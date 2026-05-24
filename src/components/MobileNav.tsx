"use client";

import { useState, useEffect } from "react";
import { Home, User, Briefcase, Code2, Trophy, Mail } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "#hero" },
  { icon: User, label: "About", href: "#about" },
  { icon: Briefcase, label: "Work", href: "#experience" },
  { icon: Code2, label: "Skills", href: "#skills" },
  { icon: Trophy, label: "Awards", href: "#awards" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

export default function MobileNav() {
  const [active, setActive] = useState("#hero");
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Hide nav when scrolling down fast, show when scrolling up
      setVisible(y < lastScroll || y < 80);
      setLastScroll(y);

      // Determine active section
      const sections = ["hero", "about", "experience", "skills", "awards", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${sections[i]}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  const handleClick = (href: string) => {
    setActive(href);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`
        md:hidden fixed bottom-0 inset-x-0 z-50 transition-transform duration-300
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[rgba(5,11,24,0.92)] border-t border-white/8 backdrop-blur-xl" />

      <div className="relative flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = active === href;
          return (
            <button
              key={href}
              onClick={() => handleClick(href)}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl
                transition-all duration-200 min-w-[48px]
                ${isActive
                  ? "text-blue-400"
                  : "text-slate-600 hover:text-slate-300 active:text-white"
                }
              `}
              aria-label={label}
            >
              <div className="relative">
                {isActive && (
                  <span className="absolute -inset-1.5 rounded-lg bg-blue-500/15" />
                )}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="relative"
                />
              </div>
              <span
                className={`text-[10px] font-medium leading-none transition-all ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
