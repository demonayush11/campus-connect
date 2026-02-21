import express from 'express';
import {
    createSession,
    getSessions,
    getSessionById,
    joinSession,
    leaveSession,
    deleteSession,
} from '../controllers/mentor.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/sessions', protect, getSessions);
router.post('/sessions', protect, authorize('senior', 'alumni'), createSession);
router.get('/sessions/:id', protect, getSessionById);
router.post('/sessions/:id/join', protect, joinSession);
router.post('/sessions/:id/leave', protect, leaveSession);
router.delete('/sessions/:id', protect, authorize('senior', 'alumni'), deleteSession);

export default router;
