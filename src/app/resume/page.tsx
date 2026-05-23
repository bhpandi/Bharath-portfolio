"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";
import { Suspense } from "react";

type Style = "classic" | "modern" | "minimal";

function ResumeContent() {
  const params = useSearchParams();
  const styleParam = (params.get("style") ?? "classic") as Style;
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [style, setStyle] = useState<Style>(styleParam);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio_preview");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.data) setData(parsed.data);
        else setData(parsed);
        if (parsed.style) setStyle(parsed.style);
      } catch { /* use default */ }
    }
    // Also fetch published data if no preview
    else {
      fetch("/api/portfolio-data").then((r) => r.json()).then(setData).catch(() => {});
    }
  }, []);

  const { personal, experience, skillGroups, awards, education, languages } = data;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0f0; }

        /* ── CLASSIC ── */
        .resume.classic { font-family: 'Inter', sans-serif; max-width: 860px; margin: 32px auto; background: #fff; border-radius: 6px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); overflow: hidden; }
        .classic .resume-header { background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%); color: #fff; padding: 40px 48px 32px; }
        .classic .resume-header h1 { font-size: 36px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
        .classic .resume-header .title { font-size: 16px; font-weight: 500; opacity: 0.85; margin-bottom: 18px; }
        .classic .contact-row { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; opacity: 0.9; }
        .classic .resume-body { padding: 36px 48px; }
        .classic .section { margin-bottom: 28px; }
        .classic .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 5px; margin-bottom: 16px; }
        .classic .exp-role { font-size: 15px; font-weight: 700; color: #1a1a2e; }
        .classic .exp-period { font-size: 12px; color: #888; }
        .classic .exp-company { font-size: 13px; font-weight: 600; color: #2563EB; }
        .classic .exp-meta { font-size: 12px; color: #888; }
        .classic ul.points li::before { content: '▸'; color: #2563EB; }

        /* ── MODERN ── */
        .resume.modern { font-family: 'Inter', sans-serif; max-width: 860px; margin: 32px auto; background: #fff; border-radius: 6px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow: hidden; }
        .modern .resume-header { background: linear-gradient(135deg, #1E1B4B 0%, #4C1D95 100%); padding: 44px 48px 36px; }
        .modern .resume-header h1 { font-size: 40px; font-weight: 800; color: #fff; letter-spacing: -1px; margin-bottom: 6px; }
        .modern .resume-header .title { font-size: 17px; color: #C4B5FD; font-weight: 500; margin-bottom: 18px; }
        .modern .contact-row { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #A5B4FC; }
        .modern .resume-body { padding: 32px 48px; display: grid; grid-template-columns: 1fr 280px; gap: 36px; }
        .modern .main-col {}
        .modern .side-col {}
        .modern .section { margin-bottom: 24px; }
        .modern .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: #6D28D9; padding-bottom: 5px; border-bottom: 2px solid #6D28D9; margin-bottom: 14px; }
        .modern .exp-role { font-size: 14px; font-weight: 700; color: #1E1B4B; }
        .modern .exp-period { font-size: 11px; color: #9CA3AF; }
        .modern .exp-company { font-size: 12px; font-weight: 600; color: #6D28D9; }
        .modern .exp-meta { font-size: 11px; color: #9CA3AF; }
        .modern ul.points li::before { content: '▸'; color: #6D28D9; }
        .modern .skill-bar { height: 4px; background: #EDE9FE; border-radius: 2px; margin-top: 4px; }
        .modern .skill-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(to right, #6D28D9, #A78BFA); }

        /* ── MINIMAL ── */
        .resume.minimal { font-family: 'Playfair Display', Georgia, serif; max-width: 820px; margin: 32px auto; background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,0.07); }
        .minimal .resume-header { padding: 52px 60px 24px; border-bottom: 2px solid #111; }
        .minimal .resume-header h1 { font-size: 48px; font-weight: 700; color: #111; letter-spacing: -1px; margin-bottom: 6px; }
        .minimal .resume-header .title { font-size: 18px; color: #666; font-style: italic; margin-bottom: 14px; font-weight: 400; }
        .minimal .contact-row { display: flex; flex-wrap: wrap; gap: 20px; font-size: 12px; color: #888; font-family: 'Inter', sans-serif; }
        .minimal .resume-body { padding: 36px 60px 52px; }
        .minimal .section { margin-bottom: 32px; }
        .minimal .section-title { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 16px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
        .minimal .exp-role { font-size: 16px; font-weight: 700; color: #111; }
        .minimal .exp-period { font-size: 12px; color: #888; font-family: 'Inter', sans-serif; }
        .minimal .exp-company { font-size: 13px; font-style: italic; color: #555; font-family: 'Inter', sans-serif; }
        .minimal .exp-meta { font-size: 12px; color: #888; font-family: 'Inter', sans-serif; }
        .minimal ul.points { font-family: 'Inter', sans-serif; }
        .minimal ul.points li::before { content: '–'; color: #999; }

        /* ── Shared ── */
        .summary-text { font-size: 13.5px; line-height: 1.7; color: #444; }
        .modern .summary-text, .minimal .summary-text { font-size: 13.5px; }
        .exp-item { margin-bottom: 20px; }
        .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; }
        .exp-info { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
        ul.points { list-style: none; padding-left: 0; margin-top: 6px; }
        ul.points li { font-size: 12.5px; line-height: 1.6; color: #555; padding-left: 14px; position: relative; margin-bottom: 3px; }
        ul.points li::before { position: absolute; left: 0; font-size: 11px; top: 2px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .edu-degree { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px; }
        .edu-details { font-size: 13px; color: #666; font-style: italic; }
        .award-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 13px; }
        .award-title { font-weight: 700; color: #1a1a2e; }
        .award-org { font-size: 12px; color: #888; font-style: italic; }

        .style-switcher { position: fixed; top: 24px; right: 24px; display: flex; gap: 6px; z-index: 999; }
        .style-btn { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid #ccc; background: #fff; color: #333; transition: all 0.15s; }
        .style-btn.active { background: #1E3A5F; color: #fff; border-color: transparent; }
        .modern .style-btn.active { background: #4C1D95; }
        .minimal .style-btn.active { background: #111; }

        .print-btn { position: fixed; bottom: 28px; right: 28px; display: flex; gap: 8px; z-index: 999; }
        .btn-pdf { padding: 11px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; border: none; background: #2563EB; color: #fff; }
        .modern .btn-pdf, button.btn-pdf { background: #6D28D9; }
        .btn-close { padding: 11px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; background: #fff; color: #444; border: 1px solid #ddd; }

        @media print {
          body { background: #fff; }
          .resume { margin: 0; box-shadow: none; border-radius: 0; max-width: 100%; }
          .modern .resume-body { display: grid; }
          .print-btn, .style-switcher { display: none; }
          @page { margin: 0.8cm 1cm; }
        }
      `}</style>

      {/* Style switcher */}
      <div className="style-switcher">
        {(["classic", "modern", "minimal"] as Style[]).map((s) => (
          <button key={s} className={`style-btn ${style === s ? "active" : ""}`} onClick={() => setStyle(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className={`resume ${style}`}>
        {/* Header */}
        <div className="resume-header">
          <h1>{personal.name}</h1>
          <p className="title">{personal.title}</p>
          <div className="contact-row">
            <span>✉ {personal.email}</span>
            <span>📞 {personal.phone}</span>
            <span>📍 {personal.location}</span>
            <span>🔗 LinkedIn</span>
          </div>
        </div>

        {/* Body */}
        {style === "modern" ? (
          <div className="resume-body">
            {/* Main column */}
            <div className="main-col">
              <div className="section">
                <div className="section-title">Professional Summary</div>
                <p className="summary-text">{personal.summary}</p>
              </div>
              <div className="section">
                <div className="section-title">Work Experience</div>
                {experience.map((exp, i) => (
                  <div key={i} className="exp-item">
                    <div className="exp-header">
                      <span className="exp-role">{exp.role}</span>
                      <span className="exp-period">{exp.period}</span>
                    </div>
                    <div className="exp-info">
                      <span className="exp-company">{exp.company}</span>
                      {exp.vendor && <span className="exp-meta">· {exp.vendor}</span>}
                      <span className="exp-meta">· {exp.location}</span>
                    </div>
                    <ul className="points">{exp.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
            {/* Side column */}
            <div className="side-col">
              <div className="section">
                <div className="section-title">Skills</div>
                {skillGroups.map((g, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4C1D95", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{g.category}</div>
                    {g.skills.map((s, j) => (
                      <div key={j} style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#374151" }}>
                          <span>{s.name}</span><span style={{ color: "#9CA3AF" }}>{s.level}%</span>
                        </div>
                        <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${s.level}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="section">
                <div className="section-title">Education</div>
                <div className="edu-degree">{education.degree}</div>
                <div className="edu-details">{education.institution} · {education.period}</div>
              </div>
              <div className="section">
                <div className="section-title">Awards</div>
                {awards.map((a, i) => (
                  <div key={i} className="award-item">
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    <div><div className="award-title">{a.title}</div><div className="award-org">{a.org}</div></div>
                  </div>
                ))}
              </div>
              <div className="section">
                <div className="section-title">Languages</div>
                <div style={{ fontSize: 13, color: "#555" }}>{languages.join(" · ")}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="resume-body">
            <div className="section">
              <div className="section-title">Professional Summary</div>
              <p className="summary-text">{personal.summary}</p>
            </div>
            <div className="section">
              <div className="section-title">Work Experience</div>
              {experience.map((exp, i) => (
                <div key={i} className="exp-item">
                  <div className="exp-header">
                    <span className="exp-role">{exp.role}</span>
                    <span className="exp-period">{exp.period}</span>
                  </div>
                  <div className="exp-info">
                    <span className="exp-company">{exp.company}</span>
                    {exp.vendor && <span className="exp-meta">— {exp.vendor}</span>}
                    <span className="exp-meta">· {exp.location}</span>
                  </div>
                  <ul className="points">{exp.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="two-col">
              <div className="section">
                <div className="section-title">Skills & Technologies</div>
                {skillGroups.map((g, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 }}>{g.category}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{g.skills.map((s) => s.name).join(" · ")}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="section">
                  <div className="section-title">Education</div>
                  <div className="edu-degree">{education.degree}</div>
                  <div className="edu-details">{education.institution} · {education.period}</div>
                </div>
                <div className="section">
                  <div className="section-title">Awards & Recognition</div>
                  {awards.map((a, i) => (
                    <div key={i} className="award-item">
                      <span style={{ fontSize: 14 }}>{a.icon}</span>
                      <div><div className="award-title">{a.title} — <span style={{ fontWeight: 400, color: "#666" }}>{a.subtitle}</span></div><div className="award-org">{a.org}</div></div>
                    </div>
                  ))}
                </div>
                <div className="section">
                  <div className="section-title">Languages</div>
                  <div style={{ fontSize: 13, color: "#555" }}>{languages.join(" · ")}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="print-btn">
        <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
        <button className="btn-pdf" onClick={() => window.print()}>⬇ Save as PDF</button>
      </div>
    </>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Loading resume…</div>}>
      <ResumeContent />
    </Suspense>
  );
}
