import type {
    CreateMealPayload,
    GetMealResponse,
    GetMealsResponse,
    UpdateMealPayload,
} from '@lib/shared_types_shop';
import type { ObjectId } from 'mongoose';

import MealModel from '../models/meal';

interface IMealRepository {
    findAll(): Promise<GetMealsResponse>;
    findById(id: string): Promise<GetMealResponse | null>;
    existsByShopAndName(shop_id: string, name: string): Promise<boolean>;
    create(payload: CreateMealPayload): Promise<{ _id: ObjectId }>;
    updateById(id: string, payload: UpdateMealPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoMealRepository implements IMealRepository {
    async findAll(): Promise<GetMealsResponse> {
        return MealModel.find({});
    }

    async findById(id: string): Promise<GetMealResponse | null> {
        return MealModel.findById(id);
    }

    async existsByShopAndName(shop_id: string, name: string): Promise<boolean> {
        const MealExists = await MealModel.exists({ shop_id, name });
        if (MealExists) return true;
        return false;
    }

    async create(payload: CreateMealPayload): Promise<{ _id: ObjectId }> {
        const meal = new MealModel(payload);
        return meal.save();
    }

    async updateById(id: string, payload: UpdateMealPayload): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await MealModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await MealModel.findByIdAndDelete(id);
        return result != null;
    }
}
