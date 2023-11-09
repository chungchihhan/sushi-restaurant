import express from 'express';

import {
    createShop,
    deleteShop,
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

export default router;
