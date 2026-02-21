import express from 'express';
import {
    createGroup,
    getGroups,
    getGroupById,
    joinGroup,
    leaveGroup,
    deleteGroup,
} from '../controllers/group.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getGroups)
    .post(protect, createGroup);

router.get('/:id', protect, getGroupById);
router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);
router.delete('/:id', protect, deleteGroup);

export default router;
