"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, GraduationCap } from "lucide-react";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

export default function Awards({ data = defaultPortfolioData }: { data?: PortfolioData }) {
  const { awards, education, languages, domainExpertise } = data;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const hasAwards = awards.length > 0;
  const hasEducation = education.degree.trim() || education.institution.trim();
  const hasLanguages = languages.length > 0;
  const hasDomains = domainExpertise.length > 0;

  if (!hasAwards && !hasEducation && !hasLanguages && !hasDomains) return null;

  return (
    <section id="awards" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080f22] to-[#050b18] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Recognition</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
            Awards & <span className="gradient-text-gold">Education</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Awards */}
          {hasAwards && (
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center shadow-lg">
                  <Trophy size={18} className="text-white" />
                </div>
                <h3 className="text-white text-xl font-bold">Awards & Recognition</h3>
              </motion.div>

              <div className="space-y-4">
                {awards.map((award, i) => (
                  <motion.div
                    key={award.title + award.org}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="glass-card rounded-2xl p-6 card-hover flex items-start gap-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center flex-shrink-0 shadow-lg text-xl`}>
                      {award.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{award.title}</h4>
                      <p className="text-slate-400 text-sm mt-0.5">{award.subtitle}</p>
                      <span className={`mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${award.color} text-white`}>
                        {award.org}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Education + Languages + Domains */}
          <div className="space-y-8">
            {hasEducation && (
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-green-400 flex items-center justify-center shadow-lg">
                    <GraduationCap size={18} className="text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold">Education</h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 }}
                  className="glass-card rounded-2xl p-7 card-hover"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${education.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">{education.degree}</h4>
                  <p className="text-slate-300 text-sm mb-1">{education.institution}</p>
                  <p className="text-slate-500 text-sm">{education.period}</p>
                </motion.div>
              </div>
            )}

            {hasLanguages && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.45 }}
                className="glass-card rounded-2xl p-7"
              >
                <h3 className="text-white font-bold text-lg mb-5">Languages</h3>
                <div className="flex flex-wrap gap-4">
                  {languages.map((lang) => (
                    <div key={lang} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                      <span className="text-slate-300 font-medium">{lang}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {hasDomains && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.55 }}
                className="glass-card rounded-2xl p-7"
              >
                <h3 className="text-white font-bold text-lg mb-5">Domain Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {domainExpertise.map((domain) => (
                    <span key={domain} className="px-3 py-1.5 rounded-xl text-sm font-medium glass-card text-slate-300">
                      {domain}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
