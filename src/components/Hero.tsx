"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Mail, Link2, Globe, ChevronDown } from "lucide-react";
import DownloadResume from "./DownloadResume";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

function useTypingCycle(words: string[], pause = 1800) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 65);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words, pause]);

  return displayed;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random(),
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        p.a = 0.2 + 0.6 * Math.abs(Math.sin(Date.now() / 2000 + p.x));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas w-full h-full" />;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function Hero({ data = defaultPortfolioData }: { data?: PortfolioData }) {
  const { personal, stats } = data;
  const [imgError, setImgError] = useState(false);

  const typingWords = [
    personal.title || "Professional",
    ...(data.about.tags?.slice(0, 3) ?? []),
  ].filter(Boolean);

  const title = useTypingCycle(typingWords.length > 0 ? typingWords : ["Professional"]);

  const photoSrc = personal.photoUrl && !imgError ? personal.photoUrl : null;
  const initials = getInitials(personal.name || "P");
  const firstName = personal.name.split(" ")[0] || "Your";
  const lastName = personal.name.split(" ").slice(1).join(" ") || "Name";
  const activeStats = stats.filter((s) => s.value.trim());

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden animated-bg">
      <div className="absolute inset-0">
        <ParticleCanvas />
      </div>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative inline-block mb-6"
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-br from-blue-500 via-purple-500 to-teal-400 shadow-2xl mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0a1628] flex items-center justify-center">
              {photoSrc ? (
                <Image
                  src={photoSrc}
                  alt={personal.name || "Profile"}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover object-top"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold gradient-text">{initials}</span>
              )}
            </div>
          </div>
          {personal.available && (
            <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 rounded-full bg-green-400 border-2 border-[#050b18] shadow" />
          )}
        </motion.div>

        {/* Available badge */}
        {personal.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-ring" />
            Available for opportunities
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-5xl sm:text-7xl font-extrabold text-white mb-4 tracking-tight leading-none"
        >
          {firstName}{" "}
          <span className="gradient-text">{lastName}</span>
        </motion.h1>

        {/* Typing title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xl sm:text-2xl font-medium text-slate-400 mb-6 h-8 flex items-center justify-center gap-1"
        >
          <span className="gradient-text-gold">{title}</span>
          <span className="cursor-blink text-yellow-400 text-2xl">|</span>
        </motion.div>

        {/* Summary */}
        {personal.summary && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {personal.summary}
          </motion.p>
        )}

        {/* Contact chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 hover:text-white text-sm transition-all hover:border-blue-500/40">
              <Mail size={14} className="text-blue-400" />
              {personal.email}
            </a>
          )}
          {personal.location && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 text-sm">
              <MapPin size={14} className="text-green-400" />
              {personal.location.split(",")[0]}
            </span>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 hover:text-white text-sm transition-all hover:border-blue-500/40">
              <Link2 size={14} className="text-blue-400" />
              LinkedIn
            </a>
          )}
          {personal.github && (
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 hover:text-white text-sm transition-all hover:border-blue-500/40">
              <Link2 size={14} className="text-slate-400" />
              GitHub
            </a>
          )}
          {personal.website && (
            <a href={personal.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-slate-300 hover:text-white text-sm transition-all hover:border-blue-500/40">
              <Globe size={14} className="text-teal-400" />
              Website
            </a>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-wrap gap-4 justify-center mb-20"
        >
          <a href="#experience" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
            View Experience
          </a>
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="px-8 py-3 rounded-xl glass-card text-slate-300 hover:text-white font-semibold transition-all hover:border-white/20 hover:-translate-y-0.5">
              Get in Touch
            </a>
          )}
        </motion.div>

        {/* Resume download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center mb-8"
        >
          <DownloadResume />
        </motion.div>

        {/* Stats */}
        {activeStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {activeStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="glass-card rounded-2xl p-5 card-hover"
              >
                <div className="text-3xl font-extrabold gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} className="float-anim" />
      </motion.a>
    </section>
  );
}
