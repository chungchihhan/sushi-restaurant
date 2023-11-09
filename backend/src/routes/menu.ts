import express from 'express';

import {
    createMenu,
    deleteMenu,
    getMenu,
    getMenus,
    updateMenu,
} from '../controllers/menu';

const router = express.Router();

// GET /api/menu/
router.get('/', getMenus);
// GET /api/menu/:id
router.get('/:id', getMenu);
// POST /api/menu
router.post('/', createMenu);
// PUT /api/menu/:id
router.put('/:id', updateMenu);
// DELETE /api/menu/:id
router.delete('/:id', deleteMenu);

export default router;
