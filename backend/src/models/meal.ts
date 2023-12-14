import type { MealData } from '@lib/shared_types';
import mongoose from 'mongoose';

interface MealDocument
    extends Omit<MealData, 'id' | 'shop_id'>,
        mongoose.Document {
    shop_id: string;
}

interface MealModel extends mongoose.Model<MealDocument> {}

const MealSchema = new mongoose.Schema<MealDocument>(
    {
        shop_id: {
            type: String,
            ref: 'Shop',
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        active: { type: Boolean, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                ret.shop_id = ret.shop_id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const Meal = mongoose.model<MealDocument, MealModel>('Meal', MealSchema);

export default Meal;
