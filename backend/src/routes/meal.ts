import express from 'express';

import {
    createMeal,
    deleteMeal,
    getMeal,
    getMeals,
    updateMeal,
} from '../controllers/meal';

const router = express.Router();

// GET /api/meal/
router.get('/', getMeals);
// GET /api/meal/:id
router.get('/:id', getMeal);
// POST /api/meal
router.post('/', createMeal);
// PUT /api/meal/:id
router.put('/:id', updateMeal);
// DELETE /api/meal/:id
router.delete('/:id', deleteMeal);

export default router;
