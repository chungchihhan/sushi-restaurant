import type {
    GetOrdersResponse,
    UpdateOrderPayload,
    UpdateOrderResponse,
} from '@lib/shared_types';
import type {
    CreateShopPayload,
    CreateShopResponse,
    DeleteShopResponse,
    GetShopResponse,
    GetShopsCategoryResponse,
    GetShopsResponse,
    ShopData,
    UpdateShopPayload,
    UpdateShopResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';

import { CategoryList, OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';
import { MongoOrderItemRepository } from './orderItem_repository';
import { MongoOrderRepository } from './order_repository';
import { MongoShopRepository } from './shop_repository';
import { MongoUserRepository } from './user_repository';

const userRepo = new MongoUserRepository();
const shopRepo = new MongoShopRepository();
const orderRepo = new MongoOrderRepository();
const orderItemRepo = new MongoOrderItemRepository();
const mealRepo = new MongoMealRepository();

export const getShops = async (_: Request, res: Response<GetShopsResponse>) => {
    try {
        const dbShops = await shopRepo.findAll();

        return res.status(200).json(dbShops);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getShop = async (
    req: Request<{ id: string }>,
    res: Response<GetShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbShop = await shopRepo.findById(id);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        return res.status(200).json(dbShop);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getShopsCategory = async (
    _: Request,
    res: Response<GetShopsCategoryResponse>,
) => {
    try {
        const dbShops = await shopRepo.findAll();

        const validCategories: CategoryList[] = Object.values(CategoryList).map(
            (value) => value as CategoryList,
        );
        const invalidShops = dbShops.filter(
            (shop) => !validCategories.includes(shop.category as CategoryList),
        );

        if (invalidShops.length > 0) {
            const invalidShopDetails = invalidShops.map(
                (shop) =>
                    `{shop_id: ${shop.id}, category: ${
                        shop.category as CategoryList
                    }}`,
            );
            throw new Error(`Invalid categories: ${invalidShopDetails}`);
        }

        const categoryCounts = dbShops.reduce(
            (acc, shop) => {
                const category = shop.category as CategoryList;
                if (acc[category]) {
                    acc[category] += 1;
                } else {
                    acc[category] = 1;
                }
                return acc;
            },
            {} as Record<CategoryList, number>,
        );

        const result = Object.entries(categoryCounts).map(
            ([category, totalSum]) => ({
                category: category as CategoryList,
                totalSum,
            }),
        );

        return res.status(200).json(result);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

type CategoryKey = keyof typeof CategoryList;
function mapCategoryKeyToValue(category: CategoryKey): string {
    return CategoryList[category];
}

export const getShopsByCategory = async (
    req: Request<{ category: string }>,
    res: Response<GetShopsResponse | { error: string }>,
) => {
    try {
        const { category } = req.params;
        const categoryValue: string = mapCategoryKeyToValue(category as CategoryKey);    
        const dbShop = await shopRepo.findAllByCategory(categoryValue);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        return res.status(200).json(dbShop);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createShop = async (
    req: Request<never, never, CreateShopPayload>,
    res: Response<CreateShopResponse | { error: string }>,
) => {
    try {
        const {
            user_id,
            name,
            address,
            phone,
            image,
            category,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        } = req.body;

        // check if the shop name is already in the database
        const shopExists = await shopRepo.existsByName(name);
        if (shopExists) {
            return res.status(404).json({ error: 'Shop already exists' });
        }

        const payload: Omit<ShopData, 'id'> = {
            user_id,
            name,
            address,
            phone,
            image,
            category,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
        };

        const newShop = await shopRepo.create(payload);

        return res.status(201).json({ id: newShop.id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateShop = async (
    req: Request<{ id: string }, never, UpdateShopPayload>,
    res: Response<UpdateShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldShop = await shopRepo.findById(id);

        if (!oldShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        const payLoad = req.body;

        await shopRepo.updateById(id, payLoad);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteShop = async (
    req: Request<{ id: string }>,
    res: Response<DeleteShopResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldShop = await shopRepo.findById(id);

        if (!oldShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        await shopRepo.deleteById(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrdersByShopId = async (
    req: Request<{ shop_id: string }>,
    res: Response<GetOrdersResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const dbOrders = await orderRepo.findByShopId(shop_id);

        return res.status(200).json(dbOrders);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateOrder = async (
    req: Request<
        { order_id: string; shop_id: string },
        never,
        UpdateOrderPayload
    >,
    res: Response<UpdateOrderResponse | { error: string }>,
) => {
    try {
        const { order_id, shop_id } = req.params;

        const oldOrder = await orderRepo.findById(order_id);
        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (oldOrder.shop_id !== shop_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const status_received = req.body.status as OrderStatus;
        if (!status_received) {
            return res.status(400).json({ error: 'Payload is required' });
        }

        if (
            status_received &&
            !Object.values(OrderStatus).includes(status_received)
        ) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const userData = await userRepo.findById(oldOrder.user_id);
        if (userData === null) {
            return res
                .status(403)
                .json({ error: 'User not found in cancelOrder' });
        }
        const userEmail = userData?.email;
        const shopData = await shopRepo.findById(oldOrder.shop_id);
        if (shopData === null) {
            return res
                .status(403)
                .json({ error: 'Shop not found in cancelOrder' });
        }
        const shopUserData = await userRepo.findById(shopData?.user_id);
        if (shopUserData === null) {
            return res.status(403).json({
                error: 'UserId of Shop not found in UserDB in cancelOrder',
            });
        }
        const shopEmail = shopUserData?.email;
        await orderRepo.sendEmailToUser(userEmail, status_received);
        await orderRepo.sendEmailToShop(shopEmail, status_received);

        const payLoad: UpdateOrderPayload = { status: status_received };

        const result = await orderRepo.updateById(order_id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getRevenue = async (
    req: Request<{ shop_id: string; year: string; month: string }>,
    res: Response<{ balance: number }>,
) => {
    try {
        const { shop_id } = req.params;
        const { year, month } = req.query;

        const targetYear = year
            ? parseInt(year as string)
            : new Date().getFullYear();
        const targetMonth = month
            ? parseInt(month as string)
            : new Date().getMonth() + 1;

        const dbOrders = await orderRepo.findByShopIdMonth(
            shop_id,
            targetYear,
            targetMonth,
        );

        let totalBalance = 0;

        for (const order of dbOrders) {
            const orderItems = await orderItemRepo.findByOrderId(order.id);

            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (meal) {
                    totalBalance += meal.price * orderItem.quantity;
                }
            }
        }
        return res.status(200).json({ balance: totalBalance });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getRevenueDetails = async (
    req: Request<{ shop_id: string; year: string; month: string }>,
    res: Response<{ mealSales: Record<string, number> }>,
) => {
    try {
        const { shop_id } = req.params;
        const { year, month } = req.query;

        const targetYear = year
            ? parseInt(year as string)
            : new Date().getFullYear();
        const targetMonth = month
            ? parseInt(month as string)
            : new Date().getMonth() + 1;

        const dbOrders = await orderRepo.findByShopIdMonth(
            shop_id,
            targetYear,
            targetMonth,
        );

        const mealSales: Record<string, number> = {};

        for (const order of dbOrders) {
            const orderItems = await orderItemRepo.findByOrderId(order.id);

            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (meal) {
                    const mealName = meal.name;

                    mealSales[mealName] = mealSales[mealName] || 0;
                    mealSales[mealName] += orderItem.quantity;
                }
            }
        }

        return res.status(200).json({ mealSales });
    } catch (err) {
        return genericErrorHandler(err, res);
    }
};
