import type {
    CreateReviewPayload,
    CreateReviewResponse,
    DeleteReviewResponse,
    GetReviewResponse,
    GetReviewsResponse,
    ReviewData,
    UpdateReviewPayload,
    UpdateReviewResponse,
} from '@lib/shared_types_shop';
import type { Request, Response } from 'express';

import { genericErrorHandler } from '../utils/errors';
import { MongoReviewRepository } from './review_repository';

const reviewRepo = new MongoReviewRepository();

export const getReviews = async (
    _: Request,
    res: Response<GetReviewsResponse>,
) => {
    try {
        const dbReviews = await reviewRepo.findAll();

        return res.status(200).json(dbReviews);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getReview = async (
    req: Request<{ id: string }>,
    res: Response<GetReviewResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const dbReview = await reviewRepo.findById(id);
        if (!dbReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        return res.status(200).json(dbReview);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const getAvgRating = async (
    req: Request<{ shop_id: string }>,
    res: Response<number | { error: string }>,
) => {
    try {
        const { shop_id } = req.params;

        const dbReviews = await reviewRepo.findAllbyShopId(shop_id);
        if (dbReviews.length === 0) {
            return res
                .status(404)
                .json({ error: 'Reviews not found for the shop' });
        }

        const totalRating: number = dbReviews.reduce(
            (sum, review) => sum + review.rating,
            0,
        );
        const avgRating: number = totalRating / dbReviews.length;

        return res.status(200).json(avgRating);
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const createReview = async (
    req: Request<never, never, CreateReviewPayload>,
    res: Response<CreateReviewResponse | { error: string }>,
) => {
    try {
        const { user_id, shop_id, rating } = req.body;

        // check if the review name is already in the database
        const reviewExists = await reviewRepo.exists(user_id, shop_id);
        if (reviewExists) {
            return res.status(404).json({ error: 'Review already exists' });
        }

        const payload: Omit<ReviewData, 'id'> = {
            user_id,
            shop_id,
            rating,
        };

        const newReview = await reviewRepo.create(payload);

        return res.status(201).json({ id: newReview.id.toString() });
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const updateReview = async (
    req: Request<{ id: string }, never, UpdateReviewPayload>,
    res: Response<UpdateReviewResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldReview = await reviewRepo.findById(id);

        if (!oldReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const payLoad = req.body;

        await reviewRepo.updateById(id, payLoad);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};

export const deleteReview = async (
    req: Request<{ id: string }>,
    res: Response<DeleteReviewResponse | { error: string }>,
) => {
    try {
        const { id } = req.params;

        const oldReview = await reviewRepo.findById(id);

        if (!oldReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await reviewRepo.deleteById(id);

        res.status(200).send('OK');
    } catch (err) {
        genericErrorHandler(err, res);
    }
};
