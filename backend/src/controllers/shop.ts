import type { GetOrdersResponse } from '@lib/shared_types';
import type {
    CreateShopPayload,
    CreateShopResponse,
    DeleteShopResponse,
    GetShopResponse,
    GetShopsResponse,
    ShopData,
    UpdateShopPayload,
    UpdateShopResponse,
} from '@lib/shared_types_shop';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoOrderRepository } from './order_repository';
import { MongoShopRepository } from './shop_repository';

const shopRepo = new MongoShopRepository();
const orderRepo = new MongoOrderRepository();

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

export const getShopsByCategory = async (
    req: Request<{ category: string }>,
    res: Response<GetShopsResponse | { error: string }>,
) => {
    try {
        const { category } = req.params;

        const dbShop = await shopRepo.findAllByCategory(category);
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
            wednesday,
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

        const payload: Omit<ShopData, 'id'> = {
            user_id,
            name,
            address,
            phone,
            image,
            category,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        };

        const newShop = await shopRepo.create(payload);

        return res.status(201).json({ id: newShop.id.toString() });
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

export const getOrdersByShopId = async (
    req: Request<{ shop_id: string }>,
    res: Response<GetOrdersResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const dbOrders = await orderRepo.findByShopId(shop_id);

        return res.status(200).json(dbOrders);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
