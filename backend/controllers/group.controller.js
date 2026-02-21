import prisma from '../config/db.js';

// ─── @desc  Create a study group ──────────────────────────────────────────────
// ─── @route POST /api/groups
// ─── @access Private
export const createGroup = async (req, res) => {
  const { name, description, subject } = req.body;

  if (!name || !description)
    return res.status(400).json({ message: 'Name and description are required' });

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        subject,
        creator: { connect: { id: req.user.id } },
        members: { connect: { id: req.user.id } }, // creator auto-joins
      },
      include: {
        creator: { select: { id: true, name: true } },
        members: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Get all study groups ──────────────────────────────────────────────
// ─── @route GET /api/groups
// ─── @access Private
export const getGroups = async (req, res) => {
  const { subject, search } = req.query;

  try {
    const groups = await prisma.group.findMany({
      where: {
        ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      include: {
        creator: { select: { id: true, name: true } },
        members: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Get single group by ID ────────────────────────────────────────────
// ─── @route GET /api/groups/:id
// ─── @access Private
export const getGroupById = async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { id: true, name: true, department: true } },
        members: { select: { id: true, name: true, role: true, department: true } },
      },
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Join a study group ────────────────────────────────────────────────
// ─── @route POST /api/groups/:id/join
// ─── @access Private
export const joinGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some((m) => m.id === req.user.id);
    if (isMember)
      return res.status(400).json({ message: 'You are already a member of this group' });

    const updated = await prisma.group.update({
      where: { id },
      data: { members: { connect: { id: req.user.id } } },
      include: {
        creator: { select: { name: true } },
        members: { select: { id: true, name: true, role: true } },
      },
    });

    // Notify group creator
    await prisma.notification.create({
      data: {
        userId: group.creatorId,
        message: `Someone joined your study group: "${group.name}"`,
        type: 'group_join',
      },
    });

    res.json({ message: 'Joined group successfully', group: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Leave a study group ───────────────────────────────────────────────
// ─── @route POST /api/groups/:id/leave
// ─── @access Private
export const leaveGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creatorId === req.user.id)
      return res.status(400).json({ message: 'Creator cannot leave the group. Delete it instead.' });

    const isMember = group.members.some((m) => m.id === req.user.id);
    if (!isMember)
      return res.status(400).json({ message: 'You are not a member of this group' });

    await prisma.group.update({
      where: { id },
      data: { members: { disconnect: { id: req.user.id } } },
    });

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Delete a study group ──────────────────────────────────────────────
// ─── @route DELETE /api/groups/:id
// ─── @access Private (creator only)
export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({ where: { id } });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.creatorId !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this group' });

    await prisma.group.delete({ where: { id } });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
