import express from 'express';

import {
    createUser,
    deleteUser,
    getOrdersByUserId,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user';

const router = express.Router();

// GET /api/user/
router.get('/', getUsers);
// GET /api/user/:id
router.get('/:id', getUser);
// POST /api/user
router.post('/', createUser);
// PUT /api/user/:id
router.put('/:id', updateUser);
// DELETE /api/user/:id
router.delete('/:id', deleteUser);
// GET /api/user/:user_id/orders
router.get('/:user_id/orders', getOrdersByUserId);

export default router;
