import express from 'express';

import {
    createMeal,
    deleteMeal,
    getMealsByShopId,
    updateMeal,
} from '../controllers/meal';
import { getAvgRating } from '../controllers/review';
import {
    createShop,
    deleteShop,
    getOrdersByShopId,
    getShop,
    getShops,
    getShopsByCategory,
    updateShop,
} from '../controllers/shop';

const router = express.Router();

// GET /api/shop/
router.get('/', getShops);
// GET /api/shop/category
router.get('/:category', getShopsByCategory);
// GET /api/shop/:id
router.get('/:id', getShop);
// GET /api/shop/:id/meals
router.get('/:id/meals', getMealsByShopId);
//GET /api/shop/:id/rating
router.get('/:id/rating', getAvgRating);
// POST /api/shop
router.post('/', createShop);
// POST /api/shop/:id/meal
router.post('/:id/meal', createMeal);
// PUT /api/shop/:id
router.put('/:id', updateShop);
// PUT /api/shop/:id/meal/:id
router.put('/:id/meal/:id', updateMeal);
// DELETE /api/shop/:id
router.delete('/:id', deleteShop);
// DELETE /api/shop/:id/meal/:id
router.delete('/:id/meal/:id', deleteMeal);
// GET /api/shop/:shop_id/orders
router.get('/:shop_id/orders', getOrdersByShopId);

export default router;
