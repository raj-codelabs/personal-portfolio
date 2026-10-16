import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import type { CmsMilestone } from '../types/cms';
import {
  GitBranch,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  GitCommit,
  Tag,
  BookOpen,
} from 'lucide-react';

export const JourneyManager: React.FC = () => {
  const { milestones, refreshCms } = useCms();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Partial<CmsMilestone> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [learningInput, setLearningInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openNewModal = () => {
    setIsNew(true);
    const nextLogNum = `LOG #${String(milestones.length + 1).padStart(2, '0')}`;
    const randomHash = Math.random().toString(16).substring(2, 9);
    setEditingMilestone({
      id: `ms-${Date.now()}`,
      logNumber: nextLogNum,
      commitHash: randomHash,
      branch: 'main',
      branchLabel: 'Coursework / Semester 01',
      date: new Date().toISOString().slice(0, 10),
      title: '',
      summary: '',
      details: '',
      learnings: [],
      marginAnnotation: '',
      tags: ['C', 'Systems'],
      isPublished: true,
      displayOrder: milestones.length,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (m: CmsMilestone) => {
    setIsNew(false);
    setEditingMilestone({
      ...m,
      tags: [...(m.tags || [])],
      learnings: [...(m.learnings || [])],
    });
    setError(null);
    setModalOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim() || !editingMilestone) return;
    if (!editingMilestone.tags?.includes(tagInput.trim())) {
      setEditingMilestone((prev) => ({
        ...prev,
        tags: [...(prev?.tags || []), tagInput.trim()],
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!editingMilestone) return;
    setEditingMilestone((prev) => ({
      ...prev,
      tags: prev?.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleAddLearning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningInput.trim() || !editingMilestone) return;
    setEditingMilestone((prev) => ({
      ...prev,
      learnings: [...(prev?.learnings || []), learningInput.trim()],
    }));
    setLearningInput('');
  };

  const handleRemoveLearning = (idx: number) => {
    if (!editingMilestone) return;
    setEditingMilestone((prev) => ({
      ...prev,
      learnings: prev?.learnings?.filter((_, i) => i !== idx) || [],
    }));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title?.trim()) {
      setError('Milestone title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      if (isNew) {
        await api.createMilestone(editingMilestone);
      } else {
        await api.updateMilestone(editingMilestone.id!, editingMilestone);
      }
      await refreshCms();
      setModalOpen(false);
      setEditingMilestone(null);
    } catch (err: any) {
      console.error('Failed to save milestone:', err);
      setError(err?.message || 'Failed to save milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    const newOrder = [...milestones];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    try {
      await api.reorderMilestones(newOrder.map((m) => m.id));
      await refreshCms();
    } catch (err: any) {
      alert('Failed to reorder milestones: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMilestone(id);
      await refreshCms();
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Failed to delete milestone: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>TOPOLOGICAL MILESTONES & CURRICULUM DAG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Milestone Journey Events
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Manage commit logs rendered in the terminal DAG graph (stdout) and the margin field notebook.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Milestone Event</span>
        </button>
      </div>

      {/* Milestones List */}
      <div className="space-y-3 font-mono text-xs">
        {milestones.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded">
            No milestones in database. Click "New Milestone Event" to add one.
          </div>
        ) : (
          milestones.map((m, idx) => (
            <div
              key={m.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all ${
                m.isPublished
                  ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]'
                  : 'border-dashed border-[var(--border-subtle)] bg-[var(--bg-page)] opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[var(--accent-primary)]">
                      {m.logNumber}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <GitCommit className="w-3 h-3 text-[var(--accent-copper)]" />
                      {m.commitHash}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      ({m.date})
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)]">
                      {m.branch}
                    </span>
                    {!m.isPublished && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        HIDDEN
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    {m.title}
                  </h3>

                  <p className="text-xs font-body text-[var(--text-secondary)] line-clamp-2">
                    {m.summary}
                  </p>

                  {m.marginAnnotation && (
                    <div className="text-[11px] font-mono text-[var(--accent-copper)] italic border-l-2 border-[var(--accent-copper)] pl-2">
                      Margin note: "{m.marginAnnotation}"
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.tags?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-secondary)]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
                  <div className="flex items-center border border-[var(--border-subtle)] rounded bg-[var(--bg-page)] mr-1">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Milestone Up"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === milestones.length - 1}
                      title="Move Milestone Down"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openEditModal(m)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {deleteConfirmId === m.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-2.5 py-1.5 rounded bg-rose-500 text-white font-bold text-[11px] hover:bg-rose-600 cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(m.id)}
                      className="p-2 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/40 transition-colors cursor-pointer"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-5 text-left font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
                {isNew ? 'New Milestone Event' : `Edit: ${editingMilestone.title}`}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Log Number / Prefix *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.logNumber || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, logNumber: e.target.value }))}
                    placeholder="LOG #01"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Commit Hash / ID</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.commitHash || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, commitHash: e.target.value }))}
                    placeholder="7c1b4e2"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Date (YYYY-MM-DD or Month Year)</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.date || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, date: e.target.value }))}
                    placeholder="2026-08-15"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Branch / Pipeline Tag</label>
                  <input
                    type="text"
                    value={editingMilestone.branch || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, branch: e.target.value }))}
                    placeholder="main or feat/allocator"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">Milestone Title *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, title: e.target.value }))}
                    placeholder="e.g. Matriculation & First-Principles Foundation"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">Summary / Log Message</label>
                  <textarea
                    rows={2}
                    required
                    value={editingMilestone.summary || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, summary: e.target.value }))}
                    placeholder="Brief description of the milestone..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">Detailed Breakdown / Context</label>
                  <textarea
                    rows={3}
                    value={editingMilestone.details || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, details: e.target.value }))}
                    placeholder="In-depth narrative of implementation decisions and challenges..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">
                    Margin Note / Notebook Annotation (Highlighted in Margin-Notes theme)
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.marginAnnotation || ''}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, marginAnnotation: e.target.value }))}
                    placeholder="e.g. Note: memory leaks observed during stress testing with 10k ops."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] italic text-[var(--accent-copper)]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[var(--text-secondary)]">Milestone Categorization Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingMilestone.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. C, Memory, Autograd, Calculus"
                    className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Learnings */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[var(--text-secondary)]">Key Learnings & Verifications</label>
                <div className="space-y-1.5 mb-2">
                  {editingMilestone.learnings?.map((l, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-start justify-between gap-2 p-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] font-body text-xs"
                    >
                      <span>• {l}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLearning(lIdx)}
                        className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={learningInput}
                    onChange={(e) => setLearningInput(e.target.value)}
                    placeholder="e.g. Cache line boundary alignment reduces bus contention by 40%."
                    className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddLearning}
                    className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer shrink-0"
                  >
                    Add Learning
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMilestone.isPublished !== false}
                    onChange={(e) => setEditingMilestone((m) => ({ ...m, isPublished: e.target.checked }))}
                    className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                  />
                  <span className="text-[var(--text-primary)] font-semibold">Publish milestone event</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Saving...' : 'Save Milestone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
