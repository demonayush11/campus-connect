import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Github, Linkedin, Code, Send, MessageCircle, Loader2, X, Check } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { usersApi, chatApi } from "@/lib/api";

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
};

const SeniorProfile = () => {
    const { id } = useParams();
    const { user: me } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [requestError, setRequestError] = useState("");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [introMsg, setIntroMsg] = useState("");

    useEffect(() => {
        usersApi.getById(id)
            .then(setProfile)
            .catch(() => navigate("/seniors"))
            .finally(() => setLoading(false));

        // Check if already sent a request
        chatApi.getRequests()
            .then((reqs) => {
                const existing = reqs.find(r => r.receiverId === id && r.senderId === me.id && r.status === "PENDING");
                if (existing) setRequestSent(true);
            })
            .catch(() => { });
    }, [id]);

    const handleSendRequest = async () => {
        setRequesting(true); setRequestError("");
        try {
            await chatApi.sendRequest({ receiverId: id, message: introMsg.trim() || undefined });
            setRequestSent(true);
            setShowRequestModal(false);
        } catch (err) {
            setRequestError(err.message);
        } finally {
            setRequesting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!profile) return null;

    const grad = roleGradient[profile.role] || roleGradient.senior;
    const isSelf = me?.id === id;
    const canRequest = !isSelf && (me?.role === "junior");

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-3xl">
                <button onClick={() => navigate("/seniors")} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Directory
                </button>

                {/* Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
                    <div className={`h-28 bg-gradient-to-r ${grad} opacity-50`} />
                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-10 mb-4">
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-3xl font-bold text-white border-4 border-[#030303]`}>
                                {profile.name?.[0]?.toUpperCase()}
                            </div>
                            {canRequest && (
                                <button
                                    onClick={() => requestSent ? null : setShowRequestModal(true)}
                                    disabled={requestSent}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${requestSent
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-default"
                                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                                        }`}
                                >
                                    {requestSent ? <><Check className="w-4 h-4" />Request Sent</> : <><MessageCircle className="w-4 h-4" />Request Chat</>}
                                </button>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`text-xs capitalize px-2.5 py-1 rounded-full bg-gradient-to-r ${grad} text-white font-medium`}>{profile.role}</span>
                            {profile.department && <span className="text-sm text-white/40">{profile.department}</span>}
                            {profile.batch && <span className="text-sm text-white/40">· Batch {profile.batch}</span>}
                        </div>

                        {profile.bio && <p className="text-white/60 text-sm mb-4">{profile.bio}</p>}

                        {profile.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {profile.skills.map(sk => (
                                    <span key={sk} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                        <Code className="w-3 h-3" />{sk}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"><Github className="w-4 h-4" />GitHub</a>}
                            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"><Linkedin className="w-4 h-4" />LinkedIn</a>}
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h2 className="font-semibold text-white">Achievements</h2>
                        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{profile.achievements?.length ?? 0}</span>
                    </div>

                    {!profile.achievements?.length ? (
                        <p className="text-white/30 text-sm text-center py-6">No achievements added yet</p>
                    ) : (
                        <div className="space-y-3">
                            {profile.achievements.map(a => (
                                <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-medium text-white text-sm">{a.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${categoryColors[a.category] || categoryColors.Other}`}>{a.category}</span>
                                            {a.year && <span className="text-xs text-white/30">{a.year}</span>}
                                        </div>
                                        {a.description && <p className="text-white/40 text-xs mt-1">{a.description}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Request Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRequestModal(false)}
                    >
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-white">Request 1-on-1 Chat</h3>
                                    <p className="text-white/40 text-sm mt-0.5">Sending to {profile.name}</p>
                                </div>
                                <button onClick={() => setShowRequestModal(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>

                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 resize-none h-28 text-sm"
                                placeholder="Introduce yourself... (optional)"
                                value={introMsg}
                                onChange={e => setIntroMsg(e.target.value)}
                            />

                            {requestError && <p className="text-rose-400 text-xs mt-2 bg-rose-500/10 px-3 py-2 rounded-lg">{requestError}</p>}

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setShowRequestModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 text-sm">Cancel</button>
                                <button onClick={handleSendRequest} disabled={requesting}
                                    className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm hover:bg-indigo-600 flex items-center justify-center gap-2 transition-all"
                                >
                                    {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {requesting ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SeniorProfile;
