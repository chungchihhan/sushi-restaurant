import type {
    CreateMenuPayload,
    GetMenuResponse,
    GetMenusResponse,
    UpdateMenuPayload,
} from '@lib/shared_types_shop';
import { ObjectId } from 'mongoose';

import MenuModel from '../models/menu';

interface IMenuRepository {
    findAll(): Promise<GetMenusResponse>;
    findById(id: string): Promise<GetMenuResponse | null>;
    existsByName(name: string): Promise<{ id: string } | null>;
    create(payload: CreateMenuPayload): Promise<{ _id: ObjectId }>;
    updateById(id: string, payload: UpdateMenuPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoMenuRepository implements IMenuRepository {
    async findAll(): Promise<GetMenusResponse> {
        return MenuModel.find({});
    }

    async findById(id: string): Promise<GetMenuResponse | null> {
        return MenuModel.findById(id);
    }

    async existsByName(name: string): Promise<{ id: string } | null> {
        const MenuExists = await MenuModel.exists({ name });
        if (MenuExists) return { id: MenuExists._id as string };
        return null;
    }

    async create(payload: CreateMenuPayload): Promise<{ _id: ObjectId }> {
        const menu = new MenuModel(payload);
        return menu.save();
    }

    async updateById(id: string, payload: UpdateMenuPayload): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await MenuModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await MenuModel.findByIdAndDelete(id);
        return result != null;
    }
}
