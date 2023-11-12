import type {
    CreateReviewPayload,
    GetReviewResponse,
    GetReviewsResponse,
    UpdateReviewPayload,
} from '@lib/shared_types_shop';
import type { ObjectId } from 'mongoose';

import ReviewModel from '../models/review';

interface IReviewRepository {
    findAll(): Promise<GetReviewsResponse>;
    findById(id: string): Promise<GetReviewResponse | null>;
    exists(user_id: string, shop_id: string): Promise<boolean>;
    create(payload: CreateReviewPayload): Promise<{ _id: ObjectId }>;
    updateById(id: string, payload: UpdateReviewPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoReviewRepository implements IReviewRepository {
    async findAll(): Promise<GetReviewsResponse> {
        return ReviewModel.find({});
    }

    async findById(id: string): Promise<GetReviewResponse | null> {
        return ReviewModel.findById(id);
    }

    async exists(user_id: string, shop_id: string): Promise<boolean> {
        const ReviewExists = await ReviewModel.exists({ user_id, shop_id });
        if (ReviewExists) return true;
        return false;
    }

    async create(payload: CreateReviewPayload): Promise<{ _id: ObjectId }> {
        const review = new ReviewModel(payload);
        return review.save();
    }

    async updateById(
        id: string,
        payload: UpdateReviewPayload,
    ): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await ReviewModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await ReviewModel.findByIdAndDelete(id);
        return result != null;
    }
}
