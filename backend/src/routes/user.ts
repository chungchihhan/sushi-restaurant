import express from 'express';

import {
    createUser,
    deleteUser,
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
router.get('/:id', getUser);
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

export default router;
