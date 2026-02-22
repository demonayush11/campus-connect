import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Eye, EyeOff, Loader2, ChevronDown, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { yearLabel, previewAcademicYear } from "@/lib/yearHelper";

const DEPTS = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "MBA", "MCA", "Other"];

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all";
const selectClass =
  "w-full bg-[#1a1a2e] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm text-white/60 mb-1.5">{label}</label>
    {children}
  </div>
);

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    department: "", bio: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  // ── Live academic year preview (display only — server always recomputes) ──
  const previewYear = previewAcademicYear(form.email);
  const isKiitEmail = /^(\d{2})\d+@kiit\.ac\.in$/i.test(form.email.trim());
  const emailTyped = form.email.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Join campusConnect</h1>
            <p className="text-white/50 text-sm mt-1">Connect with your campus community</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                className={inputClass}
                placeholder="John Doe"
                required
              />
            </Field>

            {/* Email with KIIT hint & live year preview */}
            <Field label="KIIT Email">
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className={inputClass}
                placeholder="23052234@kiit.ac.in"
                required
              />

              {/* Always show the hint */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <Info className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                <span className="text-xs text-white/30">
                  Use your KIIT roll number email (e.g.&nbsp;23052234@kiit.ac.in)
                </span>
              </div>

              {/* Live year preview after typing */}
              {emailTyped && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${previewYear !== null
                      ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                      : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                    }`}
                >
                  {previewYear !== null ? (
                    <>📚 You'll be registered as <strong>{yearLabel(previewYear)}</strong></>
                  ) : isKiitEmail ? (
                    <>⚠️ Batch out of range — only 1st–4th year students can register</>
                  ) : (
                    <>⚠️ Please enter a valid KIIT email</>
                  )}
                </motion.div>
              )}
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  className={inputClass + " pr-10"}
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-white/30 hover:text-white/60"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {/* Department */}
            <Field label="Department">
              <div className="relative">
                <select
                  value={form.department}
                  onChange={set("department")}
                  className={selectClass}
                >
                  <option value="">Select department</option>
                  {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </Field>

            <Field label="Bio (optional)">
              <textarea
                value={form.bio}
                onChange={set("bio")}
                className={inputClass + " resize-none h-20"}
                placeholder="A short intro about you..."
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
