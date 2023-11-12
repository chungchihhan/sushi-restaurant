import express from 'express';

import { createOrder, getOrder, getOrders, updateOrder, deleteOrder } from '../controllers/order';

// import { getOrders } from '../controllers/order';

const router = express.Router();

// GET /api/order/
router.get('/', getOrders);
// GET /api/order/:id
router.get('/:id', getOrder);
// POST /api/order
router.post('/', createOrder);
// PUT /api/user/:id
router.put('/:id', updateOrder);
// DELETE /api/user/:id
router.delete('/:id', deleteOrder);

export default router;
