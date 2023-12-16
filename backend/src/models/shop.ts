import type { ShopData } from '@lib/shared_types';
import mongoose from 'mongoose';

interface ShopDocument
    extends Omit<ShopData, 'id' | 'user_id'>,
        mongoose.Document {
    user_id: string;
}

interface ShopModel extends mongoose.Model<ShopDocument> {}

const ShopSchema = new mongoose.Schema<ShopDocument>(
    {
        user_id: {
            type: String,
            ref: 'User',
            required: true,
        },
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        image: { type: String, required: false },
        category: { type: String, required: true },
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
        saturday: { type: String, required: true },
        sunday: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                ret.user_id = ret.user_id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const Shop = mongoose.model<ShopDocument, ShopModel>('Shop', ShopSchema);

export default Shop;
