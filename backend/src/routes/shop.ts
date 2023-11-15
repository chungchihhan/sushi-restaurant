import express from 'express';

import {
    createShop,
    deleteShop,
    getOrdersByShop,
    getShop,
    getShops,
    updateShop,
} from '../controllers/shop';

const router = express.Router();

// GET /api/shop/
router.get('/', getShops);
// GET /api/shop/:id
router.get('/:id', getShop);
// POST /api/shop
router.post('/', createShop);
// PUT /api/shop/:id
router.put('/:id', updateShop);
// DELETE /api/shop/:id
router.delete('/:id', deleteShop);
// GET /api/shop/:shop_id/orders
router.get('/:shop_id/orders', getOrdersByShop);

export default router;
