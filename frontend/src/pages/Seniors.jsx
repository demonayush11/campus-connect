import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, MapPin, Code } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { usersApi } from "@/lib/api";
import SeniorProfileModal from "@/components/SeniorProfileModal";
import { yearLabel } from "@/lib/yearHelper";

const roleColors = {
    senior: { badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/20", gradient: "from-indigo-400 to-purple-500" },
    alumni: { badge: "bg-rose-500/20 text-rose-300 border-rose-500/20", gradient: "from-rose-400 to-orange-500" },
};

const Seniors = () => {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const fetchSeniors = (q = "") => {
        setLoading(true);
        setError("");
        usersApi.getAll(q ? { search: q } : {})
            .then(data => {
                let users = Array.isArray(data) ? data : [];
                if (q) {
                    users = users.filter(u =>
                        u.name?.toLowerCase().includes(q.toLowerCase()) ||
                        u.department?.toLowerCase().includes(q.toLowerCase()) ||
                        u.bio?.toLowerCase().includes(q.toLowerCase())
                    );
                }
                setSeniors(users);
            })
            .catch(err => {
                setError(err.message || "Failed to load members");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSeniors();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchSeniors(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-1">Community Directory</h1>
                    <p className="text-white/40 text-sm">Browse all members — click any card to view their profile and achievements</p>
                </div>

                {/* Search */}
                <div className="relative mb-8 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="Search by name, department, or bio..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : seniors.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="mb-2">No members found</p>
                        <p className="text-xs text-white/20">Try a different search</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {seniors.map(s => {
                            const colors = roleColors[s.role] || roleColors.senior;
                            return (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedId(s.id)}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all cursor-pointer group"
                                >
                                    {/* Top gradient banner */}
                                    <div className={`h-16 bg-gradient-to-r ${colors.gradient} opacity-40`} />

                                    <div className="px-5 pb-5 -mt-8">
                                        {/* Avatar */}
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-2xl font-bold text-white border-4 border-[#030303] mb-3 group-hover:scale-105 transition-transform`}>
                                            {s.name?.[0]?.toUpperCase()}
                                        </div>

                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="font-semibold text-white leading-tight">{s.name}</h3>
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    {/* Academic year badge */}
                                                    {s.academicYear ? (
                                                        <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-500/20 text-indigo-300 border-indigo-500/20">
                                                            {yearLabel(s.academicYear)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-0.5 rounded-full capitalize border bg-white/10 text-white/50 border-white/10">
                                                            {s.role}
                                                        </span>
                                                    )}
                                                    {s.department && (
                                                        <span className="flex items-center gap-0.5 text-xs text-white/40">
                                                            <MapPin className="w-3 h-3" />{s.department}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {(s.achievements?.length > 0) && (
                                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/20 flex-shrink-0">
                                                    <Trophy className="w-3 h-3" />
                                                    {s.achievements.length}
                                                </div>
                                            )}
                                        </div>

                                        {s.bio && <p className="text-white/40 text-xs line-clamp-2 mb-3">{s.bio}</p>}

                                        {s.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {s.skills.slice(0, 3).map(sk => (
                                                    <span key={sk} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                                                        <Code className="w-2.5 h-2.5" />{sk}
                                                    </span>
                                                ))}
                                                {s.skills.length > 3 && <span className="text-xs text-white/30">+{s.skills.length - 3}</span>}
                                            </div>
                                        )}

                                        <div className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs text-center group-hover:bg-indigo-500/30 transition-all border border-indigo-500/20">
                                            Click to view profile & achievements
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            <SeniorProfileModal userId={selectedId} onClose={() => setSelectedId(null)} />
        </div>
    );
};

export default Seniors;
