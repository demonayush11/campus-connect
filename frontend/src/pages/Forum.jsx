import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, X, Tag, Send, Trash2, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/context/AuthContext";
import { postsApi } from "@/lib/api";

const Forum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedPost, setExpandedPost] = useState(null);
    const [expandedContent, setExpandedContent] = useState(new Set());

    const toggleContent = (id) =>
        setExpandedContent((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    const [commentText, setCommentText] = useState({});
    const [submittingComment, setSubmittingComment] = useState(null);
    const [form, setForm] = useState({ title: "", content: "", tags: "" });
    const [error, setError] = useState("");

    const fetchPosts = () =>
        postsApi.getAll().then(setPosts).catch(console.error).finally(() => setLoading(false));

    useEffect(() => { fetchPosts(); }, []);

    const filtered = posts.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase()) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true); setError("");
        try {
            const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
            await postsApi.create({ ...form, tags: tagsArr });
            setShowModal(false);
            setForm({ title: "", content: "", tags: "" });
            fetchPosts();
        } catch (err) { setError(err.message); }
        finally { setCreating(false); }
    };

    const handleComment = async (postId) => {
        const content = commentText[postId]?.trim();
        if (!content) return;
        setSubmittingComment(postId);
        try {
            await postsApi.addComment(postId, { content });
            setCommentText({ ...commentText, [postId]: "" });
            fetchPosts();
        } catch (err) { alert(err.message); }
        finally { setSubmittingComment(null); }
    };

    const handleDeletePost = async (id) => {
        if (!confirm("Delete this post?")) return;
        try { await postsApi.delete(id); fetchPosts(); }
        catch (err) { alert(err.message); }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try { await postsApi.deleteComment(postId, commentId); fetchPosts(); }
        catch (err) { alert(err.message); }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all";

    const tagColors = ["bg-indigo-500/20 text-indigo-300", "bg-cyan-500/20 text-cyan-300", "bg-rose-500/20 text-rose-300", "bg-emerald-500/20 text-emerald-300", "bg-yellow-500/20 text-yellow-300"];

    return (
        <div className="min-h-screen bg-[#030303] text-white">
            <AppNavbar />
            <div className="pt-24 pb-12 px-4 container mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Q&A Forum</h1>
                        <p className="text-white/50 mt-1">Ask questions, share knowledge.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-orange-600 rounded-lg font-medium hover:from-rose-600 hover:to-orange-700 transition-all w-fit"
                    >
                        <Plus className="w-4 h-4" /> Ask Question
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-white/30" />
                    <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 transition-all"
                        placeholder="Search posts by title, content, or tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No posts yet. Ask the first question!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((post) => {
                            const isExpanded = expandedPost === post.id;
                            const isMine = post.authorId === user?.id;
                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-rose-500/20 transition-all"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-white text-lg leading-snug">{post.title}</h3>
                                                <p className={`text-white/50 text-sm mt-1 whitespace-pre-wrap ${expandedContent.has(post.id) ? '' : 'line-clamp-2'}`}>
                                                    {post.content}
                                                </p>
                                                {post.content?.length > 120 && (
                                                    <button
                                                        onClick={() => toggleContent(post.id)}
                                                        className="text-xs text-rose-400 hover:text-rose-300 mt-1 transition-colors font-medium"
                                                    >
                                                        {expandedContent.has(post.id) ? '▲ Show less' : '▼ Read more'}
                                                    </button>
                                                )}
                                            </div>
                                            {isMine && (
                                                <button onClick={() => handleDeletePost(post.id)} className="text-white/20 hover:text-rose-400 transition-colors flex-shrink-0">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        {post.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {post.tags.map((t, i) => (
                                                    <span key={t} className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${tagColors[i % tagColors.length]}`}>
                                                        <Tag className="w-2.5 h-2.5" /> {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2 text-xs text-white/30">
                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs">
                                                    {post.author?.name?.[0]?.toUpperCase()}
                                                </div>
                                                {post.author?.name} · <span className="capitalize">{post.author?.role}</span> · {new Date(post.createdAt).toLocaleDateString()}
                                            </div>

                                            <button
                                                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                                                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {post.comments?.length ?? 0} comments
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-white/3"
                                            >
                                                <div className="p-4 space-y-3">
                                                    {post.comments?.length === 0 ? (
                                                        <p className="text-white/30 text-sm text-center py-2">No comments yet. Be the first!</p>
                                                    ) : (
                                                        post.comments.map((c) => (
                                                            <div key={c.id} className="flex gap-3">
                                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0 font-medium">
                                                                    {c.author?.name?.[0]?.toUpperCase()}
                                                                </div>
                                                                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs text-white/40 font-medium">{c.author?.name} · <span className="capitalize">{c.author?.role}</span></span>
                                                                        {c.authorId === user?.id && (
                                                                            <button onClick={() => handleDeleteComment(post.id, c.id)} className="text-white/20 hover:text-rose-400 transition-colors">
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-white/70 text-sm mt-0.5">{c.content}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}

                                                    {/* Add Comment */}
                                                    <div className="flex gap-2 pt-2">
                                                        <input
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all"
                                                            placeholder="Write a comment..."
                                                            value={commentText[post.id] || ""}
                                                            onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                                            onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                                                        />
                                                        <button
                                                            onClick={() => handleComment(post.id)}
                                                            disabled={submittingComment === post.id}
                                                            className="p-2 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 hover:bg-rose-500/30 transition-all"
                                                        >
                                                            {submittingComment === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
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
                            className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-white">Ask a Question</h2>
                                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>
                            {error && <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}
                            <form onSubmit={handleCreate} className="space-y-3">
                                <input className={inputClass} placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                <textarea className={inputClass + " h-32 resize-none"} placeholder="Describe your question in detail..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                                    <input className={inputClass + " pl-9"} placeholder="Tags (comma-separated: css, react, python)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-rose-500 to-orange-600 text-white flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {creating ? "Posting..." : "Post Question"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Forum;
