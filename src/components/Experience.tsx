"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    role: "Technical Delivery Lead",
    company: "UOB Singapore",
    vendor: "Optimum Solutions",
    period: "Jun 2023 – Present",
    location: "Singapore",
    color: "from-blue-500 to-cyan-400",
    badge: "Current",
    points: [
      "Technical Delivery Manager for UOB Infinity Digital Banking Application",
      "Delivered banking products across Singapore, China, Hong Kong & Malaysia — including soft token, scan & pay, push notifications, IAFT, IBFT, PayNow, Bulk Payroll, Telegraphic Transfer, MT101, FI, UOBPAY, DuitNow, FPX, FPS, CNAPS",
      "Lead & provide technical guidance and architecture solutions to the squad",
      "Collaborate with business and designers to finalise requirements and translate to development specifications",
      "Setup project scaffolding, enforce code quality as gatekeeper, lead sprint demos to Product Owner",
      "Hands-on in code reviews and deployment pipeline management",
    ],
  },
  {
    role: "Tribe Lead",
    company: "UOB Singapore",
    vendor: "The Boston Software Solutions International Pte Ltd",
    period: "Jan 2022 – Jun 2023",
    location: "Singapore",
    color: "from-purple-500 to-indigo-400",
    badge: "Leadership",
    points: [
      "Tribe Lead for UOB Infinity Digital Banking Application — Malaysia",
      "Managed 6 squads across parallel feature delivery tracks",
      "Responsible for release planning, estimation, goal-setting, delivery and all Scrum ceremonies",
      "Monitored progress, mitigated risks and cleared blockers with stakeholders",
      "Hired and mentored new developers; maintained a healthy, high-performance team culture",
      "Demonstrated sprint deliverables to Product Owners at each sprint review",
    ],
  },
  {
    role: "Senior Member of Technical Staff",
    company: "PayPal",
    vendor: "",
    period: "Nov 2014 – Dec 2018",
    location: "Chennai, India",
    color: "from-teal-500 to-green-400",
    badge: "FinTech",
    points: [
      "Technical Lead for the EMEA region in the PayPal MPP team",
      "Developed responsive UI prototypes using React.js, Dust.js, HTML5, CSS3, and JavaScript",
      "Maintained brand consistency and created engaging marketing campaigns across the EMEA region",
      "Automated unit testing with Node.js to significantly enhance deployment quality",
    ],
  },
  {
    role: "Associate Projects",
    company: "Cognizant Technology Solutions",
    vendor: "",
    period: "Jun 2012 – Nov 2014",
    location: "Bangalore, India",
    color: "from-orange-500 to-amber-400",
    badge: "E-Commerce",
    points: [
      "Module Lead for The Home Depot E-Commerce Portal — one of the largest US home improvement retailers",
      "Led sprint planning, resource allocation, and RESTful API development",
      "Conducted unit testing with QUnit and performed rigorous code reviews using Crucible",
    ],
  },
  {
    role: "Web Developer",
    company: "EC Software India PVT LTD",
    vendor: "",
    period: "Mar 2008 – Jun 2012",
    location: "Chennai, India",
    color: "from-rose-500 to-pink-400",
    badge: "Foundation",
    points: [
      "Developed and maintained Lifebutiken — a Swedish pharmaceutical e-commerce platform",
      "Created VBA macros for seamless API integrations",
      "Optimised UI performance, significantly improving user experience across the platform",
    ],
  },
];

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative grid md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-8 mb-8"
    >
      {/* Left side — even items */}
      <div className={`${index % 2 === 0 ? "block" : "hidden md:block"}`}>
        {index % 2 === 0 && <ExperienceCard exp={exp} />}
      </div>

      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full bg-gradient-to-br ${exp.color} shadow-lg mt-6 flex-shrink-0 relative`}
        >
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${exp.color} opacity-40 scale-[2] animate-ping`}
          />
        </div>
        <div className="w-px flex-1 timeline-line min-h-[40px] mt-1" />
      </div>

      {/* Right side — odd items */}
      <div className={`${index % 2 !== 0 ? "block" : "hidden md:block"}`}>
        {index % 2 !== 0 && <ExperienceCard exp={exp} />}
      </div>

      {/* Mobile: always show */}
      <div className="md:hidden col-span-full">
        {index % 2 === 0 ? null : <ExperienceCard exp={exp} />}
      </div>
    </motion.div>
  );
}

function ExperienceCard({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          <Briefcase size={18} className="text-white" />
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${exp.color} text-white shadow`}
        >
          {exp.badge}
        </span>
      </div>

      <h3 className="text-white font-bold text-lg leading-tight mb-1">{exp.role}</h3>
      <p className="text-slate-300 font-medium text-sm mb-1">{exp.company}</p>
      {exp.vendor && (
        <p className="text-slate-500 text-xs mb-3">{exp.vendor}</p>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <span className="flex items-center gap-1 text-slate-500 text-xs">
          <Calendar size={12} className="text-blue-400" />
          {exp.period}
        </span>
        <span className="flex items-center gap-1 text-slate-500 text-xs">
          <MapPin size={12} className="text-green-400" />
          {exp.location}
        </span>
      </div>

      <ul className="space-y-2">
        {exp.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-400 text-sm leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${exp.color} flex-shrink-0`} />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="experience" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b18] via-[#080f22] to-[#050b18] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Career Journey</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            16+ years delivering enterprise-scale solutions from Chennai to Singapore
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line" />

          {experiences.map((exp, i) => (
            <TimelineItem key={exp.company + exp.period} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
