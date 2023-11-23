import {
    type CancelOrderPayload,
    type CreateUserPayload,
    type CreateUserResponse,
    type GetOrderDetailsPayload,
    type GetOrderResponse,
    type GetOrdersResponse,
    type GetUserResponse,
    type GetUsersResponse,
    type UpdateOrderResponse,
    type UpdateUserPayload,
    type UserData,
    type deleteUserResponse,
    type updateUserResponse,
    type userLoginPayload,
    type userLoginResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';
import { MongoOrderItemRepository } from './orderItem_repository';
import { MongoOrderRepository } from './order_repository';
import { MongoUserRepository } from './user_repository';

const userRepo = new MongoUserRepository();
const orderRepo = new MongoOrderRepository();
const orderItemRepo = new MongoOrderItemRepository();
const mealRepo = new MongoMealRepository();

export const getUsers = async (_: Request, res: Response<GetUsersResponse>) => {
    try {
        const dbUsers = await userRepo.findAll();

        return res.status(200).json(dbUsers);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getUser = async (
    req: Request<{ id: string }>,
    res: Response<GetUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbUser = await userRepo.findById(id);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(dbUser);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createUser = async (
    req: Request<never, never, CreateUserPayload>,
    res: Response<CreateUserResponse | { error: string }>,
) => {
    try {
        const { name, password, email, phone, role, birthday } = req.body;

        // check if the user name is already in the database
        const user = await userRepo.findByUsername(name);
        if (user !== null) {
            return res.status(404).json({ error: 'User already exists' });
        }

        const payload: Omit<UserData, 'id'> = {
            name,
            password,
            email,
            phone,
            role,
            birthday,
            verified: false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        };

        const newUser = await userRepo.create(payload);

        return res.status(201).json({ id: newUser.id });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateUser = async (
    req: Request<{ id: string }, never, UpdateUserPayload>,
    res: Response<updateUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldUser = await userRepo.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payLoad = req.body;

        const result = await userRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<deleteUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldUser = await userRepo.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await userRepo.deleteById(id);
        if (!result) {
            return res.status(404).json({ error: 'Delete fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrdersByUserId = async (
    req: Request<{ user_id: string }>,
    res: Response<GetOrdersResponse | { error: string }>,
) => {
    try {
        const { user_id } = req.params;
        const dbOrders = await orderRepo.findByUserId(user_id);

        return res.status(200).json(dbOrders);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const userLogin = async (
    req: Request<userLoginPayload>,
    res: Response<userLoginResponse | { error: string }>,
) => {
    try {
        const { name, password } = req.body;

        const dbUser = await userRepo.findByUsername(name);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (dbUser.password !== password) {
            return res.status(404).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ userId: dbUser.id }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        return res.status(200).json({ id: dbUser.id, token: token });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrderDetails = async (
    req: Request<GetOrderDetailsPayload>,
    res: Response<GetOrderResponse | { error: string }>,
) => {
    try {
        const { user_id, id } = req.params;
        const dbOrder = await orderRepo.findDetailsByOrderId(id);
        if (!dbOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (dbOrder.user_id !== user_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        return res.status(200).json(dbOrder);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const cancelOrder = async (
    req: Request<CancelOrderPayload>,
    res: Response<UpdateOrderResponse | { error: string }>,
) => {
    try {
        const { id, user_id } = req.params;

        const oldOrder = await orderRepo.findById(id);
        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (oldOrder.user_id !== user_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const payLoad = { status: OrderStatus.CANCELLED };
        const result = await orderRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getBalance = async (
    req: Request<{ user_id: string; year: string; month: string }>,
    res: Response<{ balance: number }>,
) => {
    try {
        const { user_id } = req.params;
        const { year, month } = req.query;

        const targetYear = year
            ? parseInt(year as string)
            : new Date().getFullYear();
        const targetMonth = month
            ? parseInt(month as string)
            : new Date().getMonth() + 1;

        const dbOrders = await orderRepo.findByUserIdMonth(
            user_id,
            targetYear,
            targetMonth,
        );

        let totalBalance: number = 0;

        for (const order of dbOrders) {
            const orderItems = await orderItemRepo.findByOrderId(order.id);

            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (meal) {
                    totalBalance += meal.price * orderItem.quantity;
                }
            }
        }
        return res.status(200).json({ balance: totalBalance });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
