import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  hasAdmin,
  checkRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  requireAdmin,
} from '../auth.js';

export const authRouter = Router();

// Check if system requires initial first-admin initialization
authRouter.get('/setup-status', (req, res) => {
  const adminExists = hasAdmin();
  res.json({
    needsSetup: !adminExists,
    hasAdmin: adminExists,
  });
});

// Setup First Administrator (Permitted only if 0 admins exist)
authRouter.post('/setup-first-admin', (req, res) => {
  if (hasAdmin()) {
    res.status(403).json({
      error: 'Administrator already provisioned. Initial setup is permanently locked.',
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Valid email address is required.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const adminId = 'admin-' + crypto.randomUUID();
  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO admins (id, email, password_hash, salt, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, email.trim().toLowerCase(), hash, salt, now, now);

    // Automatically create session
    const { token, expiresAt } = createSession(adminId);

    // Set secure HTTP-only cookie
    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
    });

    res.status(201).json({
      success: true,
      message: 'First administrator provisioned successfully.',
      admin: {
        id: adminId,
        email: email.trim().toLowerCase(),
      },
      token,
    });
  } catch (err) {
    console.error('Failed to create first admin:', err);
    res.status(500).json({ error: 'Failed to create administrator account.' });
  }
});

// Administrator Login
authRouter.post('/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(ip);
  if (rateLimit.isLocked) {
    res.status(429).json({
      error: `Too many failed attempts. Account temporarily locked for ${rateLimit.remainingSeconds} seconds.`,
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const adminRow = db.prepare('SELECT id, email, password_hash, salt FROM admins WHERE email = ?').get(cleanEmail) as {
    id: string;
    email: string;
    password_hash: string;
    salt: string;
  } | undefined;

  if (!adminRow || !verifyPassword(password, adminRow.salt, adminRow.password_hash)) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  // Success: reset attempts and record last login
  resetLoginAttempts(ip);
  const now = new Date().toISOString();
  db.prepare('UPDATE admins SET last_login_at = ? WHERE id = ?').run(now, adminRow.id);

  const { token, expiresAt } = createSession(adminRow.id);

  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });

  res.json({
    success: true,
    admin: {
      id: adminRow.id,
      email: adminRow.email,
    },
    token,
  });
});

// Logout
authRouter.post('/logout', (req, res) => {
  let token = req.cookies?.admin_session;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (token) {
    deleteSession(token);
  }

  res.clearCookie('admin_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.json({ success: true, message: 'Logged out successfully.' });
});

// Check current session
authRouter.get('/me', requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    admin: req.adminUser,
  });
});

// Change Password
authRouter.post('/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'Current password and a new password (min 8 chars) are required.' });
    return;
  }

  const adminId = req.adminUser!.id;
  const adminRow = db.prepare('SELECT password_hash, salt FROM admins WHERE id = ?').get(adminId) as {
    password_hash: string;
    salt: string;
  };

  if (!verifyPassword(currentPassword, adminRow.salt, adminRow.password_hash)) {
    res.status(400).json({ error: 'Incorrect current password.' });
    return;
  }

  const { salt, hash } = hashPassword(newPassword);
  db.prepare('UPDATE admins SET password_hash = ?, salt = ? WHERE id = ?').run(hash, salt, adminId);

  res.json({ success: true, message: 'Password updated successfully.' });
});
