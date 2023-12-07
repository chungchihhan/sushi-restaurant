import { type OrderData } from '@lib/shared_types';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

import { OrderStatus } from '../../../lib/shared_types';

interface OrderDocument
    extends Omit<OrderData, 'id' | 'order_date'>,
        mongoose.Document {
    id: Types.ObjectId;
    order_date: Date;
}

interface OrderModel extends mongoose.Model<OrderDocument> {}

const OrderSchema = new mongoose.Schema<OrderDocument>(
    {
        user_id: {
            type: String,
            ref: 'User',
            required: true,
        },
        shop_id: {
            type: String,
            ref: 'Shop',
            required: true,
        },
        order_date: { type: Date, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.WAITING,
        },
    },
    {
        // timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export default Order;
