export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'Production' | 'Featured' | 'In Development' | 'Prototype';
  stationId: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  items: { name: string; level: number; highlight?: boolean }[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  description: string;
  modules: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description: string;
  topics: string[];
}

export interface ToolItem {
  name: string;
  category: string;
  description: string;
  level: string;
  highlight?: boolean;
}

export interface BlogPostItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tags: string[];
  link?: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Kamanashis Biswas",
    shortName: "KB",
    title: "Full-Stack Web Developer",
    specialization: "MERN Stack • Next.js • TypeScript Architect",
    location: "Khulna, Bangladesh",
    email: "kamanashisbiswas007@gmail.com",
    portfolioUrl: "https://www.kamanashisbiswas.com/",
    githubUrl: "https://github.com/kamanashisbiswas007",
    linkedinUrl: "https://www.linkedin.com/in/kamanashisbiswas",
    bio: "Full-Stack Web Developer passionate about building robust, high-performance, and scalable digital solutions. With expertise across modern frontend ecosystems (React, Next.js, TypeScript) and backend microservices (Node.js, Express, PostgreSQL, MongoDB, Prisma), I bridge cinematic visual aesthetics with resilient software engineering.",
    stats: [
      { label: "Core Stacks", value: "MERN + Next.js" },
      { label: "Architecture", value: "Clean & Scalable" },
      { label: "Degree Focus", value: "Software Engg. & ICT" },
      { label: "Status", value: "Available for Projects" }
    ],
    summaryPillars: [
      {
        title: "Frontend Engineering",
        desc: "Creating responsive, component-driven user interfaces using Next.js App Router, React 19, TypeScript, Tailwind CSS, and Framer Motion."
      },
      {
        title: "Backend & Database",
        desc: "Designing secure RESTful APIs, relational databases with PostgreSQL & Prisma, and document stores with MongoDB & Mongoose."
      },
      {
        title: "System Design & UX",
        desc: "Role-based access control (RBAC), performant state management, optimized rendering, and futuristic interactive 3D interfaces."
      }
    ]
  },

  skills: [
    {
      name: "Frontend Ecosystem",
      description: "Cutting-edge client architectures, state orchestration, and styling",
      items: [
        { name: "React.js", level: 95, highlight: true },
        { name: "Next.js (App Router)", level: 92, highlight: true },
        { name: "TypeScript", level: 90, highlight: true },
        { name: "Tailwind CSS", level: 95, highlight: true },
        { name: "Redux / Redux Toolkit", level: 85 },
        { name: "JavaScript (ES6+)", level: 95 },
        { name: "Three.js / WebGL", level: 80, highlight: true },
        { name: "Framer Motion", level: 88 },
        { name: "HTML5 / CSS3 / PostCSS", level: 95 }
      ]
    },
    {
      name: "Backend & Microservices",
      description: "Server runtime environments, API design, and security layers",
      items: [
        { name: "Node.js", level: 90, highlight: true },
        { name: "Express.js", level: 92, highlight: true },
        { name: "RESTful API Design", level: 94, highlight: true },
        { name: "JWT Authentication", level: 90 },
        { name: "Role-Based Access Control", level: 88 },
        { name: "Middleware Systems", level: 86 }
      ]
    },
    {
      name: "Databases & ORM",
      description: "Data modeling, relational integrity, and indexing strategies",
      items: [
        { name: "MongoDB & Mongoose", level: 90, highlight: true },
        { name: "PostgreSQL", level: 86, highlight: true },
        { name: "Prisma ORM", level: 88, highlight: true },
        { name: "Data Aggregation Pipelines", level: 84 },
        { name: "Schema Migrations", level: 85 }
      ]
    },
    {
      name: "Tooling & DevOps",
      description: "Version control, workflow automation, and hosting platforms",
      items: [
        { name: "Git & GitHub", level: 92, highlight: true },
        { name: "Postman API Testing", level: 90 },
        { name: "Vercel / Cloud Run", level: 88 },
        { name: "Linux / Bash", level: 82 },
        { name: "Docker Basics", level: 75 },
        { name: "Vite / Webpack", level: 85 }
      ]
    }
  ] as SkillCategory[],

  projects: [
    {
      id: "antigravity",
      stationId: "pod-1",
      title: "Antigravity Web Application",
      category: "Full-Stack / Interactive Web",
      tagline: "High-performance reactive platform with modern state dynamics.",
      description: "A flagship interactive application engineered with modern frontend architecture, dynamic user interactions, and fluid micro-animations. Built to showcase responsive component lifecycle handling, modular state isolation, and performant asset rendering.",
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion"],
      features: [
        "Reactive component architecture with fine-grained state management",
        "Fluid motion transitions with hardware-accelerated animations",
        "Modular utility layers and responsive breakpoints across all viewports",
        "Optimized bundle size and fast client-side hydration"
      ],
      githubUrl: "https://github.com/kamanashisbiswas007",
      liveUrl: "https://www.kamanashisbiswas.com/",
      status: "Featured"
    },
    {
      id: "university-management",
      stationId: "pod-2",
      title: "University Management System",
      category: "Enterprise Full-Stack Application",
      tagline: "Comprehensive academic ERP system with multi-role access control.",
      description: "An enterprise academic platform providing centralized management for universities. Architected with strict TypeScript typing across both frontend and backend, incorporating PostgreSQL and Prisma ORM for relational consistency.",
      technologies: ["TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma ORM", "JWT"],
      features: [
        "Three-tier Role-Based Access Control (Admin, Faculty, Student)",
        "Semester schedule planning and course registration workflows",
        "Prisma database migrations ensuring ACID-compliant relational integrity",
        "Secure JWT token rotation and authenticated route authorization",
        "Student enrollment tracking and faculty grade submission portals"
      ],
      githubUrl: "https://github.com/kamanashisbiswas007",
      liveUrl: "https://www.kamanashisbiswas.com/",
      status: "Production"
    },
    {
      id: "nextgen-dashboard",
      stationId: "pod-3",
      title: "NextGen Management Dashboard",
      category: "SaaS & Operational Platform",
      tagline: "Data-driven analytics dashboard with real-time KPI visualization.",
      description: "A sleek enterprise operational dashboard delivering high-density telemetry, customizable chart filters, user management tables, and interactive performance metrics in a dark cyber aesthetic.",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Lucide React"],
      features: [
        "Real-time KPI telemetry cards and metric visualization modules",
        "Searchable, paginated data grid with multi-filter sorting",
        "Dark-mode high-contrast telemetry palette optimized for low eye-strain",
        "Modular widget architecture for easy tenant customization"
      ],
      githubUrl: "https://github.com/kamanashisbiswas007",
      liveUrl: "https://www.kamanashisbiswas.com/",
      status: "Featured"
    },
    {
      id: "mern-commerce-hub",
      stationId: "pod-4",
      title: "MERN Commerce & Content Hub",
      category: "Full-Stack E-Commerce",
      tagline: "Scalable digital marketplace with transactional catalog management.",
      description: "A full-featured commerce platform utilizing the MERN stack with MongoDB aggregation for high-speed product filtering, persistent shopping cart state, and an administrator product catalog management console.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js", "Redux Toolkit", "Tailwind CSS"],
      features: [
        "Complex MongoDB aggregation pipelines for fast multi-attribute filtering",
        "Client cart state persistence with Redux Toolkit and local synchronization",
        "Admin dashboard for product inventory updates and order tracking",
        "REST API endpoints with payload validation and error-handling middleware"
      ],
      githubUrl: "https://github.com/kamanashisbiswas007",
      liveUrl: "https://www.kamanashisbiswas.com/",
      status: "Production"
    }
  ] as ProjectItem[],

  education: [
    {
      degree: "M.Sc. (Engg.) in Information Communication Technology (IICT)",
      institution: "Khulna University of Engineering & Technology (KUET)",
      location: "Khulna, Bangladesh",
      period: "Enrolled / In Progress",
      status: "Active Postgraduate Research",
      description: "Pursuing advanced engineering coursework and research in modern information systems, advanced networking, distributed computing, and emerging web technologies.",
      modules: [
        "Advanced Computer Networks & Protocol Design",
        "Distributed Web Systems & Cloud Architectures",
        "Modern Information & Communication Technologies",
        "High-Performance Computing Research"
      ]
    },
    {
      degree: "B.Sc. in Software Engineering",
      institution: "North Western University, Khulna",
      location: "Khulna, Bangladesh",
      period: "Graduated",
      status: "Completed with Distinction",
      description: "Comprehensive foundational and applied software engineering education encompassing algorithm design, data structures, object-oriented design, software lifecycle models, and database engineering.",
      modules: [
        "Data Structures & Algorithm Analysis",
        "Object-Oriented Programming (OOP) & System Design",
        "Database Management Systems (DBMS & SQL)",
        "Software Architecture, Testing & QA Methodologies",
        "Web Engineering & Distributed Applications"
      ]
    }
  ] as EducationItem[],

  certificates: [
    {
      id: "cert-nextlevel",
      title: "Next Level Web Development",
      issuer: "Programming Hero",
      date: "Professional Credential",
      description: "Rigorous full-stack software development specialization covering enterprise TypeScript, advanced Next.js App Router, state management with Redux Toolkit, backend engineering with Node/Express, and relational databases using Prisma and PostgreSQL.",
      topics: [
        "TypeScript Strict Mode & Advanced Types",
        "Next.js App Router & Server Components",
        "PostgreSQL & Prisma ORM Modeling",
        "MongoDB, Mongoose & Aggregations",
        "Express.js Architecture & Clean Code Principles",
        "Redux Toolkit & RTK Query State Caching"
      ]
    },
    {
      id: "cert-fullstack-dev",
      title: "Full-Stack Web Engineering Mastery",
      issuer: "Professional Software Track",
      date: "Verified Certification",
      description: "End-to-end web architecture training focused on responsive design, RESTful API construction, asynchronous programming, and production deployment pipelines.",
      topics: [
        "MERN Stack Architecture",
        "Secure User Authentication & Session Security",
        "Responsive Component Systems (Tailwind CSS)",
        "Version Control & Collaborative Git Workflows"
      ]
    }
  ] as CertificateItem[],

  laboratoryStations: [
    {
      id: "about-station",
      name: "About Me Station",
      code: "STATION 01 // ABOUT",
      zone: "West Wing",
      position: [-6.2, 0, 9],
      icon: "User",
      description: "Holographic workstation displaying professional profile, background, and engineering philosophy."
    },
    {
      id: "education-archive",
      name: "Education Station",
      code: "STATION 02 // EDUCATION",
      zone: "West Wing",
      position: [-6.2, 0, 3],
      icon: "GraduationCap",
      description: "Formal degrees in Software Engineering (NWU) and Information Communication Technology (KUET)."
    },
    {
      id: "skills-station",
      name: "Skills Station",
      code: "STATION 03 // SKILLS",
      zone: "West Wing",
      position: [-6.2, 0, -3],
      icon: "Cpu",
      description: "Comprehensive technical competencies across React 19, Next.js, Node.js, Prisma, and PostgreSQL."
    },
    {
      id: "projects-station",
      name: "Projects Station",
      code: "STATION 04 // PROJECTS",
      zone: "West Wing",
      position: [-6.2, 0, -9],
      icon: "Layers",
      description: "Interactive deployment console showcasing Antigravity, University ERP, Telemetry Dashboard, and MERN Commerce."
    },
    {
      id: "tools-station",
      name: "Tools & Applications Station",
      code: "STATION 05 // TOOLS",
      zone: "East Wing",
      position: [6.2, 0, -9],
      icon: "Wrench",
      description: "Developer workspace featuring VS Code, Git, Postman, Docker, Figma, Vercel, and Chrome DevTools."
    },
    {
      id: "certificate-archive",
      name: "Certificates & Achievements Station",
      code: "STATION 06 // CERTIFICATES",
      zone: "East Wing",
      position: [6.2, 0, -3],
      icon: "Award",
      description: "Verified professional credentials including Next Level Web Development and Full-Stack Engineering Mastery."
    },
    {
      id: "blog-station",
      name: "Blog Station",
      code: "STATION 07 // BLOG",
      zone: "East Wing",
      position: [6.2, 0, 3],
      icon: "BookOpen",
      description: "Technical essays covering Next.js 15 Server Components, ACID PostgreSQL integrity, and 60FPS Three.js graphics."
    },
    {
      id: "contact-terminal",
      name: "Contact Me Station",
      code: "STATION 08 // CONTACT",
      zone: "East Wing",
      position: [6.2, 0, 9],
      icon: "Radio",
      description: "Direct communications relay terminal to send inquiries and connect with Kamanashis Biswas."
    }
  ],

  tools: [
    {
      name: "Visual Studio Code",
      category: "IDE & Editors",
      description: "Primary development workspace configured with strict TypeScript, Tailwind CSS IntelliSense, ESLint, and Prettier.",
      level: "Daily Driver",
      highlight: true
    },
    {
      name: "Git & GitHub",
      category: "Version Control",
      description: "Advanced Git branching, pull requests, semantic commits, GitHub Actions CI/CD workflows, and release tags.",
      level: "Proficient",
      highlight: true
    },
    {
      name: "Postman",
      category: "API Testing & Debugging",
      description: "RESTful endpoint exploration, automated testing collections, header authorization tokens, and mock servers.",
      level: "Advanced",
      highlight: true
    },
    {
      name: "Docker",
      category: "Containerization",
      description: "Containerized application workflows, multi-stage Dockerfiles, Docker Compose service orchestration, and image builds.",
      level: "Intermediate"
    },
    {
      name: "Figma",
      category: "UI/UX & Prototyping",
      description: "Design-to-code translation, layout prototyping, wireframing, component tokens, and vector asset preparation.",
      level: "Proficient"
    },
    {
      name: "Vercel & Cloudflare",
      category: "Deployment & Edge",
      description: "Automated production deployments, serverless functions, DNS configuration, and edge caching for Next.js applications.",
      level: "Advanced",
      highlight: true
    },
    {
      name: "Linux (Ubuntu / Debian) & Bash",
      category: "Operating Systems & Shell",
      description: "Command-line server administration, SSH tunneling, file system management, shell automation, and cron jobs.",
      level: "Advanced"
    },
    {
      name: "Chrome DevTools",
      category: "Inspection & Profiling",
      description: "Lighthouse audits, network waterfall optimization, DOM breakpoint debugging, memory leak heapsnapshots, and CSS grid inspection.",
      level: "Expert",
      highlight: true
    }
  ] as ToolItem[],

  blogs: [
    {
      id: "nextjs-app-router-architecture",
      title: "Architecting Scalable Web Systems with Next.js 15 & React 19",
      summary: "A comprehensive analysis of React Server Components, fine-grained streaming boundaries, and state isolation in high-throughput enterprise applications.",
      date: "October 2026",
      readTime: "6 min read",
      tags: ["Next.js 15", "React 19", "Software Architecture", "Performance"],
      link: "https://github.com/kamanashisbiswas007"
    },
    {
      id: "acid-prisma-postgresql-guide",
      title: "Mastering Relational Integrity: ACID Transactions with PostgreSQL & Prisma",
      summary: "Strategies for zero-downtime database schema migrations, connection pooling, and multi-table ACID transactions in production Node.js microservices.",
      date: "September 2026",
      readTime: "8 min read",
      tags: ["PostgreSQL", "Prisma ORM", "ACID", "Backend Engineering"],
      link: "https://github.com/kamanashisbiswas007"
    },
    {
      id: "threejs-webgl-performance-tuning",
      title: "Building High-FPS Interactive 3D Web Experiences with Three.js & WebGL",
      summary: "Techniques for in-memory procedural canvas textures, geometry instancing, throttled render loops, and post-processing bloom optimization.",
      date: "August 2026",
      readTime: "7 min read",
      tags: ["Three.js", "WebGL", "Creative Development", "3D Graphics"],
      link: "https://github.com/kamanashisbiswas007"
    }
  ] as BlogPostItem[]
};
