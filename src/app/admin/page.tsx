"use client";

import { useState, useEffect } from "react";
import { defaultPortfolioData, type PortfolioData, type Experience, type Award } from "@/data/portfolio";

type Tab = "personal" | "experience" | "skills" | "awards" | "education";

// ── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) {
      onAuth();
    } else {
      setErr("Incorrect password. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-10 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg">
          BP
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-slate-500 text-sm mb-8">Enter your admin password to continue</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            autoFocus
          />
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
        <a href="/" className="block mt-6 text-slate-600 text-xs hover:text-slate-400 transition-colors">
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, multiline, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  const cls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm transition-colors";
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={cls}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

// ── Personal Tab ──────────────────────────────────────────────────────────────
function PersonalTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const p = data.personal;
  const set = (key: keyof typeof p, val: string) =>
    onChange({ ...data, personal: { ...p, [key]: val } });

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" value={p.name} onChange={(v) => set("name", v)} />
        <Field label="Title / Role" value={p.title} onChange={(v) => set("title", v)} />
        <Field label="Email" value={p.email} onChange={(v) => set("email", v)} />
        <Field label="Phone" value={p.phone} onChange={(v) => set("phone", v)} />
        <Field label="Location" value={p.location} onChange={(v) => set("location", v)} />
        <Field label="LinkedIn URL" value={p.linkedin} onChange={(v) => set("linkedin", v)} />
      </div>
      <Field label="Professional Summary" value={p.summary} onChange={(v) => set("summary", v)} multiline />
    </div>
  );
}

// ── Experience Tab ────────────────────────────────────────────────────────────
function ExperienceTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const update = (i: number, exp: Experience) => {
    const updated = [...data.experience];
    updated[i] = exp;
    onChange({ ...data, experience: updated });
  };

  const remove = (i: number) => {
    onChange({ ...data, experience: data.experience.filter((_, idx) => idx !== i) });
    setExpanded(null);
  };

  const add = () => {
    const blank: Experience = {
      role: "New Role",
      company: "Company",
      vendor: "",
      period: "Month YYYY – Present",
      location: "Location",
      color: "from-blue-500 to-cyan-400",
      badge: "New",
      points: ["Responsibility 1"],
    };
    onChange({ ...data, experience: [blank, ...data.experience] });
    setExpanded(0);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={add}
        className="w-full py-2.5 rounded-xl border border-dashed border-blue-500/40 text-blue-400 text-sm hover:bg-blue-500/5 transition-all"
      >
        + Add Experience
      </button>

      {data.experience.map((exp, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
          >
            <div>
              <p className="text-white font-semibold text-sm">{exp.role}</p>
              <p className="text-slate-500 text-xs mt-0.5">{exp.company} · {exp.period}</p>
            </div>
            <span className="text-slate-500 text-lg">{expanded === i ? "▲" : "▼"}</span>
          </button>

          {expanded === i && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/5">
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Role" value={exp.role} onChange={(v) => update(i, { ...exp, role: v })} />
                <Field label="Company" value={exp.company} onChange={(v) => update(i, { ...exp, company: v })} />
                <Field label="Vendor (optional)" value={exp.vendor} onChange={(v) => update(i, { ...exp, vendor: v })} />
                <Field label="Period" value={exp.period} onChange={(v) => update(i, { ...exp, period: v })} />
                <Field label="Location" value={exp.location} onChange={(v) => update(i, { ...exp, location: v })} />
                <Field label="Badge Label" value={exp.badge} onChange={(v) => update(i, { ...exp, badge: v })} />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">
                  Responsibilities (one per line)
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  rows={6}
                  value={exp.points.join("\n")}
                  onChange={(e) =>
                    update(i, { ...exp, points: e.target.value.split("\n").filter(Boolean) })
                  }
                />
              </div>

              <button
                onClick={() => remove(i)}
                className="text-red-400/70 hover:text-red-400 text-xs transition-colors"
              >
                ✕ Remove this entry
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Skills Tab ────────────────────────────────────────────────────────────────
function SkillsTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  return (
    <div className="space-y-6">
      {data.skillGroups.map((group, gi) => (
        <div key={gi} className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${group.color}`} />
            <input
              className="bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-blue-500 pb-0.5 transition-colors"
              value={group.category}
              onChange={(e) => {
                const updated = [...data.skillGroups];
                updated[gi] = { ...group, category: e.target.value };
                onChange({ ...data, skillGroups: updated });
              }}
            />
          </div>

          <div className="space-y-3">
            {group.skills.map((skill, si) => (
              <div key={si} className="flex items-center gap-3">
                <input
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...data.skillGroups];
                    updated[gi] = {
                      ...group,
                      skills: group.skills.map((s, idx) =>
                        idx === si ? { ...s, name: e.target.value } : s
                      ),
                    };
                    onChange({ ...data, skillGroups: updated });
                  }}
                />
                <div className="flex items-center gap-2 w-32">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    className="flex-1 accent-blue-500"
                    onChange={(e) => {
                      const updated = [...data.skillGroups];
                      updated[gi] = {
                        ...group,
                        skills: group.skills.map((s, idx) =>
                          idx === si ? { ...s, level: Number(e.target.value) } : s
                        ),
                      };
                      onChange({ ...data, skillGroups: updated });
                    }}
                  />
                  <span className="text-slate-500 text-xs w-8">{skill.level}%</span>
                </div>
                <button
                  className="text-red-400/50 hover:text-red-400 text-sm transition-colors"
                  onClick={() => {
                    const updated = [...data.skillGroups];
                    updated[gi] = { ...group, skills: group.skills.filter((_, idx) => idx !== si) };
                    onChange({ ...data, skillGroups: updated });
                  }}
                >✕</button>
              </div>
            ))}
          </div>

          <button
            className="mt-3 text-blue-400/60 hover:text-blue-400 text-xs transition-colors"
            onClick={() => {
              const updated = [...data.skillGroups];
              updated[gi] = { ...group, skills: [...group.skills, { name: "New Skill", level: 75 }] };
              onChange({ ...data, skillGroups: updated });
            }}
          >
            + Add skill
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Awards Tab ────────────────────────────────────────────────────────────────
function AwardsTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const update = (i: number, award: Award) => {
    const updated = [...data.awards];
    updated[i] = award;
    onChange({ ...data, awards: updated });
  };

  const add = () =>
    onChange({
      ...data,
      awards: [...data.awards, { title: "Award Title", subtitle: "Subtitle", org: "Organisation", color: "from-yellow-500 to-amber-400", icon: "🏆" }],
    });

  return (
    <div className="space-y-4">
      {data.awards.map((award, i) => (
        <div key={i} className="glass-card rounded-xl p-5 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Award Title" value={award.title} onChange={(v) => update(i, { ...award, title: v })} />
            <Field label="Subtitle" value={award.subtitle} onChange={(v) => update(i, { ...award, subtitle: v })} />
            <Field label="Organisation" value={award.org} onChange={(v) => update(i, { ...award, org: v })} />
            <Field label="Emoji Icon" value={award.icon} onChange={(v) => update(i, { ...award, icon: v })} />
          </div>
          <button
            onClick={() => onChange({ ...data, awards: data.awards.filter((_, idx) => idx !== i) })}
            className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
          >✕ Remove</button>
        </div>
      ))}
      <button
        onClick={add}
        className="w-full py-2.5 rounded-xl border border-dashed border-yellow-500/30 text-yellow-400/70 text-sm hover:bg-yellow-500/5 transition-all"
      >
        + Add Award
      </button>
    </div>
  );
}

// ── Education Tab ─────────────────────────────────────────────────────────────
function EducationTab({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const edu = data.education;
  const set = (key: keyof typeof edu, val: string) =>
    onChange({ ...data, education: { ...edu, [key]: val } });

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Education</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Degree" value={edu.degree} onChange={(v) => set("degree", v)} />
          <Field label="Institution" value={edu.institution} onChange={(v) => set("institution", v)} />
          <Field label="Period" value={edu.period} onChange={(v) => set("period", v)} />
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-3">
        <h3 className="text-white font-semibold">Languages</h3>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          value={data.languages.join(", ")}
          onChange={(e) =>
            onChange({ ...data, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
          placeholder="English, Tamil, ..."
        />
        <p className="text-slate-600 text-xs">Comma-separated list</p>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-3">
        <h3 className="text-white font-semibold">Domain Expertise</h3>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          rows={3}
          value={data.domainExpertise.join(", ")}
          onChange={(e) =>
            onChange({ ...data, domainExpertise: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
          placeholder="Digital Banking, FinTech, ..."
        />
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [tab, setTab] = useState<Tab>("personal");
  const [downloading, setDownloading] = useState<"docx" | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio_preview");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch { /* use default */ }
    }
  }, []);

  const downloadDocx = async () => {
    setDownloading("docx");
    const res = await fetch("/api/resume/docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personal.name.replace(/\s+/g, "_")}_Resume.docx`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(null);
  };

  const openPdfPreview = () => {
    localStorage.setItem("portfolio_preview", JSON.stringify(data));
    window.open("/resume", "_blank");
  };

  const exportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveToPreview = () => {
    localStorage.setItem("portfolio_preview", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!authed) return <AuthScreen onAuth={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "awards", label: "Awards" },
    { id: "education", label: "Education" },
  ];

  return (
    <div className="min-h-screen bg-[#050b18]">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[rgba(5,11,24,0.9)] nav-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
              BP
            </span>
            <div>
              <p className="text-white font-semibold text-sm">Admin Panel</p>
              <p className="text-slate-500 text-xs">Portfolio Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveToPreview}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                saved
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "glass-card text-slate-400 hover:text-white"
              }`}
            >
              {saved ? "✓ Saved to Preview" : "Save to Preview"}
            </button>
            <button
              onClick={exportJson}
              className="px-4 py-2 rounded-lg glass-card text-slate-400 hover:text-white text-xs font-medium transition-all"
            >
              Export JSON
            </button>
            <button
              onClick={openPdfPreview}
              className="px-4 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-all"
            >
              ⬇ PDF Preview
            </button>
            <button
              onClick={downloadDocx}
              disabled={downloading === "docx"}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              {downloading === "docx" ? "Generating…" : "⬇ Download DOCX"}
            </button>
            <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
              ← Portfolio
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 glass-card rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === "personal" && <PersonalTab data={data} onChange={setData} />}
          {tab === "experience" && <ExperienceTab data={data} onChange={setData} />}
          {tab === "skills" && <SkillsTab data={data} onChange={setData} />}
          {tab === "awards" && <AwardsTab data={data} onChange={setData} />}
          {tab === "education" && <EducationTab data={data} onChange={setData} />}
        </div>

        {/* Bottom action strip */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center">
          <p className="text-slate-600 text-xs">
            Changes are saved to browser storage. Export JSON to persist permanently in the codebase.
          </p>
          <div className="flex gap-3">
            <button onClick={openPdfPreview} className="px-5 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-sm font-semibold transition-all">
              Open PDF Preview
            </button>
            <button onClick={downloadDocx} disabled={downloading === "docx"} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {downloading === "docx" ? "Generating…" : "Download DOCX"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
