import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

dotenv.config();

const { PORT = 8080, DATABASE_URL, JWT_SECRET, FRONTEND_ORIGIN } = process.env;

if (!DATABASE_URL || !JWT_SECRET) {
  throw new Error('Missing DATABASE_URL or JWT_SECRET in backend environment.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(
  cors({
    origin: FRONTEND_ORIGIN ? FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()) : '*',
  })
);
app.use(express.json());

function signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [payload.userId]);
    if (!result.rowCount) return res.status(401).json({ error: 'Invalid auth token' });
    req.user = result.rows[0];
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}

async function initializeDatabase() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS authorized_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS site_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT NOT NULL DEFAULT '',
      is_active BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS weeks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      week_number INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contributions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
      contributor_type TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      text_content_html TEXT NOT NULL DEFAULT '',
      font_family TEXT NOT NULL DEFAULT 'sans-serif',
      image_size TEXT NOT NULL DEFAULT '600px',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(week_id, contributor_type)
    );
    CREATE TABLE IF NOT EXISTS our_story_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      image_url TEXT,
      caption TEXT NOT NULL DEFAULT '',
      text_content TEXT NOT NULL DEFAULT '',
      display_order INTEGER NOT NULL DEFAULT 0,
      image_size TEXT NOT NULL DEFAULT '600px',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO site_settings (setting_key, setting_value, is_active)
    VALUES
      ('instagram_url', '', false),
      ('contact_email', '', true),
      ('author_name_a', 'Alin', true),
      ('author_name_b', 'Kelsey', true)
    ON CONFLICT (setting_key) DO NOTHING;
  `);

  const weeksResult = await pool.query('SELECT COUNT(*)::int AS count FROM weeks');
  if (weeksResult.rows[0].count === 0) {
    for (let weekNumber = 1; weekNumber <= 52; weekNumber += 1) {
      const week = await pool.query(
        'INSERT INTO weeks (week_number, title) VALUES ($1, $2) RETURNING id',
        [weekNumber, `Week ${weekNumber}`]
      );
      await pool.query(
        'INSERT INTO contributions (week_id, contributor_type) VALUES ($1, $2), ($1, $3)',
        [week.rows[0].id, 'A', 'B']
      );
    }
  }
}

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

app.post('/api/auth/signup', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || password.length < 6) return res.status(400).json({ error: 'Invalid email or password' });

    const authzCount = await pool.query('SELECT COUNT(*)::int AS count FROM authorized_users');
    if (authzCount.rows[0].count > 0) {
      const authz = await pool.query('SELECT id FROM authorized_users WHERE email = $1', [email]);
      if (!authz.rowCount) return res.status(403).json({ error: 'This email is not authorized to create an account.' });
    } else {
      await pool.query('INSERT INTO authorized_users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    }

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rowCount) return res.status(409).json({ error: 'This email is already registered.' });

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash]);
    return res.status(201).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (!result.rowCount) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch {
    return res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => res.status(200).json({ user: req.user }));

app.get('/api/public/settings', async (_req, res) => {
  const result = await pool.query(
    'SELECT setting_key, setting_value FROM site_settings WHERE is_active = true ORDER BY setting_key'
  );
  res.status(200).json({ settings: result.rows });
});

app.get('/api/settings', authMiddleware, async (_req, res) => {
  const result = await pool.query('SELECT id, setting_key, setting_value, is_active FROM site_settings ORDER BY setting_key');
  res.status(200).json({ settings: result.rows });
});

app.put('/api/settings/bulk', authMiddleware, async (req, res) => {
  const settings = Array.isArray(req.body?.settings) ? req.body.settings : [];
  for (const setting of settings) {
    await pool.query(
      'UPDATE site_settings SET setting_value = $1, is_active = $2, updated_at = NOW() WHERE id = $3',
      [setting.setting_value || '', !!setting.is_active, setting.id]
    );
  }
  res.status(200).json({ success: true });
});

app.get('/api/weeks-with-contributions', async (_req, res) => {
  const weeks = await pool.query('SELECT * FROM weeks ORDER BY week_number ASC');
  const contributions = await pool.query('SELECT * FROM contributions');
  const payload = weeks.rows.map((week) => ({
    ...week,
    contributions: contributions.rows.filter((item) => item.week_id === week.id),
  }));
  res.status(200).json({ weeks: payload });
});

app.put('/api/contributions/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { image_url, text_content_html, font_family, image_size } = req.body || {};
  await pool.query(
    `UPDATE contributions
     SET image_url = COALESCE($1, image_url),
         text_content_html = COALESCE($2, text_content_html),
         font_family = COALESCE($3, font_family),
         image_size = COALESCE($4, image_size),
         updated_at = NOW()
     WHERE id = $5`,
    [image_url, text_content_html, font_family, image_size, id]
  );
  res.status(200).json({ success: true });
});

app.put('/api/weeks/:id/title', authMiddleware, async (req, res) => {
  await pool.query('UPDATE weeks SET title = $1 WHERE id = $2', [String(req.body?.title || ''), req.params.id]);
  res.status(200).json({ success: true });
});

app.get('/api/our-story', async (_req, res) => {
  const result = await pool.query('SELECT * FROM our_story_images ORDER BY display_order ASC');
  res.status(200).json({ images: result.rows });
});

app.post('/api/our-story', authMiddleware, async (req, res) => {
  const { image_url, caption, text_content, display_order, image_size } = req.body || {};
  const result = await pool.query(
    `INSERT INTO our_story_images (image_url, caption, text_content, display_order, image_size)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [image_url || null, caption || '', text_content || '', Number(display_order || 0), image_size || '600px']
  );
  res.status(201).json(result.rows[0]);
});

app.put('/api/our-story/:id', authMiddleware, async (req, res) => {
  const { caption, text_content, image_size } = req.body || {};
  await pool.query(
    `UPDATE our_story_images
     SET caption = $1, text_content = $2, image_size = $3, updated_at = NOW()
     WHERE id = $4`,
    [caption || '', text_content || '', image_size || '600px', req.params.id]
  );
  res.status(200).json({ success: true });
});

app.delete('/api/our-story/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM our_story_images WHERE id = $1', [req.params.id]);
  res.status(200).json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'name, email, and message are required.' });
    }
    await pool.query('INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)', [
      String(name),
      String(email),
      String(message),
    ]);
    return res.status(200).json({ success: true, message: 'Contact message received.' });
  } catch {
    return res.status(500).json({ success: false, error: 'Unknown error occurred' });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
