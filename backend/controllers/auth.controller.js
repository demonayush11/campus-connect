import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// =========================
// Generate JWT
// =========================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// =========================
// @desc Register user
// =========================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      batch,
      department,
      skills,
      bio,
      github,
      linkedin
    } = req.body;

    // ===== Validation =====
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Prevent role abuse
    const allowedRoles = ['junior', 'senior', 'alumni'];
    const userRole = allowedRoles.includes(role) ? role : 'junior';

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        batch,
        department,
        skills: Array.isArray(skills) ? skills : [],
        bio,
        github,
        linkedin
      }
    });

    res.status(201).json({
      token: generateToken(user),
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || "",
      department: user.department || "",
      batch: user.batch || "",
      skills: user.skills || [],
      github: user.github || "",
      linkedin: user.linkedin || "",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// @desc Login user
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user),
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || "",
      department: user.department || "",
      batch: user.batch || "",
      skills: user.skills || [],
      github: user.github || "",
      linkedin: user.linkedin || "",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
        batch: true,
        department: true,
        bio: true,
        skills: true,
        github: true,
        linkedin: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};