import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

export const mediaRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

// File filter: strict image mime types
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, SVG, and GIF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET /api/media - list all media
mediaRouter.get('/media', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all() as any[];
    const media = rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.original_name,
      mimeType: r.mime_type,
      sizeBytes: r.size_bytes,
      url: r.url,
      altText: r.alt_text || '',
      uploadedAt: r.uploaded_at,
    }));
    res.json(media);
  } catch (err) {
    console.error('Failed to list media:', err);
    res.status(500).json({ error: 'Failed to list media.' });
  }
});

// POST /api/media/upload - upload image
mediaRouter.post('/media/upload', requireAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded.' });
      return;
    }

    const file = req.file;
    const id = 'media-' + crypto.randomUUID().slice(0, 8);
    const url = `/uploads/${file.filename}`;
    const altText = req.body.altText || path.basename(file.originalname, path.extname(file.originalname));
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO media (id, filename, original_name, mime_type, size_bytes, url, alt_text, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, file.filename, file.originalname, file.mimetype, file.size, url, altText, now);

    res.status(201).json({
      success: true,
      media: {
        id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        url,
        altText,
        uploadedAt: now,
      },
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload media.' });
  }
});

// DELETE /api/media/:id - delete image
mediaRouter.delete('/media/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT filename FROM media WHERE id = ?').get(id) as { filename: string } | undefined;
    if (!row) {
      res.status(404).json({ error: 'Media not found.' });
      return;
    }

    // Delete file from disk
    const filePath = path.join(UPLOADS_DIR, row.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Could not remove file from disk:', e);
      }
    }

    db.prepare('DELETE FROM media WHERE id = ?').run(id);
    res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete media:', err);
    res.status(500).json({ error: 'Failed to delete media.' });
  }
});

// PUT /api/media/:id - update alt text
mediaRouter.put('/media/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { altText } = req.body;
    db.prepare('UPDATE media SET alt_text = ? WHERE id = ?').run(altText || '', id);
    res.json({ success: true, message: 'Alt text updated.' });
  } catch (err) {
    console.error('Failed to update media:', err);
    res.status(500).json({ error: 'Failed to update media.' });
  }
});
