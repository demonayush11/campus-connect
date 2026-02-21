import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X, Book, Search, Loader2, LogIn, LogOut, Trash2 } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { groupsApi } from "@/lib/api";

const Groups = () => {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState("");
    const [actionId, setActionId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", subject: "" });
    const [error, setError] = useState("");

    const fetchGroups = () =>
        groupsApi.getAll().then(setGroups).catch(console.error).finally(() => setLoading(false));

    useEffect(() => { fetchGroups(); }, []);

    const filtered = groups.filter(
        (g) =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            (g.subject || "").toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true); setError("");
        try {
            await groupsApi.create(form);
            setShowModal(false);
            setForm({ name: "", description: "", subject: "" });
            fetchGroups();
        } catch (err) { setError(err.message); }
        finally { setCreating(false); }
    };

    const handleJoin = async (id) => {
        setActionId(id);
        try { await groupsApi.join(id); fetchGroups(); }
        catch (err) { alert(err.message); }
        finally { setActionId(null); }
    };

    const handleLeave = async (id) => {
        setActionId(id);
        try { await groupsApi.leave(id); fetchGroups(); }
        catch (err) { alert(err.message); }
        finally { setActionId(null); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this group?")) return;
        try { await groupsApi.delete(id); fetchGroups(); }
        catch (err) { alert(err.message); }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all";

    const subjectColors = {
        Math: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20",
        CSE: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
        Physics: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Study Groups</h1>
                        <p className="text-white/50 mt-1">Find your people. Learn together.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-700 transition-all w-fit"
                    >
                        <Plus className="w-4 h-4" /> Create Group
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-white/30" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                        placeholder="Search groups by name or subject..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No groups found. Create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((g) => {
                            const isMember = g.members?.some((m) => m.id === user?.id);
                            const isCreator = g.creatorId === user?.id;
                            const colorClass = subjectColors[g.subject] || "from-white/5 to-white/5 border-white/10";
                            return (
                                <motion.div
                                    key={g.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-gradient-to-br ${colorClass} border rounded-xl p-5 flex flex-col gap-3 hover:scale-[1.01] transition-all duration-200`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <Book className="w-5 h-5 text-blue-400" />
                                        </div>
                                        {g.subject && (
                                            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{g.subject}</span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-white">{g.name}</h3>
                                        <p className="text-white/50 text-sm mt-1 line-clamp-2">{g.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                        <Users className="w-3.5 h-3.5" />
                                        {g.members?.length ?? 0} members · by {g.creator?.name}
                                    </div>

                                    {/* Member avatars */}
                                    <div className="flex -space-x-2">
                                        {(g.members || []).slice(0, 5).map((m) => (
                                            <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs border border-black/40 font-medium">
                                                {m.name?.[0]?.toUpperCase()}
                                            </div>
                                        ))}
                                        {(g.members?.length ?? 0) > 5 && (
                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs border border-black/40">
                                                +{g.members.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                                        {!isCreator && (
                                            isMember ? (
                                                <button
                                                    onClick={() => handleLeave(g.id)}
                                                    disabled={actionId === g.id}
                                                    className="flex-1 py-1.5 rounded-lg text-sm border border-white/10 text-white/50 hover:border-rose-500/40 hover:text-rose-400 transition-all flex items-center justify-center gap-1"
                                                >
                                                    <LogOut className="w-3.5 h-3.5" />
                                                    {actionId === g.id ? "..." : "Leave"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleJoin(g.id)}
                                                    disabled={actionId === g.id}
                                                    className="flex-1 py-1.5 rounded-lg text-sm bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1"
                                                >
                                                    <LogIn className="w-3.5 h-3.5" />
                                                    {actionId === g.id ? "..." : "Join"}
                                                </button>
                                            )
                                        )}
                                        {isCreator && (
                                            <>
                                                <span className="text-xs text-emerald-400 flex items-center">✓ Your Group</span>
                                                <button
                                                    onClick={() => handleDelete(g.id)}
                                                    className="ml-auto p-1.5 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
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
                                <h2 className="text-lg font-semibold text-white">Create Study Group</h2>
                                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            {error && <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}
                            <form onSubmit={handleCreate} className="space-y-3">
                                <input className={inputClass} placeholder="Group Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                <textarea className={inputClass + " h-24 resize-none"} placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                                <input className={inputClass} placeholder="Subject (e.g. Algorithms, Physics)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-cyan-600 text-white flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {creating ? "Creating..." : "Create Group"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Groups;
