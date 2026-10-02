import mysql from 'mysql2/promise';
import {
  defaultSettings,
  seedCategories,
  seedCourse,
  seedGallery,
  seedMaterials,
  seedServices,
} from './content.js';

let pool = null;
let initialized = false;

export async function getDb() {
  if (pool) return pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  try {
    pool = mysql.createPool(dbUrl);
    // test connection
    const conn = await pool.getConnection();
    conn.release();
    if (!initialized) {
      await initializeTables(pool);
      initialized = true;
    }
    return pool;
  } catch (error) {
    console.warn('[Database] MySQL connection unavailable, falling back to in-memory store:', error.message);
    pool = null;
    return null;
  }
}

async function initializeTables(db) {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(160) NOT NULL,
        phone VARCHAR(40) NOT NULL,
        email VARCHAR(320),
        service VARCHAR(120) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'contacted', 'completed') DEFAULT 'new' NOT NULL,
        sourcePage VARCHAR(240),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        contactedAt TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(160) NOT NULL UNIQUE,
        title VARCHAR(240) NOT NULL,
        shortDescription TEXT NOT NULL,
        longDescription TEXT,
        imageUrl VARCHAR(1000),
        ctaLabel VARCHAR(160) NOT NULL,
        sortOrder INT DEFAULT 0 NOT NULL,
        isActive TINYINT(1) DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageUrl VARCHAR(1000) NOT NULL,
        category VARCHAR(120) NOT NULL,
        caption TEXT,
        altText TEXT NOT NULL,
        isFeatured TINYINT(1) DEFAULT 0 NOT NULL,
        isPublished TINYINT(1) DEFAULT 1 NOT NULL,
        sortOrder INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(160) NOT NULL UNIQUE,
        name VARCHAR(240) NOT NULL,
        category VARCHAR(120) NOT NULL,
        shortDescription TEXT NOT NULL,
        imageUrl VARCHAR(1000),
        whatsappLabel VARCHAR(240) NOT NULL,
        sortOrder INT DEFAULT 0 NOT NULL,
        isActive TINYINT(1) DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(160) NOT NULL UNIQUE,
        title VARCHAR(240) NOT NULL,
        subtitle TEXT NOT NULL,
        durationText VARCHAR(120) NOT NULL,
        certificateText VARCHAR(240) NOT NULL,
        description TEXT NOT NULL,
        learningPoints TEXT NOT NULL,
        audiencePoints TEXT NOT NULL,
        faqItems TEXT NOT NULL,
        ctaLabel VARCHAR(160) NOT NULL,
        isActive TINYINT(1) DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        settingKey VARCHAR(160) NOT NULL UNIQUE,
        valueJson TEXT NOT NULL,
        isPublic TINYINT(1) DEFAULT 1 NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed if empty
    const [serviceCount] = await db.query('SELECT COUNT(*) as count FROM services');
    if (serviceCount[0].count === 0) {
      for (const s of seedServices) {
        await db.query(
          'INSERT INTO services (slug, title, shortDescription, longDescription, imageUrl, ctaLabel, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [s.slug, s.title, s.shortDescription, s.longDescription || null, s.imageUrl || null, s.ctaLabel, s.sortOrder]
        );
      }
    }

    const [galleryCount] = await db.query('SELECT COUNT(*) as count FROM gallery_items');
    if (galleryCount[0].count === 0) {
      for (const g of seedGallery) {
        await db.query(
          'INSERT INTO gallery_items (imageUrl, category, caption, altText, isFeatured, isPublished, sortOrder) VALUES (?, ?, ?, ?, ?, 1, ?)',
          [g.imageUrl, g.category, g.caption || null, g.altText, g.isFeatured, g.sortOrder]
        );
      }
    }

    const [materialCount] = await db.query('SELECT COUNT(*) as count FROM materials');
    if (materialCount[0].count === 0) {
      for (const m of seedMaterials) {
        await db.query(
          'INSERT INTO materials (slug, name, category, shortDescription, imageUrl, whatsappLabel, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [m.slug, m.name, m.category, m.shortDescription, m.imageUrl || null, m.whatsappLabel, m.sortOrder]
        );
      }
    }

    const [courseCount] = await db.query('SELECT COUNT(*) as count FROM courses');
    if (courseCount[0].count === 0) {
      await db.query(
        'INSERT INTO courses (slug, title, subtitle, durationText, certificateText, description, learningPoints, audiencePoints, faqItems, ctaLabel, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [
          seedCourse.slug,
          seedCourse.title,
          seedCourse.subtitle,
          seedCourse.durationText,
          seedCourse.certificateText,
          seedCourse.description,
          JSON.stringify(seedCourse.learningPoints),
          JSON.stringify(seedCourse.audiencePoints),
          JSON.stringify(seedCourse.faqItems),
          seedCourse.ctaLabel,
        ]
      );
    }

    const [settingsCount] = await db.query('SELECT COUNT(*) as count FROM site_settings');
    if (settingsCount[0].count === 0) {
      for (const [k, v] of Object.entries(defaultSettings)) {
        await db.query(
          'INSERT INTO site_settings (settingKey, valueJson, isPublic) VALUES (?, ?, 1)',
          [k, JSON.stringify(v)]
        );
      }
    }
  } catch (err) {
    console.warn('[Database] Table init warning:', err.message);
  }
}

export async function withDb(work, fallback) {
  const db = await getDb();
  if (!db) return fallback;
  try {
    return await work(db);
  } catch (error) {
    console.warn('[Database] Query fallback:', error.message);
    return fallback;
  }
}
