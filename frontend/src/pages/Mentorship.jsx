import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Plus, X, Calendar, Clock, Link2, Users, Loader2, LogIn } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { sessionsApi } from "@/lib/api";

const Mentorship = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", date: "", duration: "60", link: "" });
    const [error, setError] = useState("");

    const canCreate = user?.role === "senior" || user?.role === "alumni";

    const fetchSessions = () =>
        sessionsApi.getAll().then(setSessions).catch(console.error).finally(() => setLoading(false));

    useEffect(() => { fetchSessions(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true); setError("");
        try {
            await sessionsApi.create(form);
            setShowModal(false);
            setForm({ title: "", description: "", date: "", duration: "60", link: "" });
            fetchSessions();
        } catch (err) { setError(err.message); }
        finally { setCreating(false); }
    };

    const handleJoin = async (id) => {
        setActionId(id);
        try { await sessionsApi.join(id); fetchSessions(); }
        catch (err) { alert(err.message); }
        finally { setActionId(null); }
    };

    const handleLeave = async (id) => {
        setActionId(id);
        try { await sessionsApi.leave(id); fetchSessions(); }
        catch (err) { alert(err.message); }
        finally { setActionId(null); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this session?")) return;
        try { await sessionsApi.delete(id); fetchSessions(); }
        catch (err) { alert(err.message); }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all";

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mentorship Hub</h1>
                        <p className="text-white/50 mt-1">Live sessions by seniors & alumni</p>
                    </div>
                    {canCreate && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Create Session
                        </button>
                    )}
                </div>

                {/* Sessions Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No sessions yet. {canCreate && "Create the first one!"}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sessions.map((s) => {
                            const amAttending = s.attendees?.some((a) => a.id === user?.id);
                            const isMine = s.mentorId === user?.id;
                            const isPast = new Date(s.date) < new Date();
                            return (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-white leading-tight">{s.title}</h3>
                                        {isPast && <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0">Past</span>}
                                    </div>
                                    <p className="text-white/50 text-sm line-clamp-2">{s.description}</p>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(s.date).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Clock className="w-3.5 h-3.5" />
                                            {s.duration} minutes
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Users className="w-3.5 h-3.5" />
                                            {s.attendees?.length ?? 0} attendees · by {s.mentor?.name}
                                        </div>
                                        {s.link && (
                                            <a href={s.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300">
                                                <Link2 className="w-3.5 h-3.5" /> Join Link
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                                        {!isMine && !isPast && (
                                            amAttending ? (
                                                <button
                                                    onClick={() => handleLeave(s.id)}
                                                    disabled={actionId === s.id}
                                                    className="flex-1 py-1.5 rounded-lg text-sm border border-white/10 text-white/50 hover:border-rose-500/40 hover:text-rose-400 transition-all"
                                                >
                                                    {actionId === s.id ? "..." : "Leave"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleJoin(s.id)}
                                                    disabled={actionId === s.id}
                                                    className="flex-1 py-1.5 rounded-lg text-sm bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all flex items-center justify-center gap-1"
                                                >
                                                    <LogIn className="w-3.5 h-3.5" />
                                                    {actionId === s.id ? "..." : "Join"}
                                                </button>
                                            )
                                        )}
                                        {isMine && (
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="py-1.5 px-3 rounded-lg text-sm border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all"
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {amAttending && (
                                            <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">✓ Enrolled</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Session Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-white">Create Session</h2>
                                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            {error && <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}
                            <form onSubmit={handleCreate} className="space-y-3">
                                <input className={inputClass} placeholder="Session Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                <textarea className={inputClass + " h-20 resize-none"} placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                                <input type="datetime-local" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" className={inputClass} placeholder="Duration (min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                                    <input className={inputClass} placeholder="Meet Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {creating ? "Creating..." : "Create Session"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mentorship;
