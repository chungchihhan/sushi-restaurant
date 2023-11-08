import type { OrderItemData } from '@lib/shared_types';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

interface OrderItemDocument extends Omit<OrderItemData, 'id' | 'order_id' | 'menu_id'>, mongoose.Document {
    id: Types.ObjectId;
    order_id: Types.ObjectId;
    menu_id: Types.ObjectId;
}

interface OrderItemModel extends mongoose.Model<OrderItemDocument> {}

const OrderItemSchema = new mongoose.Schema<OrderItemDocument> (
    {
        order_id: { type: mongoose.Schema.Types.ObjectId, ref:'Order', required: true },
        menu_id: { type: mongoose.Schema.Types.ObjectId, ref:'Menu', required: true },
        quantity: { type: Number, required: true },
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

const OrderItem = mongoose.model<OrderItemDocument, OrderItemModel>('Item', OrderItemSchema);

export default OrderItem;
