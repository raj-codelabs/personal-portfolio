import React, { useState, useMemo } from 'react';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import type { CmsSkillCategory, CmsSkillItem } from '../types/cms';
import {
  Cpu,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  Search,
} from 'lucide-react';

export const SkillsManager: React.FC = () => {
  const { skillCategories, refreshCms } = useCms();

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<CmsSkillCategory> | null>(null);
  const [isNewCat, setIsNewCat] = useState(false);

  // Skill Item Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<CmsSkillItem> | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Total skills counter
  const totalSkillsCount = useMemo(() => {
    return skillCategories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  }, [skillCategories]);

  // Category Handlers
  const openNewCategory = () => {
    setIsNewCat(true);
    setEditingCat({
      id: `cat-${Date.now()}`,
      category: '',
      kicker: 'Technical Tooling',
      description: '',
      displayOrder: skillCategories.length,
      isPublished: true,
      skills: [],
    });
    setError(null);
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: CmsSkillCategory) => {
    setIsNewCat(false);
    setEditingCat({ ...cat });
    setError(null);
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.category?.trim()) {
      setError('Category title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      if (isNewCat) {
        await api.createSkillCategory(editingCat);
      } else {
        await api.updateSkillCategory(editingCat.id!, editingCat);
      }
      await refreshCms();
      setCatModalOpen(false);
      setEditingCat(null);
    } catch (err: any) {
      console.error('Failed to save category:', err);
      setError(err?.message || 'Failed to save skill category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteSkillCategory(id);
      await refreshCms();
    } catch (err: any) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  // Skill Item Handlers
  const openNewSkill = (categoryId: string) => {
    setIsNewSkill(true);
    const cat = skillCategories.find((c) => c.id === categoryId);
    setEditingSkill({
      id: `skill-${Date.now()}`,
      categoryId,
      name: '',
      focusArea: '',
      level: 'Coursework & Projects',
      displayOrder: cat?.skills?.length || 0,
      isPublished: true,
    });
    setError(null);
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill: CmsSkillItem) => {
    setIsNewSkill(false);
    setEditingSkill({ ...skill });
    setError(null);
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name?.trim()) {
      setError('Skill name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      if (isNewSkill) {
        await api.createSkill(editingSkill);
      } else {
        await api.updateSkill(editingSkill.id!, editingSkill);
      }
      await refreshCms();
      setSkillModalOpen(false);
      setEditingSkill(null);
    } catch (err: any) {
      console.error('Failed to save skill item:', err);
      setError(err?.message || 'Failed to save skill item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      await refreshCms();
    } catch (err: any) {
      alert('Failed to delete skill item: ' + err.message);
    }
  };

  const handleToggleCategoryPublish = async (cat: CmsSkillCategory) => {
    try {
      await api.updateSkillCategory(cat.id, { isPublished: !cat.isPublished });
      await refreshCms();
    } catch (err: any) {
      alert('Failed to toggle category: ' + err.message);
    }
  };

  const handleToggleSkillPublish = async (skill: CmsSkillItem) => {
    try {
      await api.updateSkill(skill.id, { isPublished: !skill.isPublished });
      await refreshCms();
    } catch (err: any) {
      alert('Failed to toggle skill: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL EVIDENCE &amp; TOOLCHAIN LEDGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Skills &amp; Toolchain ({totalSkillsCount})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            {skillCategories.length} categories · Grouped high-density tables with instant publication controls
          </p>
        </div>

        <button
          onClick={openNewCategory}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-semibold bg-[var(--accent-primary)] text-[#0b0e14] hover:opacity-90 active:scale-[0.98] transition-transform transition-color transition-opacity cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills across all categories..."
            className="w-full pl-8 pr-7 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categorized High-Density Tables */}
      <div className="space-y-6">
        {skillCategories.map((cat, catIdx) => {
          const matchingSkills = (cat.skills || []).filter((s) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              s.name?.toLowerCase().includes(q) ||
              s.focusArea?.toLowerCase().includes(q) ||
              s.level?.toLowerCase().includes(q)
            );
          });

          if (searchQuery.trim() && matchingSkills.length === 0) return null;

          return (
            <div
              key={cat.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs"
            >
              {/* Category Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[var(--bg-page)]/80 border-b border-[var(--border-subtle)] font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent-primary)] font-bold">
                    0{catIdx + 1}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="font-bold text-[var(--text-primary)] text-sm">
                    {cat.category}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    ({matchingSkills.length} skills)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCategoryPublish(cat)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer ${
                      cat.isPublished
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                    }`}
                    title="Toggle Category Visibility"
                  >
                    {cat.isPublished ? 'Category Live' : 'Category Hidden'}
                  </button>

                  <button
                    onClick={() => openEditCategory(cat)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer"
                    title="Edit Category Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openNewSkill(cat.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/25 text-[11px] font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Skill</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-page)] cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills High-Density Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/40 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3 w-12 text-center font-semibold">#</th>
                      <th className="py-2 px-3 w-48 font-semibold">Skill / Tool</th>
                      <th className="py-2 px-3 min-w-[240px] font-semibold">Evidence &amp; Coursework Application</th>
                      <th className="py-2 px-3 w-36 font-semibold">Level Track</th>
                      <th className="py-2 px-3 w-24 text-center font-semibold">Visibility</th>
                      <th className="py-2 px-3 w-20 text-right pr-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]/50 font-mono">
                    {matchingSkills.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-[var(--text-muted)] text-[11px]">
                          No skills added to this category yet. Click "Add Skill" above.
                        </td>
                      </tr>
                    ) : (
                      matchingSkills.map((s, sIdx) => (
                        <tr
                          key={s.id}
                          className="hover:bg-[var(--bg-page)]/60 transition-colors"
                        >
                          <td className="py-2 px-3 text-center text-[var(--text-muted)] text-[11px]">
                            {sIdx + 1}
                          </td>
                          <td className="py-2 px-3 font-bold text-[var(--text-primary)]">
                            {s.name}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-[var(--text-secondary)] font-body">
                            {s.focusArea}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[10px] text-[var(--accent-primary)] font-semibold">
                              {s.level}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleToggleSkillPublish(s)}
                              className={`p-1 rounded cursor-pointer transition-colors ${
                                s.isPublished
                                  ? 'text-emerald-400 hover:text-emerald-300'
                                  : 'text-[var(--text-muted)] hover:text-zinc-300'
                              }`}
                              title={s.isPublished ? 'Published (Click to hide)' : 'Draft (Click to publish)'}
                            >
                              {s.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="py-2 px-3 text-right pr-4">
                            <div className="inline-flex items-center gap-1 justify-end">
                              <button
                                onClick={() => openEditSkill(s)}
                                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer"
                                title="Edit Skill"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(s.id)}
                                className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-page)] cursor-pointer"
                                title="Delete Skill"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {catModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-5 font-mono text-xs text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <span className="font-bold text-[var(--text-primary)] text-sm">
                {isNewCat ? 'New Skill Category' : 'Edit Skill Category'}
              </span>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCat.category || ''}
                  onChange={(e) =>
                    setEditingCat((prev) => ({ ...prev, category: e.target.value }))
                  }
                  placeholder="e.g. Languages, Engineering Toolchain"
                  required
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Kicker (Subtitle)
                </label>
                <input
                  type="text"
                  value={editingCat.kicker || ''}
                  onChange={(e) =>
                    setEditingCat((prev) => ({ ...prev, kicker: e.target.value }))
                  }
                  placeholder="e.g. Technical Tooling & Evidence"
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) =>
                    setEditingCat((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[var(--accent-primary)] text-[#0b0e14] font-semibold hover:opacity-90 active:scale-[0.98] cursor-pointer text-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Item Modal */}
      {skillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-5 font-mono text-xs text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <span className="font-bold text-[var(--text-primary)] text-sm">
                {isNewSkill ? 'New Skill Item' : 'Edit Skill Item'}
              </span>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Skill / Tool Name *
                </label>
                <input
                  type="text"
                  value={editingSkill.name || ''}
                  onChange={(e) =>
                    setEditingSkill((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Python 3.12, Git, VS Code"
                  required
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Focus Area / Coursework Evidence *
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.focusArea || ''}
                  onChange={(e) =>
                    setEditingSkill((prev) => ({ ...prev, focusArea: e.target.value }))
                  }
                  placeholder="e.g. CS50P certified, LLM study pipeline, AST parser tooling"
                  required
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Level / Track
                </label>
                <input
                  type="text"
                  value={editingSkill.level || ''}
                  onChange={(e) =>
                    setEditingSkill((prev) => ({ ...prev, level: e.target.value }))
                  }
                  placeholder="e.g. Core Fluency, Coursework & Projects, Active Exploration"
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[var(--accent-primary)] text-[#0b0e14] font-semibold hover:opacity-90 active:scale-[0.98] cursor-pointer text-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
