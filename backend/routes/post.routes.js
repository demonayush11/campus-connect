import express from 'express';
import {
    createPost,
    getPosts,
    getPostById,
    deletePost,
    addComment,
    deleteComment,
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getPosts)
    .post(protect, createPost);

router.get('/:id', protect, getPostById);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, addComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

export default router;
