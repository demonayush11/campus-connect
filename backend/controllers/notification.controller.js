import prisma from '../config/db.js';

// ─── @desc  Get my notifications ──────────────────────────────────────────────
// ─── @route GET /api/notifications
// ─── @access Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Mark a notification as read ───────────────────────────────────────
// ─── @route PATCH /api/notifications/:id/read
// ─── @access Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: req.params.id },
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.userId !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        const updated = await prisma.notification.update({
            where: { id: req.params.id },
            data: { isRead: true },
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Mark all notifications as read ────────────────────────────────────
// ─── @route PATCH /api/notifications/read-all
// ─── @access Private
export const markAllAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true },
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── @desc  Delete a notification ─────────────────────────────────────────────
// ─── @route DELETE /api/notifications/:id
// ─── @access Private
export const deleteNotification = async (req, res) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: req.params.id },
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.userId !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        await prisma.notification.delete({ where: { id: req.params.id } });

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
