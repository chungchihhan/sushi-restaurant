import express from 'express';

import { createOrder, getOrder, getOrders } from '../controllers/order';

// import { getOrders } from '../controllers/order';

const router = express.Router();

// GET /api/order/
router.get('/', getOrders);
// GET /api/order/:id
router.get('/:id', getOrder);
// POST /api/order
router.post('/', createOrder);

export default router;
