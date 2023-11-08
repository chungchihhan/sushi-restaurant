import type { OrderData } from '@lib/shared_types';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

interface OrderDocument extends Omit<OrderData, 'id' | 'user_id' | 'shop_id' | 'order_date'>, mongoose.Document {
    id: Types.ObjectId;
    user_id: Types.ObjectId;
    shop_id: Types.ObjectId;
    order_date: Date;
}

interface OrderModel extends mongoose.Model<OrderDocument> {}

const OrderSchema = new mongoose.Schema<OrderDocument> (
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
        shop_id: { type: mongoose.Schema.Types.ObjectId, ref:'Shop', required: true },
        order_date: { type: Date, required: true },
        total_price: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ['shopping cart', 'waiting', 'in progress', 'ready', 'finished'],
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
