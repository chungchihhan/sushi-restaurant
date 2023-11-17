import express from 'express';

import {
    cancelOrder,
    createUser,
    deleteUser,
    getBalance,
    getOrderDetails,
    getOrdersByUserId,
    getUser,
    getUsers,
    updateUser,
    userLogin,
} from '../controllers/user';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/user/
router.get('/', getUsers);
// GET /api/user/:id
router.get('/:id', authenticateToken, getUser);
// POST /api/user/register
router.post('/register', createUser);
// PUT /api/user/:id
router.put('/:id', authenticateToken, updateUser);
// DELETE /api/user/:id
router.delete('/:id', authenticateToken, deleteUser);
// POST /api/user/login
router.post('/login', userLogin);
// GET /api/user/:user_id/orders
router.get('/:user_id/orders', getOrdersByUserId);
// GET /api/user/:user_id/order/:order_id
router.get('/:user_id/order/:id', getOrderDetails);
// PUT /api/user/:user_id/order/:order_id/cancel
router.put('/:user_id/order/:id/cancel', cancelOrder);
// GET api/user/:user_id/balance?year=y&month=m
router.get('/:user_id/balance', getBalance);

export default router;
