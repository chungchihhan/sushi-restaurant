import type {
    CreateUserPayload,
    CreateUserResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
    deleteUserResponse,
    updateUserResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import UserModel from '../models/user';
import { checkIdFormat, genericErrorHandler } from '../utils/errors';

export const getUsers = async (_: Request, res: Response<GetUsersResponse>) => {
    try {
        const dbUsers = await UserModel.find({});

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
        checkIdFormat(id, res);

        const dbUser = await UserModel.findById(id);
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
        const userExists = await UserModel.exists({ name });
        if (userExists) {
            return res.status(404).json({ error: 'User already exists' });
        }

        const user = new UserModel({
            name,
            password,
            email,
            phone,
            role,
            birthday,
            verified: false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        });

        await user.save();
        return res.status(201).json({ id: user.id });
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
        checkIdFormat(id, res);

        const oldUser = await UserModel.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payLoad = req.body;

        await UserModel.findByIdAndUpdate(id, payLoad);

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
        checkIdFormat(id, res);

        const oldUser = await UserModel.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserModel.findByIdAndDelete(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
