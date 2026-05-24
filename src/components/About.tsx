"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users, Code2, Zap, Star, Layers, Target, Rocket } from "lucide-react";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

const ICON_CYCLE = [Globe, Users, Code2, Zap, Star, Layers, Target, Rocket];

export default function About({ data = defaultPortfolioData }: { data?: PortfolioData }) {
  const { about } = data;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = about.highlights ?? [];
  const tags = about.tags ?? [];
  const hasContent = about.description1 || about.description2 || about.description3 || tags.length > 0;

  if (!hasContent && highlights.length === 0) return null;

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b18] via-[#080f20] to-[#050b18] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">About Me</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
            Who I <span className="gradient-text">Am</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          {hasContent && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {about.description1 && (
                <p className="text-slate-300 text-lg leading-relaxed mb-6">{about.description1}</p>
              )}
              {about.description2 && (
                <p className="text-slate-400 leading-relaxed mb-6">{about.description2}</p>
              )}
              {about.description3 && (
                <p className="text-slate-400 leading-relaxed mb-8">{about.description3}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium glass-card text-slate-300 border-blue-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Highlight cards */}
          {highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {highlights.slice(0, 4).map((h, i) => {
                const Icon = ICON_CYCLE[i % ICON_CYCLE.length];
                return (
                  <motion.div
                    key={h.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="glass-card rounded-2xl p-6 card-hover"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{h.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
