import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDatabase } from './db';
import { authRouter } from './routes/auth';
import { reposRouter } from './routes/repos';
import { submissionsRouter } from './routes/submissions';
import { webhooksRouter } from './routes/webhooks';
import { notificationsRouter } from './routes/notifications';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize SQLite database
initDatabase();

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow any Vercel preview or production deployment, localhost
      if (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === CLIENT_URL
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());

// Capture raw body for GitHub Webhook HMAC verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// Health Check
app.get(['/api', '/api/health'], (_req, res) => {
  res.json({
    status: 'ok',
    platform: 'RevAI Code Review Platform',
    envCheck: {
      hasClientId: Boolean(process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID || process.env.GH_CLIENT_ID),
      hasClientSecret: Boolean(
        process.env.GITHUB_CLIENT_SECRET ||
        process.env.GITHUB_SECRET ||
        process.env.CLIENT_SECRET ||
        process.env.GH_CLIENT_SECRET
      ),
      hasClientUrl: Boolean(process.env.CLIENT_URL),
      hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/repos', reposRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/notifications', notificationsRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[RevAI Server Error]:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[RevAI Backend] Running on http://localhost:${PORT}`);
    console.log(`[RevAI Webhook URL] http://localhost:${PORT}/api/webhooks/github`);
  });
}

export default app;
