import type {
    CreateReviewPayload,
    CreateReviewResponse,
    DeleteReviewResponse,
    GetReviewResponse,
    GetReviewsResponse,
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

        const payload = req.body;

        const newReview = await reviewRepo.create(payload);

        return res.status(201).json({ id: newReview._id.toString() });
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
