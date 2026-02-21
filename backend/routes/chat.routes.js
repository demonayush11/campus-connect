import express from 'express';
import {
    sendChatRequest,
    getChatRequests,
    acceptChatRequest,
    rejectChatRequest,
    getMessages,
    sendMessage,
} from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/request', protect, sendChatRequest);
router.get('/requests', protect, getChatRequests);
router.put('/requests/:id/accept', protect, acceptChatRequest);
router.put('/requests/:id/reject', protect, rejectChatRequest);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);

export default router;
