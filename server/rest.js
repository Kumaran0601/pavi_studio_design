import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { authenticate, getSessionUser, requireAdmin, SESSION_COOKIE } from './auth.js';
import { withDb } from './db.js';
import {
  defaultSettings,
  memoryStore,
  parseJson,
  seedCategories,
} from './content.js';

const router = express.Router();

import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadDir = path.join(PROJECT_ROOT, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage for uploaded media
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP, AVIF, and SVG images are allowed.'));
    }
  },
});

const json = (res, data, status = 200) => res.status(status).json({ data });
const failure = (res, code, message, status = 400, fields = {}) =>
  res.status(status).json({ error: { code, message, fields } });

function isValidPhone(value) {
  if (!value) return false;
  const digits = value.replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ==========================================
// Authentication Routes
// ==========================================

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return failure(res, 'VALIDATION_ERROR', 'Username and password are required.', 400);
  }

  const result = authenticate(String(username).trim(), String(password).trim());
  if (!result) {
    return failure(res, 'INVALID_CREDENTIALS', 'Invalid username or password.', 401);
  }

  // Set HTTP-only cookie
  res.cookie(SESSION_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return json(res, {
    user: result.user,
    token: result.token,
    message: 'Logged in successfully.',
  });
});

router.get('/auth/me', (req, res) => {
  const user = getSessionUser(req);
  return json(res, { user: user || null });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  return json(res, { success: true, message: 'Logged out successfully.' });
});

// ==========================================
// Public Data Routes
// ==========================================

router.get('/health', (_req, res) => json(res, { status: 'ok', timestamp: new Date().toISOString() }));

router.get('/public/home', async (_req, res) => {
  const [settings, services, gallery, materials, course] = await Promise.all([
    getPublicSettings(),
    getServices(),
    getGallery({}),
    getMaterials(),
    getCourse(),
  ]);
  return json(res, { settings, services, gallery, materials, course });
});

router.get('/settings/public', async (_req, res) => json(res, await getPublicSettings()));

router.get('/services', async (_req, res) => json(res, await getServices()));

router.get('/services/:slug', async (req, res) => {
  const items = await getServices();
  const item = items.find(entry => entry.slug === req.params.slug);
  return item ? json(res, item) : failure(res, 'NOT_FOUND', 'Service not found.', 404);
});

router.get('/gallery/categories', async (_req, res) => {
  return json(res, [{ slug: 'all', name: 'All' }, ...seedCategories]);
});

router.get('/gallery', async (req, res) => {
  const category = req.query.category;
  const items = await getGallery({ category });
  return json(res, items);
});

router.get('/gallery/:id', async (req, res) => {
  const items = await getGallery({});
  const item = items.find(entry => String(entry.id) === String(req.params.id));
  return item ? json(res, item) : failure(res, 'NOT_FOUND', 'Gallery item not found.', 404);
});

router.get('/materials', async (_req, res) => json(res, await getMaterials()));

router.get('/courses', async (_req, res) => json(res, [await getCourse()]));

// Enquiry form submission
router.post('/enquiries', async (req, res) => {
  const body = req.body || {};
  // Honeypot spam trap
  if (body.website && String(body.website).trim()) {
    return failure(res, 'SPAM_REJECTED', 'Please try again.', 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  const fields = {};
  if (name.length < 2 || name.length > 160) fields.name = 'Please enter your name.';
  if (!isValidPhone(phone)) fields.phone = 'Please enter a valid 10-digit phone number.';
  if (email && !isValidEmail(email)) fields.email = 'Please enter a valid email address.';
  if (!service) fields.service = 'Please select a service.';
  if (message.length < 5 || message.length > 2500) {
    fields.message = 'Please enter a message between 5 and 2,500 characters.';
  }

  if (Object.keys(fields).length > 0) {
    return failure(res, 'VALIDATION_ERROR', 'Please check the highlighted fields.', 422, fields);
  }

  const newEnquiry = {
    id: Date.now(),
    name,
    phone,
    email: email || null,
    service,
    message,
    status: 'new',
    sourcePage: typeof body.sourcePage === 'string' ? body.sourcePage.slice(0, 240) : null,
    createdAt: new Date().toISOString(),
  };

  await withDb(async db => {
    const [result] = await db.query(
      'INSERT INTO enquiries (name, phone, email, service, message, status, sourcePage) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newEnquiry.name, newEnquiry.phone, newEnquiry.email, newEnquiry.service, newEnquiry.message, newEnquiry.status, newEnquiry.sourcePage]
    );
    newEnquiry.id = result.insertId;
  }, null);

  memoryStore.enquiries.unshift(newEnquiry);

  return json(res, {
    message: 'Thank you! Your enquiry has been received. We will contact you soon.',
    enquiry: { id: newEnquiry.id },
  }, 201);
});

// ==========================================
// Protected Admin Routes
// ==========================================

router.get('/admin/dashboard', requireAdmin, async (_req, res) => {
  const enquiryRows = await getEnquiries();
  const serviceRows = await getAllServicesAdmin();
  const galleryRows = await getAllGalleryAdmin();
  const materialRows = await getAllMaterialsAdmin();
  const course = await getCourse();
  const settings = await getPublicSettings();

  return json(res, {
    counts: {
      totalEnquiries: enquiryRows.length,
      newEnquiries: enquiryRows.filter(item => item.status === 'new').length,
      gallery: galleryRows.length,
      services: serviceRows.length,
      materials: materialRows.length,
    },
    recentEnquiries: enquiryRows.slice(0, 8),
    services: serviceRows,
    gallery: galleryRows,
    materials: materialRows,
    course,
    settings,
  });
});

router.get('/admin/enquiries', requireAdmin, async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  let rows = await getEnquiries();

  if (status) {
    rows = rows.filter(item => item.status === status);
  }
  if (search) {
    rows = rows.filter(item =>
      `${item.name} ${item.phone} ${item.message}`.toLowerCase().includes(search)
    );
  }
  return json(res, rows);
});

router.patch('/admin/enquiries/:id', requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  if (!['new', 'contacted', 'completed'].includes(status)) {
    return failure(res, 'VALIDATION_ERROR', 'Invalid status value.', 422);
  }
  const id = Number(req.params.id);

  await withDb(async db => {
    await db.query(
      'UPDATE enquiries SET status = ?, contactedAt = ? WHERE id = ?',
      [status, status === 'contacted' ? new Date() : null, id]
    );
  }, null);

  const item = memoryStore.enquiries.find(entry => Number(entry.id) === id);
  if (item) {
    item.status = status;
    if (status === 'contacted') item.contactedAt = new Date().toISOString();
  }

  return json(res, { success: true });
});

router.delete('/admin/enquiries/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await withDb(async db => {
    await db.query('DELETE FROM enquiries WHERE id = ?', [id]);
  }, null);
  memoryStore.enquiries = memoryStore.enquiries.filter(entry => Number(entry.id) !== id);
  return json(res, { success: true });
});

// Upload media file
router.post('/admin/media', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return failure(res, 'UPLOAD_ERROR', 'Please select an image file to upload.', 422);
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  const altText = req.body.altText ? String(req.body.altText).trim() : 'Pavi Designer Studio image';

  return json(res, {
    publicUrl,
    filename: req.file.filename,
    altText,
    fileSizeBytes: req.file.size,
  }, 201);
});

// Gallery Admin
router.post('/admin/gallery', requireAdmin, async (req, res) => {
  const body = req.body || {};
  if (!body.imageUrl || !body.category || !body.altText) {
    return failure(res, 'VALIDATION_ERROR', 'Image URL, category, and alt text are required.', 422);
  }
  const item = {
    id: Date.now(),
    imageUrl: String(body.imageUrl),
    category: String(body.category),
    caption: body.caption ? String(body.caption) : null,
    altText: String(body.altText),
    isFeatured: body.isFeatured ? 1 : 0,
    isPublished: body.isPublished === false ? 0 : 1,
    sortOrder: Number(body.sortOrder || 0),
  };

  await withDb(async db => {
    const [result] = await db.query(
      'INSERT INTO gallery_items (imageUrl, category, caption, altText, isFeatured, isPublished, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.imageUrl, item.category, item.caption, item.altText, item.isFeatured, item.isPublished, item.sortOrder]
    );
    item.id = result.insertId;
  }, null);

  memoryStore.gallery.unshift(item);
  return json(res, item, 201);
});

router.patch('/admin/gallery/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const patch = { ...req.body };
  delete patch.id;
  if (Object.keys(patch).length === 0) {
    return json(res, { success: true });
  }

  if ('isFeatured' in patch) patch.isFeatured = patch.isFeatured ? 1 : 0;
  if ('isPublished' in patch) patch.isPublished = patch.isPublished ? 1 : 0;
  if ('sortOrder' in patch) patch.sortOrder = Number(patch.sortOrder || 0);

  await withDb(async db => {
    const sets = Object.keys(patch).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(patch), id];
    await db.query(`UPDATE gallery_items SET ${sets} WHERE id = ?`, values);
  }, null);

  const item = memoryStore.gallery.find(entry => Number(entry.id) === id);
  if (item) Object.assign(item, patch);

  return json(res, { success: true, item });
});

router.delete('/admin/gallery/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await withDb(async db => {
    await db.query('DELETE FROM gallery_items WHERE id = ?', [id]);
  }, null);
  memoryStore.gallery = memoryStore.gallery.filter(entry => Number(entry.id) !== id);
  return json(res, { success: true });
});

// Services Admin
router.post('/admin/services', requireAdmin, async (req, res) => {
  const body = req.body || {};
  const item = {
    id: Date.now(),
    slug: String(body.slug || (body.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    title: String(body.title || 'New Service'),
    shortDescription: String(body.shortDescription || 'Contact us for details.'),
    longDescription: body.longDescription ? String(body.longDescription) : null,
    imageUrl: body.imageUrl ? String(body.imageUrl) : '/images/embroidery-detail.svg',
    ctaLabel: String(body.ctaLabel || 'Enquire'),
    sortOrder: Number(body.sortOrder || 0),
    isActive: body.isActive === false ? 0 : 1,
  };

  await withDb(async db => {
    const [result] = await db.query(
      'INSERT INTO services (slug, title, shortDescription, longDescription, imageUrl, ctaLabel, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [item.slug, item.title, item.shortDescription, item.longDescription, item.imageUrl, item.ctaLabel, item.sortOrder, item.isActive]
    );
    item.id = result.insertId;
  }, null);

  memoryStore.services.push(item);
  return json(res, item, 201);
});

router.patch('/admin/services/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const patch = { ...req.body };
  delete patch.id;
  if (Object.keys(patch).length === 0) {
    return json(res, { success: true });
  }

  if ('isActive' in patch) patch.isActive = patch.isActive ? 1 : 0;
  if ('sortOrder' in patch) patch.sortOrder = Number(patch.sortOrder || 0);

  await withDb(async db => {
    const sets = Object.keys(patch).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(patch), id];
    await db.query(`UPDATE services SET ${sets} WHERE id = ?`, values);
  }, null);

  const item = memoryStore.services.find(entry => Number(entry.id) === id);
  if (item) Object.assign(item, patch);

  return json(res, { success: true, item });
});

router.delete('/admin/services/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await withDb(async db => {
    await db.query('DELETE FROM services WHERE id = ?', [id]);
  }, null);
  memoryStore.services = memoryStore.services.filter(entry => Number(entry.id) !== id);
  return json(res, { success: true });
});

// Materials Admin
router.post('/admin/materials', requireAdmin, async (req, res) => {
  const body = req.body || {};
  const item = {
    id: Date.now(),
    slug: String(body.slug || (body.name || 'material').toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    name: String(body.name || 'New Material'),
    category: String(body.category || 'Basic Aari Materials'),
    shortDescription: String(body.shortDescription || 'Contact us for availability.'),
    imageUrl: body.imageUrl ? String(body.imageUrl) : '/images/embroidery-detail.svg',
    whatsappLabel: String(body.whatsappLabel || 'Ask about materials'),
    sortOrder: Number(body.sortOrder || 0),
    isActive: body.isActive === false ? 0 : 1,
  };

  await withDb(async db => {
    const [result] = await db.query(
      'INSERT INTO materials (slug, name, category, shortDescription, imageUrl, whatsappLabel, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [item.slug, item.name, item.category, item.shortDescription, item.imageUrl, item.whatsappLabel, item.sortOrder, item.isActive]
    );
    item.id = result.insertId;
  }, null);

  memoryStore.materials.push(item);
  return json(res, item, 201);
});

router.patch('/admin/materials/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const patch = { ...req.body };
  delete patch.id;
  if (Object.keys(patch).length === 0) {
    return json(res, { success: true });
  }

  if ('isActive' in patch) patch.isActive = patch.isActive ? 1 : 0;
  if ('sortOrder' in patch) patch.sortOrder = Number(patch.sortOrder || 0);

  await withDb(async db => {
    const sets = Object.keys(patch).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(patch), id];
    await db.query(`UPDATE materials SET ${sets} WHERE id = ?`, values);
  }, null);

  const item = memoryStore.materials.find(entry => Number(entry.id) === id);
  if (item) Object.assign(item, patch);

  return json(res, { success: true, item });
});

router.delete('/admin/materials/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await withDb(async db => {
    await db.query('DELETE FROM materials WHERE id = ?', [id]);
  }, null);
  memoryStore.materials = memoryStore.materials.filter(entry => Number(entry.id) !== id);
  return json(res, { success: true });
});

// Course Admin
router.patch('/admin/courses/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const patch = { ...req.body };
  delete patch.id;
  if (Object.keys(patch).length === 0) {
    return json(res, { success: true });
  }

  const dbPatch = { ...patch };
  if (Array.isArray(dbPatch.learningPoints)) dbPatch.learningPoints = JSON.stringify(dbPatch.learningPoints);
  if (Array.isArray(dbPatch.audiencePoints)) dbPatch.audiencePoints = JSON.stringify(dbPatch.audiencePoints);
  if (Array.isArray(dbPatch.faqItems)) dbPatch.faqItems = JSON.stringify(dbPatch.faqItems);

  await withDb(async db => {
    const sets = Object.keys(dbPatch).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(dbPatch), id];
    await db.query(`UPDATE courses SET ${sets} WHERE id = ?`, values);
  }, null);

  Object.assign(memoryStore.course, patch);
  return json(res, { success: true, course: memoryStore.course });
});

// Settings Admin
router.patch('/admin/settings', requireAdmin, async (req, res) => {
  const entries = Object.entries(req.body || {});
  for (const [key, value] of entries) {
    memoryStore.settings[key] = value;
    await withDb(async db => {
      await db.query(
        'INSERT INTO site_settings (settingKey, valueJson, isPublic) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE valueJson = ?',
        [key, JSON.stringify(value), JSON.stringify(value)]
      );
    }, null);
  }
  return json(res, memoryStore.settings);
});

// ==========================================
// Helper Query Functions
// ==========================================

async function getPublicSettings() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT settingKey, valueJson FROM site_settings WHERE isPublic = 1');
    const settings = { ...defaultSettings };
    for (const row of rows) {
      settings[row.settingKey] = parseJson(row.valueJson, row.valueJson);
    }
    return settings;
  }, memoryStore.settings);
}

async function getServices() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM services WHERE isActive = 1 ORDER BY sortOrder ASC');
    return rows;
  }, memoryStore.services.filter(s => s.isActive));
}

async function getAllServicesAdmin() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM services ORDER BY sortOrder ASC, id ASC');
    return rows;
  }, memoryStore.services);
}

async function getGallery({ category }) {
  const all = await withDb(async db => {
    const [rows] = await db.query('SELECT * FROM gallery_items WHERE isPublished = 1 ORDER BY sortOrder ASC');
    return rows;
  }, memoryStore.gallery.filter(g => g.isPublished));

  if (category && category !== 'All' && category !== 'all') {
    return all.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  return all;
}

async function getAllGalleryAdmin() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM gallery_items ORDER BY sortOrder ASC, id DESC');
    return rows;
  }, memoryStore.gallery);
}

async function getMaterials() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM materials WHERE isActive = 1 ORDER BY sortOrder ASC');
    return rows;
  }, memoryStore.materials.filter(m => m.isActive));
}

async function getAllMaterialsAdmin() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM materials ORDER BY sortOrder ASC, id ASC');
    return rows;
  }, memoryStore.materials);
}

async function getCourse() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM courses WHERE isActive = 1 LIMIT 1');
    if (!rows.length) return memoryStore.course;
    const row = rows[0];
    return {
      ...row,
      learningPoints: parseJson(row.learningPoints, []),
      audiencePoints: parseJson(row.audiencePoints, []),
      faqItems: parseJson(row.faqItems, []),
    };
  }, memoryStore.course);
}

async function getEnquiries() {
  return withDb(async db => {
    const [rows] = await db.query('SELECT * FROM enquiries ORDER BY createdAt DESC');
    return rows;
  }, memoryStore.enquiries);
}

export function registerRestRoutes(app) {
  app.use('/api', router);
}
