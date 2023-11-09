import type {
    CreateMenuPayload,
    CreateMenuResponse,
    GetMenuResponse,
    GetMenusResponse,
    UpdateMenuPayload,
    UpdateMenuResponse,
    deleteMenuResponse,
} from '@lib/shared_types_shop';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoMenuRepository } from './menu_repository';

const menuRepo = new MongoMenuRepository();

export const getMenus = async (_: Request, res: Response<GetMenusResponse>) => {
    try {
        const dbMenus = await menuRepo.findAll();

        return res.status(200).json(dbMenus);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getMenu = async (
    req: Request<{ id: string }>,
    res: Response<GetMenuResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbMenu = await menuRepo.findById(id);
        if (!dbMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        return res.status(200).json(dbMenu);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createMenu = async (
    req: Request<never, never, CreateMenuPayload>,
    res: Response<CreateMenuResponse | { error: string }>,
) => {
    try {
        const { shop_id, name, description, price, quantity, category, image } =
            req.body;

        // check if the menu name is already in the database
        const menuExists = await menuRepo.existsByName(name);
        if (menuExists) {
            return res.status(404).json({ error: 'Menu already exists' });
        }

        const payload = req.body;

        const newMenu = await menuRepo.create(payload);

        return res.status(201).json({ id: newMenu._id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateMenu = async (
    req: Request<{ id: string }, never, UpdateMenuPayload>,
    res: Response<updateMenuResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldMenu = await menuRepo.findById(id);

        if (!oldMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        const payLoad = req.body;

        await menuRepo.updateById(id, payLoad);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteMenu = async (
    req: Request<{ id: string }>,
    res: Response<deleteMenuResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldMenu = await menuRepo.findById(id);

        if (!oldMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        await menuRepo.deleteById(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
