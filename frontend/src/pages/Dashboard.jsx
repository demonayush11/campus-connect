import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users, MessageSquare, User, ArrowRight, Flame, UsersRound } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi, groupsApi, postsApi, usersApi } from "@/lib/api";
import SeniorProfileModal from "@/components/SeniorProfileModal";
import { yearLabel } from "@/lib/yearHelper";

const roleGradient = {
    junior: "from-blue-400 to-cyan-500",
    senior: "from-indigo-400 to-purple-500",
    alumni: "from-rose-400 to-orange-500",
    admin: "from-yellow-400 to-red-500",
};

const roleColors = {
    junior: "bg-blue-500/20 text-blue-300",
    senior: "bg-indigo-500/20 text-indigo-300",
    alumni: "bg-rose-500/20 text-rose-300",
    admin: "bg-yellow-500/20 text-yellow-300",
};

const StatCard = ({ icon: Icon, label, value, color, link }) => (
    <Link to={link}>
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/8 transition-all cursor-pointer"
        >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/50">{label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 ml-auto" />
        </motion.div>
    </Link>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMemberId, setSelectedMemberId] = useState(null);


    useEffect(() => {
        Promise.all([
            sessionsApi.getAll(),
            groupsApi.getAll(),
            postsApi.getAll(),
            usersApi.getAll(),
        ]).then(([s, g, p, u]) => {
            setSessions(Array.isArray(s) ? s : []);
            setGroups(Array.isArray(g) ? g : []);
            setPosts(Array.isArray(p) ? p : []);
            setMembers(Array.isArray(u) ? u : []);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const upcoming = sessions
        .filter((s) => new Date(s.date) > new Date())
        .slice(0, 3);

    const recentPosts = posts.slice(0, 3);
    const recentMembers = members.slice(0, 6);

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">

                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative bg-gradient-to-r ${roleGradient[user?.role] || roleGradient.junior} rounded-2xl p-6 mb-8 overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-black/20 rounded-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Welcome back,</p>
                                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                            </div>
                        </div>
                        <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-1">
                            {user?.academicYear ? yearLabel(user.academicYear) : (user?.role ?? "Student")}
                            {user?.department ? ` · ${user.department}` : ""}
                        </span>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={GraduationCap} label="Sessions" value={sessions.length} color="from-indigo-500 to-purple-600" link="/mentorship" />
                    <StatCard icon={Users} label="Study Groups" value={groups.length} color="from-blue-500 to-cyan-600" link="/groups" />
                    <StatCard icon={MessageSquare} label="Q&A Posts" value={posts.length} color="from-rose-500 to-orange-600" link="/forum" />
                    <StatCard icon={UsersRound} label="Members" value={members.length} color="from-emerald-500 to-teal-600" link="/dashboard" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Upcoming Sessions */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <h2 className="font-semibold text-white">Upcoming Sessions</h2>
                            </div>
                            <Link to="/mentorship" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
                        </div>
                        {upcoming.length === 0 ? (
                            <p className="text-white/30 text-sm py-6 text-center">No upcoming sessions</p>
                        ) : (
                            <div className="space-y-3">
                                {upcoming.map((s) => (
                                    <div key={s.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GraduationCap className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-white text-sm truncate">{s.title}</p>
                                            <p className="text-white/40 text-xs mt-0.5">
                                                by {s.mentor?.name} · {new Date(s.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Forum Posts */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-rose-400" />
                                <h2 className="font-semibold text-white">Recent Q&A Posts</h2>
                            </div>
                            <Link to="/forum" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
                        </div>
                        {recentPosts.length === 0 ? (
                            <p className="text-white/30 text-sm py-6 text-center">No posts yet</p>
                        ) : (
                            <div className="space-y-3">
                                {recentPosts.map((p) => (
                                    <div key={p.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                        <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-5 h-5 text-rose-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-white text-sm truncate">{p.title}</p>
                                            <p className="text-white/40 text-xs mt-0.5">
                                                by {p.author?.name} · {p.comments?.length ?? 0} comments
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Community Members */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <UsersRound className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-semibold text-white">Community Members</h2>
                            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{members.length} total</span>
                        </div>
                        <Link to="/seniors" className="text-xs text-indigo-400 hover:text-indigo-300">Browse seniors →</Link>
                    </div>
                    {members.length === 0 ? (
                        <p className="text-white/30 text-sm py-4 text-center">No members yet</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {recentMembers.map((m) => (
                                <motion.div
                                    key={m.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedMemberId(m.id)}
                                    className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/8 transition-all text-center cursor-pointer hover:border-indigo-500/30 border border-transparent"
                                >
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roleGradient[m.role] || roleGradient.junior} flex items-center justify-center text-white font-bold text-lg`}>
                                            {m.name?.[0]?.toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-medium truncate w-full max-w-[80px]">{m.name}</p>
                                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                            {m.academicYear ? yearLabel(m.academicYear) : (m.role ?? "Student")}
                                        </span>
                                        {m.department && <p className="text-white/30 text-xs mt-0.5">{m.department}</p>}
                                        <p className="text-indigo-400/60 text-xs mt-0.5">View profile</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Senior profile popup */}
                <SeniorProfileModal userId={selectedMemberId} onClose={() => setSelectedMemberId(null)} />

            </div>
        </div>
    );
};

export default Dashboard;
