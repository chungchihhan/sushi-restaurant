import type {
    CreateShopPayload,
    CreateShopResponse,
    DeleteShopResponse,
    GetMealImageUrlResponse,
    GetOrdersByShopIdResponse,
    GetShopImageUrlResponse,
    GetShopResponse,
    GetShopsCategoryResponse,
    GetShopsResponse,
    MealRevenueDetail,
    ShopData,
    ShopOrderHistoryData,
    UpdateOrderPayload,
    UpdateOrderResponse,
    UpdateShopPayload,
    UpdateShopResponse,
} from '@lib/shared_types';
import type { Request, Response } from 'express';
import { ImgurClient } from 'imgur';
import multer from 'multer';

import { CategoryList, OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';
import { MongoOrderItemRepository } from './orderItem_repository';
import { MongoOrderRepository } from './order_repository';
import { MongoShopRepository } from './shop_repository';
import { MongoUserRepository } from './user_repository';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
        const categoryValue: string = mapCategoryKeyToValue(
            category as CategoryKey,
        );
        const dbShop = await shopRepo.findAllByCategory(categoryValue);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        return res.status(200).json(dbShop);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getShopByUserId = async (
    req: Request<{ user_id: string }>,
    res: Response<GetShopsResponse | { error: string }>,
) => {
    try {
        const { user_id } = req.params;

        const dbUser = await userRepo.findById(user_id);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const dbShop = await shopRepo.findByUserId(user_id);
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

// update order status, send email notification, and update meal quantity
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

        // error handling
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

        // update meal quantity
        if (
            status_received === OrderStatus.INPROGRESS ||
            status_received === OrderStatus.CANCELLED
        ) {
            const orderItems = await orderItemRepo.findByOrderId(order_id);
            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (!meal) {
                    return res.status(404).json({
                        error: `Meal ${orderItem.meal_id} does not exist`,
                    });
                }

                let newStock;
                if (status_received === OrderStatus.INPROGRESS) {
                    newStock = meal.quantity - orderItem.quantity;
                } else {
                    newStock = meal.quantity + orderItem.quantity;
                }

                if (newStock < 0) {
                    return res.status(400).json({
                        error: `Stock of ${meal.id} is not enough`,
                    });
                }
                await mealRepo.updateById(meal.id, { quantity: newStock });
            }
        }

        // update order status
        const payLoad: UpdateOrderPayload = { status: status_received };
        const result = await orderRepo.updateById(order_id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        const orderDetails = await orderRepo.findDetailsByOrderId(order_id);
        if (!orderDetails) {
            return res.status(404).json({ error: 'Order Details not found' });
        }
        // send email to user and shop
        const shopEmail = shopUserData?.email;
        orderRepo.sendEmailToUser(orderDetails, userEmail, status_received);
        orderRepo.sendEmailToShop(orderDetails, shopEmail, status_received);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getRevenue = async (
    req: Request<{ shop_id: string; year: string; month: string }>,
    res: Response<{ balance: number } | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const { year, month } = req.query;

        const parseYear = /^\d+$/.test(year as string);
        const parseMonth = /^\d+$/.test(month as string);

        if (!parseYear || !parseMonth) {
            return res
                .status(400)
                .json({ error: 'Year and month should be numeric values.' });
        }

        const targetYear = year
            ? parseInt(year as string)
            : new Date().getFullYear();
        const targetMonth = month
            ? parseInt(month as string)
            : new Date().getMonth() + 1;

        if (targetMonth < 1 || targetMonth > 12) {
            return res.status(400).json({
                error: 'Invalid month. Month should be between 1 and 12.',
            });
        }

        const dbOrders = await orderRepo.findByShopIdMonth(
            shop_id,
            targetYear,
            targetMonth,
        );

        let totalBalance = 0;

        for (const order of dbOrders) {
            if (order.status !== OrderStatus.FINISHED) {
                continue;
            }
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
    res: Response<{ mealDetails: MealRevenueDetail[] } | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const { year, month } = req.query;

        const parseYear = /^\d+$/.test(year as string);
        const parseMonth = /^\d+$/.test(month as string);

        if (!parseYear || !parseMonth) {
            return res
                .status(400)
                .json({ error: 'Year and month should be numeric values.' });
        }

        const targetYear = year
            ? parseInt(year as string)
            : new Date().getFullYear();
        const targetMonth = month
            ? parseInt(month as string)
            : new Date().getMonth() + 1;

        if (targetMonth < 1 || targetMonth > 12) {
            return res.status(400).json({
                error: 'Invalid month. Month should be between 1 and 12.',
            });
        }

        const dbOrders = await orderRepo.findByShopIdMonth(
            shop_id,
            targetYear,
            targetMonth,
        );

        const mealDetailsMap: Record<string, MealRevenueDetail> = {};

        for (const order of dbOrders) {
            if (order.status !== OrderStatus.FINISHED) {
                continue;
            }
            const orderItems = await orderItemRepo.findByOrderId(order.id);

            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (meal) {
                    const mealName = meal.name;
                    const mealPrice = meal.price;
                    const quantity = orderItem.quantity;
                    const revenue = mealPrice * quantity;

                    if (!mealDetailsMap[meal.id]) {
                        mealDetailsMap[meal.id] = {
                            meal_name: mealName,
                            meal_price: mealPrice,
                            quantity: 0,
                            revenue: 0,
                        };
                    }

                    mealDetailsMap[meal.id].quantity += quantity;
                    mealDetailsMap[meal.id].revenue += revenue;
                }
            }
        }
        const mealDetails: MealRevenueDetail[] = Object.values(mealDetailsMap);

        return res.status(200).json({ mealDetails });
    } catch (err) {
        return genericErrorHandler(err, res);
    }
};

export const uploadImageMiddleware = upload.single('imagePayload');

export const uploadImageForShop = async (
    req: Request<{ shop_id: string }>,
    res: Response,
) => {
    try {
        const { shop_id } = req.params;
        const imagePayload = req.file;

        if (!imagePayload) {
            return res.status(400).json({ error: 'Image payload is missing.' });
        }

        if (
            !process.env.IMGUR_CLIENT_ID ||
            !process.env.IMGUR_CLIENT_ID.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_CLIENT_ID is not set in the environment variables.',
            });
        }
        if (
            !process.env.IMGUR_CLIENT_SECRET ||
            !process.env.IMGUR_CLIENT_SECRET.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_CLIENT_SECRET is not set in the environment variables.',
            });
        }
        if (
            !process.env.IMGUR_REFRESH_TOKEN ||
            !process.env.IMGUR_REFRESH_TOKEN.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_REFRESH_TOKEN is not set in the environment variables.',
            });
        }

        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENT_ID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        });

        const response = await client.upload({
            image: imagePayload.buffer.toString('base64'),
            album: process.env.IMGUR_ALBUM,
            type: 'base64',
        });
        if (!response.success) {
            return res.status(400).json({ error: 'Imgur Client is invalid.' });
        }

        const payLoad = {
            image: response.data.link,
        };
        await shopRepo.updateById(shop_id, payLoad);

        return res.status(200).json(response.data);
    } catch (err) {
        return genericErrorHandler(err, res);
    }
};

export const getImageUrlForShop = async (
    req: Request<{ shop_id: string }>,
    res: Response<GetShopImageUrlResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;

        const dbShop = await shopRepo.findById(shop_id);
        if (!dbShop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        return res.status(200).json({ image: dbShop.image });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const uploadImageForMeal = async (
    req: Request<{ shop_id: string; meal_id: string }>,
    res: Response,
) => {
    try {
        const { shop_id, meal_id } = req.params;
        const dbMeal = await mealRepo.findById(meal_id);
        if (!dbMeal) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        if (dbMeal.shop_id !== shop_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const imagePayload = req.file;

        if (!imagePayload) {
            return res.status(400).json({ error: 'Image payload is missing.' });
        }

        if (
            !process.env.IMGUR_CLIENT_ID ||
            !process.env.IMGUR_CLIENT_ID.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_CLIENT_ID is not set in the environment variables.',
            });
        }
        if (
            !process.env.IMGUR_CLIENT_SECRET ||
            !process.env.IMGUR_CLIENT_SECRET.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_CLIENT_SECRET is not set in the environment variables.',
            });
        }
        if (
            !process.env.IMGUR_REFRESH_TOKEN ||
            !process.env.IMGUR_REFRESH_TOKEN.trim()
        ) {
            return res.status(400).json({
                error: 'Error: IMGUR_REFRESH_TOKEN is not set in the environment variables.',
            });
        }

        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENT_ID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN,
        });

        const response = await client.upload({
            image: imagePayload.buffer.toString('base64'),
            album: process.env.IMGUR_ALBUM,
            type: 'base64',
        });
        if (!response.success) {
            return res.status(400).json({ error: 'Imgur Client is invalid.' });
        }

        const payLoad = {
            image: response.data.link,
        };
        await mealRepo.updateById(meal_id, payLoad);

        return res.status(200).json(response.data);
    } catch (err) {
        return genericErrorHandler(err, res);
    }
};

export const getImageUrlForMeal = async (
    req: Request<{ shop_id: string; meal_id: string }>,
    res: Response<GetMealImageUrlResponse | { error: string }>,
) => {
    try {
        const { shop_id, meal_id } = req.params;

        const dbMeal = await mealRepo.findById(meal_id);
        if (!dbMeal) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        if (dbMeal.shop_id !== shop_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        return res.status(200).json({ image: dbMeal.image });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrdersByShopId = async (
    req: Request<{ shop_id: string }>,
    res: Response<GetOrdersByShopIdResponse | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;
        const dbOrders = await orderRepo.findByShopId(shop_id);

        const shopOrderHistoryPromises = dbOrders.map(async (dbOrder) => {
            const orderItems = await orderItemRepo.findByOrderId(dbOrder.id);
            let total_price = 0;

            const mealDataPromises = orderItems.map(async (orderItem) => {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (!meal) {
                    throw new Error(
                        `Meal not found for order item ${orderItem.id}`,
                    );
                }

                const sum_price = meal.price * orderItem.quantity;
                total_price += sum_price;

                return {
                    meal_name: meal.name,
                    quantity: orderItem.quantity,
                    sum_price: sum_price,
                    remark: orderItem.remark,
                };
            });

            const mealData: ShopOrderHistoryData['order_items'] =
                await Promise.all(mealDataPromises);

            return {
                order_id: dbOrder.id,
                status: dbOrder.status,
                order_date: dbOrder.order_date,
                order_items: mealData,
                total_price: total_price,
            };
        });

        const shopOrderHistory: GetOrdersByShopIdResponse = await Promise.all(
            shopOrderHistoryPromises,
        );

        return res.status(200).json(shopOrderHistory);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
