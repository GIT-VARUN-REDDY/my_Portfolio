export const PERSONAL_INFO = {
  name: "Varun Reddy Kandimalla",
  role: "Full-Stack Developer & AI Engineer",
  tagline: "MERN stack developer building scalable full-stack web apps, REST APIs, and secure auth systems, with a passion for AI-assisted development. I build any website full-stack, and apps too.",
  bio: "MERN stack developer building scalable full-stack web apps, REST APIs, and secure auth systems, with a passion for AI-assisted development. I build any website full-stack, and apps too.",
  availability: "Available for Full-Time Roles & Projects",
  email: "varunreddy0429@gmail.com",
  phone: "+91 95057 63199",
  phoneUrl: "tel:+919505763199",
  location: "Bengaluru, India",
  github: "https://github.com/GIT-VARUN-REDDY",
  linkedin: "https://www.linkedin.com/in/varunreddy-kandimalla-45168344a/",
  resumePdf: "/Varun_Reddy_Resume.pdf",
  resumeUrl: "/Varun_Reddy_Resume.pdf",
  avatar: "/hero-avatar.webp",
  roles: [
    "MERN Stack Developer",
    "AI Engineer",
    "Full-Stack Web Architect",
    "Cross-Platform App Builder"
  ]
};

export const personalInfo = PERSONAL_INFO;

export const IMPACT_STATS = [
  {
    id: 'stat-apps',
    value: "6+",
    numeric: 6,
    suffix: "+",
    label: "Production Apps Shipped",
    description: "Web, Mobile & AI Platforms",
    icon: "FolderGit2"
  },
  {
    id: 'stat-tech',
    value: "15+",
    numeric: 15,
    suffix: "+",
    label: "Tech Stacks & Tools",
    description: "MERN, Python, Flutter, PyTorch",
    icon: "Cpu"
  },
  {
    id: 'stat-uptime',
    value: "100%",
    numeric: 100,
    suffix: "%",
    label: "Live Responsive Deployments",
    description: "Vercel & Cloud Hosted with CI/CD",
    icon: "Zap"
  },
  {
    id: 'stat-edu',
    value: "8.0",
    numeric: 8.0,
    suffix: "/10",
    label: "B.Tech ECE CGPA",
    description: "Hardware-Software Co-Design",
    icon: "CheckCircle2"
  }
];

export const impactStats = IMPACT_STATS;

export const PROJECTS = [
  {
    id: "electrocirco",
    title: "ElectroCirco",
    category: "Full-Stack",
    tagline: "Training platform for electronics students",
    shortDesc: "Training platform for electronics students",
    description: "50+ bench-verified hardware projects across IoT, Robotics, VLSI, and AI, with firmware, IEEE-standard reports, interactive calculators, and an automated circuit and firmware generator.",
    fullDesc: "50+ bench-verified hardware projects across IoT, Robotics, VLSI, and AI, with firmware, IEEE-standard reports, interactive calculators, and an automated circuit and firmware generator.",
    tags: ["IoT", "Robotics", "VLSI", "AI", "Node.js", "Hardware"],
    hue: 205,
    image: "/project-1.webp",
    metrics: "50+ Verified Hardware Labs",
    demo: "https://electrocirco.in",
    github: null,
    architecture: "Node.js/Express backend with modular lab engines, automated circuit parameter solvers, and responsive student UI.",
    highlights: [
      "50+ bench-tested projects spanning robotics, IoT microcontrollers, and VLSI",
      "Automated firmware script generator for Arduino and ESP32",
      "Interactive formula calculators & downloadable IEEE-format lab documentation"
    ],
    links: [
      { label: "Live Demo", url: "https://electrocirco.in", primary: true }
    ]
  },
  {
    id: "sk-holidays",
    title: "SK Holidays & Events",
    category: "Full-Stack",
    tagline: "Commercial travel & event management platform",
    shortDesc: "Commercial travel & event management platform",
    description: "Curated holiday packages, destination weddings, corporate offsites, and tailor-made trips across India and abroad. Built as a high-performance production freelance platform.",
    fullDesc: "Curated holiday packages, destination weddings, corporate offsites, and tailor-made trips across India and abroad. Built as a high-performance production freelance platform.",
    tags: ["Travel", "Events", "React", "Node.js", "Booking Flow"],
    hue: 215,
    image: "/project-2.webp",
    metrics: "Production Commercial Travel Engine",
    demo: "https://skholidaysandevents.vercel.app",
    github: null,
    architecture: "React.js dynamic client, custom inquiry workflow, lead generation backend, and responsive mobile-first UI.",
    highlights: [
      "Dynamic inquiry and booking consultation pipeline",
      "Custom holiday itinerary builder with real-time costing estimates",
      "Deployed to production with sub-second page load times"
    ],
    links: [
      { label: "Live Demo", url: "https://skholidaysandevents.vercel.app", primary: true }
    ]
  },
  {
    id: "dreamloom",
    title: "DreamLoom",
    category: "AI & ML",
    tagline: "AI storybooks starring your baby",
    shortDesc: "AI storybooks starring your baby",
    description: "Upload 6 to 10 photos and generate an 8-page custom personalized storybook PDF in minutes, with secure OTP authentication, user dashboard, and automated image-to-story synthesis.",
    fullDesc: "Upload 6 to 10 photos and generate an 8-page custom personalized storybook PDF in minutes, with secure OTP authentication, user dashboard, and automated image-to-story synthesis.",
    tags: ["MERN", "AI", "Storybooks", "PDF Engine", "Auth"],
    hue: 225,
    image: "/project-3.webp",
    metrics: "Automated 8-Page PDF Synthesis",
    demo: "https://dream-loom.vercel.app",
    github: "https://github.com/GIT-VARUN-REDDY/DreamLoom",
    architecture: "MERN architecture with facial consistency conditioning, automated narrative generation, and server-side PDF composition.",
    highlights: [
      "Personalized character synthesis from 6-10 uploaded user photos",
      "Cohesive 8-page visual storytelling engine with custom rhymes",
      "Secure OTP login and user gallery dashboard"
    ],
    links: [
      { label: "Live Demo", url: "https://dream-loom.vercel.app", primary: true },
      { label: "Source Code", url: "https://github.com/GIT-VARUN-REDDY/DreamLoom" }
    ]
  },
  {
    id: "docmeet",
    title: "DocMeet",
    category: "Full-Stack",
    tagline: "Doctor appointment booking & triage portal",
    shortDesc: "Doctor appointment booking & triage portal",
    description: "Find doctors by medical specialty, hospital, or city. Features an integrated symptom checker to match patients with the right specialist, instant slot scheduling, and doctor appointment management.",
    fullDesc: "Find doctors by medical specialty, hospital, or city. Features an integrated symptom checker to match patients with the right specialist, instant slot scheduling, and doctor appointment management.",
    tags: ["MERN", "Healthcare", "REST APIs", "JWT", "MongoDB"],
    hue: 235,
    image: "/project-4.webp",
    metrics: "Doctor-Patient Scheduling & Triage",
    demo: "https://doc-meet-red.vercel.app",
    github: "https://github.com/GIT-VARUN-REDDY/DocMeet",
    architecture: "MongoDB schema with doctor availability grids, JWT authentication, and rule-based symptom matching algorithms.",
    highlights: [
      "Intelligent symptom triage engine directing patients to specialist departments",
      "Live slot booking calendar with instant conflict prevention",
      "Doctor dashboard for managing patient histories and consultations"
    ],
    links: [
      { label: "Live Demo", url: "https://doc-meet-red.vercel.app", primary: true },
      { label: "Source Code", url: "https://github.com/GIT-VARUN-REDDY/DocMeet" }
    ]
  },
  {
    id: "pptxplains",
    title: "PPTxplains",
    category: "AI & ML",
    tagline: "Voice-driven AI presentation assistant",
    shortDesc: "Voice-driven AI presentation assistant",
    description: "Displays a 12-slide interactive presentation and answers complex questions about the active slide using Google Gemini LLM. Includes speech-to-text voice questions and voice-synthesized answers with zero login friction.",
    fullDesc: "Displays a 12-slide interactive presentation and answers complex questions about the active slide using Google Gemini LLM. Includes speech-to-text voice questions and voice-synthesized answers with zero login friction.",
    tags: ["React", "Node.js", "Google Gemini", "Web Speech API", "Voice AI"],
    hue: 195,
    image: "/project-5.webp",
    metrics: "Voice-to-Voice Multimodal Gemini AI",
    demo: "https://pp-txplains.vercel.app",
    github: "https://github.com/GIT-VARUN-REDDY/PPTxplains",
    architecture: "React slide presentation engine integrated with Web Speech recognition and Google Gemini API for context-aware Q&A.",
    highlights: [
      "Real-time slide context injection into Gemini system instructions",
      "Hands-free voice question recognition and synthesized audio answer playback",
      "Instant responsive presentation viewer with zero login friction"
    ],
    links: [
      { label: "Live Demo", url: "https://pp-txplains.vercel.app", primary: true },
      { label: "Source Code", url: "https://github.com/GIT-VARUN-REDDY/PPTxplains" }
    ]
  },
  {
    id: "spider-mind",
    title: "spider-mind",
    category: "Mobile",
    tagline: "Cross-platform task, idea & goal tracker",
    shortDesc: "Cross-platform task, idea & goal tracker",
    description: "A sleek Flutter mobile app paired with a 3D web home screen powered by Node.js, Express, and MongoDB. Features live multi-device synchronization, offline-first persistence, push reminders, and automated daily digests.",
    fullDesc: "A sleek Flutter mobile app paired with a 3D web home screen powered by Node.js, Express, and MongoDB. Features live multi-device synchronization, offline-first persistence, push reminders, and automated daily digests.",
    tags: ["Flutter", "Node.js", "MongoDB", "3D Web", "Offline-First"],
    hue: 245,
    image: "/project-6.webp",
    metrics: "Offline-First Cross-Platform Sync",
    demo: null,
    github: "https://github.com/GIT-VARUN-REDDY/spider-mind",
    architecture: "Flutter cross-platform client with Hive offline caching and REST/WebSocket backend for seamless cloud sync.",
    highlights: [
      "Offline-first local cache synchronization with conflict resolution",
      "Interactive 3D mind-map web visualizer for interconnected goals",
      "Automated daily productivity notifications and progress summaries"
    ],
    links: [
      { label: "Source Code", url: "https://github.com/GIT-VARUN-REDDY/spider-mind", primary: true }
    ]
  }
];

export const projectsData = PROJECTS;

export const SKILL_CATEGORIES = [
  {
    category: "Languages",
    name: "Languages",
    skills: [
      { name: "JavaScript (ES6+)", level: 95 },
      { name: "TypeScript", level: 85 },
      { name: "Python", level: 90 },
      { name: "C / C++", level: 82 },
      { name: "Dart (Flutter)", level: 80 },
      { name: "SQL", level: 85 }
    ]
  },
  {
    category: "Frontend",
    name: "Frontend",
    skills: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 88 },
      { name: "HTML5 & CSS3", level: 95 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Three.js / WebGL", level: 80 },
      { name: "Vite & Tooling", level: 90 }
    ]
  },
  {
    category: "Backend",
    name: "Backend & Databases",
    skills: [
      { name: "Node.js", level: 92 },
      { name: "Express.js", level: 92 },
      { name: "RESTful APIs", level: 95 },
      { name: "MongoDB", level: 90 },
      { name: "MySQL", level: 82 },
      { name: "JWT & Security", level: 88 }
    ]
  },
  {
    category: "AI & Machine Learning",
    name: "AI & Machine Learning",
    skills: [
      { name: "Google Gemini API", level: 95 },
      { name: "OpenAI & LLM APIs", level: 92 },
      { name: "Prompt Engineering", level: 95 },
      { name: "RAG & Vector Search", level: 85 },
      { name: "PyTorch & Computer Vision", level: 80 },
      { name: "Speech & Audio AI", level: 84 }
    ]
  },
  {
    category: "Mobile & Cloud",
    name: "Mobile & Cloud",
    skills: [
      { name: "Flutter Cross-Platform", level: 85 },
      { name: "Git & GitHub Workflows", level: 94 },
      { name: "Vercel & Render", level: 90 },
      { name: "Docker Basics", level: 75 },
      { name: "Linux CLI", level: 85 },
      { name: "Postman & API Testing", level: 90 }
    ]
  }
];

export const skillsData = SKILL_CATEGORIES;

export const JOURNEY = [
  {
    year: "2026",
    date: "Sep 2026 - Present",
    title: "Technical Associate Intern",
    company: "Ample Semiconductors",
    org: "Ample Semiconductors",
    description: "Driving technical analysis, workflow optimizations, hardware-software integrations, and embedded systems telemetry."
  },
  {
    year: "2026",
    date: "Apr 2026",
    title: "B.Tech in Electronics & Communication",
    company: "Teegala Krishna Reddy Engineering College",
    org: "Teegala Krishna Reddy Engineering College (CGPA: 8.0/10)",
    description: "Graduated with strong foundation in computing, circuits, hardware-software interfacing, data structures, and algorithms."
  },
  {
    year: "2025",
    date: "Dec 2024 - Jan 2025",
    title: "MERN Stack Developer Intern",
    company: "EY Global Delivery Services (GDS)",
    org: "EY Global Delivery Services (GDS)",
    description: "Built scalable full-stack applications utilizing React, Node.js, Express, and MongoDB with secure token-based authentication."
  },
  {
    year: "2024",
    date: "2024 - Continuous",
    title: "Professional Credentials & Projects",
    company: "EY & IBM SkillsBuild",
    org: "EY GDS & IBM SkillsBuild",
    description: "Earned EY GDS AICTE MERN Stack Certification and IBM SkillsBuild Career Management Essentials while building 6+ production apps."
  }
];

export const journeyMilestones = JOURNEY;

export const aboutData = {
  summary: "I'm a full-stack engineer and AI builder who loves creating end-to-end digital solutions that solve tangible problems. From interactive 3D web applications and multi-agent AI assistants to cross-platform mobile apps, I bring engineering rigor and clean design to everything I code.",
  experience: {
    period: "Sep 2026 - Present",
    role: "Technical Associate Intern",
    company: "Ample Semiconductors",
    description: "Working on real-world engineering workflows, hardware-software co-design, and technical optimization."
  },
  education: [
    {
      period: "2022 - 2026",
      degree: "B.Tech in Electronics and Communication Engineering",
      institution: "Teegala Krishna Reddy Engineering College",
      score: "8.0 / 10"
    },
    {
      period: "2020 - 2022",
      degree: "Intermediate MPC (Maths, Physics, Chemistry)",
      institution: "Resonance Junior College",
      score: "91.8%"
    }
  ]
};

export const AI_KNOWLEDGE_BASE = [
  {
    keywords: ["who", "varun", "about", "bio", "experience"],
    answer: "I am Varun Reddy Kandimalla, a Full-Stack MERN Developer and AI Engineer with a B.Tech in ECE. I specialize in building complete web products, mobile apps, and generative AI integrations from scratch."
  },
  {
    keywords: ["skills", "stack", "technologies", "tech"],
    answer: "My core stack is MERN (MongoDB, Express, React, Node.js) along with Python, C++, Flutter, and AI APIs like Google Gemini and OpenAI. I also work with Three.js for 3D web interfaces!"
  },
  {
    keywords: ["project", "projects", "work", "portfolio"],
    answer: "I've built 6 major apps: ElectroCirco (IoT training platform), SK Holidays (travel agency), DreamLoom (AI personalized storybook generator), DocMeet (doctor appointment booking), PPTxplains (voice Gemini AI presentation doubts), and spider-mind (Flutter + 3D web tracker)."
  },
  {
    keywords: ["hire", "available", "job", "contact", "email", "phone"],
    answer: "I am actively open to Full-Stack Developer and AI Engineer roles! You can reach me directly at varunreddy0429@gmail.com or call +91 95057 63199."
  },
  {
    keywords: ["resume", "cv", "download"],
    answer: "You can download my verified resume directly using the 'Download Resume' button at the top or in the command palette!"
  }
];

export const aiAvatarKnowledge = AI_KNOWLEDGE_BASE;
