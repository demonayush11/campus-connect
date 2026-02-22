import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { computeAcademicYear } from "./auth.controller.js";

// ─── Safe user select (never expose password) ─────────────────────────────────
const safeSelect = {
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
  profilePic: true,
  isVerified: true,
  createdAt: true,
};

// Attach live-computed academicYear to a user or array of users
const withYear = (u) => ({
  ...u,
  academicYear: u.admissionYear != null ? computeAcademicYear(u.admissionYear) : null,
});

// ─── @desc  Get own profile ───────────────────────────────────────────────────
// ─── @route GET /api/users/me
// ─── @access Private
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: safeSelect,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(withYear(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── @desc  Update own profile ────────────────────────────────────────────────
// ─── @route PUT /api/users/profile
// ─── @access Private
export const updateProfile = async (req, res) => {
  // Note: rollNumber, admissionYear, academicYear are NOT updatable by client
  const { name, bio, skills, github, linkedin, department, profilePic } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(skills && { skills: Array.isArray(skills) ? skills : [] }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
        ...(department !== undefined && { department }),
        ...(profilePic !== undefined && { profilePic }),
      },
      select: safeSelect,
    });

    res.json({ message: "Profile updated", user: withYear(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── @desc  Change password ───────────────────────────────────────────────────
// ─── @route PUT /api/users/change-password
// ─── @access Private
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ message: "Old and new password are required" });

  if (newPassword.length < 6)
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters" });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── @desc  Get all users (with optional role filter) ────────────────────────
// ─── @route GET /api/users?role=senior|junior|alumni
// ─── @access Private
export const getAllUsers = async (req, res) => {
  const { role, department, search } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(department && { department }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      select: safeSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json(users.map(withYear));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── @desc  Get seniors + alumni with achievements ────────────────────────────
// ─── @route GET /api/users/seniors
// ─── @access Private
export const getSeniors = async (req, res) => {
  try {
    const { search, department } = req.query;
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["senior", "alumni"] },
        ...(department && { department }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        ...safeSelect,
        achievements: { orderBy: [{ year: "desc" }, { createdAt: "desc" }] },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users.map(withYear));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── @desc  Get user by ID (public profile with achievements) ─────────────────
// ─── @route GET /api/users/:id
// ─── @access Private
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...safeSelect,
        achievements: { orderBy: [{ year: "desc" }, { createdAt: "desc" }] },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(withYear(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

