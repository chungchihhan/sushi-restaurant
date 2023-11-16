import type {
    CreateUserPayload,
    CreateUserResponse,
    GetOrdersResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateOrderPayload,
    UpdateOrderResponse,
    UpdateUserPayload,
    UserData,
    deleteUserResponse,
    updateUserResponse,
    userLoginPayload,
    userLoginResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { genericErrorHandler } from '../utils/errors';
import { MongoOrderRepository } from './order_repository';
import { MongoUserRepository } from './user_repository';

const userRepo = new MongoUserRepository();
const orderRepo = new MongoOrderRepository();

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

        return res.status(200).json({ token: token });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const cancelOrder = async (
    req: Request<
        { user_id: string; order_id: string },
        never,
        UpdateOrderPayload
    >,
    res: Response<UpdateOrderResponse | { error: string }>,
) => {
    try {
        const { order_id } = req.params;

        const oldOrder = await orderRepo.findById(order_id);
        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (oldOrder.user_id !== req.params.user_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const payLoad = { status: 'cancelled' };
        const result = await orderRepo.updateById(order_id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
