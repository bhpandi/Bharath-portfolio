"use client";

import { useEffect, useState } from "react";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

export default function ResumePage() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio_preview");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        /* use default */
      }
    }
  }, []);

  const { personal, experience, skillGroups, awards, education, languages } = data;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', Arial, sans-serif;
          background: #f5f5f5;
          color: #1a1a2e;
        }

        .resume {
          max-width: 860px;
          margin: 32px auto;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          overflow: hidden;
        }

        .resume-header {
          background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%);
          color: #fff;
          padding: 40px 48px 32px;
        }

        .resume-header h1 {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .resume-header .title {
          font-size: 16px;
          font-weight: 500;
          opacity: 0.85;
          margin-bottom: 18px;
        }

        .contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          opacity: 0.9;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .resume-body {
          padding: 36px 48px;
        }

        .section {
          margin-bottom: 28px;
        }

        .section-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #2563EB;
          border-bottom: 2px solid #2563EB;
          padding-bottom: 5px;
          margin-bottom: 16px;
        }

        .summary-text {
          font-size: 13.5px;
          line-height: 1.7;
          color: #444;
        }

        .exp-item {
          margin-bottom: 20px;
        }

        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3px;
        }

        .exp-role {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .exp-period {
          font-size: 12px;
          color: #888;
          white-space: nowrap;
          padding-top: 2px;
        }

        .exp-company {
          font-size: 13px;
          font-weight: 600;
          color: #2563EB;
          margin-bottom: 6px;
        }

        .exp-vendor {
          font-size: 12px;
          color: #888;
          font-style: italic;
        }

        .exp-location {
          font-size: 12px;
          color: #888;
          margin-left: 8px;
        }

        ul.points {
          list-style: none;
          padding-left: 0;
          margin-top: 6px;
        }

        ul.points li {
          font-size: 13px;
          line-height: 1.6;
          color: #555;
          padding-left: 14px;
          position: relative;
          margin-bottom: 3px;
        }

        ul.points li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #2563EB;
          font-size: 11px;
          top: 2px;
        }

        .skills-grid {
          display: grid;
          gap: 10px;
        }

        .skill-group {
          margin-bottom: 6px;
        }

        .skill-group-name {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 3px;
        }

        .skill-list {
          font-size: 13px;
          color: #555;
          line-height: 1.5;
        }

        .awards-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .award-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
        }

        .award-emoji { font-size: 16px; }

        .award-title {
          font-weight: 700;
          color: #1a1a2e;
        }

        .award-org {
          color: #2563EB;
          font-style: italic;
        }

        .edu-degree {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 3px;
        }

        .edu-details {
          font-size: 13px;
          color: #666;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .print-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          gap: 10px;
          z-index: 999;
        }

        .print-btn button {
          padding: 12px 22px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-pdf {
          background: #2563EB;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37,99,235,0.4);
        }

        .btn-pdf:hover { background: #1d4ed8; }

        .btn-close {
          background: #fff;
          color: #444;
          border: 1px solid #ddd !important;
        }

        @media print {
          body { background: #fff; }
          .resume { margin: 0; box-shadow: none; border-radius: 0; max-width: 100%; }
          .print-btn { display: none; }
          @page { margin: 1cm 1.2cm; }
        }
      `}</style>

      <div className="resume">
        {/* Header */}
        <div className="resume-header">
          <h1>{personal.name}</h1>
          <p className="title">{personal.title}</p>
          <div className="contact-row">
            <span className="contact-item">✉ {personal.email}</span>
            <span className="contact-item">📞 {personal.phone}</span>
            <span className="contact-item">📍 {personal.location}</span>
            <span className="contact-item">🔗 LinkedIn</span>
          </div>
        </div>

        {/* Body */}
        <div className="resume-body">
          {/* Summary */}
          <div className="section">
            <div className="section-title">Professional Summary</div>
            <p className="summary-text">{personal.summary}</p>
          </div>

          {/* Experience */}
          <div className="section">
            <div className="section-title">Work Experience</div>
            {experience.map((exp, i) => (
              <div key={i} className="exp-item">
                <div className="exp-header">
                  <span className="exp-role">{exp.role}</span>
                  <span className="exp-period">{exp.period}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                  <span className="exp-company">{exp.company}</span>
                  {exp.vendor && (
                    <span className="exp-vendor"> — {exp.vendor}</span>
                  )}
                  <span className="exp-location">• {exp.location}</span>
                </div>
                <ul className="points">
                  {exp.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="two-col">
            {/* Skills */}
            <div className="section">
              <div className="section-title">Skills & Technologies</div>
              <div className="skills-grid">
                {skillGroups.map((group, i) => (
                  <div key={i} className="skill-group">
                    <div className="skill-group-name">{group.category}</div>
                    <div className="skill-list">
                      {group.skills.map((s) => s.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: Education + Awards */}
            <div>
              <div className="section">
                <div className="section-title">Education</div>
                <div className="edu-degree">{education.degree}</div>
                <div className="edu-details">
                  {education.institution} · {education.period}
                </div>
              </div>

              <div className="section">
                <div className="section-title">Awards & Recognition</div>
                <div className="awards-list">
                  {awards.map((award, i) => (
                    <div key={i} className="award-item">
                      <span className="award-emoji">{award.icon}</span>
                      <div>
                        <span className="award-title">{award.title}</span>
                        <span style={{ color: "#888", fontSize: 12 }}> — {award.subtitle}</span>
                        <div className="award-org">{award.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-title">Languages</div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {languages.join(" · ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="print-btn">
        <button className="btn-close" onClick={() => window.close()}>
          ✕ Close
        </button>
        <button className="btn-pdf" onClick={() => window.print()}>
          ⬇ Save as PDF
        </button>
      </div>
    </>
  );
}
