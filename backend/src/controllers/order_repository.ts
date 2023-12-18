import type {
    CreateOrderPayload,
    GetOrderDetailsResponse,
    GetOrderResponse,
    GetOrdersResponse,
    OrderData,
    OrderDetailsData,
    UpdateOrderPayload,
} from '@lib/shared_types';
import nodemailer from 'nodemailer';

import type { OrderStatus } from '../../../lib/shared_types';
import OrderModel from '../models/order';
import OrderItemModel from '../models/orderItem';
import { MongoMealRepository } from './meal_repository';
import { MongoShopRepository } from './shop_repository';

const mealRepo = new MongoMealRepository();
const shopRepo = new MongoShopRepository();

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

    async findByShopIdMonth(
        id: string,
        year: number,
        month: number,
    ): Promise<GetOrdersResponse> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return OrderModel.find({
            shop_id: id,
            order_date: {
                $gte: startDate,
                $lte: endDate,
            },
        });
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

    async findDetailsByOrderId(
        id: string,
    ): Promise<GetOrderDetailsResponse | null> {
        try {
            const order = await OrderModel.findById(id);

            if (!order) {
                return null;
            }

            const dbShop = await shopRepo.findById(order.shop_id);
            if (!dbShop) {
                return null;
            }

            const orderItems = await OrderItemModel.find({ order_id: id });
            let totalPrice = 0;

            const mealPromises = orderItems.map(async (item) => {
                const meal = await mealRepo.findById(item.meal_id);
                if (!meal) {
                    throw new Error(`Meal ${item.meal_id} not found`);
                }
                totalPrice += item.quantity * meal.price;
                return {
                    meal_name: meal.name,
                    quantity: item.quantity,
                    meal_price: meal.price,
                    remark: item.remark,
                };
            });

            const orderItemsWithDetails = await Promise.all(mealPromises);

            const orderDetails: GetOrderDetailsResponse = {
                id: order.id,
                user_id: order.user_id,
                status: order.status,
                date: order.order_date.toISOString(),
                order_items: orderItemsWithDetails,
                shop_name: dbShop.name,
                shop_id: dbShop.id,
                total_price: totalPrice,
            };

            return orderDetails;
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error('Error finding order detail:', error);
            }
            return null;
        }
    }

    async sendEmailToUser(
        order_details: OrderDetailsData,
        user_email: string,
        order_status: OrderStatus,
    ): Promise<boolean> {
        try {
            if (!process.env.GMAIL || !process.env.GMAIL.trim()) {
                console.error('Gmail not found in .env');
                return false;
            }

            if (!process.env.GMAIL_PASS || !process.env.GMAIL_PASS.trim()) {
                console.error('Gmail pass not found in .env');
                return false;
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAIL_PASS, // Input your Gmail 2-step verification
                    // app password
                },
            });

            let subject = '';
            let html = '';

            switch (order_status) {
                case 'inprogress':
                    subject = '你的訂單已成功訂購';
                    html = `總覽：<br>
                        訂單號碼：${order_details.id}<br>
                        訂購時間：${order_details.date}<br>
                        <br>
                        我們已收到您在 ${order_details.shop_name} 下的訂單囉！<br>
                        店家收到訂單後將盡快為您準備，惟實際出貨狀況依各店家接單狀況為主。<br>
                        提醒您，由於店家商品數量有所限制，在您成功下單後，店家有可能因備貨不足取消您的訂單，
                        取消後TSMC Eat將儘速通知您。<br>
                        <a href="https://sushi-frontend.azurewebsites.net/order/buyer/${order_details.user_id}">追蹤您的訂單</a><br>
                        <br>
                        待會見囉<br>
                        TSMC Eat<br>
                        <br>`;
                    break;
                case 'ready':
                    subject = '你的訂單已準備完成';
                    html = `總覽：<br>
                        訂單號碼：${order_details.id}<br>
                        訂購時間：${order_details.date}<br>
                        <br>
                        您在 ${order_details.shop_name} 下的訂單已經準備好囉！<br>
                        請儘速取餐，謝謝！<br>
                        <a href="https://sushi-frontend.azurewebsites.net/order/buyer/${order_details.user_id}">追蹤您的訂單</a><br>`;
                    break;
                case 'cancelled':
                    subject = '你的訂單已被取消';
                    html = `總覽：<br>
                        訂單號碼：${order_details.id}<br>
                        訂購時間：${order_details.date}<br>
                        <br>
                        您在 ${order_details.shop_name} 下的訂單已被取消，若有任何問題請聯絡店家。<br>
                        <a href="https://sushi-frontend.azurewebsites.net/order/buyer/${order_details.user_id}">追蹤您的訂單</a><br>`;
                    break;
                default:
                    return false;
            }

            await transporter.sendMail({
                from: process.env.GMAIL,
                to: user_email,
                subject,
                html,
            });

            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendEmailToShop(
        order_details: OrderDetailsData,
        shop_email: string,
        order_status: OrderStatus,
    ): Promise<boolean> {
        try {
            if (!process.env.GMAIL || !process.env.GMAIL.trim()) {
                console.error('Gmail not found in .env');
                return false;
            }

            if (!process.env.GMAIL_PASS || !process.env.GMAIL_PASS.trim()) {
                console.error('Gmail pass not found in .env');
                return false;
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAIL_PASS,
                },
            });

            let subject = '';
            let html = '';

            switch (order_status) {
                case 'waiting':
                    subject = '有新的訂單等待確認';
                    html = `總覽：<br>
                        訂單號碼：${order_details.id}<br>
                        訂購時間：${order_details.date}<br>
                        <br>
                        有新的訂單等待確認，請盡速確認訂單。<br>
                        <a href="https://sushi-frontend.azurewebsites.net/order/saler">追蹤您的訂單</a><br>`;
                    break;
                case 'cancelled':
                    subject = '有一筆訂單已被取消';
                    html = `總覽：<br>
                        訂單號碼：${order_details.id}<br>
                        訂購時間：${order_details.date}<br>
                        <br>
                        有一筆訂單已被取消，請盡速確認訂單。<br>
                        <a href="https://sushi-frontend.azurewebsites.net/order/saler">追蹤您的訂單</a><br>`;
                    break;
                default:
                    return false;
            }

            await transporter.sendMail({
                from: process.env.GMAIL,
                to: shop_email,
                subject,
                html,
            });

            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}
