"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Zap, Globe, Code2 } from "lucide-react";

const highlights = [
  {
    icon: Globe,
    color: "from-blue-500 to-cyan-400",
    title: "Global Reach",
    desc: "Delivered banking products across Singapore, China, Hong Kong, Malaysia and India",
  },
  {
    icon: Users,
    color: "from-purple-500 to-pink-400",
    title: "People Leader",
    desc: "Managed 6 squads, hiring, mentoring developers and maintaining healthy team culture",
  },
  {
    icon: Code2,
    color: "from-green-500 to-teal-400",
    title: "Full-Stack Architect",
    desc: "Expert in React, TypeScript, Node.js — architecting scalable frontend systems since 2008",
  },
  {
    icon: Zap,
    color: "from-orange-500 to-yellow-400",
    title: "Agile Delivery",
    desc: "Release planning, sprint ceremonies, stakeholder demos and CI/CD quality gating",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b18] via-[#080f20] to-[#050b18] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">About Me</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Building the future of{" "}
            <span className="gradient-text">Digital Banking</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              With{" "}
              <span className="text-blue-400 font-semibold">16+ years of experience</span>{" "}
              across Banking, FinTech, Retail, and E-Commerce, I specialise in
              translating complex business requirements into elegant, high-performance
              digital experiences.
            </p>
            <p className="text-slate-400 leading-relaxed mb-6">
              Currently driving the technical delivery of UOB Infinity — one of
              Southeast Asia&apos;s most feature-rich digital banking platforms —
              spanning payments like PayNow, SWIFT MT101, DuitNow, FPX, FPS,
              CNAPS, and more.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              My career spans industry leaders including{" "}
              <span className="text-white font-medium">PayPal</span>,{" "}
              <span className="text-white font-medium">Cognizant</span>, and{" "}
              <span className="text-white font-medium">UOB Singapore</span> — with
              a consistent track record of award-winning delivery and team excellence.
            </p>

            {/* Key domains */}
            <div className="flex flex-wrap gap-2">
              {[
                "Digital Banking",
                "Frontend Architecture",
                "Agile Delivery",
                "Payments",
                "CI/CD",
                "Team Leadership",
                "React.js",
                "TypeScript",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium glass-card text-slate-300 border-blue-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 card-hover"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <h.icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{h.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
