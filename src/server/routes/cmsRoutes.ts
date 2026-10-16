import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import type {
  CmsProject,
  CmsSkillCategory,
  CmsSkillItem,
  CmsMilestone,
  CmsProfile,
  CmsSiteSettings,
  PublicPortfolioData,
} from '../../types/cms.js';

export const cmsRouter = Router();

// ==========================================
// 1. PUBLIC PORTFOLIO DATA (Published Only)
// ==========================================
cmsRouter.get('/public/portfolio', (req, res) => {
  try {
    // 1. Profile
    const profileRow = db.prepare('SELECT data_json FROM profile WHERE id = ?').get('current') as { data_json: string } | undefined;
    const profile: CmsProfile = profileRow ? JSON.parse(profileRow.data_json) : {};

    // 2. Site Settings
    const settingsRow = db.prepare('SELECT data_json FROM site_settings WHERE id = ?').get('current') as { data_json: string } | undefined;
    const siteSettings: CmsSiteSettings = settingsRow ? JSON.parse(settingsRow.data_json) : {};

    // 3. Projects (Published only, ordered by display_order)
    const projectRows = db.prepare(`
      SELECT * FROM projects
      WHERE is_published = 1
      ORDER BY display_order ASC, created_at DESC
    `).all() as any[];

    const projects: CmsProject[] = projectRows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      subtitle: r.subtitle,
      problem: r.problem,
      built: r.built,
      architecture: r.architecture,
      lessonsLearned: JSON.parse(r.lessons_json || '[]'),
      stack: JSON.parse(r.stack_json || '[]'),
      status: r.status,
      repoUrl: r.repo_url,
      demoUrl: r.demo_url || undefined,
      coverImage: r.cover_image || undefined,
      screenshots: JSON.parse(r.screenshots_json || '[]'),
      imageAlt: r.image_alt || undefined,
      isFeatured: Boolean(r.is_featured),
      isPublished: Boolean(r.is_published),
      displayOrder: r.display_order,
      startDate: r.start_date || undefined,
      completionDate: r.completion_date || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    // 4. Skills & Categories (Published only)
    const catRows = db.prepare(`
      SELECT * FROM skill_categories
      WHERE is_published = 1
      ORDER BY display_order ASC
    `).all() as any[];

    const skillRows = db.prepare(`
      SELECT * FROM skills
      WHERE is_published = 1
      ORDER BY display_order ASC
    `).all() as any[];

    const skillCategories: CmsSkillCategory[] = catRows.map((cat) => ({
      id: cat.id,
      category: cat.category,
      kicker: cat.kicker,
      description: cat.description,
      displayOrder: cat.display_order,
      isPublished: Boolean(cat.is_published),
      skills: skillRows
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          id: s.id,
          categoryId: s.category_id,
          name: s.name,
          focusArea: s.focus_area,
          level: s.level,
          displayOrder: s.display_order,
          isPublished: Boolean(s.is_published),
        })),
    }));

    // 5. Milestones (Published only)
    const milestoneRows = db.prepare(`
      SELECT * FROM milestones
      WHERE is_published = 1
      ORDER BY display_order ASC
    `).all() as any[];

    const milestones: CmsMilestone[] = milestoneRows.map((m) => ({
      id: m.id,
      logNumber: m.log_number,
      commitHash: m.commit_hash,
      branch: m.branch,
      branchLabel: m.branch_label || undefined,
      date: m.date,
      title: m.title,
      summary: m.summary,
      details: m.details,
      learnings: JSON.parse(m.learnings_json || '[]'),
      marginAnnotation: m.margin_annotation || undefined,
      tags: JSON.parse(m.tags_json || '[]'),
      projectLink: m.project_link || undefined,
      isPublished: Boolean(m.is_published),
      displayOrder: m.display_order,
    }));

    const responseData: PublicPortfolioData = {
      profile,
      projects,
      skillCategories,
      milestones,
      siteSettings,
    };

    res.json(responseData);
  } catch (err) {
    console.error('Error fetching public portfolio:', err);
    res.status(500).json({ error: 'Failed to load portfolio content.' });
  }
});

// ==========================================
// 2. ADMIN CMS ALL (Includes drafts)
// ==========================================
cmsRouter.get('/cms/all', requireAdmin, (req, res) => {
  try {
    const profileRow = db.prepare('SELECT data_json FROM profile WHERE id = ?').get('current') as { data_json: string } | undefined;
    const settingsRow = db.prepare('SELECT data_json FROM site_settings WHERE id = ?').get('current') as { data_json: string } | undefined;

    const projectRows = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC').all() as any[];
    const catRows = db.prepare('SELECT * FROM skill_categories ORDER BY display_order ASC').all() as any[];
    const skillRows = db.prepare('SELECT * FROM skills ORDER BY display_order ASC').all() as any[];
    const milestoneRows = db.prepare('SELECT * FROM milestones ORDER BY display_order ASC').all() as any[];

    const projects: CmsProject[] = projectRows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      subtitle: r.subtitle,
      problem: r.problem,
      built: r.built,
      architecture: r.architecture,
      lessonsLearned: JSON.parse(r.lessons_json || '[]'),
      stack: JSON.parse(r.stack_json || '[]'),
      status: r.status,
      repoUrl: r.repo_url,
      demoUrl: r.demo_url || undefined,
      coverImage: r.cover_image || undefined,
      screenshots: JSON.parse(r.screenshots_json || '[]'),
      imageAlt: r.image_alt || undefined,
      isFeatured: Boolean(r.is_featured),
      isPublished: Boolean(r.is_published),
      displayOrder: r.display_order,
      startDate: r.start_date || undefined,
      completionDate: r.completion_date || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    const skillCategories: CmsSkillCategory[] = catRows.map((cat) => ({
      id: cat.id,
      category: cat.category,
      kicker: cat.kicker,
      description: cat.description,
      displayOrder: cat.display_order,
      isPublished: Boolean(cat.is_published),
      skills: skillRows
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          id: s.id,
          categoryId: s.category_id,
          name: s.name,
          focusArea: s.focus_area,
          level: s.level,
          displayOrder: s.display_order,
          isPublished: Boolean(s.is_published),
        })),
    }));

    const milestones: CmsMilestone[] = milestoneRows.map((m) => ({
      id: m.id,
      logNumber: m.log_number,
      commitHash: m.commit_hash,
      branch: m.branch,
      branchLabel: m.branch_label || undefined,
      date: m.date,
      title: m.title,
      summary: m.summary,
      details: m.details,
      learnings: JSON.parse(m.learnings_json || '[]'),
      marginAnnotation: m.margin_annotation || undefined,
      tags: JSON.parse(m.tags_json || '[]'),
      projectLink: m.project_link || undefined,
      isPublished: Boolean(m.is_published),
      displayOrder: m.display_order,
    }));

    res.json({
      profile: profileRow ? JSON.parse(profileRow.data_json) : {},
      siteSettings: settingsRow ? JSON.parse(settingsRow.data_json) : {},
      projects,
      skillCategories,
      milestones,
    });
  } catch (err) {
    console.error('Error fetching admin CMS content:', err);
    res.status(500).json({ error: 'Failed to fetch CMS content.' });
  }
});

// ==========================================
// 3. PROFILE & SETTINGS MUTATIONS
// ==========================================
cmsRouter.put('/cms/profile', requireAdmin, (req, res) => {
  try {
    const profileData = req.body;
    if (!profileData || typeof profileData !== 'object') {
      res.status(400).json({ error: 'Invalid profile data.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('INSERT OR REPLACE INTO profile (id, data_json, updated_at) VALUES (?, ?, ?)')
      .run('current', JSON.stringify(profileData), now);

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

cmsRouter.put('/cms/settings', requireAdmin, (req, res) => {
  try {
    const settingsData = req.body;
    if (!settingsData || typeof settingsData !== 'object') {
      res.status(400).json({ error: 'Invalid settings data.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('INSERT OR REPLACE INTO site_settings (id, data_json, updated_at) VALUES (?, ?, ?)')
      .run('current', JSON.stringify(settingsData), now);

    res.json({ success: true, message: 'Site settings updated successfully.' });
  } catch (err) {
    console.error('Failed to update settings:', err);
    res.status(500).json({ error: 'Failed to update site settings.' });
  }
});

// ==========================================
// 4. PROJECTS CRUD
// ==========================================
cmsRouter.post('/cms/projects', requireAdmin, (req, res) => {
  try {
    const p = req.body;
    if (!p.title || !p.subtitle) {
      res.status(400).json({ error: 'Project title and subtitle are required.' });
      return;
    }

    const id = p.id || 'project-' + crypto.randomUUID().slice(0, 8);
    const slug = (p.slug || p.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check duplicate slug
    const existing = db.prepare('SELECT id FROM projects WHERE slug = ?').get(slug);
    if (existing) {
      res.status(400).json({ error: `Slug '${slug}' is already in use by another project.` });
      return;
    }

    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM projects').get() as { maxOrder: number | null };
    const displayOrder = p.displayOrder !== undefined ? p.displayOrder : (maxOrderRow.maxOrder ?? -1) + 1;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO projects (
        id, title, slug, subtitle, problem, built, architecture, lessons_json,
        stack_json, status, repo_url, demo_url, cover_image, screenshots_json,
        image_alt, is_featured, is_published, display_order, start_date, completion_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      p.title,
      slug,
      p.subtitle,
      p.problem || '',
      p.built || '',
      p.architecture || '',
      JSON.stringify(p.lessonsLearned || []),
      JSON.stringify(p.stack || []),
      p.status || 'Active Exploration',
      p.repoUrl || '',
      p.demoUrl || null,
      p.coverImage || null,
      JSON.stringify(p.screenshots || []),
      p.imageAlt || p.title,
      p.isFeatured ? 1 : 0,
      p.isPublished !== false ? 1 : 0,
      displayOrder,
      p.startDate || null,
      p.completionDate || null,
      now,
      now
    );

    res.status(201).json({ success: true, id, message: 'Project created successfully.' });
  } catch (err) {
    console.error('Failed to create project:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

cmsRouter.put('/cms/projects/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    const existingProject = db.prepare('SELECT id, slug FROM projects WHERE id = ?').get(id) as { id: string; slug: string } | undefined;
    if (!existingProject) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const slug = (p.slug || p.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Prevent duplicate slug on other project
    const duplicate = db.prepare('SELECT id FROM projects WHERE slug = ? AND id != ?').get(slug, id);
    if (duplicate) {
      res.status(400).json({ error: `Slug '${slug}' is already used by another project.` });
      return;
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE projects SET
        title = ?, slug = ?, subtitle = ?, problem = ?, built = ?, architecture = ?,
        lessons_json = ?, stack_json = ?, status = ?, repo_url = ?, demo_url = ?,
        cover_image = ?, screenshots_json = ?, image_alt = ?, is_featured = ?,
        is_published = ?, display_order = ?, start_date = ?, completion_date = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      p.title,
      slug,
      p.subtitle,
      p.problem || '',
      p.built || '',
      p.architecture || '',
      JSON.stringify(p.lessonsLearned || []),
      JSON.stringify(p.stack || []),
      p.status || 'Active Exploration',
      p.repoUrl || '',
      p.demoUrl || null,
      p.coverImage || null,
      JSON.stringify(p.screenshots || []),
      p.imageAlt || p.title,
      p.isFeatured ? 1 : 0,
      p.isPublished ? 1 : 0,
      p.displayOrder ?? 0,
      p.startDate || null,
      p.completionDate || null,
      now,
      id
    );

    res.json({ success: true, message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Failed to update project:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

cmsRouter.delete('/cms/projects/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete project:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

cmsRouter.post('/cms/projects/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'Array of project IDs required.' });
      return;
    }

    const updateStmt = db.prepare('UPDATE projects SET display_order = ? WHERE id = ?');
    orderedIds.forEach((id: string, idx: number) => {
      updateStmt.run(idx, id);
    });

    res.json({ success: true, message: 'Projects reordered.' });
  } catch (err) {
    console.error('Failed to reorder projects:', err);
    res.status(500).json({ error: 'Failed to reorder projects.' });
  }
});

// ==========================================
// 5. SKILL CATEGORIES & SKILLS CRUD
// ==========================================
cmsRouter.post('/cms/skill-categories', requireAdmin, (req, res) => {
  try {
    const c = req.body;
    if (!c.category) {
      res.status(400).json({ error: 'Category title is required.' });
      return;
    }

    const id = c.id || 'cat-' + crypto.randomUUID().slice(0, 8);
    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM skill_categories').get() as { maxOrder: number | null };
    const displayOrder = c.displayOrder !== undefined ? c.displayOrder : (maxOrderRow.maxOrder ?? -1) + 1;

    db.prepare(`
      INSERT INTO skill_categories (id, category, kicker, description, display_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, c.category, c.kicker || '', c.description || '', displayOrder, c.isPublished !== false ? 1 : 0);

    res.status(201).json({ success: true, id, message: 'Category created.' });
  } catch (err) {
    console.error('Failed to create skill category:', err);
    res.status(500).json({ error: 'Failed to create skill category.' });
  }
});

cmsRouter.put('/cms/skill-categories/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const c = req.body;

    db.prepare(`
      UPDATE skill_categories SET
        category = ?, kicker = ?, description = ?, display_order = ?, is_published = ?
      WHERE id = ?
    `).run(c.category, c.kicker || '', c.description || '', c.displayOrder ?? 0, c.isPublished ? 1 : 0, id);

    res.json({ success: true, message: 'Category updated.' });
  } catch (err) {
    console.error('Failed to update category:', err);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

cmsRouter.delete('/cms/skill-categories/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM skill_categories WHERE id = ?').run(id);
    res.json({ success: true, message: 'Category and its skills deleted.' });
  } catch (err) {
    console.error('Failed to delete category:', err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

cmsRouter.post('/cms/skills', requireAdmin, (req, res) => {
  try {
    const s = req.body;
    if (!s.categoryId || !s.name) {
      res.status(400).json({ error: 'Skill name and Category ID are required.' });
      return;
    }

    const id = s.id || 'skill-' + crypto.randomUUID().slice(0, 8);
    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM skills WHERE category_id = ?').get(s.categoryId) as { maxOrder: number | null };
    const displayOrder = s.displayOrder !== undefined ? s.displayOrder : (maxOrderRow.maxOrder ?? -1) + 1;

    db.prepare(`
      INSERT INTO skills (id, category_id, name, focus_area, level, display_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, s.categoryId, s.name, s.focusArea || '', s.level || 'Active Exploration', displayOrder, s.isPublished !== false ? 1 : 0);

    res.status(201).json({ success: true, id, message: 'Skill created.' });
  } catch (err) {
    console.error('Failed to create skill:', err);
    res.status(500).json({ error: 'Failed to create skill.' });
  }
});

cmsRouter.put('/cms/skills/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const s = req.body;

    db.prepare(`
      UPDATE skills SET
        category_id = ?, name = ?, focus_area = ?, level = ?, display_order = ?, is_published = ?
      WHERE id = ?
    `).run(s.categoryId, s.name, s.focusArea || '', s.level || 'Active Exploration', s.displayOrder ?? 0, s.isPublished ? 1 : 0, id);

    res.json({ success: true, message: 'Skill updated.' });
  } catch (err) {
    console.error('Failed to update skill:', err);
    res.status(500).json({ error: 'Failed to update skill.' });
  }
});

cmsRouter.delete('/cms/skills/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) {
    console.error('Failed to delete skill:', err);
    res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

// ==========================================
// 6. MILESTONES CRUD
// ==========================================
cmsRouter.post('/cms/milestones', requireAdmin, (req, res) => {
  try {
    const m = req.body;
    if (!m.title || !m.date) {
      res.status(400).json({ error: 'Milestone title and date are required.' });
      return;
    }

    const id = m.id || 'milestone-' + crypto.randomUUID().slice(0, 8);
    const maxOrderRow = db.prepare('SELECT MAX(display_order) as maxOrder FROM milestones').get() as { maxOrder: number | null };
    const displayOrder = m.displayOrder !== undefined ? m.displayOrder : (maxOrderRow.maxOrder ?? -1) + 1;

    db.prepare(`
      INSERT INTO milestones (
        id, log_number, commit_hash, branch, branch_label, date, title,
        summary, details, learnings_json, margin_annotation, tags_json,
        project_link, is_published, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      m.logNumber || `LOG #${String(displayOrder + 1).padStart(2, '0')}`,
      m.commitHash || crypto.randomBytes(3).toString('hex'),
      m.branch || 'main',
      m.branchLabel || null,
      m.date,
      m.title,
      m.summary || '',
      m.details || '',
      JSON.stringify(m.learnings || []),
      m.marginAnnotation || null,
      JSON.stringify(m.tags || []),
      m.projectLink || null,
      m.isPublished !== false ? 1 : 0,
      displayOrder
    );

    res.status(201).json({ success: true, id, message: 'Milestone created.' });
  } catch (err) {
    console.error('Failed to create milestone:', err);
    res.status(500).json({ error: 'Failed to create milestone.' });
  }
});

cmsRouter.put('/cms/milestones/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const m = req.body;

    db.prepare(`
      UPDATE milestones SET
        log_number = ?, commit_hash = ?, branch = ?, branch_label = ?, date = ?,
        title = ?, summary = ?, details = ?, learnings_json = ?, margin_annotation = ?,
        tags_json = ?, project_link = ?, is_published = ?, display_order = ?
      WHERE id = ?
    `).run(
      m.logNumber,
      m.commitHash,
      m.branch || 'main',
      m.branchLabel || null,
      m.date,
      m.title,
      m.summary || '',
      m.details || '',
      JSON.stringify(m.learnings || []),
      m.marginAnnotation || null,
      JSON.stringify(m.tags || []),
      m.projectLink || null,
      m.isPublished ? 1 : 0,
      m.displayOrder ?? 0,
      id
    );

    res.json({ success: true, message: 'Milestone updated.' });
  } catch (err) {
    console.error('Failed to update milestone:', err);
    res.status(500).json({ error: 'Failed to update milestone.' });
  }
});

cmsRouter.delete('/cms/milestones/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM milestones WHERE id = ?').run(id);
    res.json({ success: true, message: 'Milestone deleted.' });
  } catch (err) {
    console.error('Failed to delete milestone:', err);
    res.status(500).json({ error: 'Failed to delete milestone.' });
  }
});

cmsRouter.post('/cms/milestones/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'Array of milestone IDs required.' });
      return;
    }

    const updateStmt = db.prepare('UPDATE milestones SET display_order = ? WHERE id = ?');
    orderedIds.forEach((id: string, idx: number) => {
      updateStmt.run(idx, id);
    });

    res.json({ success: true, message: 'Milestones reordered.' });
  } catch (err) {
    console.error('Failed to reorder milestones:', err);
    res.status(500).json({ error: 'Failed to reorder milestones.' });
  }
});

// ==========================================
// 6. CONTACT INQUIRIES & MESSAGES
// ==========================================

// Public message submission
cmsRouter.post('/contact/messages', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Your name is required.' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.status(400).json({ error: 'Message must be at least 5 characters.' });
      return;
    }

    const id = `msg-${crypto.randomUUID()}`;
    const cleanSubject = (subject && typeof subject === 'string' && subject.trim()) ? subject.trim() : 'Portfolio Inquiry';
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO messages (id, name, email, subject, message, status, replied_at, admin_notes, created_at)
      VALUES (?, ?, ?, ?, ?, 'unread', NULL, NULL, ?)
    `).run(id, name.trim(), email.trim().toLowerCase(), cleanSubject, message.trim(), now);

    res.status(201).json({
      success: true,
      message: 'Your correspondence has been securely logged. Thank you for reaching out.',
      id,
    });
  } catch (err) {
    console.error('Failed to save message:', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again later.' });
  }
});

// Admin: Get all messages
cmsRouter.get('/cms/messages', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all() as any[];
    const messages = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: r.message,
      status: r.status,
      repliedAt: r.replied_at || undefined,
      adminNotes: r.admin_notes || undefined,
      createdAt: r.created_at,
    }));

    res.json(messages);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Admin: Update message status or notes
cmsRouter.put('/cms/messages/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, repliedAt } = req.body;

    const existing = db.prepare('SELECT id FROM messages WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    db.prepare(`
      UPDATE messages SET
        status = COALESCE(?, status),
        admin_notes = COALESCE(?, admin_notes),
        replied_at = COALESCE(?, replied_at)
      WHERE id = ?
    `).run(status ?? null, adminNotes ?? null, repliedAt ?? null, id);

    res.json({ success: true, message: 'Message updated.' });
  } catch (err) {
    console.error('Failed to update message:', err);
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

// Admin: Delete message
cmsRouter.delete('/cms/messages/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    console.error('Failed to delete message:', err);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

// ==========================================
// 7. DASHBOARD STATS & AUDIT OVERVIEW
// ==========================================
cmsRouter.get('/cms/stats', requireAdmin, (req, res) => {
  try {
    const totalProjects = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;
    const publishedProjects = (db.prepare('SELECT COUNT(*) as c FROM projects WHERE is_published = 1').get() as { c: number }).c;
    const totalCategories = (db.prepare('SELECT COUNT(*) as c FROM skill_categories').get() as { c: number }).c;
    const totalSkills = (db.prepare('SELECT COUNT(*) as c FROM skills').get() as { c: number }).c;
    const totalMilestones = (db.prepare('SELECT COUNT(*) as c FROM milestones').get() as { c: number }).c;
    const totalMessages = (db.prepare('SELECT COUNT(*) as c FROM messages').get() as { c: number }).c;
    const unreadMessages = (db.prepare("SELECT COUNT(*) as c FROM messages WHERE status = 'unread'").get() as { c: number }).c;

    const lastProjectUpdate = (db.prepare('SELECT MAX(updated_at) as u FROM projects').get() as { u: string | null }).u;
    const lastProfileUpdate = (db.prepare('SELECT updated_at FROM profile WHERE id = ?').get('current') as { updated_at: string } | undefined)?.updated_at;

    res.json({
      projectsCount: totalProjects,
      publishedProjectsCount: publishedProjects,
      categoriesCount: totalCategories,
      skillsCount: totalSkills,
      milestonesCount: totalMilestones,
      messagesCount: totalMessages,
      unreadMessagesCount: unreadMessages,
      lastUpdated: lastProjectUpdate || lastProfileUpdate || new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to fetch CMS stats:', err);
    res.status(500).json({ error: 'Failed to fetch CMS statistics.' });
  }
});

// ==========================================
// 8. BACKUP EXPORT & IMPORT (JSON)
// ==========================================
cmsRouter.get('/cms/export', requireAdmin, (req, res) => {
  try {
    const profileRow = db.prepare('SELECT data_json FROM profile WHERE id = ?').get('current') as { data_json: string } | undefined;
    const settingsRow = db.prepare('SELECT data_json FROM site_settings WHERE id = ?').get('current') as { data_json: string } | undefined;
    const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC').all();
    const categories = db.prepare('SELECT * FROM skill_categories ORDER BY display_order ASC').all();
    const skills = db.prepare('SELECT * FROM skills ORDER BY display_order ASC').all();
    const milestones = db.prepare('SELECT * FROM milestones ORDER BY display_order ASC').all();
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();

    const backup = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      profile: profileRow ? JSON.parse(profileRow.data_json) : null,
      siteSettings: settingsRow ? JSON.parse(settingsRow.data_json) : null,
      projects,
      skillCategories: categories,
      skills,
      milestones,
      messages,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    res.json(backup);
  } catch (err) {
    console.error('Failed to export CMS backup:', err);
    res.status(500).json({ error: 'Failed to export backup.' });
  }
});

cmsRouter.post('/cms/import', requireAdmin, (req, res) => {
  try {
    const backup = req.body;
    if (!backup || typeof backup !== 'object') {
      res.status(400).json({ error: 'Invalid backup file format.' });
      return;
    }

    const now = new Date().toISOString();

    if (backup.profile) {
      db.prepare('INSERT OR REPLACE INTO profile (id, data_json, updated_at) VALUES (?, ?, ?)')
        .run('current', JSON.stringify(backup.profile), now);
    }

    if (backup.siteSettings) {
      db.prepare('INSERT OR REPLACE INTO site_settings (id, data_json, updated_at) VALUES (?, ?, ?)')
        .run('current', JSON.stringify(backup.siteSettings), now);
    }

    if (Array.isArray(backup.projects)) {
      db.prepare('DELETE FROM projects').run();
      const insertProj = db.prepare(`
        INSERT INTO projects (
          id, title, slug, subtitle, problem, built, architecture, lessons_json,
          stack_json, status, repo_url, demo_url, cover_image, screenshots_json,
          image_alt, is_featured, is_published, display_order, start_date, completion_date,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of backup.projects) {
        insertProj.run(
          p.id, p.title, p.slug, p.subtitle, p.problem, p.built, p.architecture,
          typeof p.lessons_json === 'string' ? p.lessons_json : JSON.stringify(p.lessonsLearned || []),
          typeof p.stack_json === 'string' ? p.stack_json : JSON.stringify(p.stack || []),
          p.status, p.repo_url || p.repoUrl, p.demo_url || p.demoUrl || null,
          p.cover_image || p.coverImage || null,
          typeof p.screenshots_json === 'string' ? p.screenshots_json : JSON.stringify(p.screenshots || []),
          p.image_alt || p.imageAlt || null,
          p.is_featured ?? (p.isFeatured ? 1 : 0),
          p.is_published ?? (p.isPublished !== false ? 1 : 0),
          p.display_order ?? p.displayOrder ?? 0,
          p.start_date || p.startDate || null,
          p.completion_date || p.completionDate || null,
          p.created_at || now,
          p.updated_at || now
        );
      }
    }

    if (Array.isArray(backup.skillCategories)) {
      db.prepare('DELETE FROM skill_categories').run();
      const insertCat = db.prepare(`
        INSERT INTO skill_categories (id, category, kicker, description, display_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const c of backup.skillCategories) {
        insertCat.run(
          c.id, c.category, c.kicker, c.description,
          c.display_order ?? c.displayOrder ?? 0,
          c.is_published ?? (c.isPublished !== false ? 1 : 0)
        );
      }
    }

    if (Array.isArray(backup.skills)) {
      db.prepare('DELETE FROM skills').run();
      const insertSkill = db.prepare(`
        INSERT INTO skills (id, category_id, name, focus_area, level, display_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of backup.skills) {
        insertSkill.run(
          s.id, s.category_id || s.categoryId, s.name,
          s.focus_area || s.focusArea, s.level,
          s.display_order ?? s.displayOrder ?? 0,
          s.is_published ?? (s.isPublished !== false ? 1 : 0)
        );
      }
    }

    if (Array.isArray(backup.milestones)) {
      db.prepare('DELETE FROM milestones').run();
      const insertM = db.prepare(`
        INSERT INTO milestones (
          id, log_number, commit_hash, branch, branch_label, date, title,
          summary, details, learnings_json, margin_annotation, tags_json,
          project_link, is_published, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const m of backup.milestones) {
        insertM.run(
          m.id, m.log_number || m.logNumber, m.commit_hash || m.commitHash,
          m.branch || 'main', m.branch_label || m.branchLabel || null,
          m.date, m.title, m.summary || '', m.details || '',
          typeof m.learnings_json === 'string' ? m.learnings_json : JSON.stringify(m.learnings || []),
          m.margin_annotation || m.marginAnnotation || null,
          typeof m.tags_json === 'string' ? m.tags_json : JSON.stringify(m.tags || []),
          m.project_link || m.projectLink || null,
          m.is_published ?? (m.isPublished !== false ? 1 : 0),
          m.display_order ?? m.displayOrder ?? 0
        );
      }
    }

    res.json({ success: true, message: 'Portfolio backup successfully imported.' });
  } catch (err) {
    console.error('Failed to import backup:', err);
    res.status(500).json({ error: 'Failed to import backup: ' + (err as any)?.message });
  }
});

