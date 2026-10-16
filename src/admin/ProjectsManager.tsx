import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import type { CmsProject } from '../types/cms';
import {
  FolderGit2,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  ExternalLink,
  GitFork,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ProjectsManager: React.FC = () => {
  const { projects, refreshCms } = useCms();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<CmsProject> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stackInput, setStackInput] = useState('');
  const [lessonInput, setLessonInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openNewModal = () => {
    setIsNew(true);
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      slug: '',
      subtitle: '',
      problem: '',
      built: '',
      architecture: '',
      lessonsLearned: [],
      stack: ['C (C11)', 'Linux Terminal'],
      status: 'active',
      repoUrl: 'https://github.com/raj-golder/',
      demoUrl: '',
      coverImage: '',
      isFeatured: false,
      isPublished: true,
      displayOrder: projects.length,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (proj: CmsProject) => {
    setIsNew(false);
    setEditingProject({
      ...proj,
      lessonsLearned: [...(proj.lessonsLearned || [])],
      stack: [...(proj.stack || [])],
    });
    setError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    if (!editingProject) return;
    const updates: Partial<CmsProject> = { title };
    if (isNew) {
      updates.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    setEditingProject((prev) => ({ ...prev, ...updates }));
  };

  const handleAddStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stackInput.trim() || !editingProject) return;
    if (!editingProject.stack?.includes(stackInput.trim())) {
      setEditingProject((prev) => ({
        ...prev,
        stack: [...(prev?.stack || []), stackInput.trim()],
      }));
    }
    setStackInput('');
  };

  const handleRemoveStack = (tech: string) => {
    if (!editingProject) return;
    setEditingProject((prev) => ({
      ...prev,
      stack: prev?.stack?.filter((s) => s !== tech) || [],
    }));
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonInput.trim() || !editingProject) return;
    setEditingProject((prev) => ({
      ...prev,
      lessonsLearned: [...(prev?.lessonsLearned || []), lessonInput.trim()],
    }));
    setLessonInput('');
  };

  const handleRemoveLesson = (idx: number) => {
    if (!editingProject) return;
    setEditingProject((prev) => ({
      ...prev,
      lessonsLearned: prev?.lessonsLearned?.filter((_, i) => i !== idx) || [],
    }));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title || !editingProject.title.trim()) {
      setError('Project title is required.');
      return;
    }

    if (!editingProject.slug || !editingProject.slug.trim()) {
      setError('Project slug is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isNew) {
        await api.createProject(editingProject);
      } else {
        await api.updateProject(editingProject.id!, editingProject);
      }

      await refreshCms();
      setModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setError(err?.message || 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (proj: CmsProject) => {
    try {
      await api.updateProject(proj.id, { isPublished: !proj.isPublished });
      await refreshCms();
    } catch (err: any) {
      alert('Failed to update published status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (proj: CmsProject) => {
    try {
      await api.updateProject(proj.id, { isFeatured: !proj.isFeatured });
      await refreshCms();
    } catch (err: any) {
      alert('Failed to update featured flag: ' + err.message);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    try {
      await api.reorderProjects(newOrder.map((p) => p.id));
      await refreshCms();
    } catch (err: any) {
      alert('Failed to reorder projects: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      await refreshCms();
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>REPOSITORIES & WORKBENCHES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Project Dossier Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Create, edit, reorder, and publish first-principles projects, architectural blueprints, and invariant logs.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Dossier</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3 font-mono text-xs">
        {projects.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded">
            No projects in database. Click "New Project Dossier" to create one.
          </div>
        ) : (
          projects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all ${
                proj.isPublished
                  ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]'
                  : 'border-dashed border-[var(--border-subtle)] bg-[var(--bg-page)] opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] text-base">
                      {proj.title}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      /{proj.slug}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        proj.status === 'completed'
                          ? 'bg-[var(--accent-success)]/15 text-[var(--accent-success)] border border-[var(--accent-success)]/30'
                          : proj.status === 'active'
                          ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                          : 'bg-[var(--text-muted)]/15 text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {proj.status}
                    </span>

                    {proj.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>FEATURED</span>
                      </span>
                    )}

                    {!proj.isPublished && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        DRAFT (HIDDEN)
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-body text-[var(--text-secondary)] line-clamp-2">
                    {proj.subtitle || proj.problem}
                  </p>

                  {/* Stack pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.stack?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-[var(--border-subtle)] rounded bg-[var(--bg-page)] mr-1">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Project Up"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      title="Move Project Down"
                      className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Feature Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(proj)}
                    title={proj.isFeatured ? 'Unfeature project' : 'Feature on homepage'}
                    className={`p-2 rounded border border-[var(--border-subtle)] transition-colors cursor-pointer ${
                      proj.isFeatured
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : 'text-[var(--text-muted)] hover:text-amber-400 hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${proj.isFeatured ? 'fill-current' : ''}`} />
                  </button>

                  {/* Publish / Draft Toggle */}
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    title={proj.isPublished ? 'Unpublish (set to draft)' : 'Publish to live website'}
                    className={`p-2 rounded border border-[var(--border-subtle)] transition-colors cursor-pointer ${
                      proj.isPublished
                        ? 'text-[var(--accent-success)] hover:bg-[var(--accent-success)]/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {proj.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(proj)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete */}
                  {deleteConfirmId === proj.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(proj.id)}
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
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="p-2 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/40 transition-colors cursor-pointer"
                      title="Delete project"
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

      {/* Create / Edit Modal Dialog */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-8 p-6 sm:p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">
                  {isNew ? 'Create New Project Dossier' : `Edit: ${editingProject.title}`}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
                  Specify architectural problem statement, stack tokens, repository endpoints, and key invariants.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-5 text-xs font-mono max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Memory Allocator & Arena Subsystem"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="memory-allocator"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">Subtitle / Elevator Summary</label>
                  <input
                    type="text"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, subtitle: e.target.value }))}
                    placeholder="Physical memory manager tracking heap invariants"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Status</label>
                  <select
                    value={editingProject.status || 'active'}
                    onChange={(e) => setEditingProject((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="active">Active Exploration</option>
                    <option value="completed">Completed & Verified</option>
                    <option value="archived">Archived Snapshot</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, coverImage: e.target.value }))}
                    placeholder="/uploads/diagram.png or https://..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.repoUrl || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, repoUrl: e.target.value }))}
                    placeholder="https://github.com/raj-golder/..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Live Interactive Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.demoUrl || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, demoUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              {/* Problem, Built, Architecture */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">The Problem (What engineering challenge triggered this?)</label>
                  <textarea
                    rows={2}
                    value={editingProject.problem || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, problem: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">What Was Built (Implementation overview)</label>
                  <textarea
                    rows={2}
                    value={editingProject.built || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, built: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">System Architecture (Internal mechanisms & invariants)</label>
                  <textarea
                    rows={3}
                    value={editingProject.architecture || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, architecture: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
                  />
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[var(--text-secondary)]">Tech Stack & Tools</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingProject.stack?.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStack(tech)}
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
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="e.g. C (C11), POSIX APIs, Python, PyTorch"
                    className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddStack}
                    className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                  >
                    Add Stack
                  </button>
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[var(--text-secondary)]">Key Learnings & Hardware Takeaways</label>
                <div className="space-y-1.5 mb-2">
                  {editingProject.lessonsLearned?.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-start justify-between gap-2 p-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-body"
                    >
                      <span>• {lesson}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(lIdx)}
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
                    value={lessonInput}
                    onChange={(e) => setLessonInput(e.target.value)}
                    placeholder="e.g. Splitting blocks introduces memory fragmentation if headers aren't aligned to 8 bytes."
                    className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-body"
                  />
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer shrink-0"
                  >
                    Add Takeaway
                  </button>
                </div>
              </div>

              {/* Flags: Featured & Published */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[var(--border-subtle)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured || false}
                    onChange={(e) => setEditingProject((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus:ring-0"
                  />
                  <span className="text-[var(--text-primary)] font-semibold">Mark as Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished !== false}
                    onChange={(e) => setEditingProject((p) => ({ ...p, isPublished: e.target.checked }))}
                    className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus:ring-0"
                  />
                  <span className="text-[var(--text-primary)] font-semibold">Publish immediately (Visible to visitors)</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{submitting ? 'Saving Project...' : isNew ? 'Create Project' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
