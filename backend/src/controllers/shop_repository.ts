import type {
    CreateShopPayload,
    CreateShopResponse,
    GetShopResponse,
    GetShopsResponse,
    UpdateShopPayload,
} from '@lib/shared_types';

import ShopModel from '../models/shop';

interface IShopRepository {
    findAll(): Promise<GetShopsResponse>;
    findAllByCategory(id: string): Promise<GetShopsResponse | null>;
    findById(id: string): Promise<GetShopResponse | null>;
    existsByName(name: string): Promise<boolean>;
    create(payload: CreateShopPayload): Promise<CreateShopResponse>;
    updateById(id: string, payload: UpdateShopPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoShopRepository implements IShopRepository {
    async findAll(): Promise<GetShopsResponse> {
        return ShopModel.find({});
    }

    async findAllByCategory(
        category: string,
    ): Promise<GetShopsResponse | null> {
        return ShopModel.find({ category: category });
    }

    async findById(id: string): Promise<GetShopResponse | null> {
        return ShopModel.findById(id);
    }

    async findByUserId(user_id: string): Promise<GetShopsResponse | null> {
        return ShopModel.find({ user_id: user_id });
    }

    async existsByName(name: string): Promise<boolean> {
        const shopExists = await ShopModel.exists({ name });
        if (shopExists) return true;
        return false;
    }

    async create(payload: CreateShopPayload): Promise<CreateShopResponse> {
        const shop = await new ShopModel(payload).save();
        return { id: shop.id };
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
