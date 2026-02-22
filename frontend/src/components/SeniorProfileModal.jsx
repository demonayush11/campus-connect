import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Trophy, Code, Github, Linkedin, MapPin, Send, Loader2, Check,
    MessageCircle, GraduationCap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usersApi, achievementsApi, chatApi } from "@/lib/api";
import { yearLabel } from "@/lib/yearHelper";

const categoryColors = {
    Academic: "bg-blue-500/20 text-blue-300 border-blue-500/20",
    Technical: "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
    Leadership: "bg-purple-500/20 text-purple-300 border-purple-500/20",
    Sports: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
    Other: "bg-white/10 text-white/50 border-white/10",
};

const roleGradient = {
    senior: "from-indigo-400 to-purple-500",
    alumni: "from-rose-400 to-orange-500",
    junior: "from-blue-400 to-cyan-500",
    admin: "from-yellow-400 to-red-500",
};

const SeniorProfileModal = ({ userId, onClose }) => {
    const { user: me } = useAuth();
    const [profile, setProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [showIntro, setShowIntro] = useState(false);
    const [introMsg, setIntroMsg] = useState("");

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        Promise.all([
            usersApi.getById(userId),
            achievementsApi.getByUser(userId),
            chatApi.getRequests(),
        ]).then(([p, a, reqs]) => {
            setProfile(p);
            setAchievements(a);
            const existing = reqs.find(
                r => r.receiverId === userId && r.senderId === me?.id && r.status === "PENDING"
            );
            if (existing) setRequestSent(true);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    const handleSendRequest = async () => {
        setRequesting(true); setRequestError("");
        try {
            await chatApi.sendRequest({ receiverId: userId, message: introMsg.trim() || undefined });
            setRequestSent(true);
            setShowIntro(false);
        } catch (err) {
            setRequestError(err.message);
        } finally {
            setRequesting(false);
        }
    };

    const isSelf = me?.id === userId;
    const grad = profile ? (roleGradient[profile.role] || roleGradient.junior) : "from-indigo-400 to-purple-500";

    return (
        <AnimatePresence>
            {userId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="bg-[#0d0d1a] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : !profile ? null : (
                            <>
                                {/* Gradient Banner */}
                                <div className={`h-24 bg-gradient-to-r ${grad} opacity-50 rounded-t-3xl sm:rounded-t-2xl relative`}>
                                    <button onClick={onClose}
                                        className="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                    {/* drag handle for mobile */}
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full sm:hidden" />
                                </div>

                                <div className="px-6 pb-6 -mt-10">
                                    {/* Avatar + name row */}
                                    <div className="flex items-end justify-between mb-4">
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-3xl font-bold text-white border-4 border-[#0d0d1a]`}>
                                            {profile.name?.[0]?.toUpperCase()}
                                        </div>
                                        {!isSelf && (
                                            <div className="flex flex-col items-end gap-1">
                                                {!showIntro && !requestSent && (
                                                    <button onClick={() => setShowIntro(true)}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm hover:bg-indigo-600 transition-all font-medium">
                                                        <MessageCircle className="w-4 h-4" /> Request Chat
                                                    </button>
                                                )}
                                                {requestSent && (
                                                    <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm border border-emerald-500/20">
                                                        <Check className="w-4 h-4" /> Sent!
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Intro msg input */}
                                    <AnimatePresence>
                                        {showIntro && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4"
                                            >
                                                <div className="bg-white/5 rounded-xl p-3 space-y-2">
                                                    <p className="text-xs text-white/40">Add a short intro (optional)</p>
                                                    <textarea
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-indigo-500/50 resize-none h-20"
                                                        placeholder="Introduce yourself..."
                                                        value={introMsg}
                                                        onChange={e => setIntroMsg(e.target.value)}
                                                    />
                                                    {requestError && <p className="text-rose-400 text-xs bg-rose-500/10 px-2 py-1 rounded">{requestError}</p>}
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setShowIntro(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 text-sm">Cancel</button>
                                                        <button onClick={handleSendRequest} disabled={requesting}
                                                            className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm flex items-center justify-center gap-1.5 hover:bg-indigo-600 transition-all disabled:opacity-50"
                                                        >
                                                            {requesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                            {requesting ? "Sending..." : "Send"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 mb-3">
                                        {/* Show academic year — never the raw role string */}
                                        {profile.academicYear ? (
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                                                {yearLabel(profile.academicYear)}
                                            </span>
                                        ) : null}
                                        {profile.department && (
                                            <span className="flex items-center gap-1 text-xs text-white/40">
                                                <MapPin className="w-3 h-3" />{profile.department}
                                            </span>
                                        )}
                                        {profile.rollNumber && <span className="text-xs text-white/30">{profile.rollNumber}</span>}
                                    </div>

                                    {profile.bio && <p className="text-white/50 text-sm mb-4 leading-relaxed">{profile.bio}</p>}

                                    {profile.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {profile.skills.map(sk => (
                                                <span key={sk} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                                    <Code className="w-2.5 h-2.5" />{sk}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {(profile.github || profile.linkedin) && (
                                        <div className="flex gap-4 mb-5">
                                            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"><Github className="w-3.5 h-3.5" />GitHub</a>}
                                            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" />LinkedIn</a>}
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    <div className="border-t border-white/8 pt-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Trophy className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm font-semibold text-white">Achievements</span>
                                            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{achievements.length}</span>
                                        </div>

                                        {achievements.length === 0 ? (
                                            <p className="text-white/20 text-sm text-center py-4">No achievements yet</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {achievements.map(a => (
                                                    <div key={a.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                                                        <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Trophy className="w-4 h-4 text-yellow-400" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-medium text-white">{a.title}</p>
                                                                <span className={`text-xs px-1.5 py-0.5 rounded border capitalize ${categoryColors[a.category] || categoryColors.Other}`}>{a.category}</span>
                                                                {a.year && <span className="text-xs text-white/30">{a.year}</span>}
                                                            </div>
                                                            {a.description && <p className="text-xs text-white/40 mt-0.5">{a.description}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SeniorProfileModal;
