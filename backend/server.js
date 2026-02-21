import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import groupRoutes from "./routes/group.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
const httpServer = createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────
export const io = new SocketServer(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    // Join a chat room (room = chatRequestId)
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });

    // Leave a room (when switching conversations)
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
    });

    // Typing indicator: broadcast to everyone else in the room
    socket.on("typing", ({ roomId, userName }) => {
        socket.to(roomId).emit("user-typing", { userName });
    });

    socket.on("stop-typing", ({ roomId }) => {
        socket.to(roomId).emit("user-stop-typing");
    });

    socket.on("disconnect", () => { });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "🚀 Campus Connect API is running!", status: "ok" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/chat", chatRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err.message);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT} 🚀`));
