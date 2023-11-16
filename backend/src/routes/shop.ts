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
    getRevenue,
    getShop,
    getShops,
    getShopsByCategory,
    updateOrder,
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
router.get('/:shop_id/meals', getMealsByShopId);
//GET /api/shop/:id/rating
router.get('/:shop_id/rating', getAvgRating);
// POST /api/shop
router.post('/', createShop);
// POST /api/shop/:id/meal
router.post('/:shop_id/meal', createMeal);
// PUT /api/shop/:id
router.put('/:id', updateShop);
// PUT /api/shop/:id/meal/:id
router.put('/:shop_id/meal/:id', updateMeal);
// DELETE /api/shop/:id
router.delete('/:id', deleteShop);
// DELETE /api/shop/:id/meal/:id
router.delete('/:shop_id/meal/:id', deleteMeal);
// GET /api/shop/:shop_id/orders
router.get('/:shop_id/orders', getOrdersByShopId);
// PUT /api/shop/:shop_id/order/:order_id
router.put('/:shop_id/order/:order_id', updateOrder);
// GET /api/shop/:shop_id/revenue?year=y&month=m
router.get('/:shop_id/revenue', getRevenue);

export default router;
