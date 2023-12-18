import type {
    CancelOrderPayload,
    CreateUserPayload,
    CreateUserResponse,
    GetOrderDetailsPayload,
    GetOrderDetailsResponse,
    GetOrdersByUserIdResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateOrderResponse,
    UpdateUserPayload,
    UserData,
    deleteUserResponse,
    updateUserResponse,
    userLoginPayload,
    userLoginResponse,
} from '@lib/shared_types';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { OrderStatus } from '../../../lib/shared_types';
import { genericErrorHandler } from '../utils/errors';
import { MongoMealRepository } from './meal_repository';
import { MongoOrderItemRepository } from './orderItem_repository';
import { MongoOrderRepository } from './order_repository';
import { MongoShopRepository } from './shop_repository';
import { MongoUserRepository } from './user_repository';

const userRepo = new MongoUserRepository();
const orderRepo = new MongoOrderRepository();
const orderItemRepo = new MongoOrderItemRepository();
const mealRepo = new MongoMealRepository();
const shopRepo = new MongoShopRepository();

export const getUsers = async (_: Request, res: Response<GetUsersResponse>) => {
    try {
        const dbUsers = await userRepo.findAll();

        return res.status(200).json(dbUsers);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getUser = async (
    req: Request<{ id: string }>,
    res: Response<GetUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbUser = await userRepo.findById(id);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(dbUser);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

const saltRounds = 10;
export const createUser = async (
    req: Request<never, never, CreateUserPayload>,
    res: Response<CreateUserResponse | { error: string }>,
) => {
    try {
        const { account, username, password, email, phone, role, birthday } =
            req.body;

        // check if the user name is already in the database
        const user = await userRepo.findByAccount(account);
        if (user !== null) {
            return res.status(404).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const payload: Omit<UserData, 'id'> = {
            account,
            password: hashedPassword,
            username,
            email,
            phone,
            role,
            birthday,
            verified: false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        };

        const newUser = await userRepo.create(payload);

        return res.status(201).json({ id: newUser.id });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateUser = async (
    req: Request<{ id: string }, never, UpdateUserPayload>,
    res: Response<updateUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldUser = await userRepo.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payLoad = req.body;

        if (payLoad.password) {
            const hashedPassword = await bcrypt.hash(
                payLoad.password,
                saltRounds,
            );
            payLoad.password = hashedPassword;
        }

        const result = await userRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<deleteUserResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldUser = await userRepo.findById(id);

        if (!oldUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await userRepo.deleteById(id);
        if (!result) {
            return res.status(404).json({ error: 'Delete fails' });
        }

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrdersByUserId = async (
    req: Request<{ user_id: string }>,
    res: Response<GetOrdersByUserIdResponse | { error: string }>,
) => {
    try {
        const { user_id } = req.params;
        const dbOrders = await orderRepo.findByUserId(user_id);

        const orderHistoryPromises = dbOrders.map(async (dbOrder) => {
            const shop = await shopRepo.findById(dbOrder.shop_id);
            if (!shop) {
                throw new Error(`Shop not found for order ${dbOrder.id}`);
            }

            const orderItems = await orderItemRepo.findByOrderId(dbOrder.id);
            let order_price = 0;

            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (meal) {
                    order_price += meal.price * orderItem.quantity;
                }
            }

            return {
                order_id: dbOrder.id,
                status: dbOrder.status,
                order_date: dbOrder.order_date,
                order_price: order_price,
                shop_name: shop.name,
                shop_image: shop.image,
            };
        });

        const orderHistory: GetOrdersByUserIdResponse =
            await Promise.all(orderHistoryPromises);

        return res.status(200).json(orderHistory);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const userLogin = async (
    req: Request<userLoginPayload>,
    res: Response<userLoginResponse | { error: string }>,
) => {
    try {
        const { account, password } = req.body;

        const dbUser = await userRepo.findByAccount(account);

        if (process.env.NODE_ENV !== 'test') {
            console.log(account);
            console.log(dbUser);
        }
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        const token = jwt.sign({ userId: dbUser.id }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        let shop_id;
        const dbShop = await shopRepo.findByUserId(dbUser.id);
        if (dbUser.role == '店家') {
            if (!dbShop || dbShop?.length == 0) {
                shop_id = 'none';
            } else {
                shop_id = dbShop[0].id;
            }
        } else {
            shop_id = 'none';
        }

        return res
            .status(200)
            .json({ id: dbUser.id, token: token, shop_id: shop_id });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getOrderDetails = async (
    req: Request<GetOrderDetailsPayload>,
    res: Response<GetOrderDetailsResponse | { error: string }>,
) => {
    try {
        const { user_id, id } = req.params;
        const dbOrder = await orderRepo.findDetailsByOrderId(id);
        if (!dbOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (dbOrder.user_id !== user_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        return res.status(200).json(dbOrder);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

// cancel order, send email, and update meal quantity
export const cancelOrder = async (
    req: Request<CancelOrderPayload>,
    res: Response<UpdateOrderResponse | { error: string }>,
) => {
    try {
        const { id, user_id } = req.params;

        // error handling
        const oldOrder = await orderRepo.findById(id);
        if (!oldOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (oldOrder.user_id !== user_id) {
            return res.status(403).json({ error: 'Permission denied' });
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
        if (oldOrder.status !== OrderStatus.CANCELLED) {
            const orderItems = await orderItemRepo.findByOrderId(id);
            for (const orderItem of orderItems) {
                const meal = await mealRepo.findById(orderItem.meal_id);
                if (!meal) {
                    return res.status(404).json({
                        error: `Meal ${orderItem.meal_id} does not exist`,
                    });
                }
                const newStock = meal.quantity + orderItem.quantity;
                await mealRepo.updateById(meal.id, { quantity: newStock });
            }
        }

        // cancel order
        const payLoad = { status: OrderStatus.CANCELLED };
        const result = await orderRepo.updateById(id, payLoad);

        if (!result) {
            return res.status(404).json({ error: 'Update fails' });
        }

        const orderDetails = await orderRepo.findDetailsByOrderId(id);
        if (!orderDetails) {
            return res.status(404).json({ error: 'Order Details not found' });
        }
        // send email to user and shop
        const shopEmail = shopUserData?.email;
        orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            OrderStatus.CANCELLED,
        );
        orderRepo.sendEmailToShop(
            orderDetails,
            shopEmail,
            OrderStatus.CANCELLED,
        );

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getBalance = async (
    req: Request<{ user_id: string; year: string; month: string }>,
    res: Response<{ balance: number } | { error: string }>,
) => {
    try {
        const { user_id } = req.params;
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

        const dbOrders = await orderRepo.findByUserIdMonth(
            user_id,
            targetYear,
            targetMonth,
        );

        let totalBalance: number = 0;

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
