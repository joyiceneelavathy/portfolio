"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialSettings = exports.initialSocialLinks = exports.initialResume = exports.initialServices = exports.initialExperience = exports.initialCertificates = exports.initialProjects = exports.initialSkills = exports.initialEducation = exports.initialAbout = exports.initialProfile = exports.initialAdmin = void 0;
exports.initialAdmin = {
    email: 'admin@portfolio.com',
    password: 'admin123',
    name: 'Joyice Neelavathy',
    role: 'admin',
};
exports.initialProfile = {
    name: 'Joyice Neelavathy',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    title: 'Full-Stack Developer & Software Engineer',
    subtitle: 'B.Tech Information Technology Student',
    shortIntro: 'Passionate software developer building modern, scalable web applications with React, Node.js, and MongoDB.',
    aboutDescription: 'I am a passionate software developer focused on modern web architectures, cloud applications, and responsive design. Dedicated to engineering clean code and intuitive user interfaces.',
    bio: 'Passionate Information Technology student and aspiring full-stack developer with a strong foundation in modern web technologies.',
    email: 'joyiceneelavathy06@gmail.com',
    phone: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu, India',
    resumeUrl: '/resume.pdf',
    isVisible: true,
    linkedinUrl: 'https://linkedin.com/in/joyice-neelavathy',
    githubUrl: 'https://github.com/joyiceneelavathy',
    skills: [
        'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Bootstrap',
        'Node.js', 'Express.js', 'MongoDB', 'Java', 'Python', 'Git', 'GitHub'
    ],
    careerInterests: [
        'Full-Stack Web Development',
        'Cloud Computing & DevOps',
        'API Architecture & Microservices',
        'Applied Machine Learning'
    ]
};
exports.initialAbout = {
    title: 'About Me',
    description: 'A driven Information Technology undergraduate enthusiastic about building robust software systems, modern web platforms, and data-driven solutions.',
    careerGoal: 'To contribute as a versatile Software Engineer or Full-Stack Developer in a fast-paced environment where I can engineer scalable applications, solve real-world problems, and continuously level up my technical craft.',
    professionalSummary: 'Proficient in both frontend and backend development with strong foundations in React, TypeScript, Express.js, MongoDB, Java, and Python. Experienced in building RESTful APIs, responsive web interfaces, and integrating machine learning algorithms into web applications.',
    personalIntroduction: 'Hello! I am Joyice Neelavathy, currently pursuing my B.Tech in Information Technology. I take pride in crafting clean, accessible code and elegant user experiences. Outside of programming, I love exploring emerging technologies, participating in hackathons, and reading tech blogs.'
};
exports.initialEducation = [
    {
        degree: 'Bachelor of Technology (B.Tech)',
        department: 'Information Technology',
        institution: 'Engineering College / University',
        startYear: '2022',
        endYear: '2026',
        description: 'Specializing in software engineering, database management systems, web development, cloud computing, and algorithms.',
        percentageOrCgpa: '8.6 CGPA',
        order: 1,
    },
    {
        degree: 'Higher Secondary Certificate (HSC)',
        department: 'Computer Science & Mathematics',
        institution: 'Higher Secondary School',
        startYear: '2020',
        endYear: '2022',
        description: 'Completed Higher Secondary Education with distinction in Mathematics, Physics, Chemistry, and Computer Science.',
        percentageOrCgpa: '92.4%',
        order: 2,
    },
    {
        degree: 'Secondary School Leaving Certificate (SSLC)',
        department: 'General Schooling',
        institution: 'High School',
        startYear: '2019',
        endYear: '2020',
        description: 'Graduated secondary schooling with high academic excellence and active participation in school science exhibitions.',
        percentageOrCgpa: '94.0%',
        order: 3,
    }
];
exports.initialSkills = [
    // Frontend
    { name: 'React', category: 'Frontend', level: 'Expert', percentage: 90, icon: 'bi-filetype-jsx', order: 1 },
    { name: 'TypeScript', category: 'Frontend', level: 'Advanced', percentage: 85, icon: 'bi-filetype-tsx', order: 2 },
    { name: 'JavaScript (ES6+)', category: 'Frontend', level: 'Expert', percentage: 92, icon: 'bi-filetype-js', order: 3 },
    { name: 'HTML5 & CSS3', category: 'Frontend', level: 'Expert', percentage: 95, icon: 'bi-filetype-html', order: 4 },
    { name: 'Bootstrap 5', category: 'Frontend', level: 'Expert', percentage: 90, icon: 'bi-bootstrap', order: 5 },
    // Backend
    { name: 'Node.js', category: 'Backend', level: 'Advanced', percentage: 88, icon: 'bi-hdd-network', order: 6 },
    { name: 'Express.js', category: 'Backend', level: 'Advanced', percentage: 86, icon: 'bi-server', order: 7 },
    { name: 'RESTful APIs', category: 'Backend', level: 'Expert', percentage: 92, icon: 'bi-gear-wide-connected', order: 8 },
    // Programming Languages
    { name: 'Java', category: 'Programming Languages', level: 'Advanced', percentage: 82, icon: 'bi-filetype-java', order: 9 },
    { name: 'Python', category: 'Programming Languages', level: 'Advanced', percentage: 80, icon: 'bi-filetype-py', order: 10 },
    // Databases
    { name: 'MongoDB & Mongoose', category: 'Databases', level: 'Advanced', percentage: 88, icon: 'bi-database-check', order: 11 },
    { name: 'SQL / Relational DB', category: 'Databases', level: 'Intermediate', percentage: 75, icon: 'bi-database', order: 12 },
    // Tools & Platforms
    { name: 'Git & GitHub', category: 'Tools & Platforms', level: 'Expert', percentage: 90, icon: 'bi-git', order: 13 },
    { name: 'Swagger / OpenAPI', category: 'Tools & Platforms', level: 'Advanced', percentage: 85, icon: 'bi-journal-code', order: 14 },
    { name: 'Postman', category: 'Tools & Platforms', level: 'Advanced', percentage: 88, icon: 'bi-send-check', order: 15 },
    { name: 'VS Code', category: 'Tools & Platforms', level: 'Expert', percentage: 95, icon: 'bi-code-square', order: 16 },
];
exports.initialProjects = [
    {
        title: 'UsedMart — Used Products Buy & Sell Web Application',
        description: 'A full-stack marketplace web application enabling users to list, browse, search, and securely buy/sell pre-owned items with category filtering and real-time inquiries.',
        fullDescription: 'UsedMart is built to make campus and neighborhood product exchange effortless. It features a responsive UI, product catalog, authentication, search filter, and instant message inquiry between buyers and sellers.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/joyiceneelavathy/usedmart',
        liveDemoUrl: 'https://usedmart-demo.example.com',
        startDate: 'Jan 2024',
        endDate: 'Apr 2024',
        category: 'Full Stack',
        featured: true,
        order: 1,
    },
    {
        title: 'Disease Prediction / Disease Classification System',
        description: 'An intelligent healthcare prediction system analyzing user-entered symptoms and clinical biomarkers to predict potential disease conditions with classification algorithms.',
        fullDescription: 'Utilizes machine learning models trained on medical symptom datasets. Features a clean interactive form where users select clinical signs and receive predicted risk assessments with precautionary measures.',
        technologies: ['Python', 'Flask', 'React', 'TypeScript', 'Scikit-Learn', 'Bootstrap'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/joyiceneelavathy/disease-prediction',
        liveDemoUrl: 'https://disease-prediction-demo.example.com',
        startDate: 'Jul 2023',
        endDate: 'Nov 2023',
        category: 'Machine Learning',
        featured: true,
        order: 2,
    },
    {
        title: 'Creative Story Generator',
        description: 'An interactive AI-assisted storytelling web app that generates dynamic plots, rich character descriptions, and narrative branches based on customized user prompts.',
        fullDescription: 'Creative Story Generator gives budding authors, game masters, and learners an inspiring platform to brainstorm tales, select story genres, create vivid chapters, and export customized story drafts.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Bootstrap', 'REST API'],
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
        githubUrl: 'https://github.com/joyiceneelavathy/creative-story-generator',
        liveDemoUrl: 'https://story-generator-demo.example.com',
        startDate: 'Sep 2024',
        endDate: 'Dec 2024',
        category: 'AI / Web',
        featured: true,
        order: 3,
    },
];
exports.initialCertificates = [
    {
        name: 'Full-Stack Web Development Specialization',
        issuingOrganization: 'Coursera / Meta',
        issueDate: 'August 2024',
        certificateId: 'META-FS-892147',
        credentialUrl: 'https://coursera.org/verify/example',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        pdfUrl: '',
        description: 'Comprehensive project certification covering React, responsive frontend development, server architecture, and REST APIs.',
    },
    {
        name: 'Python for Data Science & Machine Learning',
        issuingOrganization: 'NPTEL / Great Learning',
        issueDate: 'April 2024',
        certificateId: 'NPTEL-PY-552190',
        credentialUrl: 'https://nptel.ac.in/verify/example',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        pdfUrl: '',
        description: 'Coursework on algorithmic thinking, data preprocessing, model evaluation, and classification pipelines in Python.',
    },
    {
        name: 'Database Design & MongoDB Developer Certification',
        issuingOrganization: 'MongoDB University',
        issueDate: 'November 2023',
        certificateId: 'MDB-DEV-334182',
        credentialUrl: 'https://learn.mongodb.com/verify/example',
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        pdfUrl: '',
        description: 'Database modeling, CRUD operations, indexing, aggregation pipelines, and Mongoose ODM integration in Node.js.',
    },
];
exports.initialExperience = [
    {
        title: 'Full-Stack Web Developer Intern',
        company: 'Tech Innovators Studio',
        location: 'Chennai (Hybrid)',
        startDate: 'May 2024',
        endDate: 'July 2024',
        currentlyWorking: false,
        description: 'Developed responsive client-side components using React and TypeScript. Created RESTful endpoints with Node.js and Express, integrated MongoDB collections, and improved page load performance by 25%.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Bootstrap'],
        order: 1,
    },
    {
        title: 'Frontend Development Project Lead',
        company: 'College Tech Club',
        location: 'Campus',
        startDate: 'August 2023',
        endDate: 'Present',
        currentlyWorking: true,
        description: 'Mentoring junior students in web development fundamentals. Coordinated college symposium web portal development used by 1,000+ student attendees.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Git', 'GitHub Pages'],
        order: 2,
    },
];
exports.initialServices = [
    {
        title: 'Web Development',
        description: 'Building fast, responsive, and cross-browser compatible modern websites with HTML5, CSS3, JavaScript, and Bootstrap.',
        icon: 'bi-laptop',
        order: 1,
    },
    {
        title: 'Frontend Development',
        description: 'Creating intuitive user interfaces and single page applications with React, TypeScript, and modern component architecture.',
        icon: 'bi-code-slash',
        order: 2,
    },
    {
        title: 'Backend Development',
        description: 'Architecting scalable server-side systems, RESTful APIs, and business logic using Node.js and Express.js.',
        icon: 'bi-hdd-network',
        order: 3,
    },
    {
        title: 'Full Stack Development',
        description: 'End-to-end web engineering seamlessly integrating frontend React clients with Node.js/Express backends and databases.',
        icon: 'bi-layers-half',
        order: 4,
    },
    {
        title: 'Database Development',
        description: 'Designing NoSQL schema, aggregation queries, and index strategies with MongoDB and Mongoose ODM.',
        icon: 'bi-database-check',
        order: 5,
    },
];
exports.initialResume = {
    title: 'Joyice Neelavathy — Official Resume',
    fileUrl: '/resume.pdf',
    summary: 'Passionate Information Technology student with hands-on expertise in full-stack web engineering, React, TypeScript, Node.js, and MongoDB. Proven track record of developing functional applications and seeking software engineering roles.',
    skillsOverview: [
        'Frontend: React 18, TypeScript, Bootstrap 5, HTML5/CSS3',
        'Backend: Node.js, Express.js, REST APIs, Swagger/OpenAPI',
        'Databases: MongoDB, Mongoose ODM, MySQL',
        'Core Languages: JavaScript, Java, Python',
        'Tools: Git, GitHub, VS Code, Postman, Vite',
    ],
    experienceSummary: 'Internship and project leadership experience delivering responsive web applications.',
    educationSummary: 'B.Tech in Information Technology with consistent academic standing.',
};
exports.initialSocialLinks = [
    { platform: 'GitHub', url: 'https://github.com/joyiceneelavathy', icon: 'bi-github', order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/joyice-neelavathy', icon: 'bi-linkedin', order: 2 },
    { platform: 'Instagram', url: 'https://instagram.com/joyice_neelavathy', icon: 'bi-instagram', order: 3 },
    { platform: 'Twitter/X', url: 'https://twitter.com/joyice_dev', icon: 'bi-twitter-x', order: 4 },
    { platform: 'Email', url: 'mailto:joyiceneelavathy06@gmail.com', icon: 'bi-envelope-fill', order: 5 },
];
exports.initialSettings = {
    websiteTitle: 'Joyice Neelavathy | Full-Stack Developer Portfolio',
    logoText: 'Joyice.dev',
    heroTitle: 'Hi, I am Joyice Neelavathy',
    heroSubtitle: 'Passionate Full-Stack Developer & Software Engineer',
    footerText: 'Crafted with passion using React, Node.js, Express & MongoDB.',
    contactEmail: 'joyiceneelavathy06@gmail.com',
    theme: 'blue-modern',
    sectionsVisibility: {
        about: true,
        education: true,
        skills: true,
        projects: true,
        certificates: true,
        experience: true,
        services: true,
        resume: true,
        contact: true,
    },
};
