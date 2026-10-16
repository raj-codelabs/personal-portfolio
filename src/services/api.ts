import type {
  PublicPortfolioData,
  CmsProject,
  CmsSkillCategory,
  CmsSkillItem,
  CmsMilestone,
  CmsProfile,
  CmsSiteSettings,
  CmsMediaItem,
  CmsMessage,
  AdminUser,
} from '../types/cms';

const API_BASE = '/api';

// Helper for fetch with credentials and error parsing
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Check for local session token fallback if cookie is partitioned
  const localToken = localStorage.getItem('admin_token');
  if (localToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${localToken}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // sends HTTP-only session cookie
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.error) {
        errorMsg = errorJson.error;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Public Portfolio Data
  async getPublicPortfolio(): Promise<PublicPortfolioData> {
    return request<PublicPortfolioData>('/public/portfolio');
  },

  // Auth Endpoints
  async getSetupStatus(): Promise<{ needsSetup: boolean; hasAdmin: boolean }> {
    return request('/auth/setup-status');
  },

  async setupFirstAdmin(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
    const res = await request<{ admin: AdminUser; token: string }>('/auth/setup-first-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('admin_token', res.token);
    }
    return res;
  },

  async login(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
    const res = await request<{ admin: AdminUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('admin_token', res.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  async getMe(): Promise<{ authenticated: boolean; admin: AdminUser }> {
    return request('/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // CMS Admin Operations
  async getCmsAll(): Promise<{
    profile: CmsProfile;
    siteSettings: CmsSiteSettings;
    projects: CmsProject[];
    skillCategories: CmsSkillCategory[];
    milestones: CmsMilestone[];
  }> {
    return request('/cms/all');
  },

  async updateProfile(profile: CmsProfile): Promise<{ success: boolean }> {
    return request('/cms/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async updateSettings(settings: CmsSiteSettings): Promise<{ success: boolean }> {
    return request('/cms/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Projects CRUD
  async createProject(project: Partial<CmsProject>): Promise<{ success: boolean; id: string }> {
    return request('/cms/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updateProject(id: string, project: Partial<CmsProject>): Promise<{ success: boolean }> {
    return request(`/cms/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return request(`/cms/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async reorderProjects(orderedIds: string[]): Promise<{ success: boolean }> {
    return request('/cms/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds }),
    });
  },

  // Skills & Categories CRUD
  async createSkillCategory(category: Partial<CmsSkillCategory>): Promise<{ success: boolean; id: string }> {
    return request('/cms/skill-categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateSkillCategory(id: string, category: Partial<CmsSkillCategory>): Promise<{ success: boolean }> {
    return request(`/cms/skill-categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async deleteSkillCategory(id: string): Promise<{ success: boolean }> {
    return request(`/cms/skill-categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async createSkill(skill: Partial<CmsSkillItem>): Promise<{ success: boolean; id: string }> {
    return request('/cms/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  },

  async updateSkill(id: string, skill: Partial<CmsSkillItem>): Promise<{ success: boolean }> {
    return request(`/cms/skills/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(skill),
    });
  },

  async deleteSkill(id: string): Promise<{ success: boolean }> {
    return request(`/cms/skills/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Milestones CRUD
  async createMilestone(milestone: Partial<CmsMilestone>): Promise<{ success: boolean; id: string }> {
    return request('/cms/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone),
    });
  },

  async updateMilestone(id: string, milestone: Partial<CmsMilestone>): Promise<{ success: boolean }> {
    return request(`/cms/milestones/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(milestone),
    });
  },

  async deleteMilestone(id: string): Promise<{ success: boolean }> {
    return request(`/cms/milestones/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async reorderMilestones(orderedIds: string[]): Promise<{ success: boolean }> {
    return request('/cms/milestones/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds }),
    });
  },

  // Media Management
  async getMedia(): Promise<CmsMediaItem[]> {
    return request<CmsMediaItem[]>('/media');
  },

  async uploadMedia(file: File, altText?: string): Promise<{ success: boolean; media: CmsMediaItem }> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }
    return request('/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    return request(`/media/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async updateMediaAlt(id: string, altText: string): Promise<{ success: boolean }> {
    return request(`/media/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ altText }),
    });
  },

  // Contact Inquiries & Messages
  async sendContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string; id: string }> {
    return request('/contact/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMessages(): Promise<CmsMessage[]> {
    return request<CmsMessage[]>('/cms/messages');
  },

  async updateMessage(id: string, updates: { status?: 'unread' | 'read' | 'archived'; adminNotes?: string; repliedAt?: string }): Promise<{ success: boolean }> {
    return request(`/cms/messages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteMessage(id: string): Promise<{ success: boolean }> {
    return request(`/cms/messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // CMS Dashboard Statistics & Health
  async getCmsStats(): Promise<{
    projectsCount: number;
    publishedProjectsCount: number;
    categoriesCount: number;
    skillsCount: number;
    milestonesCount: number;
    messagesCount: number;
    unreadMessagesCount: number;
    lastUpdated: string;
  }> {
    return request('/cms/stats');
  },

  // Backup Export & Import
  async exportBackup(): Promise<any> {
    return request('/cms/export');
  },

  async importBackup(data: any): Promise<{ success: boolean; message: string }> {
    return request('/cms/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

