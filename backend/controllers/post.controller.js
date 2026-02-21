import prisma from '../config/db.js';

// ─── @desc  Create a new post ─────────────────────────────────────────────────
// ─── @route POST /api/posts
// ─── @access Private
export const createPost = async (req, res) => {
    const { title, content, tags } = req.body;

    if (!title || !content)
        return res.status(400).json({ message: 'Title and content are required' });

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                tags: Array.isArray(tags) ? tags : [],
                author: { connect: { id: req.user.id } },
            },
            include: {
                author: { select: { id: true, name: true, role: true, department: true, profilePic: true } },
            },
        });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Get all posts ─────────────────────────────────────────────────────
// ─── @route GET /api/posts
// ─── @access Private
export const getPosts = async (req, res) => {
    const { tag, search } = req.query;

    try {
        const posts = await prisma.post.findMany({
            where: {
                ...(tag && { tags: { has: tag } }),
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                author: { select: { id: true, name: true, role: true, department: true, profilePic: true } },
                comments: {
                    include: {
                        author: { select: { id: true, name: true, role: true, profilePic: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Get single post by ID ─────────────────────────────────────────────
// ─── @route GET /api/posts/:id
// ─── @access Private
export const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                author: { select: { id: true, name: true, role: true, department: true, bio: true, profilePic: true } },
                comments: {
                    include: {
                        author: { select: { id: true, name: true, role: true, profilePic: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Delete a post ─────────────────────────────────────────────────────
// ─── @route DELETE /api/posts/:id
// ─── @access Private (author only)
export const deletePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: req.params.id } });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.authorId !== req.user.id)
            return res.status(403).json({ message: 'Not authorized to delete this post' });

        await prisma.post.delete({ where: { id: req.params.id } });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Add a comment to a post ──────────────────────────────────────────
// ─── @route POST /api/posts/:id/comments
// ─── @access Private
export const addComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content)
        return res.status(400).json({ message: 'Comment content is required' });

    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await prisma.comment.create({
            data: {
                content,
                post: { connect: { id } },
                author: { connect: { id: req.user.id } },
            },
            include: {
                author: { select: { id: true, name: true, role: true, profilePic: true } },
            },
        });

        // Notify post author if it's not their own comment
        if (post.authorId !== req.user.id) {
            await prisma.notification.create({
                data: {
                    userId: post.authorId,
                    message: `Someone commented on your post: "${post.title}"`,
                    type: 'comment',
                },
            });
        }

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Delete a comment ──────────────────────────────────────────────────
// ─── @route DELETE /api/posts/:postId/comments/:commentId
// ─── @access Private (comment author only)
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.authorId !== req.user.id)
            return res.status(403).json({ message: 'Not authorized to delete this comment' });

        await prisma.comment.delete({ where: { id: commentId } });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
