import express from 'express';

import {
    createOrder,
    deleteOrder,
    getOrder,
    getOrders,
} from '../controllers/order';

const router = express.Router();

// GET /api/order/
router.get('/', getOrders);
// GET /api/order/:id
router.get('/:id', getOrder);
// POST /api/order
router.post('/', createOrder);
// DELETE /api/user/:id
router.delete('/:id', deleteOrder);

export default router;
