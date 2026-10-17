import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { profileData } from '../data/profile.js';
import { projectsData } from '../data/projects.js';
import { skillsData } from '../data/skills.js';
import { milestonesData } from '../data/journey.js';

const DB_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'portfolio.db');
export const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  // 1. Admins Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );
  `);

  // 2. Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
    );
  `);

  // 3. Login Attempts (Rate Limiting) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL,
      last_attempt_at TEXT NOT NULL,
      locked_until TEXT
    );
  `);

  // 4. Profile Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 5. Site Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 6. Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT NOT NULL,
      problem TEXT NOT NULL,
      built TEXT NOT NULL,
      architecture TEXT NOT NULL,
      lessons_json TEXT NOT NULL,
      stack_json TEXT NOT NULL,
      status TEXT NOT NULL,
      repo_url TEXT NOT NULL,
      demo_url TEXT,
      cover_image TEXT,
      screenshots_json TEXT,
      image_alt TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      start_date TEXT,
      completion_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 7. Skill Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skill_categories (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      kicker TEXT NOT NULL,
      description TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1
    );
  `);

  // 8. Skills Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      focus_area TEXT NOT NULL,
      level TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
    );
  `);

  // 9. Milestones Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      log_number TEXT NOT NULL,
      commit_hash TEXT NOT NULL,
      branch TEXT NOT NULL,
      branch_label TEXT,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      details TEXT NOT NULL,
      learnings_json TEXT NOT NULL,
      margin_annotation TEXT,
      tags_json TEXT NOT NULL,
      project_link TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 10. Media Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      uploaded_at TEXT NOT NULL
    );
  `);

  // 11. Contact Inquiries & Messages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      replied_at TEXT,
      admin_notes TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default data if empty
  seedInitialDataIfEmpty();
}

export { purgeExpiredSessions } from './auth.js';

function seedInitialDataIfEmpty() {
  const now = new Date().toISOString();

  // 1. Seed Profile
  const profileRow = db.prepare('SELECT id FROM profile WHERE id = ?').get('current');
  if (!profileRow) {
    const defaultProfile = {
      ...profileData,
      primaryCtaText: 'Inspect Repositories',
      primaryCtaLink: '#projects',
      secondaryCtaText: 'Milestone DAG Graph',
      secondaryCtaLink: '#journey',
      avatarUrl: '',
      contact: {
        ...profileData.contact,
        customLinks: [],
      },
    };
    db.prepare('INSERT INTO profile (id, data_json, updated_at) VALUES (?, ?, ?)')
      .run('current', JSON.stringify(defaultProfile), now);
  }

  // 2. Seed Site Settings
  const settingsRow = db.prepare('SELECT id FROM site_settings WHERE id = ?').get('current');
  if (!settingsRow) {
    const defaultSettings = {
      siteTitle: 'Raj Golder · Systems & Foundational Machine Learning',
      siteDescription: 'First-principles engineering portfolio of Raj Golder, B.Tech CSE (AI/ML) student, featuring live invariant workbenches, C memory allocators, and autograd DAGs.',
      defaultTheme: 'stdout',
      themeToggleVisible: true,
      footerNote: 'All project architectures and invariant diagrams documented for academic review.',
      sectionsVisibility: {
        hero: true,
        projects: true,
        journey: true,
        skills: true,
        about: true,
        contact: true,
      },
      sectionOrder: ['hero', 'projects', 'journey', 'skills', 'about', 'contact'],
    };
    db.prepare('INSERT INTO site_settings (id, data_json, updated_at) VALUES (?, ?, ?)')
      .run('current', JSON.stringify(defaultSettings), now);
  }

  // 3. Seed Projects
  const projectCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, title, slug, subtitle, problem, built, architecture, lessons_json,
        stack_json, status, repo_url, demo_url, cover_image, screenshots_json,
        image_alt, is_featured, is_published, display_order, start_date, completion_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    projectsData.forEach((p, idx) => {
      const slug = p.id.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      insertProject.run(
        p.id,
        p.title,
        slug,
        p.subtitle,
        p.problem,
        p.built,
        p.architecture,
        JSON.stringify(p.lessonsLearned),
        JSON.stringify(p.stack),
        p.status,
        p.repoUrl,
        (p as any).demoUrl || (p as any).liveDemoUrl || null,
        null,
        JSON.stringify([]),
        p.title,
        idx < 3 ? 1 : 0, // feature first 3
        1, // published
        idx,
        null,
        null,
        now,
        now
      );
    });
  }

  // 4. Seed Skills & Categories
  const categoryCount = (db.prepare('SELECT COUNT(*) as count FROM skill_categories').get() as { count: number }).count;
  if (categoryCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO skill_categories (id, category, kicker, description, display_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertSkill = db.prepare(`
      INSERT INTO skills (id, category_id, name, focus_area, level, display_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    skillsData.forEach((cat, catIdx) => {
      const catId = `cat-${catIdx + 1}-${cat.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      insertCat.run(catId, cat.category, cat.kicker, cat.description, catIdx, 1);

      cat.skills.forEach((skill, skillIdx) => {
        const skillId = `skill-${catIdx + 1}-${skillIdx + 1}`;
        insertSkill.run(skillId, catId, skill.name, skill.focusArea, skill.level, skillIdx, 1);
      });
    });
  }

  // 5. Seed Milestones
  const milestoneCount = (db.prepare('SELECT COUNT(*) as count FROM milestones').get() as { count: number }).count;
  if (milestoneCount === 0) {
    const insertMilestone = db.prepare(`
      INSERT INTO milestones (
        id, log_number, commit_hash, branch, branch_label, date, title,
        summary, details, learnings_json, margin_annotation, tags_json,
        project_link, is_published, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    milestonesData.forEach((m, idx) => {
      insertMilestone.run(
        m.id,
        m.logNumber,
        m.commitHash,
        m.branch,
        m.branchLabel || null,
        m.date,
        m.title,
        m.summary,
        m.details,
        JSON.stringify(m.learnings),
        m.marginAnnotation || null,
        JSON.stringify(m.tags),
        null,
        1,
        idx
      );
    });
  }

  // 6. Seed Inquiries & Messages
  const messageCount = (db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number }).count;
  if (messageCount === 0) {
    const insertMessage = db.prepare(`
      INSERT INTO messages (id, name, email, subject, message, status, replied_at, admin_notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMessage.run(
      'msg-1',
      'Dr. Elena Rostova',
      'elena.rostova@lab-invariants.org',
      'Inquiry on custom buddy allocator benchmarks and safety invariants',
      'Hello Raj, I reviewed your first-principles memory allocator write-up. The explicit invariant tracking for free-list coalesce operations is very well structured. Are you planning to extend this to multi-threaded arenas or slab allocations for small object graphs? Would welcome a discussion regarding an undergraduate research fellowship.',
      'unread',
      null,
      'Review thesis proposal before replying',
      new Date(Date.now() - 36 * 3600 * 1000).toISOString()
    );

    insertMessage.run(
      'msg-2',
      'Marcus Chen',
      'marcus.chen@compilers-symposium.io',
      'Invitation: Systems & Compilers Reading Group lightning demo',
      'Hi Raj, saw your regex engine bytecode interpreter demo. We have a virtual session on finite automata vs recursive descent virtual machines next month. Let us know if you would like a 15-minute slot to present your DAG visualization.',
      'read',
      new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      'Replied confirming interest for demo session',
      new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    );
  }
}

