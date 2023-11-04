import express from 'express';

import {
    createUser,
    deleteUser,
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

export default router;
