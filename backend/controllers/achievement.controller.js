import prisma from '../config/db.js';

// ─── Add achievement (senior/alumni only) ────────────────────────────────────
export const addAchievement = async (req, res) => {
    try {
        const { title, description, year, category } = req.body;
        const user = req.user;

        if (user.role !== 'senior' && user.role !== 'alumni' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Only seniors and alumni can add achievements' });
        }
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const achievement = await prisma.achievement.create({
            data: {
                title,
                description: description || null,
                year: year ? parseInt(year) : null,
                category: category || 'Other',
                userId: user.id,
            },
        });
        res.status(201).json(achievement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Get achievements for a user (public) ───────────────────────────────────
export const getUserAchievements = async (req, res) => {
    try {
        const achievements = await prisma.achievement.findMany({
            where: { userId: req.params.userId },
            orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        });
        res.json(achievements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Update own achievement ──────────────────────────────────────────────────
export const updateAchievement = async (req, res) => {
    try {
        const existing = await prisma.achievement.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ message: 'Achievement not found' });
        if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorised' });

        const { title, description, year, category } = req.body;
        const updated = await prisma.achievement.update({
            where: { id: req.params.id },
            data: {
                title: title ?? existing.title,
                description: description ?? existing.description,
                year: year !== undefined ? (year ? parseInt(year) : null) : existing.year,
                category: category ?? existing.category,
            },
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── Delete own achievement ──────────────────────────────────────────────────
export const deleteAchievement = async (req, res) => {
    try {
        const existing = await prisma.achievement.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ message: 'Achievement not found' });
        if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorised' });

        await prisma.achievement.delete({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
