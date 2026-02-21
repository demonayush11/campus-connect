import { io as socketIO } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Singleton — one socket connection for the whole app
let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = socketIO(SOCKET_URL, {
            transports: ["websocket"],
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) s.connect();
    return s;
};

export const disconnectSocket = () => {
    if (socket?.connected) {
        socket.disconnect();
    }
};
