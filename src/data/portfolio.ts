export interface Experience {
  role: string;
  company: string;
  vendor: string;
  period: string;
  location: string;
  color: string;
  badge: string;
  points: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  color: string;
  skills: Skill[];
}

export interface Award {
  title: string;
  subtitle: string;
  org: string;
  color: string;
  icon: string;
}

export interface Highlight {
  title: string;
  desc: string;
  color: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github?: string;
    website?: string;
    photoUrl?: string;
    summary: string;
    available: boolean;
  };
  stats: { value: string; label: string }[];
  about: {
    description1: string;
    description2: string;
    description3: string;
    tags: string[];
    highlights?: Highlight[];
  };
  experience: Experience[];
  skillGroups: SkillGroup[];
  techBadges: string[];
  awards: Award[];
  education: {
    degree: string;
    institution: string;
    period: string;
    color: string;
  };
  languages: string[];
  domainExpertise: string[];
}

export const defaultPortfolioData: PortfolioData = {
  personal: {
    name: "Bharath Pandi",
    title: "Technical Delivery Manager",
    email: "baratfullstackengg@gmail.com",
    phone: "+65 828-346-58",
    location: "Singapore, 530702",
    linkedin: "https://www.linkedin.com/in/bharath-pandi-b758005a",
    github: "",
    website: "",
    photoUrl: "/profile-avatar.png",
    summary:
      "Over a decade architecting enterprise-scale digital banking solutions across Singapore, Malaysia & beyond — bridging business vision with cutting-edge frontend engineering.",
    available: true,
  },
  stats: [
    { value: "16+", label: "Years Experience" },
    { value: "5", label: "Countries Served" },
    { value: "10+", label: "Banking Products" },
    { value: "6", label: "Squads Led" },
  ],
  about: {
    description1:
      "With 16+ years of experience across Banking, FinTech, Retail, and E-Commerce, I specialise in translating complex business requirements into elegant, high-performance digital experiences.",
    description2:
      "Currently driving the technical delivery of UOB Infinity — one of Southeast Asia's most feature-rich digital banking platforms — spanning payments like PayNow, SWIFT MT101, DuitNow, FPX, FPS, CNAPS, CBPR+, and more.",
    description3:
      "My career spans industry leaders including PayPal, Cognizant, and UOB Singapore — with a consistent track record of award-winning delivery and team excellence.",
    tags: [
      "Digital Banking",
      "Frontend Architecture",
      "Agile Delivery",
      "Payments",
      "CI/CD",
      "Team Leadership",
      "React.js",
      "TypeScript",
    ],
    highlights: [
      {
        title: "Global Reach",
        desc: "Delivered banking products across Singapore, China, Hong Kong, Malaysia and India",
        color: "from-blue-500 to-cyan-400",
      },
      {
        title: "People Leader",
        desc: "Managed 6 squads, hiring, mentoring developers and maintaining healthy team culture",
        color: "from-purple-500 to-pink-400",
      },
      {
        title: "Full-Stack Architect",
        desc: "Expert in React, TypeScript, Node.js — architecting scalable frontend systems since 2008",
        color: "from-green-500 to-teal-400",
      },
      {
        title: "Agile Delivery",
        desc: "Release planning, sprint ceremonies, stakeholder demos and CI/CD quality gating",
        color: "from-orange-500 to-yellow-400",
      },
    ],
  },
  experience: [
    {
      role: "Technical Delivery Manager",
      company: "UOB Singapore",
      vendor: "",
      period: "Jun 2023 – Present",
      location: "Singapore",
      color: "from-blue-500 to-cyan-400",
      badge: "Current",
      points: [
        "Technical Delivery Manager in Infinity Digital Banking Application",
        "Worked on Singapore, China, Hong Kong, Malaysia banking products including soft token, scan and pay, push notifications, IAFT, IBFT, PayNow, Bulk Payroll, Telegraphic Transfer, MT101, FI, UOBPAY, DuitNow Transfers, DuitNow Collections, FPX, FPS, CNAPS payments, CBPR+",
        "Lead & assist in providing technical guidance and architecture solutions to the team",
        "Working with business and designers for the finalisation of requirements",
        "Analyse and interpret business and design requirements to functional and development specification",
        "Work as part of the squad and deliver in agile model",
        "Setup the project and ensure the code quality as a gatekeeper",
        "Demo the sprint items to the PO at the end of each sprint",
        "Involved in code review and the deployment process",
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
        "Tribe Lead for UOB Infinity Digital Banking application Malaysia",
        "Managing 6 squads",
        "Responsible for release planning, estimation, setting goals, delivery and scrum ceremonies",
        "Monitoring the progress throughout the development process, mitigating the risk and clearing the blockers along with the stakeholders",
        "Responsible for demonstrating the sprint items to the POs at the end of each sprint",
        "Hiring and mentoring new developers",
        "Creating and maintaining the healthy work environment",
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
        "Maintained brand consistency and created engaging marketing campaigns",
        "Automated unit testing with Node.js to enhance deployment quality",
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
        "Module Lead for The Home Depot E-Commerce Portal",
        "Led sprint planning, resource allocation, and REST API development",
        "Conducted unit testing with QUnit and reviewed code using Crucible",
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
        "Developed and maintained Lifebutiken (Swedish pharmaceuticals e-commerce platform)",
        "Created VBA macros for API integrations and optimized UI performance",
      ],
    },
  ],
  skillGroups: [
    {
      category: "Frontend",
      color: "from-blue-500 to-cyan-400",
      skills: [
        { name: "React.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "JavaScript (ES6+)", level: 95 },
        { name: "HTML5 / CSS3", level: 95 },
        { name: "Redux", level: 85 },
        { name: "Jest / React Testing Library", level: 80 },
        { name: "Formik", level: 80 },
      ],
    },
    {
      category: "Backend & DevOps",
      color: "from-purple-500 to-indigo-400",
      skills: [
        { name: "Node.js", level: 80 },
        { name: "AWS", level: 70 },
        { name: "Jenkins / CI/CD", level: 80 },
        { name: "GitHub / BitBucket", level: 90 },
        { name: "REST APIs", level: 85 },
      ],
    },
    {
      category: "Leadership & Delivery",
      color: "from-teal-500 to-green-400",
      skills: [
        { name: "Agile / Scrum", level: 95 },
        { name: "Technical Architecture", level: 90 },
        { name: "Code Review & Quality", level: 95 },
        { name: "Release Management", level: 90 },
        { name: "Team Mentoring", level: 88 },
      ],
    },
  ],
  techBadges: [
    "React.js", "TypeScript", "JavaScript", "Node.js", "Redux",
    "HTML5", "CSS3", "AWS", "Jest", "Formik",
    "GitHub", "Jenkins", "Agile", "Scrum", "CI/CD",
    "REST API", "BitBucket", "React Testing Library",
  ],
  awards: [
    {
      title: "Team Innovation Award",
      subtitle: "Payment Transformation",
      org: "UOB Singapore",
      color: "from-yellow-500 to-amber-400",
      icon: "🏆",
    },
    {
      title: "Monthly Award",
      subtitle: "Excellence in Delivery",
      org: "Cognizant Technology Solutions",
      color: "from-blue-500 to-cyan-400",
      icon: "🏆",
    },
    {
      title: "Quarterly Award",
      subtitle: "Outstanding Performance",
      org: "NESS Technologies",
      color: "from-purple-500 to-pink-400",
      icon: "🏆",
    },
  ],
  education: {
    degree: "Bachelor of Engineering — Computer Science",
    institution: "Anna University, Chennai",
    period: "2002 – 2006",
    color: "from-teal-500 to-green-400",
  },
  languages: ["English", "Tamil"],
  domainExpertise: [
    "Digital Banking",
    "FinTech",
    "E-Commerce",
    "Payments",
    "CMS",
    "Marketing Tech",
    "Pharma E-Commerce",
  ],
};

export const emptyPortfolioData: PortfolioData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    photoUrl: "",
    summary: "",
    available: true,
  },
  stats: [
    { value: "", label: "Years Experience" },
    { value: "", label: "Projects Delivered" },
    { value: "", label: "Teams Led" },
    { value: "", label: "Technologies" },
  ],
  about: {
    description1: "",
    description2: "",
    description3: "",
    tags: [],
    highlights: [
      { title: "Your Strength 1", desc: "Describe a key strength or achievement here.", color: "from-blue-500 to-cyan-400" },
      { title: "Your Strength 2", desc: "Describe another key strength or achievement here.", color: "from-purple-500 to-pink-400" },
      { title: "Your Strength 3", desc: "Describe a third strength or achievement here.", color: "from-green-500 to-teal-400" },
      { title: "Your Strength 4", desc: "Describe a fourth strength or achievement here.", color: "from-orange-500 to-yellow-400" },
    ],
  },
  experience: [],
  skillGroups: [],
  techBadges: [],
  awards: [],
  education: {
    degree: "",
    institution: "",
    period: "",
    color: "from-teal-500 to-green-400",
  },
  languages: [],
  domainExpertise: [],
};
