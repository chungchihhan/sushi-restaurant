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
    getImageUrlForMeal,
    getImageUrlForShop,
    getOrdersByShopId,
    getRevenue,
    getRevenueDetails,
    getShop,
    getShopsByCategory,
    getShopsCategory,
    updateOrder,
    updateShop,
    uploadImageForMeal,
    uploadImageForShop,
    uploadImageMiddleware,
} from '../controllers/shop';

const router = express.Router();

// GET /api/shop/
router.get('/', getShopsCategory);
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
// GET /api/shop/:shop_id/revenue?year=y&month=m/details
router.get('/:shop_id/revenue/details', getRevenueDetails);
// POST /api/shop/:shop_id/image
router.post('/:shop_id/image', uploadImageMiddleware, uploadImageForShop);
// GET /api/shop/:shop_id/image
router.get('/:shop_id/image', getImageUrlForShop);
// POST /api/shop/:shop_id/meal/:meal_id/image
router.post(
    '/:shop_id/meal/:meal_id/image',
    uploadImageMiddleware,
    uploadImageForMeal,
);
// GET /api/shop/:shop_id/meal/:meal_id/image
router.get('/:shop_id/meal/:meal_id/image', getImageUrlForMeal);

export default router;
