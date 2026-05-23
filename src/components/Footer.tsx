"use client";

import { motion } from "framer-motion";
import { Link2, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-10 px-6 border-t border-white/5 bg-[#050b18]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            BP
          </span>
          <span className="text-slate-500 text-sm">
            Bharath Pandi · Technical Delivery Manager
          </span>
        </div>

        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} · Built with Next.js & Framer Motion
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/bharath-pandi-b758005a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Link2 size={18} />
          </a>
          <a
            href="mailto:baratfullstackengg@gmail.com"
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Mail size={18} />
          </a>
          <motion.a
            href="#hero"
            whileHover={{ y: -2 }}
            className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-slate-500 hover:text-white transition-colors"
          >
            <ArrowUp size={16} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
