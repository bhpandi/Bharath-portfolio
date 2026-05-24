import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PortfolioKit — Professional Portfolio & Resume Builder",
  description: "A premium Next.js portfolio template with a built-in content dashboard, live publish, DOCX/PDF resume download in 3 styles. Deploy on Vercel in minutes.",
};

const FEATURES = [
  {
    icon: "⚡",
    title: "One-Click Deploy",
    desc: "Deploy your portfolio to Vercel in under 2 minutes. No server setup, no DevOps required.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: "🎨",
    title: "Visual Dashboard",
    desc: "Edit every section — profile, experience, skills, awards — through a polished password-protected dashboard.",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: "🚀",
    title: "Publish Live Instantly",
    desc: "Hit Publish and your changes go live on your portfolio immediately — no rebuild required.",
    color: "from-green-500 to-teal-400",
  },
  {
    icon: "📄",
    title: "3 Resume Styles",
    desc: "Download your resume as DOCX or PDF in Classic, Modern, or Minimal styles — all generated from your live data.",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: "✏️",
    title: "Fully Editable",
    desc: "Every word, every section, every skill — completely editable through your dashboard. No code changes needed.",
    color: "from-teal-500 to-green-400",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    desc: "Dashboard protected by a password you control. Content served from Vercel's global CDN.",
    color: "from-rose-500 to-pink-400",
  },
];

const SECTIONS = [
  { icon: "👤", name: "Hero & Profile", desc: "Photo, name, title, social links, stats" },
  { icon: "💬", name: "About", desc: "Bio paragraphs, expertise tags, highlight cards" },
  { icon: "💼", name: "Experience", desc: "Timeline with roles, responsibilities, reorderable" },
  { icon: "⚙️", name: "Skills", desc: "Skill bars by category, tech badge cloud" },
  { icon: "🏆", name: "Awards", desc: "Recognition, education, languages, domains" },
  { icon: "📬", name: "Contact", desc: "Email, LinkedIn, location with CTA button" },
];

const RESUME_STYLES = [
  {
    name: "Classic",
    desc: "Blue gradient header, clean single-column. The go-to for corporate and enterprise roles.",
    color: "from-blue-600 to-blue-400",
    badge: "Most Popular",
  },
  {
    name: "Modern",
    desc: "Dark purple header with a two-column sidebar for skills. Bold and contemporary.",
    color: "from-purple-600 to-indigo-400",
    badge: "Stand Out",
  },
  {
    name: "Minimal",
    desc: "Serif typography, clean dividers, understated elegance. Perfect for creative roles.",
    color: "from-slate-500 to-slate-400",
    badge: "Timeless",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Deploy to Vercel", desc: "Click Deploy, connect your GitHub, and your portfolio is live in under 2 minutes." },
  { step: "02", title: "Fill in your content", desc: "Open your dashboard, create your account, and fill in your profile, experience, and skills." },
  { step: "03", title: "Publish & share", desc: "Hit Publish and your portfolio updates instantly. Share the URL with confidence." },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[rgba(5,11,24,0.92)] backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow">PK</div>
            <span className="text-white font-bold">PortfolioKit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">Live Demo →</Link>
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB/portfolio-bharath"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
            >
              Deploy Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Next.js · Vercel · TypeScript · Tailwind
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight">
            Your entire career,<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">beautifully presented.</span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium portfolio template with a built-in content dashboard, live publishing, and professional resume download in 3 styles. Deploy on Vercel in minutes.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB/portfolio-bharath"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              ▲ Deploy on Vercel — Free
            </a>
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold text-lg transition-all hover:border-white/20 hover:-translate-y-0.5"
            >
              View Live Demo →
            </Link>
          </div>

          <p className="text-slate-600 text-sm mt-6">Free to deploy · One-time setup · Your data, your domain</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#080f22]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Why PortfolioKit</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">Everything you need, nothing you don&apos;t</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white/3 border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Sections Included</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">A complete portfolio, out of the box</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((s) => (
              <div key={s.name} className="bg-white/3 border border-white/5 rounded-xl p-5 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div>
                  <h4 className="text-white font-semibold">{s.name}</h4>
                  <p className="text-slate-500 text-sm mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume styles */}
      <section className="py-24 px-6 bg-[#080f22]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest">Resume Download</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">3 professional resume styles</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Download as DOCX or print to PDF. All styles generated from your portfolio data — always in sync.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {RESUME_STYLES.map((rs) => (
              <div key={rs.name} className="bg-white/3 border border-white/5 rounded-2xl p-7 text-center hover:border-white/10 transition-all">
                <div className={`w-16 h-20 rounded-xl bg-gradient-to-br ${rs.color} mx-auto mb-5 flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-2xl">📄</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${rs.color} text-white mb-3 inline-block`}>{rs.badge}</span>
                <h3 className="text-white font-bold text-xl mb-2">{rs.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{rs.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Getting Started</span>
            <h2 className="text-4xl font-extrabold text-white mt-3">Live in 3 steps</h2>
          </div>
          <div className="space-y-6">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="flex items-start gap-6 bg-white/3 border border-white/5 rounded-2xl p-7">
                <div className="text-5xl font-extrabold bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent flex-shrink-0 leading-none">{h.step}</div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{h.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 px-6 bg-[#080f22]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm uppercase tracking-widest mb-8">Built with</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Next.js 16", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel Blob", "docx npm"].map((t) => (
              <span key={t} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-purple-600/5 to-teal-600/8 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to stand out?
          </h2>
          <p className="text-slate-400 text-lg mb-10">Deploy your professional portfolio in minutes. No monthly fees, no lock-in.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB/portfolio-bharath"
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              ▲ Deploy on Vercel
            </a>
            <Link href="/" className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold text-xl transition-all hover:border-white/20 hover:-translate-y-1">
              See Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs">PK</div>
          <span className="text-slate-400 text-sm font-semibold">PortfolioKit</span>
        </div>
        <p className="text-slate-600 text-xs">Built with Next.js & deployed on Vercel</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Live Demo</Link>
          <Link href="/admin" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Dashboard</Link>
          <Link href="/resume" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Resume</Link>
        </div>
      </footer>
    </div>
  );
}
