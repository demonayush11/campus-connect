import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Edit2, Save, X, Github, Linkedin, Lock, Loader2, GraduationCap, Users as UsersIcon, Tag, Trophy, Plus, Trash2 } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { usersApi, achievementsApi } from "@/lib/api";
import { yearLabel } from "@/lib/yearHelper";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [pwMode, setPwMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const [error, setError] = useState("");
    const [pwError, setPwError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        department: user?.department || "",
        github: user?.github || "",
        linkedin: user?.linkedin || "",
        skills: (user?.skills || []).join(", "),
    });

    // Fetch fresh profile data on mount so bio/skills always show current DB values
    useEffect(() => {
        usersApi.me().then((fresh) => {
            updateUser(fresh);
            setForm({
                name: fresh.name || "",
                bio: fresh.bio || "",
                department: fresh.department || "",
                github: fresh.github || "",
                linkedin: fresh.linkedin || "",
                skills: (fresh.skills || []).join(", "),
            });
        }).catch(console.error);
    }, []);

    const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });

    // ── Achievements state (seniors / alumni only) ────────────────────────────
    const [achievements, setAchievements] = useState([]);
    const [achieveLoading, setAchieveLoading] = useState(false);
    const [newAchieve, setNewAchieve] = useState({ title: "", description: "", year: "", category: "Technical" });
    const [addingAchieve, setAddingAchieve] = useState(false);
    const [showAddAchieve, setShowAddAchieve] = useState(false);
    const [achieveError, setAchieveError] = useState("");

    const categories = ["Academic", "Technical", "Leadership", "Sports", "Other"];

    // Allow all students to manage achievements
    const canAddAchievements = !!user?.id;

    useEffect(() => {
        if (!user?.id) return;
        setAchieveLoading(true);
        achievementsApi.getByUser(user.id)
            .then(setAchievements)
            .catch(console.error)
            .finally(() => setAchieveLoading(false));
    }, [user?.id]);

    const handleAddAchievement = async () => {
        if (!newAchieve.title.trim()) return;
        setAddingAchieve(true);
        setAchieveError("");
        try {
            const created = await achievementsApi.add({
                ...newAchieve,
                year: newAchieve.year ? parseInt(newAchieve.year) : undefined,
            });
            setAchievements(prev => [created, ...prev]);
            setNewAchieve({ title: "", description: "", year: "", category: "Technical" });
            setShowAddAchieve(false);
        } catch (err) {
            console.error(err);
            setAchieveError(err.message || "Failed to save achievement. Make sure the backend is running.");
        }
        finally { setAddingAchieve(false); }
    };

    const handleDeleteAchievement = async (id) => {
        try {
            await achievementsApi.delete(id);
            setAchievements(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error(err); }
    };

    const handleSave = async () => {
        setSaving(true); setError(""); setSuccess("");
        try {
            await usersApi.updateProfile({
                ...form,
                skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            });
            // Fetch fresh data so profile card reflects changes immediately
            const fresh = await usersApi.me();
            updateUser(fresh);
            setForm({
                name: fresh.name || "",
                bio: fresh.bio || "",
                department: fresh.department || "",
                github: fresh.github || "",
                linkedin: fresh.linkedin || "",
                skills: (fresh.skills || []).join(", "),
            });
            setEditMode(false);
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    const handlePwSave = async () => {
        setSavingPw(true); setPwError("");
        try {
            await usersApi.changePassword(pwForm);
            setPwMode(false);
            setPwForm({ oldPassword: "", newPassword: "" });
            setSuccess("Password changed!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) { setPwError(err.message); }
        finally { setSavingPw(false); }
    };

    const roleGradient = {
        junior: "from-blue-400 to-cyan-500",
        senior: "from-indigo-400 to-purple-500",
        alumni: "from-rose-400 to-orange-500",
        admin: "from-yellow-400 to-red-500",
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all";

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm"
                    >
                        ✓ {success}
                    </motion.div>
                )}

                {/* Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-5">
                    {/* Banner */}
                    <div className={`h-24 bg-gradient-to-r ${roleGradient[user?.role]} opacity-60`} />

                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex items-end justify-between -mt-10 mb-4">
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleGradient[user?.role]} flex items-center justify-center text-3xl font-bold text-white border-4 border-[#030303]`}>
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex gap-2">
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => setEditMode(false)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-all"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}

                        {/* Fields */}
                        <div className="space-y-4">
                            {editMode ? (
                                <>
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Full Name</label>
                                        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Department</label>
                                        <input className={inputClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. CSE" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Bio</label>
                                        <textarea className={inputClass + " h-20 resize-none"} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Skills (comma-separated)</label>
                                        <input className={inputClass} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Python, Machine Learning" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-white/40 mb-1 block flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</label>
                                            <input className={inputClass} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="github.com/..." />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/40 mb-1 block flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</label>
                                            <input className={inputClass} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="linkedin.com/in/..." />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            {/* Academic year badge — never shows "junior"/"senior" */}
                                            {user?.academicYear ? (
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-medium">
                                                    {yearLabel(user.academicYear)}
                                                </span>
                                            ) : null}
                                            {user?.rollNumber && (
                                                <span className="text-xs text-white/30">{user.rollNumber}</span>
                                            )}
                                            {user?.department && <span className="text-sm text-white/40">{user.department}</span>}
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm">{user?.bio || <span className="italic text-white/20">No bio yet. Click edit to add one.</span>}</p>

                                    {user?.skills?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-white/40 mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.map((s) => (
                                                    <span key={s} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {user?.github && (
                                            <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
                                                <Github className="w-4 h-4" /> GitHub
                                            </a>
                                        )}
                                        {user?.linkedin && (
                                            <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
                                                <Linkedin className="w-4 h-4" /> LinkedIn
                                            </a>
                                        )}
                                    </div>

                                    <p className="text-xs text-white/20">Email: {user?.email}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-white/50" />
                            <h3 className="font-semibold text-white">Change Password</h3>
                        </div>
                        {!pwMode && (
                            <button onClick={() => setPwMode(true)} className="text-sm text-indigo-400 hover:text-indigo-300">Change →</button>
                        )}
                    </div>

                    {pwMode && (
                        <div className="space-y-3">
                            {pwError && <p className="text-rose-400 text-sm bg-rose-500/10 px-3 py-2 rounded-lg">{pwError}</p>}
                            <input type="password" className={inputClass} placeholder="Current Password" value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} />
                            <input type="password" className={inputClass} placeholder="New Password (min 6 chars)" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                            <div className="flex gap-2">
                                <button onClick={() => { setPwMode(false); setPwForm({ oldPassword: "", newPassword: "" }); }} className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 text-sm transition-all">Cancel</button>
                                <button
                                    onClick={handlePwSave}
                                    disabled={savingPw}
                                    className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {savingPw && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {savingPw ? "Saving..." : "Update Password"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievements — available to all students */}
                {canAddAchievements && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <h3 className="font-semibold text-white">My Achievements</h3>
                                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{achievements.length}</span>
                            </div>
                            <button onClick={() => setShowAddAchieve(v => !v)}
                                className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                        </div>

                        <AnimatePresence>
                            {showAddAchieve && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 overflow-hidden"
                                >
                                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <input
                                            className={inputClass} placeholder="Achievement title *"
                                            value={newAchieve.title} onChange={e => setNewAchieve(p => ({ ...p, title: e.target.value }))}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                className={inputClass + " bg-[#0a0a1a]"}
                                                value={newAchieve.category}
                                                onChange={e => setNewAchieve(p => ({ ...p, category: e.target.value }))}
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <input
                                                className={inputClass} placeholder="Year (e.g. 2024)"
                                                type="number" value={newAchieve.year}
                                                onChange={e => setNewAchieve(p => ({ ...p, year: e.target.value }))}
                                            />
                                        </div>
                                        <textarea
                                            className={inputClass + " resize-none h-20"}
                                            placeholder="Description (optional)"
                                            value={newAchieve.description}
                                            onChange={e => setNewAchieve(p => ({ ...p, description: e.target.value }))}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => { setShowAddAchieve(false); setAchieveError(""); }} className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 text-sm">Cancel</button>
                                            <button onClick={handleAddAchievement} disabled={addingAchieve || !newAchieve.title.trim()}
                                                className="flex-1 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {addingAchieve ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                                                {addingAchieve ? "Saving..." : "Save Achievement"}
                                            </button>
                                        </div>
                                        {achieveError && (
                                            <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mt-1">
                                                ⚠ {achieveError}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {achieveLoading ? (
                            <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>
                        ) : achievements.length === 0 ? (
                            <p className="text-white/30 text-sm text-center py-6">No achievements yet — add your first one!</p>
                        ) : (
                            <div className="space-y-3">
                                {achievements.map(a => (
                                    <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-3 p-3 bg-white/5 rounded-xl group"
                                    >
                                        <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Trophy className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white text-sm">{a.title}</p>
                                                <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded capitalize">{a.category}</span>
                                                {a.year && <span className="text-xs text-white/20">{a.year}</span>}
                                            </div>
                                            {a.description && <p className="text-white/40 text-xs mt-0.5">{a.description}</p>}
                                        </div>
                                        <button onClick={() => handleDeleteAchievement(a.id)}
                                            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-400 transition-all p-1 rounded"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
