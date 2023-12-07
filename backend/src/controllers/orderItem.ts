import type {
    CreateOrderItemPayload,
    CreateOrderItemResponse,
    DeleteOrderItemResponse,
    GetOrderItemResponse,
    GetOrderItemsResponse,
    OrderItemData,
    UpdateOrderItemPayload,
    UpdateOrderItemResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoOrderItemRepository } from './orderItem_repository';

const orderItemRepo = new MongoOrderItemRepository();

export const getOrderItems = async (
    req: Request,
    res: Response<GetOrderItemsResponse | { error: string }>,
) => {
    try {
        const { order_id } = req.body;
        let dbOrderItems;

        if (order_id) {
            dbOrderItems = await orderItemRepo.findByOrderId(order_id);
        } else {
            dbOrderItems = await orderItemRepo.findAll();
        }

        if (!dbOrderItems) {
            return res.status(404).json({ error: 'OrderItems not found' });
        }

        return res.status(200).json(dbOrderItems);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrderItem = async (
    req: Request<{ id: string }>,
    res: Response<GetOrderItemResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbOrderItem = await orderItemRepo.findById(id);
        if (!dbOrderItem) {
            return res.status(404).json({ error: 'OrderItem not found' });
        }

        return res.status(200).json(dbOrderItem);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createOrderItem = async (
    req: Request<never, never, CreateOrderItemPayload>,
    res: Response<CreateOrderItemResponse | { error: string }>,
) => {
    try {
        const { order_id, meal_id, quantity, remark } = req.body;

        const payload: Omit<OrderItemData, 'id'> = {
            order_id,
            meal_id,
            quantity,
            remark,
        };

        const newOrderItem = await orderItemRepo.create(payload);

        return res.status(201).json({ id: newOrderItem.id });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateOrderItem = async (
    req: Request<{ id: string }, never, UpdateOrderItemPayload>,
    res: Response<UpdateOrderItemResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldOrderItem = await orderItemRepo.findById(id);

        if (!oldOrderItem) {
            return res.status(404).json({ error: 'OrderItem not found' });
        }

        const payLoad = req.body;

        const result = await orderItemRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteOrderItem = async (
    req: Request<{ id: string }>,
    res: Response<DeleteOrderItemResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldOrderItem = await orderItemRepo.findById(id);

        if (!oldOrderItem) {
            return res.status(404).json({ error: 'OrderItem not found' });
        }

        const result = await orderItemRepo.deleteById(id);
        if (!result) {
            return res.status(404).json({ error: 'Delete fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
