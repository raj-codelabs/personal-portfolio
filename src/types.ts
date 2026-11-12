export type Theme = 'stdout' | 'margin-notes';

// ponytail: Unified domain entities provide a single source of truth for static data and CMS hydrated models.

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  built: string;
  architecture: string;
  lessonsLearned: string[];
  stack: string[];
  status: string;
  repoUrl: string;
  demoUrl?: string;
  liveDemoUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  imageAlt?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
  startDate?: string;
  completionDate?: string;
  keyTakeaway?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Milestone {
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
  isPublished?: boolean;
  displayOrder?: number;
}

export interface SkillItem {
  id?: string;
  categoryId?: string;
  name: string;
  focusArea: string;
  level: string;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface SkillCategory {
  id?: string;
  category: string;
  kicker: string;
  description: string;
  displayOrder?: number;
  isPublished?: boolean;
  skills: SkillItem[];
}

export interface Profile {
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
  idBadgeQrUrl?: string;
  idBadgeNumber?: string;
  sketchGrayscaleUrl?: string;
  sketchColorUrl?: string;
  sketchCaption?: string;
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
