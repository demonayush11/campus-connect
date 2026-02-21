import express from 'express';
import {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    getSeniors,
    getUserById,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.get('/seniors', protect, getSeniors);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);

export default router;

