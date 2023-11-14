import express from 'express';

import {
    createReview,
    deleteReview,
    getReview,
    getReviews,
    updateReview,
} from '../controllers/review';

const router = express.Router();

// GET /api/review/
router.get('/', getReviews);
// GET /api/review/:id
router.get('/:id', getReview);
// POST /api/review
router.post('/', createReview);
// PUT /api/review/:id
router.put('/:id', updateReview);
// DELETE /api/review/:id
router.delete('/:id', deleteReview);

export default router;
