import type {
    CreateOrderItemPayload,
    GetOrderItemResponse,
    GetOrderItemsResponse,
    UpdateOrderItemPayload,
} from '@lib/shared_types';

import OrderItemModel from '../models/orderItem';

export class OrderItemRepository {
    async findAll(): Promise<GetOrderItemsResponse> {
        return OrderItemModel.find({});
    }

    async findById(id: string): Promise<GetOrderItemResponse | null> {
        return OrderItemModel.findById(id);
    }

    async findByOrderId(id: string): Promise<GetOrderItemsResponse | null> {
        return OrderItemModel.find({ order_id: id });
    }

    async create(
        payload: CreateOrderItemPayload,
    ): Promise<{ id: string } | null> {
        const OrderItem = new OrderItemModel(payload);
        return OrderItem.save();
    }

    async updateById(id: string, payload: UpdateOrderItemPayload) {
        // mongoose would ignore undefined values
        return OrderItemModel.findByIdAndUpdate(id, payload, { new: true });
    }

    async deleteById(id: string) {
        return OrderItemModel.findByIdAndDelete(id);
    }
}
