import {
    type CreateOrderPayload,
    type CreateOrderResponse,
    type DeleteOrderResponse,
    type GetOrderResponse,
    type GetOrdersResponse,
    type OrderData,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import { OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';
import { MongoOrderItemRepository } from './orderItem_repository';
import { MongoOrderRepository } from './order_repository';
import { MongoShopRepository } from './shop_repository';
import { MongoUserRepository } from './user_repository';

const userRepo = new MongoUserRepository();
const shopRepo = new MongoShopRepository();
const mealRepo = new MongoMealRepository();
const orderRepo = new MongoOrderRepository();
const orderItemRepo = new MongoOrderItemRepository();

export const getOrders = async (
    req: Request,
    res: Response<GetOrdersResponse | { error: string }>,
) => {
    try {
        const { user_id, year, month } = req.body;

        let dbOrders;

        if (year && month) {
            dbOrders = await orderRepo.findByUserIdMonth(
                user_id,
                parseInt(year),
                parseInt(month),
            );
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
        const { user_id, shop_id, order_items } = req.body;

        const dbUser = await userRepo.findById(user_id);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dbShop = await shopRepo.findById(shop_id);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        const shopUserData = await userRepo.findById(dbShop?.user_id);
        if (shopUserData === null) {
            return res.status(403).json({
                error: 'UserId of Shop not found in UserDB in cancelOrder',
            });
        }

        const payload: Omit<OrderData, 'id'> = {
            shop_id: shop_id,
            user_id: user_id,
            order_date: new Date().toISOString(),
            status: OrderStatus.WAITING,
            order_items: [],
        };

        const newOrder = await orderRepo.create(payload);

        if (!newOrder) {
            return res.status(404).json({ error: 'Order creation failed' });
        }

        const orderItemPromises = order_items.map(async (item) => {
            const dbMeal = await mealRepo.findById(item.meal_id);
            if (!dbMeal) {
                return res
                    .status(404)
                    .json({ error: `Meal ${item.meal_id} not found' ` });
            }
            if (dbMeal.shop_id !== shop_id) {
                return res.status(404).json({
                    error: `Meal ${item.meal_id} not found in shop ${shop_id}`,
                });
            }

            const orderItemPayload = {
                order_id: newOrder.id,
                meal_id: item.meal_id,
                quantity: item.quantity,
                remark: item.remark,
            };
            return orderItemRepo.create(orderItemPayload);
        });

        await Promise.all(orderItemPromises);
        const orderDetails = await orderRepo.findDetailsByOrderId(newOrder.id);
        if (!orderDetails) {
            return res.status(404).json({ error: 'Order Details not found' });
        }
        const shopEmail = shopUserData?.email;
        orderRepo.sendEmailToShop(orderDetails, shopEmail, OrderStatus.WAITING);

        return res.status(201).json({ id: newOrder.id });
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
