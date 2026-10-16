import React, { useState } from 'react';
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
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
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

  // Category Handlers
  const openNewCategory = () => {
    setIsNewCat(true);
    setEditingCat({
      id: `cat-${Date.now()}`,
      category: '',
      kicker: '04 // NEW APPARATUS DOMAIN',
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
    if (!window.confirm('Delete this entire skill category and its associated skills?')) return;
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
      level: 'Core Fluency',
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
      alert('Failed to delete skill: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>FOUNDATIONS & METHODOLOGY TAXONOMY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Technical Apparatus & Skills
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Manage competencies, language proficiencies, verification environments, and experimental systems.
          </p>
        </div>

        <button
          onClick={openNewCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Category Domain</span>
        </button>
      </div>

      {/* Categories & Skills List */}
      <div className="space-y-6">
        {skillCategories.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded">
            No skill categories defined. Click "New Category Domain" to create your first category.
          </div>
        ) : (
          skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="text-[11px] font-mono text-[var(--accent-primary)]">{cat.kicker}</div>
                  <h2 className="text-base font-bold font-display text-[var(--text-primary)] flex items-center gap-2">
                    <span>{cat.category}</span>
                    {!cat.isPublished && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        HIDDEN
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{cat.description}</p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <button
                    onClick={() => openNewSkill(cat.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>

                  <button
                    onClick={() => openEditCategory(cat)}
                    className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                    title="Edit category details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
                {cat.skills?.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-copper)] transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--text-primary)] truncate">{s.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{s.focusArea}</div>
                      <div className="mt-1">
                        <span className="text-[10px] px-1.5 py-0.2 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)]">
                          {s.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditSkill(s)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {catModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-5 text-left font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold font-display text-[var(--text-primary)]">
                {isNewCat ? 'Create Category Domain' : 'Edit Category Domain'}
              </h2>
              <button
                onClick={() => setCatModalOpen(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="text-rose-400 text-xs">{error}</div>}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Category Title *</label>
                <input
                  type="text"
                  required
                  value={editingCat.category || ''}
                  onChange={(e) => setEditingCat((c) => ({ ...c, category: e.target.value }))}
                  placeholder="e.g. Systems & Low-Level Foundations"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Kicker Eyebrow</label>
                <input
                  type="text"
                  value={editingCat.kicker || ''}
                  onChange={(e) => setEditingCat((c) => ({ ...c, kicker: e.target.value }))}
                  placeholder="01 // ARCHITECTURAL TOOLCHAIN"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Domain Description</label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat((c) => ({ ...c, description: e.target.value }))}
                  placeholder="Primary systems languages and runtime environments..."
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCat.isPublished !== false}
                  onChange={(e) => setEditingCat((c) => ({ ...c, isPublished: e.target.checked }))}
                  className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                />
                <span className="text-[var(--text-primary)] font-semibold">Publish category domain</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Item Modal */}
      {skillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-5 text-left font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold font-display text-[var(--text-primary)]">
                {isNewSkill ? 'Add Technical Apparatus' : 'Edit Skill'}
              </h2>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="text-rose-400 text-xs">{error}</div>}

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill((s) => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. C (C11 Standard)"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Focus Area / Invariant Application</label>
                <input
                  type="text"
                  value={editingSkill.focusArea || ''}
                  onChange={(e) => setEditingSkill((s) => ({ ...s, focusArea: e.target.value }))}
                  placeholder="e.g. Manual heap allocation, raw pointer math"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)]">Proficiency / Verification Level</label>
                <input
                  type="text"
                  value={editingSkill.level || ''}
                  onChange={(e) => setEditingSkill((s) => ({ ...s, level: e.target.value }))}
                  placeholder="e.g. Core Fluency, Invariant Analysis, Active Exploration"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
