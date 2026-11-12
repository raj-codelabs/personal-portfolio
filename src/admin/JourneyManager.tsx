import React, { useState, useMemo } from 'react';
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
  GitCommit,
  Search,
  Eye,
  EyeOff,
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

  // Search & Branch Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const branches = useMemo(() => {
    const list = Array.from(new Set(milestones.map((m) => m.branch).filter(Boolean)));
    return ['all', ...list];
  }, [milestones]);

  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (selectedBranch !== 'all' && m.branch !== selectedBranch) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchHash = m.commitHash?.toLowerCase().includes(q);
      const matchLog = m.logNumber?.toLowerCase().includes(q);
      const matchTags = m.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchHash || matchLog || matchTags;
    });
  }, [milestones, selectedBranch, searchQuery]);

  const openNewModal = () => {
    setIsNew(true);
    const nextLogNum = String(milestones.length + 1).padStart(2, '0');
    const randomHash = Math.random().toString(16).substring(2, 9);
    setEditingMilestone({
      id: `ms-${Date.now()}`,
      logNumber: nextLogNum,
      commitHash: randomHash,
      branch: 'main',
      branchLabel: 'Coursework / Academics',
      date: new Date().getFullYear().toString(),
      title: '',
      summary: '',
      details: '',
      learnings: [],
      marginAnnotation: '',
      tags: ['Academics', 'Coursework'],
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

  const handleTogglePublish = async (m: CmsMilestone) => {
    try {
      await api.updateMilestone(m.id, { isPublished: !m.isPublished });
      await refreshCms();
    } catch (err: any) {
      alert('Failed to update milestone status: ' + err.message);
    }
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
    <div className="space-y-6 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>TOPOLOGICAL MILESTONES &amp; JOURNEY LOG</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Milestone Journey Events ({milestones.length})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            Chronological commit records rendered in the terminal DAG and archival monograph
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-semibold bg-[var(--accent-primary)] text-[#0b0e14] hover:opacity-90 active:scale-[0.98] transition-transform transition-color transition-opacity cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Milestone</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, hash, tags..."
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

        {/* Branch Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer uppercase font-mono ${
                selectedBranch === b
                  ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
              }`}
            >
              {b === 'all' ? 'All Branches' : `git:${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Commit Table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/60 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16 text-center font-semibold">Order</th>
                <th className="py-2.5 px-3 w-32 font-semibold">Commit / Log</th>
                <th className="py-2.5 px-3 w-28 font-semibold">Branch</th>
                <th className="py-2.5 px-3 min-w-[220px] font-semibold">Milestone Title &amp; Summary</th>
                <th className="py-2.5 px-3 w-20 font-semibold">Date</th>
                <th className="py-2.5 px-3 w-28 text-center font-semibold">Visibility</th>
                <th className="py-2.5 px-3 w-28 text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/60 font-mono">
              {filteredMilestones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                    No matching milestones found.
                  </td>
                </tr>
              ) : (
                filteredMilestones.map((m) => {
                  const originalIndex = milestones.findIndex((item) => item.id === m.id);
                  const isFirst = originalIndex === 0;
                  const isLast = originalIndex === milestones.length - 1;

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-[var(--bg-page)]/70 transition-colors group"
                    >
                      {/* Order Controls */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            disabled={isFirst}
                            onClick={() => handleMove(originalIndex, 'up')}
                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-4 text-center text-[11px] text-[var(--text-muted)] font-bold">
                            {originalIndex + 1}
                          </span>
                          <button
                            disabled={isLast}
                            onClick={() => handleMove(originalIndex, 'down')}
                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Log Number & Hash */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--accent-copper)]">
                          <GitCommit className="w-3.5 h-3.5 shrink-0" />
                          <span>{m.logNumber || 'LOG'}</span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono">
                          {m.commitHash || '0000000'}
                        </div>
                      </td>

                      {/* Branch Badge */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)]">
                          {m.branch || 'main'}
                        </span>
                      </td>

                      {/* Title & Summary */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[var(--text-primary)] text-xs">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-body line-clamp-1 mt-0.5">
                          {m.summary}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3 text-[11px] text-[var(--text-muted)]">
                        {m.date}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(m)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                            m.isPublished
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 hover:bg-zinc-500/25'
                          }`}
                          title={m.isPublished ? 'Click to hide (Draft)' : 'Click to publish'}
                        >
                          {m.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right pr-4">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => openEditModal(m)}
                            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                            title="Edit Milestone"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === m.id ? (
                            <div className="inline-flex items-center gap-1 ml-1">
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] hover:bg-rose-700 cursor-pointer"
                              >
                                Del
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(m.id)}
                              className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                              title="Delete Milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Milestone Modal */}
      {modalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl flex flex-col max-h-[90vh] font-mono text-xs text-left">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/80">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {isNew ? 'Create Milestone Event' : `Edit: ${editingMilestone.title || 'Untitled'}`}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                    Log Number
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.logNumber || ''}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({ ...prev, logNumber: e.target.value }))
                    }
                    placeholder="e.g. 01"
                    className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                    Commit Hash
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.commitHash || ''}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({ ...prev, commitHash: e.target.value }))
                    }
                    placeholder="e.g. btech-ug"
                    className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.date || ''}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({ ...prev, date: e.target.value }))
                    }
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.branch || 'main'}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({ ...prev, branch: e.target.value }))
                    }
                    placeholder="e.g. main, python, projects"
                    className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                    Branch Label / Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingMilestone.branchLabel || ''}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({ ...prev, branchLabel: e.target.value }))
                    }
                    placeholder="e.g. Academics, Foundations"
                    className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingMilestone.title || ''}
                  onChange={(e) =>
                    setEditingMilestone((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. B.Tech CSE (AI/ML) · Undergraduate Studies"
                  required
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Summary (Brief Overview)
                </label>
                <textarea
                  rows={2}
                  value={editingMilestone.summary || ''}
                  onChange={(e) =>
                    setEditingMilestone((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Margin Annotation (Field Notes)
                </label>
                <input
                  type="text"
                  value={editingMilestone.marginAnnotation || ''}
                  onChange={(e) =>
                    setEditingMilestone((prev) => ({ ...prev, marginAnnotation: e.target.value }))
                  }
                  placeholder="Handwriting note for Margin Notes mode..."
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag (e.g. Harvard, Python)"
                    className="flex-1 px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingMilestone.tags?.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[11px]"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Published Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingMilestone.isPublished)}
                    onChange={(e) =>
                      setEditingMilestone((prev) => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                  />
                  <span className="text-xs">Published on Public Timeline</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
