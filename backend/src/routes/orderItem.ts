import express from 'express';

import {
    createOrderItem,
    deleteOrderItem,
    getOrderItem,
    getOrderItems,
    updateOrderItem,
} from '../controllers/orderItem';

// import { getOrders } from '../controllers/order';

const router = express.Router();

// GET /api/orderItem/
router.get('/', getOrderItems);
// GET /api/orderItem/:id
router.get('/:id', getOrderItem);
// POST /api/orderItem
router.post('/', createOrderItem);
// PUT /api/orderItem/:id
router.put('/:id', updateOrderItem);
// DELETE /api/orderItem/:id
router.delete('/:id', deleteOrderItem);

export default router;
