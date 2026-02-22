import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Menu, X, Bell, LogOut, User, GraduationCap, MessageSquare, Home, MessageCircle, UsersRound, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { notificationsApi, chatApi, usersApi } from "@/lib/api";
import { yearLabel } from "@/lib/yearHelper";

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [pendingChats, setPendingChats] = useState(0);

    // ── Global user search ──────────────────────────────────────────────
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchInputRef = useRef(null);
    const searchTimer = useRef(null);

    const unread = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        if (!user) return;
        notificationsApi.getAll().then(setNotifications).catch(() => { });
        chatApi.getRequests()
            .then(reqs => setPendingChats(reqs.filter(r => r.receiverId === user.id && r.status === "PENDING").length))
            .catch(() => { });
    }, [user, location.pathname]);

    // Focus input when search overlay opens + Esc to close
    useEffect(() => {
        if (showSearch) {
            setTimeout(() => searchInputRef.current?.focus(), 80);
            const onKey = (e) => { if (e.key === "Escape") setShowSearch(false); };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
        } else {
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [showSearch]);

    // Debounced search
    useEffect(() => {
        clearTimeout(searchTimer.current);
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        setSearchLoading(true);
        searchTimer.current = setTimeout(async () => {
            try {
                const data = await usersApi.getAll({ search: searchQuery.trim() });
                setSearchResults(Array.isArray(data) ? data.slice(0, 8) : []);
            } catch { setSearchResults([]); }
            finally { setSearchLoading(false); }
        }, 300);
        return () => clearTimeout(searchTimer.current);
    }, [searchQuery]);

    const handleLogout = () => { logout(); navigate("/"); };

    const markAll = async () => {
        await notificationsApi.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const navLinks = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Community", href: "/seniors", icon: UsersRound },
        { label: "Mentorship", href: "/mentorship", icon: GraduationCap },
        { label: "Study Groups", href: "/groups", icon: Users },
        { label: "Q&A Forum", href: "/forum", icon: MessageSquare },
        { label: "Chat", href: "/chat", icon: MessageCircle, badge: pendingChats },
    ];

    const roleColor = {
        junior: "from-blue-400 to-cyan-400",
        senior: "from-indigo-400 to-purple-400",
        alumni: "from-rose-400 to-orange-400",
        admin: "from-yellow-400 to-red-400",
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-[#030303]/95 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
                                campusConnect
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((item) => {
                                const active = location.pathname.startsWith(item.href) && (item.href !== "/dashboard" || location.pathname === "/dashboard");
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                                            ? "bg-white/10 text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                        {item.badge > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{item.badge}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center space-x-2">

                            {/* 🔍 Global User Search Icon */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                title="Search users"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotif(!showNotif)}
                                    className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unread > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotif && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-80 bg-[#0f0f1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                                <span className="text-sm font-semibold text-white">Notifications</span>
                                                {unread > 0 && (
                                                    <button onClick={markAll} className="text-xs text-indigo-400 hover:text-indigo-300">
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-72 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <p className="text-center text-white/40 text-sm py-8">No notifications</p>
                                                ) : (
                                                    notifications.slice(0, 10).map((n) => (
                                                        <div
                                                            key={n.id}
                                                            className={`px-4 py-3 border-b border-white/5 text-sm ${n.isRead ? "text-white/40" : "text-white/80"
                                                                }`}
                                                        >
                                                            <p>{n.message}</p>
                                                            <p className="text-xs text-white/30 mt-1">
                                                                {new Date(n.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile */}
                            <Link to="/profile">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer">
                                    <div className={`w-7 h-7 rounded-full bg-gradient-to-r ${roleColor[user?.role] || "from-gray-400 to-gray-600"} flex items-center justify-center`}>
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium text-white leading-none">{user?.name?.split(" ")[0]}</p>
                                        <p className="text-xs text-white/40">
                                            {user?.academicYear ? yearLabel(user.academicYear) : "Student"}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Logout */}
                            <button onClick={handleLogout} className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile: search + menu */}
                        <div className="md:hidden flex items-center gap-1">
                            <button onClick={() => setShowSearch(true)} className="p-2 text-white/70">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-white/70" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden pb-4 border-t border-white/10 mt-2"
                            >
                                {navLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-2 py-3 text-white/70 hover:text-white transition-colors"
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                                <div className="border-t border-white/10 pt-3 mt-2 flex justify-between items-center">
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white flex items-center gap-2">
                                        <User className="w-4 h-4" /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="text-rose-400 flex items-center gap-2 text-sm">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* ── Global User Search Overlay ─────────────────────────────────────── */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
                        onClick={(e) => e.target === e.currentTarget && setShowSearch(false)}
                    >
                        <motion.div
                            initial={{ y: -20, scale: 0.97, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -20, scale: 0.97, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-xl bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                                <Search className="w-5 h-5 text-white/30 flex-shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search students by name, roll number, or department…"
                                    className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-sm"
                                />
                                {searchLoading
                                    ? <Loader2 className="w-4 h-4 text-white/30 animate-spin flex-shrink-0" />
                                    : searchQuery
                                        ? <button onClick={() => setSearchQuery("")} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                                        : <kbd className="text-xs text-white/20 border border-white/10 px-1.5 py-0.5 rounded">esc</kbd>
                                }
                            </div>

                            {/* Results */}
                            <div className="max-h-96 overflow-y-auto">
                                {searchQuery && !searchLoading && searchResults.length === 0 && (
                                    <p className="text-center text-white/30 text-sm py-10">No users found for "{searchQuery}"</p>
                                )}
                                {!searchQuery && (
                                    <p className="text-center text-white/20 text-sm py-10">Start typing to search all campus members…</p>
                                )}
                                {searchResults.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => { navigate(`/seniors`); setShowSearch(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-0"
                                    >
                                        {/* Avatar */}
                                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColor[u.role] || "from-indigo-400 to-purple-400"} flex items-center justify-center flex-shrink-0`}>
                                            {u.profilePic
                                                ? <img src={u.profilePic} className="w-9 h-9 rounded-full object-cover" alt={u.name} />
                                                : <span className="text-white text-sm font-semibold">{u.name?.[0]?.toUpperCase()}</span>
                                            }
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{u.name}</p>
                                            <p className="text-xs text-white/40 truncate">
                                                {u.rollNumber && <span className="mr-2">{u.rollNumber}</span>}
                                                {u.department && <span>{u.department}</span>}
                                            </p>
                                        </div>
                                        {/* Year badge */}
                                        {u.academicYear && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex-shrink-0">
                                                {yearLabel(u.academicYear)}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppNavbar;
