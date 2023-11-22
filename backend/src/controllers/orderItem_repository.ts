import type {
    CreateOrderItemPayload,
    GetOrderItemResponse,
    GetOrderItemsResponse,
    OrderItemData,
    UpdateOrderItemPayload,
} from '@lib/shared_types';

import OrderItemModel from '../models/orderItem';

interface IOrderItemRepository {
    findAll(): Promise<GetOrderItemsResponse>;
    findById(id: string): Promise<GetOrderItemResponse | null>;
    findByOrderId(id: string): Promise<GetOrderItemsResponse>;
    create(payload: CreateOrderItemPayload): Promise<Pick<OrderItemData, 'id'>>;
    updateById(id: string, payload: UpdateOrderItemPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoOrderItemRepository implements IOrderItemRepository {
    async findAll(): Promise<GetOrderItemsResponse> {
        return OrderItemModel.find({});
    }

    async findById(id: string): Promise<GetOrderItemResponse | null> {
        return OrderItemModel.findById(id);
    }

    async findByOrderId(id: string): Promise<GetOrderItemsResponse> {
        return OrderItemModel.find({ order_id: id });
    }

    async create(
        payload: CreateOrderItemPayload,
    ): Promise<Pick<OrderItemData, 'id'>> {
        const OrderItem = new OrderItemModel(payload);
        return OrderItem.save();
    }

    async updateById(
        id: string,
        payload: UpdateOrderItemPayload,
    ): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await OrderItemModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await OrderItemModel.findByIdAndDelete(id);
        return result != null;
    }
}
