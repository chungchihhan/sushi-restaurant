import {
    type CreateOrderPayload,
    type CreateOrderResponse,
    type DeleteOrderResponse,
    type GetOrderResponse,
    type GetOrdersResponse,
    type OrderData,
    type UpdateOrderPayload,
    type UpdateOrderResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import { OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoOrderRepository } from './order_repository';

const orderRepo = new MongoOrderRepository();

export const getOrders = async (
    req: Request,
    res: Response<GetOrdersResponse | { error: string }>,
) => {
    try {
        const { user_id, shop_id, year, month } = req.body;

        let dbOrders;

        if (year && month) {
            dbOrders = await orderRepo.findByUserIdMonth(
                user_id,
                parseInt(year),
                parseInt(month),
            );
        } else if (shop_id) {
            dbOrders = await orderRepo.findByShopId(shop_id);
        } else if (user_id) {
            dbOrders = await orderRepo.findByUserId(user_id);
        } else {
            dbOrders = await orderRepo.findAll();
        }

        if (!dbOrders) {
            return res.status(404).json({ error: 'Orders not found' });
        }

        return res.status(200).json(dbOrders);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrder = async (
    req: Request<{ id: string }>,
    res: Response<GetOrderResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbOrder = await orderRepo.findById(id);
        if (!dbOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(200).json(dbOrder);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createOrder = async (
    req: Request<never, never, CreateOrderPayload>,
    res: Response<CreateOrderResponse | { error: string }>,
) => {
    try {
        const { user_id, shop_id } = req.body;

        const payload: Omit<OrderData, 'id'> = {
            user_id,
            shop_id,
            order_date: new Date().toISOString(),
            status: OrderStatus.CART,
        };

        const newOrder = await orderRepo.create(payload);

        if (!newOrder) {
            return res.status(404).json({ error: 'Order creation failed' });
        }

        return res.status(201).json({ id: newOrder.id });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateOrder = async (
    req: Request<{ id: string }, never, UpdateOrderPayload>,
    res: Response<UpdateOrderResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldOrder = await orderRepo.findById(id);

        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const payLoad = req.body;

        if (
            payLoad.status &&
            !Object.values(OrderStatus).includes(payLoad.status as OrderStatus)
        ) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const result = await orderRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteOrder = async (
    req: Request<{ id: string }>,
    res: Response<DeleteOrderResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldOrder = await orderRepo.findById(id);

        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const result = await orderRepo.deleteById(id);
        if (!result) {
            return res.status(404).json({ error: 'Delete fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
