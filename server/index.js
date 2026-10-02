import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import net from 'node:net';
import path from 'node:path';
import fs from 'node:fs';
import { registerRestRoutes } from './rest.js';

import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const __dirname = PROJECT_ROOT;

function isPortAvailable(port) {
  return new Promise(resolve => {
    const tester = net.createServer();
    tester.listen(port, () => {
      tester.close(() => resolve(true));
    });
    tester.on('error', () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000) {
  for (let p = startPort; p < startPort + 20; p++) {
    if (await isPortAvailable(p)) return p;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // CORS support for separate client & server execution
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Serve uploaded images statically
  const uploadsPath = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));

  // Serve local photos directly for /images
  const imagesPath = path.join(__dirname, 'client', 'public', 'images');
  app.use('/images', express.static(imagesPath));

  // Register REST API routes
  registerRestRoutes(app);

  // SEO sitemap & robots.txt
  const publicRoutes = [
    '/',
    '/about',
    '/services',
    '/services/aari-embroidery',
    '/services/bridal-blouse',
    '/services/customized-works',
    '/classes',
    '/materials',
    '/gallery',
    '/contact',
  ];

  app.get('/sitemap.xml', (req, res) => {
    const origin = `${req.protocol}://${req.get('host')}`;
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes
        .map(route => `<url><loc>${origin}${route}</loc></url>`)
        .join('')}</urlset>`
    );
  });

  app.get('/robots.txt', (req, res) => {
    const origin = `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: ${origin}/sitemap.xml\n`
    );
  });

  // Client serving: development vs production
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.join(__dirname, 'client'),
      configFile: path.join(__dirname, 'vite.config.js'),
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/uploads') || url.startsWith('/images')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist', 'public');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const preferredPort = parseInt(process.env.PORT || '3000', 10);
  const port = await findAvailablePort(preferredPort);

  server.listen(port, () => {
    console.log(`\n✨ Pavi Designer Studio server running on: http://localhost:${port}/`);
    console.log(`   Admin Login: http://localhost:${port}/admin/login (Username: admin, Password: admin123)\n`);
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
