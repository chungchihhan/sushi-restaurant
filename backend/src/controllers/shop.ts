import type {
    CreateShopPayload,
    CreateShopResponse,
    GetShopResponse,
    GetShopsResponse,
    UpdateShopPayload,
    DeleteShopResponse,
    UpdateShopResponse,
} from '@lib/shared_types_shop';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoShopRepository } from './shop_repository';

const shopRepo = new MongoShopRepository();

export const getShops = async (_: Request, res: Response<GetShopsResponse>) => {
    try {
        const dbShops = await shopRepo.findAll();

        return res.status(200).json(dbShops);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getShop = async (
    req: Request<{ id: string }>,
    res: Response<GetShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbShop = await shopRepo.findById(id);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        return res.status(200).json(dbShop);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createShop = async (
    req: Request<never, never, CreateShopPayload>,
    res: Response<CreateShopResponse | { error: string }>,
) => {
    try {
        const {
            user_id,
            name,
            address,
            phone,
            image,
            category,
            monday,
            tuesday,
            wensday,
            thursday,
            friday,
            saturday,
            sunday,
        } = req.body;

        // check if the shop name is already in the database
        const shopExists = await shopRepo.existsByName(name);
        if (shopExists) {
            return res.status(404).json({ error: 'Shop already exists' });
        }

        const payload = req.body;

        const newShop = await shopRepo.create(payload);

        return res.status(201).json({ id: newShop._id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateShop = async (
    req: Request<{ id: string }, never, UpdateShopPayload>,
    res: Response<UpdateShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldShop = await shopRepo.findById(id);

        if (!oldShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        const payLoad = req.body;

        await shopRepo.updateById(id, payLoad);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteShop = async (
    req: Request<{ id: string }>,
    res: Response<DeleteShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldShop = await shopRepo.findById(id);

        if (!oldShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        await shopRepo.deleteById(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
