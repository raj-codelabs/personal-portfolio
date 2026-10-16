import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

// Extend Express Request to hold admin user
declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string;
        email: string;
      };
    }
  }
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Hash password with unique salt using scrypt
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

// Verify password in constant time
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const derivedHash = crypto.scryptSync(password, salt, 64);
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    return crypto.timingSafeEqual(derivedHash, expectedBuffer);
  } catch {
    return false;
  }
}

// Hash session token for secure storage
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Create a new session in database
export function createSession(adminId: string): { token: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  db.prepare(`
    INSERT INTO sessions (token_hash, admin_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(tokenHash, adminId, now.toISOString(), expiresAt.toISOString());

  return { token, expiresAt };
}

// Invalidate session
export function deleteSession(token: string): void {
  const tokenHash = hashToken(token);
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
}

// Clean up expired sessions periodically
export function purgeExpiredSessions(): void {
  const now = new Date().toISOString();
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now);
}

// Brute force protection check
export function checkRateLimit(ip: string): { isLocked: boolean; remainingSeconds?: number } {
  const row = db.prepare('SELECT attempts, last_attempt_at, locked_until FROM login_attempts WHERE ip = ?').get(ip) as {
    attempts: number;
    last_attempt_at: string;
    locked_until: string | null;
  } | undefined;

  if (!row) return { isLocked: false };

  if (row.locked_until) {
    const lockTime = new Date(row.locked_until).getTime();
    const now = Date.now();
    if (lockTime > now) {
      return { isLocked: true, remainingSeconds: Math.ceil((lockTime - now) / 1000) };
    }
  }

  return { isLocked: false };
}

// Record failed login attempt
export function recordFailedAttempt(ip: string): void {
  const row = db.prepare('SELECT attempts FROM login_attempts WHERE ip = ?').get(ip) as { attempts: number } | undefined;
  const now = new Date();

  if (!row) {
    db.prepare('INSERT INTO login_attempts (ip, attempts, last_attempt_at, locked_until) VALUES (?, 1, ?, NULL)')
      .run(ip, now.toISOString());
  } else {
    const attempts = row.attempts + 1;
    let lockedUntil: string | null = null;
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION_MS).toISOString();
    }
    db.prepare('UPDATE login_attempts SET attempts = ?, last_attempt_at = ?, locked_until = ? WHERE ip = ?')
      .run(attempts, now.toISOString(), lockedUntil, ip);
  }
}

// Reset failed login attempts on successful login
export function resetLoginAttempts(ip: string): void {
  db.prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
}

// Check if any admin exists
export function hasAdmin(): boolean {
  const row = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  return row.count > 0;
}

// Authentication Middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // Check authorization header first or fallback to cookie
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies.admin_session) {
    token = req.cookies.admin_session;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in as an administrator.' });
    return;
  }

  const tokenHash = hashToken(token);
  const now = new Date().toISOString();

  const sessionRow = db.prepare(`
    SELECT s.admin_id, s.expires_at, a.email
    FROM sessions s
    JOIN admins a ON s.admin_id = a.id
    WHERE s.token_hash = ? AND s.expires_at > ?
  `).get(tokenHash, now) as { admin_id: string; expires_at: string; email: string } | undefined;

  if (!sessionRow) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }

  req.adminUser = {
    id: sessionRow.admin_id,
    email: sessionRow.email,
  };

  next();
}
