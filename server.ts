import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { initDatabase } from './src/server/db.js';
import { purgeExpiredSessions } from './src/server/auth.js';
import { authRouter } from './src/server/routes/authRoutes.js';
import { cmsRouter } from './src/server/routes/cmsRoutes.js';
import { mediaRouter } from './src/server/routes/mediaRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB and Seed
initDatabase();

// Clean up expired sessions periodically every hour
setInterval(purgeExpiredSessions, 60 * 60 * 1000);

// Parse CLI arguments (--port 3000 --host 0.0.0.0)
const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const hostIdx = args.indexOf('--host');
const cliPort = portIdx !== -1 && args[portIdx + 1] ? Number(args[portIdx + 1]) : null;
const cliHost = hostIdx !== -1 && args[hostIdx + 1] ? args[hostIdx + 1] : null;

const PORT = cliPort || Number(process.env.PORT) || 3000;
const HOST = cliHost || process.env.HOST || '0.0.0.0';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads folder
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routers
app.use('/api/auth', authRouter);
app.use('/api', cmsRouter);
app.use('/api', mediaRouter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[Full-Stack Server] Server listening on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('[Server Error]', err);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Error]', err);
  process.exit(1);
});
