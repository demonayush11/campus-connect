import prisma from '../config/db.js';

// ─── @desc  Create a mentorship session ──────────────────────────────────────
// ─── @route POST /api/mentors/sessions
// ─── @access Private (senior / alumni only)
export const createSession = async (req, res) => {
  const { title, description, date, duration, link } = req.body;

  if (!title || !description || !date || !duration) {
    return res.status(400).json({ message: 'Title, description, date and duration are required' });
  }

  try {
    const session = await prisma.session.create({
      data: {
        title,
        description,
        date: new Date(date),
        duration: parseInt(duration),
        link,
        mentor: { connect: { id: req.user.id } },
      },
      include: {
        mentor: { select: { name: true, role: true, department: true } },
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Get all mentorship sessions ──────────────────────────────────────
// ─── @route GET /api/mentors/sessions
// ─── @access Private
export const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        mentor: { select: { id: true, name: true, role: true, department: true, profilePic: true } },
        attendees: { select: { id: true, name: true, role: true } },
      },
      orderBy: { date: 'asc' },
    });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Get single session by ID ─────────────────────────────────────────
// ─── @route GET /api/mentors/sessions/:id
// ─── @access Private
export const getSessionById = async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        mentor: { select: { id: true, name: true, role: true, department: true, bio: true, profilePic: true } },
        attendees: { select: { id: true, name: true, role: true } },
      },
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Join a mentorship session ────────────────────────────────────────
// ─── @route POST /api/mentors/sessions/:id/join
// ─── @access Private
export const joinSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { attendees: true },
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentorId === req.user.id)
      return res.status(400).json({ message: 'You are the mentor of this session' });

    const isAttending = session.attendees.some((a) => a.id === req.user.id);
    if (isAttending)
      return res.status(400).json({ message: 'You have already joined this session' });

    const updated = await prisma.session.update({
      where: { id },
      data: { attendees: { connect: { id: req.user.id } } },
      include: {
        mentor: { select: { name: true, role: true } },
        attendees: { select: { id: true, name: true } },
      },
    });

    // Create notification for the mentor
    await prisma.notification.create({
      data: {
        userId: session.mentorId,
        message: `Someone joined your session: "${session.title}"`,
        type: 'session_join',
      },
    });

    res.json({ message: 'Joined session successfully', session: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Leave a mentorship session ───────────────────────────────────────
// ─── @route POST /api/mentors/sessions/:id/leave
// ─── @access Private
export const leaveSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { attendees: true },
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isAttending = session.attendees.some((a) => a.id === req.user.id);
    if (!isAttending)
      return res.status(400).json({ message: 'You are not attending this session' });

    await prisma.session.update({
      where: { id },
      data: { attendees: { disconnect: { id: req.user.id } } },
    });

    res.json({ message: 'Left session successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc  Delete a mentorship session ──────────────────────────────────────
// ─── @route DELETE /api/mentors/sessions/:id
// ─── @access Private (only the mentor who created it)
export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.mentorId !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this session' });

    await prisma.session.delete({ where: { id } });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
