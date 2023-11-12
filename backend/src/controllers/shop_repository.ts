import type {
    CreateShopPayload,
    GetShopResponse,
    GetShopsResponse,
    UpdateShopPayload,
} from '@lib/shared_types_shop';
import type { ObjectId } from 'mongoose';

import ShopModel from '../models/shop';

interface IShopRepository {
    findAll(): Promise<GetShopsResponse>;
    findById(id: string): Promise<GetShopResponse | null>;
    existsByName(name: string): Promise<boolean>;
    create(payload: CreateShopPayload): Promise<{ _id: ObjectId }>;
    updateById(id: string, payload: UpdateShopPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoShopRepository implements IShopRepository {
    async findAll(): Promise<GetShopsResponse> {
        return ShopModel.find({});
    }

    async findById(id: string): Promise<GetShopResponse | null> {
        return ShopModel.findById(id);
    }

    async existsByName(name: string): Promise<boolean> {
        const shopExists = await ShopModel.exists({ name });
        if (shopExists) return true;
        return false;
    }

    async create(payload: CreateShopPayload): Promise<{ _id: ObjectId }> {
        const shop = new ShopModel(payload);
        return shop.save();
    }

    async updateById(id: string, payload: UpdateShopPayload): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await ShopModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await ShopModel.findByIdAndDelete(id);
        return result != null;
    }
}