import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { connectDB, getDBStatus } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import { swaggerDocument } from './swagger/swaggerDocs.js';

// Import All REST Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import socialLinkRoutes from './routes/socialLinkRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Enable CORS for frontend and API consumers
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Swagger UI Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
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
  })
);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
  });
});

// Swagger JSON endpoint
app.get('/api/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Mount All API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/social-links', socialLinkRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url} - Endpoint not found`,
    documentation: '/api-docs',
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and Connect Database
const startServer = async () => {
  try {
    const isDbConnected = await connectDB();
    if (isDbConnected) {
      await seedDatabase();
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
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
  }
};

startServer();

export default app;
