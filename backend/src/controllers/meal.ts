import type {
    CreateMealPayload,
    CreateMealResponse,
    DeleteMealResponse,
    GetMealResponse,
    GetMealsResponse,
    MealData,
    UpdateMealPayload,
    UpdateMealResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';

const mealRepo = new MongoMealRepository();

export const getMeals = async (_: Request, res: Response<GetMealsResponse>) => {
    try {
        const dbMeals = await mealRepo.findAll();

        return res.status(200).json(dbMeals);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getMealsByShopId = async (
    req: Request<{ shop_id: string }>,
    res: Response<GetMealsResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const dbMeals = await mealRepo.findAllbyShopId(shop_id);
        const returnMeals = dbMeals.filter((meal) => meal.active === true);

        return res.status(200).json(returnMeals);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getMeal = async (
    req: Request<{ id: string }>,
    res: Response<GetMealResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbMeal = await mealRepo.findById(id);
        if (!dbMeal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        return res.status(200).json(dbMeal);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createMeal = async (
    req: Request<{ shop_id: string }, never, CreateMealPayload>,
    res: Response<CreateMealResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const { name, description, price, quantity, category, image } =
            req.body;

        const sameMeal = await mealRepo.findByName(name);

        let mealExists = false;
        sameMeal.forEach((meal) => {
            if (meal.active) {
                mealExists = true;
            }
        });

        // check if the Meal name is already in the database
        // const mealExists = await mealRepo.existsByShopAndName(shop_id, name);
        if (mealExists) {
            return res.status(404).json({ error: 'Meal already exists' });
        }

        const payload: Omit<MealData, 'id'> = {
            shop_id,
            name,
            description,
            price,
            quantity,
            category,
            image,
            active: true,
        };

        const newMeal = await mealRepo.create(payload);

        return res.status(201).json({ id: newMeal.id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateMeal = async (
    req: Request<{ id: string; shop_id: string }, never, UpdateMealPayload>,
    res: Response<UpdateMealResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldMeal = await mealRepo.findById(id);

        if (!oldMeal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        const shop_id = oldMeal.shop_id;
        const { name, description, price, quantity, category, image } = oldMeal;
        const payload: Omit<MealData, 'id'> = {
            shop_id,
            name,
            description,
            price,
            quantity,
            category,
            image,
            active: true,
        };
        await mealRepo.deleteById(id);
        const newMeal = await mealRepo.create(payload);

        const payLoad = req.body;

        await mealRepo.updateById(newMeal.id, payLoad);

        return res.status(200).json({ id: newMeal.id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteMeal = async (
    req: Request<{ id: string; shop_id: string }>,
    res: Response<DeleteMealResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldMeal = await mealRepo.findById(id);

        if (!oldMeal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        await mealRepo.deleteById(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
