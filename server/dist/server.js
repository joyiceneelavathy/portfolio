"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_js_1 = require("./config/db.js");
const seed_js_1 = require("./config/seed.js");
const swaggerDocs_js_1 = require("./swagger/swaggerDocs.js");
// Import All REST Routes
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const profileRoutes_js_1 = __importDefault(require("./routes/profileRoutes.js"));
const aboutRoutes_js_1 = __importDefault(require("./routes/aboutRoutes.js"));
const educationRoutes_js_1 = __importDefault(require("./routes/educationRoutes.js"));
const skillRoutes_js_1 = __importDefault(require("./routes/skillRoutes.js"));
const projectRoutes_js_1 = __importDefault(require("./routes/projectRoutes.js"));
const certificateRoutes_js_1 = __importDefault(require("./routes/certificateRoutes.js"));
const experienceRoutes_js_1 = __importDefault(require("./routes/experienceRoutes.js"));
const serviceRoutes_js_1 = __importDefault(require("./routes/serviceRoutes.js"));
const resumeRoutes_js_1 = __importDefault(require("./routes/resumeRoutes.js"));
const contactRoutes_js_1 = __importDefault(require("./routes/contactRoutes.js"));
const socialLinkRoutes_js_1 = __importDefault(require("./routes/socialLinkRoutes.js"));
const settingsRoutes_js_1 = __importDefault(require("./routes/settingsRoutes.js"));
const uploadRoutes_js_1 = __importDefault(require("./routes/uploadRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Ensure uploads directory exists
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Enable CORS for frontend and API consumers
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(uploadDir));
// Swagger UI Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs_js_1.swaggerDocument, {
    customSiteTitle: 'Joyice Neelavathy Portfolio CMS - API Docs',
    customCss: `
      .swagger-ui .topbar { background-color: #0d6efd; }
      .swagger-ui .topbar .topbar-wrapper a span { display: none; }
      .swagger-ui .topbar .topbar-wrapper:after {
        content: 'Joyice Neelavathy Portfolio CMS REST API';
        color: #ffffff;
        font-weight: 700;
        font-size: 1.25rem;
      }
    `,
}));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: (0, db_js_1.getDBStatus)(),
    });
});
// Swagger JSON endpoint
app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs_js_1.swaggerDocument);
});
// Mount All API Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/profile', profileRoutes_js_1.default);
app.use('/api/about', aboutRoutes_js_1.default);
app.use('/api/education', educationRoutes_js_1.default);
app.use('/api/skills', skillRoutes_js_1.default);
app.use('/api/projects', projectRoutes_js_1.default);
app.use('/api/certificates', certificateRoutes_js_1.default);
app.use('/api/experience', experienceRoutes_js_1.default);
app.use('/api/services', serviceRoutes_js_1.default);
app.use('/api/resume', resumeRoutes_js_1.default);
app.use('/api/contact', contactRoutes_js_1.default);
app.use('/api/social-links', socialLinkRoutes_js_1.default);
app.use('/api/settings', settingsRoutes_js_1.default);
app.use('/api/upload', uploadRoutes_js_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Joyice Neelavathy Portfolio CMS REST API',
        endpoints: {
            auth: '/api/auth/login',
            profile: '/api/profile',
            about: '/api/about',
            education: '/api/education',
            skills: '/api/skills',
            projects: '/api/projects',
            certificates: '/api/certificates',
            experience: '/api/experience',
            services: '/api/services',
            resume: '/api/resume',
            contact: '/api/contact',
            socialLinks: '/api/social-links',
            settings: '/api/settings',
            upload: '/api/upload',
            swaggerDocs: '/api-docs',
            health: '/api/health',
        },
        documentation: 'Visit /api-docs for interactive Swagger UI documentation',
    });
});
// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url} - Endpoint not found`,
        documentation: '/api-docs',
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
// Start Server and Connect Database
const startServer = async () => {
    try {
        const isDbConnected = await (0, db_js_1.connectDB)();
        if (isDbConnected) {
            await (0, seed_js_1.seedDatabase)();
        }
        app.listen(PORT, () => {
            console.log(`\n======================================================`);
            console.log(`🚀 Joyice Neelavathy Portfolio CMS Server is running!`);
            console.log(`🌐 Server URL:        http://localhost:${PORT}`);
            console.log(`📚 Swagger API Docs:  http://localhost:${PORT}/api-docs`);
            console.log(`🩺 Health Check:      http://localhost:${PORT}/api/health`);
            console.log(`🔑 Admin Credentials: admin@portfolio.com / admin123`);
            console.log(`======================================================\n`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error.message);
    }
};
startServer();
exports.default = app;
