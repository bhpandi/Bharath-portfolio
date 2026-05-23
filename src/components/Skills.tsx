"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-slate-300 text-sm font-medium">{name}</span>
        <span className="text-slate-500 text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-sm`}
        />
      </div>
    </div>
  );
}

export default function Skills({ data = defaultPortfolioData }: { data?: PortfolioData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const activeGroups = (data.skillGroups ?? []).filter(
    (g) => g.skills.filter((s) => s.name.trim()).length > 0
  );
  const activeBadges = (data.techBadges ?? []).filter((b) => b.trim());

  if (activeGroups.length === 0 && activeBadges.length === 0) return null;

  return (
    <section id="skills" className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-[#080f22] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest">Technical Arsenal</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
        </motion.div>

        {activeGroups.length > 0 && (
          <div className={`grid gap-8 mb-16 ${activeGroups.length === 1 ? "md:grid-cols-1 max-w-lg mx-auto" : activeGroups.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {activeGroups.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + gi * 0.1 }}
                className="glass-card rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${group.color} shadow-lg`} />
                  <h3 className={`font-bold text-base bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}>
                    {group.category}
                  </h3>
                </div>
                {group.skills.filter((s) => s.name.trim()).map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={group.color}
                    delay={0.3 + gi * 0.1 + si * 0.06}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        )}

        {activeBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-6">Full Technology Stack</p>
            <div className="flex flex-wrap justify-center gap-3">
              {activeBadges.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.65 + i * 0.04 }}
                  className="px-4 py-2 rounded-xl glass-card text-sm font-medium text-slate-300 hover:text-white hover:border-blue-500/30 transition-all cursor-default card-hover"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
