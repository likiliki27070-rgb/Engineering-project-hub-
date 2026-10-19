import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import categoryRoutes from './routes/categories.js';
import technologyRoutes from './routes/technologies.js';
import creatorRoutes from './routes/creators.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import { db } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'LIMO — Engineering Project Hub',
    timestamp: new Date().toISOString(),
    metrics: {
      projects: db.projects.length,
      users: db.users.length,
      creators: db.creators.length,
      categories: db.categories.length
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route handler
app.use((_req, res) => {
  res.status(404).json({ error: 'LIMO API endpoint not found' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[LIMO Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  LIMO — Engineering Project Hub Server  `);
  console.log(`  REST API listening on port ${PORT}      `);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
