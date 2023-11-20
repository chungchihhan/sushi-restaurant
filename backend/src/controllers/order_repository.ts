import type {
    CreateOrderPayload,
    GetOrderResponse,
    GetOrdersResponse,
    OrderData,
    UpdateOrderPayload,
} from '@lib/shared_types';

import OrderModel from '../models/order';
import OrderItemModel from '../models/orderItem';

interface IOrderRepository {
    findAll(): Promise<GetOrdersResponse>;
    findById(id: string): Promise<GetOrderResponse | null>;
    findByUserId(id: string): Promise<GetOrdersResponse>;
    findByShopId(id: string): Promise<GetOrdersResponse>;
    findByUserIdMonth(
        id: string,
        year: number,
        month: number,
    ): Promise<GetOrdersResponse>;
    create(payload: CreateOrderPayload): Promise<Pick<OrderData, 'id'>>;
    updateById(id: string, payload: UpdateOrderPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoOrderRepository implements IOrderRepository {
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

    async create(payload: CreateOrderPayload): Promise<Pick<OrderData, 'id'>> {
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

    async findDetailsByOrderId(id: string): Promise<GetOrderResponse | null> {
        try {
            const order = await OrderModel.findById(id);

            if (!order) {
                return null;
            }

            const orderItems = await OrderItemModel.find({ order_id: id });
            const orderDetails: GetOrderResponse = {
                id: order.id,
                user_id: order.user_id,
                shop_id: order.shop_id,
                order_date: order.order_date.toISOString(),
                status: order.status,
                order_items: orderItems.map((item) => ({
                    id: item.id,
                    order_id: item.order_id,
                    menu_id: item.menu_id,
                    quantity: item.quantity,
                })),
            };

            return orderDetails;
        } catch (error) {
            console.error('Error finding order detail:', error);
            return null;
        }
    }
}
