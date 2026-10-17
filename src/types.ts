export type Theme = 'stdout' | 'margin-notes';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  built: string;
  stack: string[];
  status: 'Completed' | 'Active Exploration' | 'Prototype Experiment' | 'completed' | 'active' | 'archived' | string;
  repoUrl: string;
  liveDemoUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  imageAlt?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
  startDate?: string;
  completionDate?: string;
  architecture: string;
  lessonsLearned: string[];
  keyTakeaway?: string;
}

export interface Milestone {
  id: string;
  logNumber: string;
  commitHash: string;
  branch: 'main' | 'ml-core' | 'systems';
  branchLabel?: string;
  date: string;
  title: string;
  summary: string;
  details: string;
  learnings: string[];
  marginAnnotation?: string;
  tags: string[];
}

export interface SkillItem {
  name: string;
  level: 'Core Fluency' | 'Active Exploration' | 'Foundations';
  focusArea: string;
}

export interface SkillCategory {
  category: string;
  kicker: string;
  description: string;
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
  contact: {
    email: string;
    github: string;
    linkedin: string;
    location: string;
    statusLabel: string;
  };
}
