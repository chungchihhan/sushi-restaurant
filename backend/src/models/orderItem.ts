import type { OrderItemData } from '@lib/shared_types';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

interface OrderItemDocument
    extends Omit<OrderItemData, 'id'>,
        mongoose.Document {
    id: Types.ObjectId;
}

interface OrderItemModel extends mongoose.Model<OrderItemDocument> {}

const OrderItemSchema = new mongoose.Schema<OrderItemDocument>(
    {
        order_id: {
            type: String,
            ref: 'Order',
            required: true,
        },
        meal_id: {
            type: String,
            ref: 'Meal',
            required: true,
        },
        quantity: { type: Number, required: true },
        remark: { type: String, required: false },
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

const OrderItem = mongoose.model<OrderItemDocument, OrderItemModel>(
    'OrderItem',
    OrderItemSchema,
);

export default OrderItem;
