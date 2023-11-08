import type {
    CreateOrderPayload,
    GetOrderResponse,
    GetOrdersResponse,
    UpdateOrderPayload
} from '@lib/shared_types';

import OrderModel from'../models/order';

export class OrderRepository {
    async findAll(): Promise<GetOrdersResponse> {
        return OrderModel.find({});
    }

    async findById(id: string): Promise<GetOrderResponse | null> {
        return OrderModel.findById(id);
    }

    async findByUserId(id: string): Promise<GetOrdersResponse | null> {
        return OrderModel.find({ user_id: id });
    }

    async findByShopId(id: string): Promise<GetOrdersResponse | null> {
        return OrderModel.find({ shop_id: id });
    }

    // 要寫ShopIdMonth的版本嗎？
    async findByUserIdMonth(id: string, year: number, month: number): Promise<GetOrdersResponse | null> {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        return OrderModel.find({
            user_id: id,
            order_date: {
                $gte: startDate,
                $lte: endDate
            }
        });
    }

    async create(payload: CreateOrderPayload): Promise<{id : string} | null> {
        const order = new OrderModel(payload);
        return order.save();
    }

    async updateById(id: string, payload: UpdateOrderPayload) {
        // mongoose would ignore undefined values
        return OrderModel.findByIdAndUpdate(id, payload, { new: true });
    }

    async deleteById(id: string) {
        return OrderModel.findByIdAndDelete(id);
    }
}