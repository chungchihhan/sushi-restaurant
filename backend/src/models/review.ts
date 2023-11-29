import type { ReviewData } from '@lib/shared_types';
import mongoose from 'mongoose';

interface ReviewDocument
    extends Omit<ReviewData, 'id' | 'user_id' | 'shop_id'>,
        mongoose.Document {
    user_id: string;
    shop_id: string;
}

interface ReviewModel extends mongoose.Model<ReviewDocument> {}

const ReviewSchema = new mongoose.Schema<ReviewDocument>(
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
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                ret.user_id = ret.user_id.toString();
                ret.shop_id = ret.shop_id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const Review = mongoose.model<ReviewDocument, ReviewModel>(
    'Review',
    ReviewSchema,
);

export default Review;
