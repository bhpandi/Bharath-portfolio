"use client";

import { useState, useEffect, useRef } from "react";
import {
  defaultPortfolioData,
  emptyPortfolioData,
  type PortfolioData,
  type Experience,
  type Award,
  type SkillGroup,
  type Highlight,
} from "@/data/portfolio";
import { User, BookOpen, Briefcase, Code2, Trophy, Download, Upload, Eye, EyeOff, LogOut, ChevronDown, ChevronUp, Plus, Trash2, GripVertical, AlertCircle, CheckCircle2 } from "lucide-react";

type Tab = "profile" | "about" | "experience" | "skills" | "recognition";
type ResumeStyle = "classic" | "modern" | "minimal";
type AuthStatus = "loading" | "signup" | "signin";

const GRADIENT_COLORS = [
  { label: "Blue", value: "from-blue-500 to-cyan-400" },
  { label: "Purple", value: "from-purple-500 to-indigo-400" },
  { label: "Teal", value: "from-teal-500 to-green-400" },
  { label: "Orange", value: "from-orange-500 to-amber-400" },
  { label: "Rose", value: "from-rose-500 to-pink-400" },
  { label: "Violet", value: "from-violet-500 to-purple-400" },
  { label: "Gold", value: "from-yellow-500 to-amber-400" },
  { label: "Emerald", value: "from-emerald-500 to-teal-400" },
];

// ── Auth helpers ──────────────────────────────────────────────────────────────
function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}

function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 8) return "Must be at least 8 characters";
  return "";
}

function passwordStrength(pw: string): { score: number; label: string; bar: string; text: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const bars   = ["w-[8%]", "w-[20%]", "w-[40%]", "w-[60%]", "w-[80%]", "w-full"];
  const texts  = ["text-red-500", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-emerald-400"];
  const i = Math.min(s, 5);
  return { score: s, label: labels[i], bar: bars[i], text: texts[i] };
}

function InputField({
  label, type = "text", value, onChange, error, touched, placeholder, hint, autoFocus,
  rightEl,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string; touched?: boolean; placeholder?: string; hint?: string;
  autoFocus?: boolean; rightEl?: React.ReactNode;
}) {
  const hasError = touched && error;
  const isOk = touched && !error && value;
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm transition-colors pr-10 ${
            hasError ? "border-red-500/60 focus:border-red-500" : isOk ? "border-green-500/40 focus:border-green-500/60" : "border-white/10 focus:border-blue-500"
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl ?? (hasError ? <AlertCircle size={16} className="text-red-400" /> : isOk ? <CheckCircle2 size={16} className="text-green-400" /> : null)}
        </div>
      </div>
      {hasError && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {!hasError && hint && <p className="text-slate-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ── Sign In ───────────────────────────────────────────────────────────────────
function SignInForm({ onAuth, hasAccount, onSwitchToSignUp }: { onAuth: () => void; hasAccount: boolean; onSwitchToSignUp: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ email: false, pw: false });
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const emailErr = hasAccount ? validateEmail(email) : "";
  const pwErr = validatePassword(pw);
  const canSubmit = (!hasAccount || !emailErr) && !pwErr;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, pw: true });
    if (!canSubmit) return;
    setLoading(true);
    setServerErr("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pw }),
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) onAuth();
    else setServerErr(json.error ?? "Invalid credentials.");
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-900/40">
            <User size={28} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your portfolio</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={submit} className="space-y-4" noValidate>
            {hasAccount && (
              <InputField
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                error={emailErr}
                touched={touched.email}
                placeholder="you@example.com"
                autoFocus
              />
            )}
            <div>
              <InputField
                label="Password"
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={setPw}
                error={pwErr}
                touched={touched.pw}
                placeholder={hasAccount ? "Your password" : "Admin password"}
                autoFocus={!hasAccount}
                rightEl={
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {serverErr && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                {serverErr}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/5 space-y-3 text-center">
            {!hasAccount && (
              <button onClick={onSwitchToSignUp} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Create your account →
              </button>
            )}
            <p className="text-slate-600 text-xs">
              {hasAccount ? "Forgot password? Reset it via your Vercel Blob store." : "Password is set via ADMIN_PASSWORD in Vercel env vars."}
            </p>
          </div>
        </div>

        <a href="/" className="block text-center mt-5 text-slate-600 text-xs hover:text-slate-400 transition-colors">← Back to portfolio</a>
      </div>
    </div>
  );
}

// ── Sign Up ───────────────────────────────────────────────────────────────────
function SignUpForm({ onAuth, onSwitchToSignIn }: { onAuth: () => void; onSwitchToSignIn: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, pw: false, confirm: false });
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const nameErr = !name.trim() ? "Name is required" : name.trim().length < 2 ? "Must be at least 2 characters" : "";
  const emailErr = validateEmail(email);
  const pwErr = validatePassword(pw);
  const confirmErr = !confirmPw ? "Please confirm your password" : confirmPw !== pw ? "Passwords do not match" : "";
  const strength = passwordStrength(pw);
  const canSubmit = !nameErr && !emailErr && !pwErr && !confirmErr;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, pw: true, confirm: true });
    if (!canSubmit) return;
    setLoading(true);
    setServerErr("");
    const res = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pw }),
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) onAuth();
    else setServerErr(json.error ?? "Registration failed.");
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-900/40">
            <User size={28} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Set up your portfolio dashboard</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <InputField
              label="Full name"
              value={name}
              onChange={setName}
              error={nameErr}
              touched={touched.name}
              placeholder="Jane Smith"
              autoFocus
            />
            <InputField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              error={emailErr}
              touched={touched.email}
              placeholder="you@example.com"
            />

            {/* Password with strength */}
            <div>
              <InputField
                label="Password"
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={setPw}
                error={pwErr}
                touched={touched.pw}
                placeholder="Min 8 characters"
                rightEl={
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {pw && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 ${strength.bar}`} />
                  </div>
                  <p className={`text-xs ${strength.text}`}>{strength.label}</p>
                </div>
              )}
            </div>

            <InputField
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={setConfirmPw}
              error={confirmErr}
              touched={touched.confirm}
              placeholder="Re-enter your password"
              rightEl={
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {serverErr && (
              <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{serverErr}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/5 text-center">
            <p className="text-slate-600 text-xs mb-2">
              Credentials are stored securely in your Vercel Blob store.
            </p>
            <button onClick={onSwitchToSignIn} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
              Already have an account? Sign in
            </button>
          </div>
        </div>

        <a href="/" className="block text-center mt-5 text-slate-600 text-xs hover:text-slate-400 transition-colors">← Back to portfolio</a>
      </div>
    </div>
  );
}

// ── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then(({ hasAccount: ha, blobConfigured }: { hasAccount: boolean; blobConfigured: boolean }) => {
        setHasAccount(ha);
        // If blob is configured and no account → show signup
        // If blob not configured or account exists → show signin
        setStatus(!ha && blobConfigured ? "signup" : "signin");
      })
      .catch(() => setStatus("signin"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "signup") {
    return <SignUpForm onAuth={onAuth} onSwitchToSignIn={() => setStatus("signin")} />;
  }

  return <SignInForm onAuth={onAuth} hasAccount={hasAccount} onSwitchToSignUp={() => setStatus("signup")} />;
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline, rows = 4, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string; hint?: string;
}) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm transition-colors";
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>
      {multiline
        ? <textarea className={cls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        : <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
      {hint && <p className="text-slate-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const p = data.personal;
  const set = (key: keyof typeof p, val: string | boolean) =>
    onChange({ ...data, personal: { ...p, [key]: val } });

  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = p.name
    .split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload-photo", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        set("photoUrl", json.url);
      } else {
        setUploadErr(json.error ?? "Upload failed.");
      }
    } catch {
      setUploadErr("Network error. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo upload */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 inline-block" />
          Profile Photo
        </h3>
        <div className="flex items-start gap-6">
          {/* Avatar preview */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-teal-400">
              <div className="w-full h-full rounded-full bg-[#0a1628] flex items-center justify-center overflow-hidden">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                ) : p.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photoUrl} alt="preview" className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="text-2xl font-bold gradient-text">{initials}</span>
                )}
              </div>
            </div>
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-3">
            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-semibold transition-all disabled:opacity-50 w-full justify-center"
            >
              <Upload size={15} />
              {uploading ? "Uploading…" : "Upload Photo"}
            </button>
            <p className="text-slate-600 text-xs text-center">JPEG, PNG, WebP or GIF · max 5 MB</p>

            {uploadErr && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <AlertCircle size={13} className="flex-shrink-0" />
                {uploadErr}
              </div>
            )}

            {/* Manual URL fallback */}
            <div className="pt-1">
              <Field
                label="Or paste URL"
                value={p.photoUrl ?? ""}
                onChange={(v) => set("photoUrl", v)}
                placeholder="https://example.com/photo.jpg"
                hint="Clear the field to show initials instead"
              />
            </div>

            {p.photoUrl && (
              <button
                onClick={() => { set("photoUrl", ""); setUploadErr(""); }}
                className="text-slate-600 hover:text-red-400 text-xs transition-colors"
              >
                ✕ Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 inline-block" />
          Personal Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={p.name} onChange={(v) => set("name", v)} placeholder="Jane Smith" />
          <Field label="Job Title / Role" value={p.title} onChange={(v) => set("title", v)} placeholder="Senior Software Engineer" />
          <Field label="Email" value={p.email} onChange={(v) => set("email", v)} placeholder="jane@example.com" />
          <Field label="Phone" value={p.phone} onChange={(v) => set("phone", v)} placeholder="+1 555 000 0000" />
          <Field label="Location" value={p.location} onChange={(v) => set("location", v)} placeholder="San Francisco, CA" />
        </div>
      </div>

      {/* Social / Online presence */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
          Online Presence
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="LinkedIn URL" value={p.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/yourname" />
          <Field label="GitHub URL" value={p.github ?? ""} onChange={(v) => set("github", v)} placeholder="https://github.com/yourname" />
          <Field label="Personal Website" value={p.website ?? ""} onChange={(v) => set("website", v)} placeholder="https://yoursite.com" />
        </div>
      </div>

      {/* Availability + Summary */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-green-500 to-teal-500 inline-block" />
          Availability & Summary
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => set("available", !p.available)}
            className={`w-12 h-6 rounded-full transition-all relative ${p.available ? "bg-green-500" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${p.available ? "left-7" : "left-1"}`} />
          </div>
          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
            {p.available ? "Open to opportunities" : "Not currently available"}
          </span>
        </label>
        <Field
          label="Professional Summary"
          value={p.summary}
          onChange={(v) => set("summary", v)}
          multiline
          rows={3}
          placeholder="A short, compelling 1-2 sentence bio shown in the hero section..."
          hint="Keep this brief — it appears as the hero tagline. Longer bio goes in the About section."
        />
      </div>

      {/* Stats */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-orange-500 to-amber-500 inline-block" />
          Stats (shown below hero)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-sm text-center font-bold focus:outline-none focus:border-blue-500"
                value={s.value}
                onChange={(e) => { const st = [...data.stats]; st[i] = { ...s, value: e.target.value }; onChange({ ...data, stats: st }); }}
                placeholder="16+"
              />
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-400 text-sm focus:outline-none focus:border-blue-500"
                value={s.label}
                onChange={(e) => { const st = [...data.stats]; st[i] = { ...s, label: e.target.value }; onChange({ ...data, stats: st }); }}
                placeholder="Years Experience"
              />
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-3">Leave Value blank to hide that stat</p>
      </div>
    </div>
  );
}

// ── About Tab ─────────────────────────────────────────────────────────────────
function AboutTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const a = data.about;
  const setAbout = (key: keyof typeof a, val: unknown) =>
    onChange({ ...data, about: { ...a, [key]: val } });

  const highlights: Highlight[] = a.highlights ?? [];

  const updateHighlight = (i: number, h: Highlight) => {
    const u = [...highlights]; u[i] = h; setAbout("highlights", u);
  };
  const removeHighlight = (i: number) => setAbout("highlights", highlights.filter((_, idx) => idx !== i));
  const addHighlight = () => {
    const colors = GRADIENT_COLORS.map((c) => c.value);
    const used = highlights.map((h) => h.color);
    const color = colors.find((c) => !used.includes(c)) ?? colors[highlights.length % colors.length];
    setAbout("highlights", [...highlights, { title: "New Highlight", desc: "Describe this strength or achievement.", color }]);
  };

  return (
    <div className="space-y-6">
      {/* Bio paragraphs */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 inline-block" />
          About Paragraphs
        </h3>
        <p className="text-slate-500 text-xs">These three paragraphs appear in the About section of your portfolio.</p>
        <Field label="Paragraph 1 (primary, larger text)" value={a.description1} onChange={(v) => setAbout("description1", v)} multiline rows={3} placeholder="Your main value proposition or career summary..." />
        <Field label="Paragraph 2" value={a.description2} onChange={(v) => setAbout("description2", v)} multiline rows={3} placeholder="Specific achievements or current focus..." />
        <Field label="Paragraph 3" value={a.description3} onChange={(v) => setAbout("description3", v)} multiline rows={3} placeholder="Career highlights or unique differentiators..." />
      </div>

      {/* Tags */}
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-teal-500 to-green-500 inline-block" />
          Expertise Tags
        </h3>
        <p className="text-slate-500 text-xs">These appear as pills below your bio. Also used for the hero typing animation.</p>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          value={a.tags.join(", ")}
          onChange={(e) => setAbout("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          placeholder="React.js, TypeScript, Team Leadership, Agile..."
        />
      </div>

      {/* Highlights */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-purple-500 to-pink-500 inline-block" />
              Highlight Cards
            </h3>
            <p className="text-slate-500 text-xs mt-1">Up to 4 cards showing your key strengths (shown in the About section grid)</p>
          </div>
          {highlights.length < 4 && (
            <button onClick={addHighlight} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xs font-medium transition-all">
              <Plus size={13} /> Add Card
            </button>
          )}
        </div>
        <div className="space-y-3">
          {highlights.map((h, i) => (
            <div key={i} className="bg-white/3 rounded-xl p-4 space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${h.color}`} />
                  <span className="text-slate-400 text-xs font-medium">Card {i + 1}</span>
                </div>
                <button onClick={() => removeHighlight(i)} className="text-red-400/50 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Title" value={h.title} onChange={(v) => updateHighlight(i, { ...h, title: v })} placeholder="Key Strength" />
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Color</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 text-sm focus:outline-none"
                    value={h.color}
                    onChange={(e) => updateHighlight(i, { ...h, color: e.target.value })}
                  >
                    {GRADIENT_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Description" value={h.desc} onChange={(v) => updateHighlight(i, { ...h, desc: v })} placeholder="Brief description of this strength..." />
            </div>
          ))}
          {highlights.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-4">No highlight cards yet. Add up to 4.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Experience Tab ────────────────────────────────────────────────────────────
function ExperienceTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const update = (i: number, exp: Experience) => { const u = [...data.experience]; u[i] = exp; onChange({ ...data, experience: u }); };
  const remove = (i: number) => { onChange({ ...data, experience: data.experience.filter((_, idx) => idx !== i) }); if (expanded === i) setExpanded(null); };
  const add = () => {
    const blank: Experience = { role: "New Role", company: "Company Name", vendor: "", period: "Month YYYY – Present", location: "City, Country", color: "from-blue-500 to-cyan-400", badge: "Current", points: ["Key responsibility or achievement"] };
    onChange({ ...data, experience: [blank, ...data.experience] });
    setExpanded(0);
  };
  const moveUp = (i: number) => { if (i === 0) return; const u = [...data.experience]; [u[i - 1], u[i]] = [u[i], u[i - 1]]; onChange({ ...data, experience: u }); };
  const moveDown = (i: number) => { if (i === data.experience.length - 1) return; const u = [...data.experience]; [u[i], u[i + 1]] = [u[i + 1], u[i]]; onChange({ ...data, experience: u }); };

  return (
    <div className="space-y-3">
      <button onClick={add} className="w-full py-3 rounded-xl border border-dashed border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2">
        <Plus size={16} /> Add Experience
      </button>
      {data.experience.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No experience added yet. Click above to add your first role.</p>
        </div>
      )}
      {data.experience.map((exp, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden">
          <div className="flex items-center">
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-white/3 transition-colors">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${exp.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{exp.role}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{exp.company}{exp.period ? ` · ${exp.period}` : ""}</p>
              </div>
              {expanded === i ? <ChevronUp size={16} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />}
            </button>
            <div className="flex items-center gap-1 pr-3">
              <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1.5 text-slate-600 hover:text-slate-300 disabled:opacity-30 transition-colors" title="Move up"><ChevronUp size={14} /></button>
              <button onClick={() => moveDown(i)} disabled={i === data.experience.length - 1} className="p-1.5 text-slate-600 hover:text-slate-300 disabled:opacity-30 transition-colors" title="Move down"><ChevronDown size={14} /></button>
              <button onClick={() => remove(i)} className="p-1.5 text-red-400/50 hover:text-red-400 transition-colors" title="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
          {expanded === i && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Role / Title" value={exp.role} onChange={(v) => update(i, { ...exp, role: v })} />
                <Field label="Company" value={exp.company} onChange={(v) => update(i, { ...exp, company: v })} />
                <Field label="Employer / Vendor (optional)" value={exp.vendor} onChange={(v) => update(i, { ...exp, vendor: v })} hint="e.g., contractor or consulting agency" />
                <Field label="Period" value={exp.period} onChange={(v) => update(i, { ...exp, period: v })} placeholder="Jan 2022 – Present" />
                <Field label="Location" value={exp.location} onChange={(v) => update(i, { ...exp, location: v })} placeholder="Singapore" />
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Badge Label</label>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      value={exp.badge} onChange={(e) => update(i, { ...exp, badge: e.target.value })} placeholder="Current" />
                    <select className="bg-white/5 border border-white/10 rounded-xl px-2 text-slate-400 text-xs focus:outline-none"
                      value={exp.color} onChange={(e) => update(i, { ...exp, color: e.target.value })}>
                      {GRADIENT_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Key Responsibilities / Achievements (one per line)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  rows={6}
                  value={exp.points.join("\n")}
                  onChange={(e) => update(i, { ...exp, points: e.target.value.split("\n") })}
                  placeholder="Led a team of 8 engineers...&#10;Reduced deployment time by 40%...&#10;Architected the payments module..."
                />
                <p className="text-slate-600 text-xs mt-1">Empty lines are ignored on display</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Skills Tab ────────────────────────────────────────────────────────────────
function SkillsTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const updateGroup = (gi: number, group: SkillGroup) => {
    const u = [...data.skillGroups]; u[gi] = group; onChange({ ...data, skillGroups: u });
  };
  const removeGroup = (gi: number) => onChange({ ...data, skillGroups: data.skillGroups.filter((_, i) => i !== gi) });
  const addGroup = () => {
    const used = data.skillGroups.map((g) => g.color);
    const color = GRADIENT_COLORS.find((c) => !used.includes(c.value))?.value ?? GRADIENT_COLORS[0].value;
    onChange({ ...data, skillGroups: [...data.skillGroups, { category: "New Category", color, skills: [] }] });
  };

  return (
    <div className="space-y-4">
      {data.skillGroups.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          <Code2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No skill categories yet. Add your first skill group below.</p>
        </div>
      )}

      {data.skillGroups.map((group, gi) => (
        <div key={gi} className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${group.color} flex-shrink-0`} />
              <input
                className="bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-blue-500 pb-0.5 transition-colors min-w-0 flex-1"
                value={group.category}
                onChange={(e) => updateGroup(gi, { ...group, category: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <select
                className="bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs px-2 py-1.5 focus:outline-none"
                value={group.color}
                onChange={(e) => updateGroup(gi, { ...group, color: e.target.value })}
              >
                {GRADIENT_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <button onClick={() => removeGroup(gi)} className="flex items-center gap-1 text-red-400/60 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-red-400/5">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {group.skills.map((skill, si) => (
              <div key={si} className="flex items-center gap-3">
                <GripVertical size={14} className="text-slate-700 flex-shrink-0" />
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 min-w-0"
                  value={skill.name}
                  onChange={(e) => updateGroup(gi, { ...group, skills: group.skills.map((s, idx) => idx === si ? { ...s, name: e.target.value } : s) })}
                  placeholder="Skill name"
                />
                <div className="flex items-center gap-2 w-36">
                  <input
                    type="range" min={10} max={100} value={skill.level}
                    className="flex-1 accent-blue-500"
                    onChange={(e) => updateGroup(gi, { ...group, skills: group.skills.map((s, idx) => idx === si ? { ...s, level: Number(e.target.value) } : s) })}
                  />
                  <span className="text-slate-500 text-xs w-8 text-right">{skill.level}%</span>
                </div>
                <button
                  className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                  onClick={() => updateGroup(gi, { ...group, skills: group.skills.filter((_, idx) => idx !== si) })}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {group.skills.length === 0 && (
              <p className="text-slate-700 text-xs pl-5">No skills in this category yet</p>
            )}
          </div>

          <button
            className="mt-3 flex items-center gap-1.5 text-blue-400/60 hover:text-blue-400 text-xs transition-colors"
            onClick={() => updateGroup(gi, { ...group, skills: [...group.skills, { name: "", level: 80 }] })}
          >
            <Plus size={12} /> Add skill
          </button>
        </div>
      ))}

      <button
        onClick={addGroup}
        className="w-full py-3 rounded-xl border border-dashed border-purple-500/30 text-purple-400/70 text-sm hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Skill Category
      </button>

      {/* Tech Badges */}
      <div className="glass-card rounded-xl p-5 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-sm">Tech Badge Cloud</h3>
          <p className="text-slate-500 text-xs mt-1">Short technology names displayed as tags. Comma-separated.</p>
        </div>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          rows={3}
          value={data.techBadges.join(", ")}
          onChange={(e) => onChange({ ...data, techBadges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="React.js, TypeScript, Node.js, AWS, Docker..."
        />
      </div>
    </div>
  );
}

// ── Recognition Tab ───────────────────────────────────────────────────────────
function RecognitionTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const updateAward = (i: number, award: Award) => { const u = [...data.awards]; u[i] = award; onChange({ ...data, awards: u }); };
  const removeAward = (i: number) => onChange({ ...data, awards: data.awards.filter((_, idx) => idx !== i) });
  const addAward = () => onChange({ ...data, awards: [...data.awards, { title: "Award Title", subtitle: "Achievement or contribution", org: "Organisation", color: "from-yellow-500 to-amber-400", icon: "🏆" }] });

  const edu = data.education;
  const setEdu = (key: keyof typeof edu, val: string) => onChange({ ...data, education: { ...edu, [key]: val } });

  return (
    <div className="space-y-6">
      {/* Awards */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-yellow-500 to-amber-500 inline-block" />
            Awards & Recognition
          </h3>
          <button onClick={addAward} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 text-xs font-medium transition-all">
            <Plus size={13} /> Add Award
          </button>
        </div>
        {data.awards.length === 0 && (
          <p className="text-slate-600 text-sm text-center py-4">No awards yet</p>
        )}
        {data.awards.map((award, i) => (
          <div key={i} className="bg-white/3 rounded-xl p-4 space-y-3 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{award.icon}</span>
              <button onClick={() => removeAward(i)} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Award Title" value={award.title} onChange={(v) => updateAward(i, { ...award, title: v })} />
              <Field label="Subtitle" value={award.subtitle} onChange={(v) => updateAward(i, { ...award, subtitle: v })} />
              <Field label="Organisation" value={award.org} onChange={(v) => updateAward(i, { ...award, org: v })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Emoji Icon" value={award.icon} onChange={(v) => updateAward(i, { ...award, icon: v })} placeholder="🏆" />
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Color</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-slate-300 text-sm focus:outline-none"
                    value={award.color} onChange={(e) => updateAward(i, { ...award, color: e.target.value })}>
                    {GRADIENT_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-teal-500 to-green-500 inline-block" />
          Education
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Degree / Qualification" value={edu.degree} onChange={(v) => setEdu("degree", v)} placeholder="Bachelor of Computer Science" />
          <Field label="Institution" value={edu.institution} onChange={(v) => setEdu("institution", v)} placeholder="University Name" />
          <Field label="Period" value={edu.period} onChange={(v) => setEdu("period", v)} placeholder="2000 – 2004" />
        </div>
      </div>

      {/* Languages */}
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 inline-block" />
          Languages <span className="text-slate-600 font-normal text-xs ml-1">comma-separated</span>
        </h3>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          value={data.languages.join(", ")}
          onChange={(e) => onChange({ ...data, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="English, Spanish, Mandarin..."
        />
      </div>

      {/* Domain Expertise */}
      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 inline-block" />
          Domain Expertise <span className="text-slate-600 font-normal text-xs ml-1">comma-separated</span>
        </h3>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          rows={2}
          value={data.domainExpertise.join(", ")}
          onChange={(e) => onChange({ ...data, domainExpertise: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="FinTech, E-Commerce, Digital Banking, Healthcare..."
        />
      </div>
    </div>
  );
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [tab, setTab] = useState<Tab>("profile");
  const [style, setStyle] = useState<ResumeStyle>("classic");
  const [downloading, setDownloading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState<{ ok: boolean; text: string; showLink?: boolean } | null>(null);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio-data")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  const handleChange = (d: PortfolioData) => { setData(d); setUnsaved(true); };

  const downloadDocx = async () => {
    setDownloading(true);
    const res = await fetch(`/api/resume/docx?style=${style}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.personal.name || "Resume").replace(/\s+/g, "_")}_Resume_${style}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const openPdfPreview = () => {
    localStorage.setItem("portfolio_preview", JSON.stringify({ data, style }));
    window.open(`/resume?style=${style}`, "_blank");
  };

  const publish = async () => {
    setPublishing(true);
    setPublishMsg(null);
    const res = await fetch("/api/portfolio-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setPublishing(false);
    if (res.ok) {
      setPublishMsg({ ok: true, text: "Published! Your portfolio is now live.", showLink: true });
      setUnsaved(false);
    } else {
      setPublishMsg({ ok: false, text: json.error ?? "Publish failed. Check Vercel Blob is configured." });
    }
    setTimeout(() => setPublishMsg(null), 10000);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToBlank = () => {
    if (confirm("Clear all content and start from a blank template? This cannot be undone until you publish.")) {
      handleChange({ ...emptyPortfolioData });
    }
  };

  const initials = (data.personal.name || "?")
    .split(" ").filter(Boolean).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "about", label: "About", icon: <BookOpen size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "skills", label: "Skills", icon: <Code2 size={16} /> },
    { id: "recognition", label: "Recognition", icon: <Trophy size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050b18]">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[rgba(5,11,24,0.95)] nav-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
              {initials || "P"}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">Portfolio Dashboard</p>
              {unsaved && <p className="text-amber-400 text-xs mt-0.5">Unsaved changes</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 text-xs hidden md:block">Style:</span>
            <div className="flex gap-1">
              {(["classic", "modern", "minimal"] as ResumeStyle[]).map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${style === s ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={openPdfPreview} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-all">
              <Eye size={13} /> PDF
            </button>
            <button onClick={downloadDocx} disabled={downloading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-all disabled:opacity-50">
              <Download size={13} /> {downloading ? "…" : "DOCX"}
            </button>
            <button onClick={exportJson} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-slate-400 hover:text-white text-xs font-medium transition-all">
              <Download size={13} /> JSON
            </button>
            <button onClick={publish} disabled={publishing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-green-900/20">
              <Upload size={13} /> {publishing ? "Publishing…" : "Publish Live"}
            </button>
            <a href="/" className="p-1.5 text-slate-600 hover:text-slate-400 transition-colors" title="View portfolio" target="_blank" rel="noopener noreferrer">
              <LogOut size={16} />
            </a>
          </div>
        </div>

        {publishMsg && (
          <div className={`px-6 py-2.5 text-xs font-medium text-center border-t flex items-center justify-center gap-3 ${publishMsg.ok ? "bg-green-600/15 text-green-400 border-green-500/20" : "bg-red-600/15 text-red-400 border-red-500/20"}`}>
            <span>{publishMsg.text}</span>
            {publishMsg.showLink && (
              <a
                href={`/?t=${Date.now()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold transition-colors text-xs border border-green-500/30"
              >
                View Portfolio →
              </a>
            )}
            {!publishMsg.ok && (
              <span className="text-slate-500">→ Set up Vercel Blob in your Vercel Dashboard under Storage.</span>
            )}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab nav */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl">
          {tab === "profile" && <ProfileTab data={data} onChange={handleChange} />}
          {tab === "about" && <AboutTab data={data} onChange={handleChange} />}
          {tab === "experience" && <ExperienceTab data={data} onChange={handleChange} />}
          {tab === "skills" && <SkillsTab data={data} onChange={handleChange} />}
          {tab === "recognition" && <RecognitionTab data={data} onChange={handleChange} />}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center max-w-3xl">
          <div className="flex gap-3">
            <button onClick={resetToBlank} className="px-4 py-2 rounded-xl text-slate-500 text-xs border border-white/5 hover:border-red-500/20 hover:text-red-400 transition-all">
              Start from blank
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={openPdfPreview} className="px-5 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-sm font-semibold transition-all flex items-center gap-2">
              <Eye size={15} /> Preview Resume ({style})
            </button>
            <button onClick={downloadDocx} disabled={downloading} className="px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2">
              <Download size={15} /> {downloading ? "Generating…" : `Download DOCX`}
            </button>
            <button onClick={publish} disabled={publishing} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2">
              <Upload size={15} /> {publishing ? "Publishing…" : "Publish to Portfolio"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
