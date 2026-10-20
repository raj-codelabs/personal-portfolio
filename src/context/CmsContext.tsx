import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { PublicPortfolioData, CmsProject, CmsSkillCategory, CmsMilestone, CmsProfile, CmsSiteSettings } from '../types/cms';
import { api } from '../services/api';
import { profileData as fallbackProfile } from '../data/profile';
import { projectsData as fallbackProjects } from '../data/projects';
import { skillsData as fallbackSkills } from '../data/skills';
import { milestonesData as fallbackMilestones } from '../data/journey';

const defaultFallbackSettings: CmsSiteSettings = {
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

interface CmsContextType {
  profile: CmsProfile;
  projects: CmsProject[];
  skillCategories: CmsSkillCategory[];
  milestones: CmsMilestone[];
  siteSettings: CmsSiteSettings;
  loading: boolean;
  error: string | null;
  refreshCms: () => Promise<void>;
  updateProfileDirectly: (updates: Partial<CmsProfile>) => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CmsProfile>(() => {
    try {
      const saved = localStorage.getItem('raj_portfolio_profile_override');
      if (saved) {
        return { ...fallbackProfile, ...JSON.parse(saved) } as CmsProfile;
      }
    } catch {}
    return fallbackProfile as CmsProfile;
  });
  const [projects, setProjects] = useState<CmsProject[]>(
    fallbackProjects.map((p, idx) => ({
      ...p,
      slug: p.id,
      isFeatured: idx < 3,
      isPublished: true,
      displayOrder: idx,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  );
  const [skillCategories, setSkillCategories] = useState<CmsSkillCategory[]>(
    fallbackSkills.map((c, idx) => ({
      id: `cat-${idx + 1}`,
      category: c.category,
      kicker: c.kicker,
      description: c.description,
      displayOrder: idx,
      isPublished: true,
      skills: c.skills.map((s, sIdx) => ({
        id: `skill-${idx + 1}-${sIdx + 1}`,
        categoryId: `cat-${idx + 1}`,
        name: s.name,
        focusArea: s.focusArea,
        level: s.level,
        displayOrder: sIdx,
        isPublished: true,
      })),
    }))
  );
  const [milestones, setMilestones] = useState<CmsMilestone[]>(
    fallbackMilestones.map((m, idx) => ({
      ...m,
      isPublished: true,
      displayOrder: idx,
    }))
  );
  const [siteSettings, setSiteSettings] = useState<CmsSiteSettings>(defaultFallbackSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateProfileDirectly = useCallback(async (updates: Partial<CmsProfile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem('raj_portfolio_profile_override', JSON.stringify(merged));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
      return merged;
    });

    try {
      await api.updateProfile(updates as CmsProfile);
    } catch {
      // Ignored if offline/unauthenticated
    }
  }, []);

  const fetchCmsData = useCallback(async () => {
    try {
      setLoading(true);
      const data: PublicPortfolioData = await api.getPublicPortfolio();
      if (data) {
        let mergedProfile = data.profile;
        try {
          const saved = localStorage.getItem('raj_portfolio_profile_override');
          if (saved) {
            mergedProfile = { ...data.profile, ...JSON.parse(saved) };
          }
        } catch {}

        if (mergedProfile && mergedProfile.name) setProfile(mergedProfile);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.skillCategories)) setSkillCategories(data.skillCategories);
        if (Array.isArray(data.milestones)) setMilestones(data.milestones);
        if (data.siteSettings && data.siteSettings.siteTitle) setSiteSettings(data.siteSettings);
        setError(null);
      }
    } catch (err: any) {
      console.warn('CMS public fetch fallback to static data:', err?.message || err);
      // Fallback data remains active so UI is resilient
      setError(err?.message || 'Using offline portfolio snapshot.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  return (
    <CmsContext.Provider
      value={{
        profile,
        projects,
        skillCategories,
        milestones,
        siteSettings,
        loading,
        error,
        refreshCms: fetchCmsData,
        updateProfileDirectly,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
