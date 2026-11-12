import type { Project, Milestone, SkillItem, SkillCategory, Profile } from '../types.js';

// ponytail: CMS models extend the unified domain types with database audit and ordering fields.

export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type CmsProject = Project & {
  slug: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
};

export type CmsSkillItem = SkillItem & {
  id: string;
  categoryId: string;
  displayOrder: number;
  isPublished: boolean;
};

export type CmsSkillCategory = Omit<SkillCategory, 'skills'> & {
  id: string;
  displayOrder: number;
  isPublished: boolean;
  skills: CmsSkillItem[];
};

export type CmsMilestone = Milestone & {
  isPublished: boolean;
  displayOrder: number;
};

export type CmsProfile = Profile;

export interface CmsMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  repliedAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface CmsSiteSettings {
  siteTitle: string;
  siteDescription: string;
  defaultTheme: 'stdout' | 'margin-notes';
  themeToggleVisible: boolean;
  footerNote: string;
  sectionsVisibility: {
    hero: boolean;
    projects: boolean;
    journey: boolean;
    skills: boolean;
    about: boolean;
    contact: boolean;
  };
  sectionOrder: string[];
}

export interface CmsMediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText: string;
  uploadedAt: string;
}

export interface PublicPortfolioData {
  profile: CmsProfile;
  projects: CmsProject[];
  skillCategories: CmsSkillCategory[];
  milestones: CmsMilestone[];
  siteSettings: CmsSiteSettings;
}
