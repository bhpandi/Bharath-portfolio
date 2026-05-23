"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Link2, Send } from "lucide-react";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "baratfullstackengg@gmail.com",
    href: "mailto:baratfullstackengg@gmail.com",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Link2,
    label: "LinkedIn",
    value: "bharath-pandi-b758005a",
    href: "https://www.linkedin.com/in/bharath-pandi-b758005a",
    color: "from-blue-600 to-indigo-400",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Singapore, 530702",
    href: "#",
    color: "from-green-500 to-teal-400",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f22] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Let&apos;s Connect</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
            Open to senior technical leadership, delivery management, and strategic
            engineering roles in fintech, banking and enterprise software.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {contactLinks.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="glass-card rounded-2xl p-7 card-hover text-center group"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <c.icon size={22} className="text-white" />
              </div>
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{c.label}</p>
              <p className="text-slate-200 text-sm font-medium break-all">{c.value}</p>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <a
            href="mailto:baratfullstackengg@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 glow-blue"
          >
            <Send size={20} />
            Send a Message
          </a>
        </motion.div>
      </div>
    </section>
  );
}
