import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, X, Send, Loader2, Clock } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { chatApi } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

const statusStyles = {
    PENDING: { badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20", icon: Clock },
    ACCEPTED: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20", icon: Check },
    REJECTED: { badge: "bg-rose-500/20 text-rose-400 border-rose-500/20", icon: X },
};

const roleGradient = {
    junior: "from-blue-400 to-cyan-500",
    senior: "from-indigo-400 to-purple-500",
    alumni: "from-rose-400 to-orange-500",
};

// Animated typing dots
const TypingIndicator = ({ name }) => (
    <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        className="flex items-center gap-2 px-1"
    >
        <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-2xl rounded-bl-sm">
            {[0, 0.15, 0.3].map((delay, i) => (
                <motion.span
                    key={i}
                    className="w-1.5 h-1.5 bg-white/60 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
                />
            ))}
        </div>
        <span className="text-xs text-white/30">{name} is typing…</span>
    </motion.div>
);

const Chat = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState("");
    const [sending, setSending] = useState(false);
    const [tab, setTab] = useState("requests");
    const [typingUser, setTypingUser] = useState(null); // { name } of who is typing
    const messagesEndRef = useRef(null);
    const typingTimerRef = useRef(null);
    const socketRef = useRef(null);
    const activeChatRef = useRef(null); // keep ref in sync for socket callbacks

    // Keep ref in sync
    useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

    // ── Load requests ──────────────────────────────────────────────────────────
    const loadRequests = useCallback(() => {
        chatApi.getRequests()
            .then(setRequests)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { loadRequests(); }, []);

    // ── Auto-scroll ────────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUser]);

    // ── Socket.io setup ────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = connectSocket();
        socketRef.current = socket;

        // When a new message arrives from another user
        socket.on("new-message", (msg) => {
            // Only add if it's for the currently open chat AND not sent by me
            if (msg.chatRequestId === activeChatRef.current?.id && msg.senderId !== user?.id) {
                setMessages(prev => {
                    // Deduplicate
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                // Clear typing indicator when a message actually arrives
                setTypingUser(null);
            }
        });

        socket.on("user-typing", ({ userName }) => {
            setTypingUser(userName);
        });

        socket.on("user-stop-typing", () => {
            setTypingUser(null);
        });

        return () => {
            socket.off("new-message");
            socket.off("user-typing");
            socket.off("user-stop-typing");
            disconnectSocket();
        };
    }, [user?.id]);

    // ── Join/leave socket room when active chat changes ───────────────────────
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;
        // Leave previous room
        if (typeof window._prevChatRoom === "string") {
            socket.emit("leave-room", window._prevChatRoom);
        }
        if (activeChat) {
            socket.emit("join-room", activeChat.id);
            window._prevChatRoom = activeChat.id;
            // Fetch initial messages from DB
            chatApi.getMessages(activeChat.id).then(setMessages).catch(console.error);
        } else {
            window._prevChatRoom = null;
            setMessages([]);
        }
        setTypingUser(null);
    }, [activeChat?.id]);

    // ── Handle accept / reject ─────────────────────────────────────────────────
    const handleAccept = async (id) => {
        try {
            const updated = await chatApi.accept(id);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) { console.error(err); }
    };

    const handleReject = async (id) => {
        try {
            const updated = await chatApi.reject(id);
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) { console.error(err); }
    };

    // ── Send message ──────────────────────────────────────────────────────────
    const handleSend = async () => {
        if (!msgText.trim() || !activeChat) return;
        const text = msgText.trim();
        setMsgText("");

        // Stop typing signal
        socketRef.current?.emit("stop-typing", { roomId: activeChat.id });
        clearTimeout(typingTimerRef.current);

        setSending(true);
        try {
            const msg = await chatApi.sendMessage(activeChat.id, { content: text });
            // Add my own message optimistically
            setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
        } catch (err) { console.error(err); }
        finally { setSending(false); }
    };

    // ── Typing events ─────────────────────────────────────────────────────────
    const handleTyping = (e) => {
        setMsgText(e.target.value);
        if (!activeChat || !socketRef.current) return;

        socketRef.current.emit("typing", { roomId: activeChat.id, userName: user?.name?.split(" ")[0] });
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            socketRef.current?.emit("stop-typing", { roomId: activeChat.id });
        }, 2000);
    };

    const pendingReceived = requests.filter(r => r.receiverId === user?.id && r.status === "PENDING");
    const acceptedChats = requests.filter(r => r.status === "ACCEPTED");
    const allRequests = requests.filter(r => r.senderId === user?.id || r.receiverId === user?.id);
    const getOther = (req) => req.senderId === user?.id ? req.receiver : req.sender;

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {["requests", "chats"].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all relative ${tab === t ? "bg-indigo-500 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                        >
                            {t}
                            {t === "requests" && pendingReceived.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">{pendingReceived.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : tab === "requests" ? (
                    /* ── Requests Tab ── */
                    <div className="space-y-3">
                        {allRequests.length === 0 && (
                            <div className="text-center py-16 text-white/30">
                                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No chat requests yet</p>
                            </div>
                        )}
                        {allRequests.map(req => {
                            const other = getOther(req);
                            const isReceiver = req.receiverId === user?.id;
                            const { badge, icon: Icon } = statusStyles[req.status];
                            const grad = roleGradient[other?.role] || roleGradient.junior;
                            return (
                                <motion.div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl font-bold text-white flex-shrink-0`}>
                                        {other?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-white">{other?.name}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${badge} flex items-center gap-1`}>
                                                <Icon className="w-3 h-3" />{req.status.toLowerCase()}
                                            </span>
                                            <span className="text-xs text-white/30 capitalize">{isReceiver ? "incoming" : "outgoing"}</span>
                                        </div>
                                        {req.message && <p className="text-white/40 text-sm mt-1 truncate">"{req.message}"</p>}
                                        <p className="text-white/20 text-xs mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {isReceiver && req.status === "PENDING" && (
                                            <>
                                                <button onClick={() => handleAccept(req.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 border border-emerald-500/20">
                                                    <Check className="w-3.5 h-3.5" />Accept
                                                </button>
                                                <button onClick={() => handleReject(req.id)} className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg text-sm hover:bg-rose-500/20 border border-rose-500/20">
                                                    <X className="w-3.5 h-3.5" />Decline
                                                </button>
                                            </>
                                        )}
                                        {req.status === "ACCEPTED" && (
                                            <button onClick={() => { setActiveChat(req); setTab("chats"); }}
                                                className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/30 border border-indigo-500/20">
                                                Open Chat
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Chats Tab ── */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[65vh]">
                        {/* Chat List */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-y-auto">
                            {acceptedChats.length === 0 && (
                                <p className="text-white/30 text-sm text-center py-10">No active chats yet</p>
                            )}
                            {acceptedChats.map(req => {
                                const other = getOther(req);
                                const grad = roleGradient[other?.role] || roleGradient.junior;
                                const isActive = activeChat?.id === req.id;
                                return (
                                    <button key={req.id} onClick={() => setActiveChat(req)}
                                        className={`w-full flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-all text-left ${isActive ? "bg-white/8 border-l-2 border-l-indigo-500" : ""}`}
                                    >
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white flex-shrink-0`}>
                                                {other?.name?.[0]?.toUpperCase()}
                                            </div>
                                            {/* Typing dot on list item */}
                                            {isActive && typingUser && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030303] animate-pulse" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{other?.name}</p>
                                            <p className="text-white/30 text-xs capitalize">
                                                {isActive && typingUser ? (
                                                    <span className="text-emerald-400">typing…</span>
                                                ) : other?.role}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Chat Window */}
                        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl flex flex-col overflow-hidden">
                            {!activeChat ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center text-white/30">
                                        <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Select a conversation</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Header */}
                                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleGradient[getOther(activeChat)?.role] || roleGradient.junior} flex items-center justify-center font-bold text-white text-sm`}>
                                            {getOther(activeChat)?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-white text-sm">{getOther(activeChat)?.name}</p>
                                            <AnimatePresence mode="wait">
                                                {typingUser ? (
                                                    <motion.p key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="text-xs text-emerald-400">typing…</motion.p>
                                                ) : (
                                                    <motion.p key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="text-xs text-white/30 capitalize">{getOther(activeChat)?.role}</motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {/* Live indicator dot */}
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live" />
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {messages.length === 0 && (
                                            <p className="text-white/20 text-sm text-center mt-10">No messages yet — say hello! 👋</p>
                                        )}
                                        {messages.map((msg) => {
                                            const isMe = msg.senderId === user?.id;
                                            return (
                                                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                        ? "bg-indigo-500 text-white rounded-br-sm"
                                                        : "bg-white/10 text-white/90 rounded-bl-sm"
                                                        }`}>
                                                        <p>{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${isMe ? "text-indigo-200" : "text-white/30"}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        {/* Typing indicator bubble */}
                                        <AnimatePresence>
                                            {typingUser && (
                                                <TypingIndicator name={typingUser} />
                                            )}
                                        </AnimatePresence>

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 border-t border-white/10 flex gap-2">
                                        <input
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 text-sm"
                                            placeholder="Type a message…"
                                            value={msgText}
                                            onChange={handleTyping}
                                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                            onBlur={() => {
                                                socketRef.current?.emit("stop-typing", { roomId: activeChat?.id });
                                                clearTimeout(typingTimerRef.current);
                                            }}
                                        />
                                        <button onClick={handleSend} disabled={sending || !msgText.trim()}
                                            className="p-2.5 bg-indigo-500 rounded-xl text-white hover:bg-indigo-600 disabled:opacity-50 transition-all"
                                        >
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
