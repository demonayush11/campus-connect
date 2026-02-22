import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// =========================
// Generate JWT
// =========================
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// =========================
// Compute academic year from admissionYear (NEVER stored — always live)
// July-based calendar: if month >= 7, new academic year has started
// =========================
export function computeAcademicYear(admissionYear) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  return currentMonth >= 7
    ? currentYear - admissionYear + 1
    : currentYear - admissionYear;
}

// =========================
// Derive role from academicYear:
//   3rd or 4th year → 'senior' (can create mentorship sessions)
//   1st or 2nd year → 'junior'
// =========================
function roleFromYear(academicYear) {
  return academicYear >= 3 ? 'senior' : 'junior';
}

// =========================
// Parse KIIT email → { rollNumber, admissionYear } or null
// Format: 23052234@kiit.ac.in  (first 2 digits = YY)
// =========================
function parseKiitEmail(email) {
  const match = email.trim().match(/^(\d{2})(\d+)@kiit\.ac\.in$/i);
  if (!match) return null;
  const yy = parseInt(match[1], 10);
  return {
    rollNumber: email.split('@')[0],
    admissionYear: 2000 + yy,
  };
}

// =========================
// Attach computed academicYear to a user object for API response
// =========================
function attachAcademicYear(user) {
  return {
    ...user,
    academicYear: user.admissionYear != null
      ? computeAcademicYear(user.admissionYear)
      : null,
  };
}

// =========================
// @desc Register user
// =========================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      skills,
      bio,
      github,
      linkedin
    } = req.body;

    // ===== Basic validation =====
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // ===== KIIT email validation =====
    const parsed = parseKiitEmail(email);
    if (!parsed) {
      return res.status(400).json({
        message: 'Only KIIT emails are allowed (e.g. 23052234@kiit.ac.in)'
      });
    }

    const { rollNumber, admissionYear } = parsed;
    const academicYear = computeAcademicYear(admissionYear);
    const role = roleFromYear(academicYear);

    if (academicYear < 1 || academicYear > 4) {
      return res.status(400).json({
        message: 'Invalid batch — only active KIIT students (1st–4th year) can register.'
      });
    }

    // ===== Duplicate check =====
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ===== Create user =====
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,             // 'senior' for 3rd/4th year, 'junior' for 1st/2nd
        rollNumber,
        admissionYear,
        department,
        skills: Array.isArray(skills) ? skills : [],
        bio,
        github,
        linkedin,
      }
    });

    const response = attachAcademicYear({
      token: generateToken(user),
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      rollNumber: user.rollNumber,
      admissionYear: user.admissionYear,
      bio: user.bio || '',
      department: user.department || '',
      skills: user.skills || [],
      github: user.github || '',
      linkedin: user.linkedin || '',
    });

    res.status(201).json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================
// @desc Login user
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ── Auto-sync role based on current academicYear ──────────────────
    // This ensures a student auto-promoted to 3rd year in July
    // gets senior access on their next login (no manual DB edit needed).
    let updatedUser = user;
    if (user.admissionYear != null) {
      const currentAcademicYear = computeAcademicYear(user.admissionYear);
      const expectedRole = roleFromYear(currentAcademicYear);
      if (user.role !== expectedRole) {
        updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { role: expectedRole },
        });
      }
    }

    const response = attachAcademicYear({
      token: generateToken(updatedUser),
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      rollNumber: updatedUser.rollNumber || '',
      admissionYear: updatedUser.admissionYear,
      bio: updatedUser.bio || '',
      department: updatedUser.department || '',
      skills: updatedUser.skills || [],
      github: updatedUser.github || '',
      linkedin: updatedUser.linkedin || '',
    });

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================
// @desc Get profile
// =========================
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        rollNumber: true,
        admissionYear: true,
        department: true,
        bio: true,
        skills: true,
        github: true,
        linkedin: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(attachAcademicYear(user));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};