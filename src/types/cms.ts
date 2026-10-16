export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CmsProject {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  problem: string;
  built: string;
  architecture: string;
  lessonsLearned: string[];
  stack: string[];
  status: string;
  repoUrl: string;
  demoUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  imageAlt?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  startDate?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsSkillItem {
  id: string;
  categoryId: string;
  name: string;
  focusArea: string;
  level: string; // e.g. 'Core Fluency', 'Active Exploration'
  displayOrder: number;
  isPublished: boolean;
}

export interface CmsSkillCategory {
  id: string;
  category: string;
  kicker: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
  skills: CmsSkillItem[];
}

export interface CmsMilestone {
  id: string;
  logNumber: string;
  commitHash: string;
  branch: string;
  branchLabel?: string;
  date: string;
  title: string;
  summary: string;
  details: string;
  learnings: string[];
  marginAnnotation?: string;
  tags: string[];
  projectLink?: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface CmsProfile {
  name: string;
  title: string;
  subtitle: string;
  department: string;
  semester: string;
  institutionNote: string;
  currentInterests: string[];
  shortBio: string;
  philosophy: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
    location: string;
    statusLabel: string;
    customLinks?: Array<{
      id: string;
      label: string;
      url: string;
      iconName?: string;
      isEnabled: boolean;
    }>;
  };
}

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
