import express from 'express';
import { addAchievement, getUserAchievements, updateAchievement, deleteAchievement } from '../controllers/achievement.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId', protect, getUserAchievements);
router.post('/', protect, addAchievement);
router.put('/:id', protect, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

export default router;
