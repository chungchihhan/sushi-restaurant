import type {
    CreateMealPayload,
    CreateMealResponse,
    GetMealResponse,
    GetMealsResponse,
    UpdateMealPayload,
} from '@lib/shared_types';

import MealModel from '../models/meal';
import redis from '../utils/redis';

interface IMealRepository {
    findAll(): Promise<GetMealsResponse>;
    findAllbyShopId(shop_id: string): Promise<GetMealsResponse>;
    findById(id: string): Promise<GetMealResponse | null>;
    findByName(id: string): Promise<GetMealsResponse | null>;
    existsByShopAndName(shop_id: string, name: string): Promise<boolean>;
    create(payload: CreateMealPayload): Promise<CreateMealResponse>;
    updateById(id: string, payload: UpdateMealPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoMealRepository implements IMealRepository {
    async findAll(): Promise<GetMealsResponse> {
        return MealModel.find({});
    }

    async findAllbyShopId(shop_id: string): Promise<GetMealsResponse> {
        return MealModel.find({ shop_id: shop_id });
    }

    async findById(id: string): Promise<GetMealResponse | null> {
        const cachedMeal = await redis?.get(`meal:${id}`);
        if (cachedMeal) {
            return JSON.parse(cachedMeal);
        }

        const meal = await MealModel.findById(id);
        if (!meal) {
            return null;
        }
        const mealResponse: GetMealResponse = {
            id: meal._id.toString(),
            shop_id: meal.shop_id,
            name: meal.name,
            description: meal.description,
            price: meal.price,
            quantity: meal.quantity,
            category: meal.category,
            image: meal.image,
            active: meal.active,
        };

        await redis?.set(
            `meal:${id}`,
            JSON.stringify(mealResponse),
            'EX',
            3600,
        );

        return mealResponse;
    }

    async findByName(name: string): Promise<GetMealsResponse> {
        return MealModel.find({ name: name });
    }

    async existsByShopAndName(shop_id: string, name: string): Promise<boolean> {
        const MealExists = await MealModel.exists({ shop_id, name });
        if (MealExists) return true;
        return false;
    }

    async create(payload: CreateMealPayload): Promise<CreateMealResponse> {
        const meal = await new MealModel(payload).save();
        return { id: meal.id };
    }

    async updateById(id: string, payload: UpdateMealPayload): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await MealModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (result) {
            await redis?.set(`meal:${id}`, JSON.stringify(result), 'EX', 3600);
            return true;
        }
        return false;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await MealModel.findByIdAndUpdate(
            id,
            { active: false },
            {
                new: true,
            },
        );
        if (result) {
            await redis?.set(`meal:${id}`, JSON.stringify(result), 'EX', 3600);
            return true;
        }
        return false;
    }
}
