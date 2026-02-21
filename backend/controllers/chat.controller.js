import prisma from '../config/db.js';
import { io } from '../server.js';


const chatInclude = {
    sender: { select: { id: true, name: true, role: true } },
    receiver: { select: { id: true, name: true, role: true } },
    messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } },
    },
};

// ─── Send chat request (junior → senior/alumni) ──────────────────────────────
export const sendChatRequest = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        if (!receiverId) return res.status(400).json({ message: 'receiverId required' });
        if (receiverId === senderId) return res.status(400).json({ message: 'Cannot send request to yourself' });

        // Prevent duplicate pending requests
        const existing = await prisma.chatRequest.findFirst({
            where: { senderId, receiverId, status: 'PENDING' },
        });
        if (existing) return res.status(400).json({ message: 'You already have a pending request with this person' });

        const chatReq = await prisma.chatRequest.create({
            data: { senderId, receiverId, message: message || null },
            include: chatInclude,
        });
        res.status(201).json(chatReq);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Get all requests (sent + received) ─────────────────────────────────────
export const getChatRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await prisma.chatRequest.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }] },
            include: chatInclude,
            orderBy: { updatedAt: 'desc' },
        });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Accept request ──────────────────────────────────────────────────────────
export const acceptChatRequest = async (req, res) => {
    try {
        const chatReq = await prisma.chatRequest.findUnique({ where: { id: req.params.id } });
        if (!chatReq) return res.status(404).json({ message: 'Request not found' });
        if (chatReq.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorised' });

        const updated = await prisma.chatRequest.update({
            where: { id: req.params.id },
            data: { status: 'ACCEPTED' },
            include: chatInclude,
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Reject request ──────────────────────────────────────────────────────────
export const rejectChatRequest = async (req, res) => {
    try {
        const chatReq = await prisma.chatRequest.findUnique({ where: { id: req.params.id } });
        if (!chatReq) return res.status(404).json({ message: 'Request not found' });
        if (chatReq.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorised' });

        const updated = await prisma.chatRequest.update({
            where: { id: req.params.id },
            data: { status: 'REJECTED' },
            include: chatInclude,
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Get messages in a chat ──────────────────────────────────────────────────
export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const chatReq = await prisma.chatRequest.findUnique({ where: { id: req.params.id } });
        if (!chatReq) return res.status(404).json({ message: 'Chat not found' });
        if (chatReq.senderId !== userId && chatReq.receiverId !== userId)
            return res.status(403).json({ message: 'Not authorised' });
        if (chatReq.status !== 'ACCEPTED')
            return res.status(403).json({ message: 'Chat is not active' });

        const messages = await prisma.message.findMany({
            where: { chatRequestId: req.params.id },
            include: { sender: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'asc' },
        });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Send a message ──────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ message: 'Message content required' });

        const chatReq = await prisma.chatRequest.findUnique({ where: { id: req.params.id } });
        if (!chatReq) return res.status(404).json({ message: 'Chat not found' });
        if (chatReq.senderId !== userId && chatReq.receiverId !== userId)
            return res.status(403).json({ message: 'Not authorised' });
        if (chatReq.status !== 'ACCEPTED')
            return res.status(403).json({ message: 'Chat is not active' });

        const msg = await prisma.message.create({
            data: { content: content.trim(), chatRequestId: req.params.id, senderId: userId },
            include: { sender: { select: { id: true, name: true } } },
        });

        // Broadcast new message to everyone in the chat room (real-time)
        io.to(req.params.id).emit('new-message', msg);

        res.status(201).json(msg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

