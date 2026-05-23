"use client";

import { useState } from "react";

export default function DownloadResume() {
  const [downloading, setDownloading] = useState(false);

  const downloadDocx = async () => {
    setDownloading(true);
    const res = await fetch("/api/resume/docx");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bharath_Pandi_Resume.docx";
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const openPdf = () => window.open("/resume", "_blank");

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={openPdf}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
      >
        <span>⬇</span> PDF Resume
      </button>
      <button
        onClick={downloadDocx}
        disabled={downloading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-60"
      >
        <span>⬇</span> {downloading ? "Generating…" : "DOCX Resume"}
      </button>
    </div>
  );
}
