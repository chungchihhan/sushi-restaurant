import type {
    CreateUserPayload,
    CreateUserResponse,
    GetOrdersResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
    UserData,
    deleteUserResponse,
    updateUserResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

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
        const userExists = await userRepo.existsByName(name);
        if (userExists) {
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

export const getOrdersByUser = async (
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
