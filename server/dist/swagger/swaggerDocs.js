"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Joyice Neelavathy Portfolio CMS API',
        version: '2.0.0',
        description: `### Dynamic Full-Stack Portfolio CMS REST API & Swagger Documentation
B.Tech Information Technology Student & Aspiring Full-Stack Developer.
This API provides complete CRUD operations and JWT-protected endpoints for managing all portfolio sections directly from the web interface without modifying source code.

**Admin Credentials (Default):**
* Email: \`admin@portfolio.com\`
* Password: \`admin123\`

To test protected endpoints, authenticate via **\`/api/auth/login\`**, copy the returned \`token\`, and paste it into the **Authorize** dialog as \`Bearer <token>\`.`,
        contact: {
            name: 'Joyice Neelavathy',
            email: 'joyiceneelavathy06@gmail.com',
            url: 'https://github.com/joyiceneelavathy',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local Express Server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token obtained from /api/auth/login',
            },
        },
        schemas: {
            AdminLoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', example: 'admin@portfolio.com' },
                    password: { type: 'string', example: 'admin123' },
                },
            },
            Profile: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Joyice Neelavathy' },
                    avatarUrl: { type: 'string' },
                    title: { type: 'string', example: 'Full-Stack Developer & Software Engineer' },
                    subtitle: { type: 'string', example: 'B.Tech Information Technology Student' },
                    shortIntro: { type: 'string' },
                    aboutDescription: { type: 'string' },
                    email: { type: 'string', example: 'joyiceneelavathy06@gmail.com' },
                    phone: { type: 'string', example: '+91 98765 43210' },
                    location: { type: 'string', example: 'Chennai, India' },
                    resumeUrl: { type: 'string', example: '/resume.pdf' },
                    isVisible: { type: 'boolean', example: true },
                },
            },
            About: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'About Me' },
                    description: { type: 'string' },
                    careerGoal: { type: 'string' },
                    professionalSummary: { type: 'string' },
                    personalIntroduction: { type: 'string' },
                },
            },
            Education: {
                type: 'object',
                required: ['degree', 'department', 'institution', 'startYear', 'endYear', 'percentageOrCgpa'],
                properties: {
                    degree: { type: 'string', example: 'Bachelor of Technology (B.Tech)' },
                    department: { type: 'string', example: 'Information Technology' },
                    institution: { type: 'string', example: 'Engineering College / University' },
                    startYear: { type: 'string', example: '2022' },
                    endYear: { type: 'string', example: '2026' },
                    percentageOrCgpa: { type: 'string', example: '8.6 CGPA' },
                    description: { type: 'string' },
                    order: { type: 'number', example: 1 },
                },
            },
            Skill: {
                type: 'object',
                required: ['name', 'category'],
                properties: {
                    name: { type: 'string', example: 'React' },
                    category: { type: 'string', example: 'Frontend' },
                    level: { type: 'string', example: 'Expert' },
                    percentage: { type: 'number', example: 90 },
                    icon: { type: 'string', example: 'bi-filetype-jsx' },
                    order: { type: 'number', example: 1 },
                },
            },
            Project: {
                type: 'object',
                required: ['title', 'description', 'technologies'],
                properties: {
                    title: { type: 'string', example: 'UsedMart Marketplace' },
                    description: { type: 'string' },
                    fullDescription: { type: 'string' },
                    technologies: { type: 'array', items: { type: 'string' } },
                    imageUrl: { type: 'string' },
                    githubUrl: { type: 'string' },
                    liveDemoUrl: { type: 'string' },
                    startDate: { type: 'string', example: 'Jan 2024' },
                    endDate: { type: 'string', example: 'Apr 2024' },
                    category: { type: 'string', example: 'Full Stack' },
                    featured: { type: 'boolean', example: true },
                    order: { type: 'number', example: 1 },
                },
            },
            Certificate: {
                type: 'object',
                required: ['name', 'issuingOrganization', 'issueDate'],
                properties: {
                    name: { type: 'string', example: 'Full-Stack Web Development Specialization' },
                    issuingOrganization: { type: 'string', example: 'Coursera / Meta' },
                    issueDate: { type: 'string', example: 'August 2024' },
                    certificateId: { type: 'string', example: 'META-FS-892147' },
                    imageUrl: { type: 'string' },
                    pdfUrl: { type: 'string' },
                    credentialUrl: { type: 'string' },
                    description: { type: 'string' },
                },
            },
            Experience: {
                type: 'object',
                required: ['title', 'company', 'startDate', 'description'],
                properties: {
                    title: { type: 'string', example: 'Full-Stack Web Developer Intern' },
                    company: { type: 'string', example: 'Tech Innovators Studio' },
                    location: { type: 'string', example: 'Chennai' },
                    startDate: { type: 'string', example: 'May 2024' },
                    endDate: { type: 'string', example: 'July 2024' },
                    currentlyWorking: { type: 'boolean', example: false },
                    description: { type: 'string' },
                    technologies: { type: 'array', items: { type: 'string' } },
                    order: { type: 'number', example: 1 },
                },
            },
            Service: {
                type: 'object',
                required: ['title', 'description'],
                properties: {
                    title: { type: 'string', example: 'Web Development' },
                    description: { type: 'string' },
                    icon: { type: 'string', example: 'bi-laptop' },
                    order: { type: 'number', example: 1 },
                },
            },
            Resume: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    fileUrl: { type: 'string' },
                    summary: { type: 'string' },
                    skillsOverview: { type: 'array', items: { type: 'string' } },
                    experienceSummary: { type: 'string' },
                    educationSummary: { type: 'string' },
                },
            },
            ContactMessage: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                    name: { type: 'string', example: 'Recruiter / Visitor' },
                    email: { type: 'string', example: 'visitor@company.com' },
                    subject: { type: 'string', example: 'Interview Opportunity' },
                    message: { type: 'string', example: 'We would love to discuss a full-stack engineering role.' },
                },
            },
            SocialLink: {
                type: 'object',
                required: ['platform', 'url'],
                properties: {
                    platform: { type: 'string', example: 'GitHub' },
                    url: { type: 'string', example: 'https://github.com/joyiceneelavathy' },
                    icon: { type: 'string', example: 'bi-github' },
                    order: { type: 'number', example: 1 },
                },
            },
            WebsiteSettings: {
                type: 'object',
                properties: {
                    websiteTitle: { type: 'string', example: 'Joyice Neelavathy | Portfolio' },
                    logoText: { type: 'string', example: 'Joyice.dev' },
                    heroTitle: { type: 'string', example: 'Hi, I am Joyice Neelavathy' },
                    heroSubtitle: { type: 'string', example: 'Passionate Full-Stack Developer & Software Engineer' },
                    footerText: { type: 'string' },
                    contactEmail: { type: 'string' },
                    theme: { type: 'string', example: 'blue-modern' },
                    sectionsVisibility: {
                        type: 'object',
                        properties: {
                            about: { type: 'boolean', example: true },
                            education: { type: 'boolean', example: true },
                            skills: { type: 'boolean', example: true },
                            projects: { type: 'boolean', example: true },
                            certificates: { type: 'boolean', example: true },
                            experience: { type: 'boolean', example: true },
                            services: { type: 'boolean', example: true },
                            resume: { type: 'boolean', example: true },
                            contact: { type: 'boolean', example: true },
                        },
                    },
                },
            },
        },
    },
    tags: [
        { name: 'Auth', description: 'Admin authentication and token management' },
        { name: 'Profile', description: 'Personal and contact profile management' },
        { name: 'About', description: 'About section, career goals, and summaries' },
        { name: 'Education', description: 'Academic credentials and schooling history' },
        { name: 'Skills', description: 'Categorized technical skills and proficiency percentages' },
        { name: 'Projects', description: 'Portfolio project showcase with full CRUD' },
        { name: 'Certificates', description: 'Certifications and verified credentials' },
        { name: 'Experience', description: 'Work, internship, and project leadership experience' },
        { name: 'Services', description: 'Professional services offered' },
        { name: 'Resume', description: 'Resume summary and downloadable file links' },
        { name: 'Contact', description: 'Visitor inquiries and admin message inbox' },
        { name: 'Social Links', description: 'Social media and developer profile links' },
        { name: 'Settings', description: 'Global website branding, themes, and section toggles' },
        { name: 'Upload', description: 'Multipart file upload for images and documents' },
        { name: 'System', description: 'Health check and diagnostic information' },
    ],
    paths: {
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Admin Login',
                description: 'Authenticates administrator and issues JWT token.',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminLoginRequest' } } },
                },
                responses: {
                    '200': { description: 'Login successful with JWT token' },
                    '401': { description: 'Invalid email or password' },
                },
            },
        },
        '/api/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get Current Logged-in Admin',
                security: [{ BearerAuth: [] }],
                responses: {
                    '200': { description: 'Admin profile data' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/api/profile': {
            get: {
                tags: ['Profile'],
                summary: 'Get Profile Details',
                responses: { '200': { description: 'Profile retrieved successfully' } },
            },
            put: {
                tags: ['Profile'],
                summary: 'Update Profile Details',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Profile' } } } },
                responses: { '200': { description: 'Profile updated successfully' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/about': {
            get: {
                tags: ['About'],
                summary: 'Get About Section Details',
                responses: { '200': { description: 'About details retrieved' } },
            },
            put: {
                tags: ['About'],
                summary: 'Update About Section Details',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/About' } } } },
                responses: { '200': { description: 'About details updated' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/education': {
            get: {
                tags: ['Education'],
                summary: 'List All Education Records',
                responses: { '200': { description: 'List of education records' } },
            },
            post: {
                tags: ['Education'],
                summary: 'Add New Education Record',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } } },
                responses: { '201': { description: 'Education record created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/education/{id}': {
            get: {
                tags: ['Education'],
                summary: 'Get Education Record by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Record found' }, '404': { description: 'Record not found' } },
            },
            put: {
                tags: ['Education'],
                summary: 'Update Education Record',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Education' } } } },
                responses: { '200': { description: 'Record updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Education'],
                summary: 'Delete Education Record',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Record deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/skills': {
            get: {
                tags: ['Skills'],
                summary: 'List All Skills',
                responses: { '200': { description: 'List of skills' } },
            },
            post: {
                tags: ['Skills'],
                summary: 'Add New Skill',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } } },
                responses: { '201': { description: 'Skill created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/skills/{id}': {
            put: {
                tags: ['Skills'],
                summary: 'Update Skill',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } } },
                responses: { '200': { description: 'Skill updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Skills'],
                summary: 'Delete Skill',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Skill deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/projects': {
            get: {
                tags: ['Projects'],
                summary: 'List All Projects',
                responses: { '200': { description: 'List of projects' } },
            },
            post: {
                tags: ['Projects'],
                summary: 'Add New Project',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
                responses: { '201': { description: 'Project created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/projects/{id}': {
            get: {
                tags: ['Projects'],
                summary: 'Get Project by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Project found' }, '404': { description: 'Not found' } },
            },
            put: {
                tags: ['Projects'],
                summary: 'Update Project',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
                responses: { '200': { description: 'Project updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Projects'],
                summary: 'Delete Project',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Project deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/certificates': {
            get: {
                tags: ['Certificates'],
                summary: 'List All Certificates',
                responses: { '200': { description: 'List of certificates' } },
            },
            post: {
                tags: ['Certificates'],
                summary: 'Add New Certificate',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Certificate' } } } },
                responses: { '201': { description: 'Certificate created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/certificates/{id}': {
            put: {
                tags: ['Certificates'],
                summary: 'Update Certificate',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Certificate' } } } },
                responses: { '200': { description: 'Certificate updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Certificates'],
                summary: 'Delete Certificate',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Certificate deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/experience': {
            get: {
                tags: ['Experience'],
                summary: 'List All Experience Records',
                responses: { '200': { description: 'List of experience records' } },
            },
            post: {
                tags: ['Experience'],
                summary: 'Add New Experience Record',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } } },
                responses: { '201': { description: 'Experience record created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/experience/{id}': {
            put: {
                tags: ['Experience'],
                summary: 'Update Experience Record',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Experience' } } } },
                responses: { '200': { description: 'Experience updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Experience'],
                summary: 'Delete Experience Record',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Experience deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/services': {
            get: {
                tags: ['Services'],
                summary: 'List All Offered Services',
                responses: { '200': { description: 'List of services' } },
            },
            post: {
                tags: ['Services'],
                summary: 'Add New Service',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
                responses: { '201': { description: 'Service created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/services/{id}': {
            put: {
                tags: ['Services'],
                summary: 'Update Service',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Service' } } } },
                responses: { '200': { description: 'Service updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Services'],
                summary: 'Delete Service',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Service deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/resume': {
            get: {
                tags: ['Resume'],
                summary: 'Get Resume Details',
                responses: { '200': { description: 'Resume details' } },
            },
            put: {
                tags: ['Resume'],
                summary: 'Update Resume Information',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Resume' } } } },
                responses: { '200': { description: 'Resume updated' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/contact': {
            post: {
                tags: ['Contact'],
                summary: 'Submit Visitor Contact Inquiry',
                description: 'Sends and saves a contact inquiry message into MongoDB.',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } },
                },
                responses: { '201': { description: 'Message submitted successfully' }, '400': { description: 'Validation error' } },
            },
            get: {
                tags: ['Contact'],
                summary: 'Get All Contact Inquiries (Admin)',
                security: [{ BearerAuth: [] }],
                responses: { '200': { description: 'Inquiry inbox list with unreadCount' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/contact/{id}/read': {
            patch: {
                tags: ['Contact'],
                summary: 'Mark Contact Message as Read / Unread',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { isRead: { type: 'boolean' } } } } } },
                responses: { '200': { description: 'Message status updated' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/contact/{id}': {
            delete: {
                tags: ['Contact'],
                summary: 'Delete Contact Message',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Message deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/social-links': {
            get: {
                tags: ['Social Links'],
                summary: 'List All Social Media Links',
                responses: { '200': { description: 'List of social links' } },
            },
            post: {
                tags: ['Social Links'],
                summary: 'Add New Social Link',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLink' } } } },
                responses: { '201': { description: 'Social link created' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/social-links/{id}': {
            put: {
                tags: ['Social Links'],
                summary: 'Update Social Link',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLink' } } } },
                responses: { '200': { description: 'Social link updated' }, '401': { description: 'Unauthorized' } },
            },
            delete: {
                tags: ['Social Links'],
                summary: 'Delete Social Link',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Social link deleted' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/settings': {
            get: {
                tags: ['Settings'],
                summary: 'Get Global Website Settings',
                responses: { '200': { description: 'Website settings' } },
            },
            put: {
                tags: ['Settings'],
                summary: 'Update Global Website Settings',
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WebsiteSettings' } } } },
                responses: { '200': { description: 'Settings updated successfully' }, '401': { description: 'Unauthorized' } },
            },
        },
        '/api/upload': {
            post: {
                tags: ['Upload'],
                summary: 'Upload Image or PDF Document',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    file: { type: 'string', format: 'binary', description: 'Image (JPG, PNG, WEBP) or PDF document' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'File uploaded successfully with accessible URL' },
                    '400': { description: 'Invalid file format or missing file' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/api/health': {
            get: {
                tags: ['System'],
                summary: 'Check API and Database Health Status',
                responses: {
                    '200': { description: 'Server and MongoDB status' },
                },
            },
        },
    },
};
