import crypto from 'node:crypto';
import { parse as parseCookieHeader } from 'cookie';

const SESSION_COOKIE = 'app_session_id';
const SECRET_KEY = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'pavi-designer-studio-secret-key-32chars';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function authenticate(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const token = signToken({
      username,
      role: 'admin',
      name: 'Pavi Studio Administrator',
      exp: expiresAt,
    });
    return {
      token,
      user: {
        username,
        role: 'admin',
        name: 'Pavi Studio Administrator',
      },
    };
  }
  return null;
}

export function getSessionUser(req) {
  let token = null;
  // 1. Try cookie
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    token = cookies[SESSION_COOKIE];
  }
  // 2. Try Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  }
  return verifyToken(token);
}

export function requireAdmin(req, res, next) {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Admin sign-in required.' },
    });
  }
  req.adminUser = user;
  next();
}

export { SESSION_COOKIE };
