import type {
    CreateOrderPayload,
    GetOrderResponse,
    GetOrdersResponse,
    OrderData,
    UpdateOrderPayload,
} from '@lib/shared_types';

import OrderModel from '../models/order';

interface IOrderReposiotry {
    findAll(): Promise<GetOrdersResponse | null>;
    findById(id: string): Promise<GetOrderResponse | null>;
    findByUserId(id: string): Promise<GetOrdersResponse | null>;
    findByShopId(id: string): Promise<GetOrdersResponse | null>;
    findByUserIdMonth(
        id: string,
        year: number,
        month: number,
    ): Promise<GetOrdersResponse | null>;
    create(payload: CreateOrderPayload): Promise<Pick<OrderData, 'id'> | null>;
    updateById(id: string, payload: UpdateOrderPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoOrderRepository implements IOrderReposiotry {
    async findAll(): Promise<GetOrdersResponse> {
        return OrderModel.find({});
    }

    async findById(id: string): Promise<GetOrderResponse | null> {
        return OrderModel.findById(id);
    }

    async findByUserId(id: string): Promise<GetOrdersResponse> {
        return OrderModel.find({ user_id: id });
    }

    async findByShopId(id: string): Promise<GetOrdersResponse> {
        return OrderModel.find({ shop_id: id });
    }

    // Do we need findByShopIdMonth？
    async findByUserIdMonth(
        id: string,
        year: number,
        month: number,
    ): Promise<GetOrdersResponse> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return OrderModel.find({
            user_id: id,
            order_date: {
                $gte: startDate,
                $lte: endDate,
            },
        });
    }

    async create(
        payload: CreateOrderPayload,
    ): Promise<Pick<OrderData, 'id'>> {
        const order = new OrderModel(payload);
        return order.save();
    }

    async updateById(
        id: string,
        payload: UpdateOrderPayload,
    ): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await OrderModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id);
        return result != null;
    }
}
