import type {
    CreateOrderPayload,
    GetOrderDetailsResponse,
    GetOrderResponse,
    GetOrdersResponse,
    OrderData,
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
            console.error('Error finding order detail:', error);
            return null;
        }
    }

    async sendEmailToUser(
        userEmail: string,
        orderStatus: OrderStatus,
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
                    pass: process.env.GMAIL_PASS, // Input your Gmail 2-step verification app password
                },
            });

            let subject = '';
            let html = '';

            switch (orderStatus) {
                case 'inprogress':
                    subject = 'Your order is in progress!';
                    html =
                        'Your order is now in progress. We will notify you once it is ready for pickup.';
                    break;
                case 'ready':
                    subject = 'Your order is ready!';
                    html =
                        'Your order is now ready for pickup. Enjoy your meal!';
                    break;
                case 'cancelled':
                    subject = 'Your order has been canceled';
                    html =
                        'Your order has been canceled. If you have any questions, please contact us.';
                    break;
                default:
                    return false;
            }

            await transporter.sendMail({
                from: process.env.GMAIL,
                to: userEmail,
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
        shopEmail: string,
        orderStatus: OrderStatus,
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

            switch (orderStatus) {
                case 'waiting':
                    subject = 'New order for confirmation';
                    html =
                        'A new order is waiting for confirmation. Please check your dashboard for details.';
                    break;
                case 'cancelled':
                    subject = 'New order cancellation';
                    html =
                        'An order has been canceled. Please check your dashboard for details.';
                    break;
                default:
                    return false;
            }

            await transporter.sendMail({
                from: process.env.GMAIL,
                to: shopEmail,
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
