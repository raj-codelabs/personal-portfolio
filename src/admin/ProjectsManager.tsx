import React, { useState, useMemo } from 'react';
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
  Search,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Layers,
  Code,
  FileText,
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

  // High-density table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [modalTab, setModalTab] = useState<'basics' | 'architecture' | 'stack'>('basics');

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      // Status filter
      if (statusFilter === 'published' && !proj.isPublished) return false;
      if (statusFilter === 'draft' && proj.isPublished) return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title?.toLowerCase().includes(q);
      const matchSlug = proj.slug?.toLowerCase().includes(q);
      const matchStatus = proj.status?.toLowerCase().includes(q);
      const matchStack = proj.stack?.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchSlug || matchStatus || matchStack;
    });
  }, [projects, statusFilter, searchQuery]);

  const openNewModal = () => {
    setIsNew(true);
    setModalTab('basics');
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      slug: '',
      subtitle: '',
      problem: '',
      built: '',
      architecture: '',
      lessonsLearned: [],
      stack: ['Python', 'LLM API', 'CLI'],
      status: 'active',
      repoUrl: 'https://github.com/raj-codelabs/',
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
    setModalTab('basics');
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

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="space-y-6 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PROJECT MANAGEMENT · HIGH-DENSITY LEDGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Project Dossiers ({projects.length})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            {publishedCount} published · {draftCount} draft · Single-click publishing &amp; direct reordering
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-semibold bg-[var(--accent-primary)] text-[#0b0e14] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Utilitarian Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by title, stack, slug..."
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

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/60 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16 text-center font-semibold">Order</th>
                <th className="py-2.5 px-3 min-w-[200px] font-semibold">Project &amp; Slug</th>
                <th className="py-2.5 px-3 min-w-[160px] font-semibold">Stack</th>
                <th className="py-2.5 px-3 w-28 font-semibold">Status</th>
                <th className="py-2.5 px-3 w-24 text-center font-semibold">Featured</th>
                <th className="py-2.5 px-3 w-28 text-center font-semibold">Visibility</th>
                <th className="py-2.5 px-3 w-32 text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/60 font-mono">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  const originalIndex = projects.findIndex((p) => p.id === proj.id);
                  const isFirst = originalIndex === 0;
                  const isLast = originalIndex === projects.length - 1;

                  return (
                    <tr
                      key={proj.id}
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

                      {/* Project Title & Slug */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[var(--text-primary)] text-xs">
                          {proj.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono">
                          /{proj.slug}
                        </div>
                      </td>

                      {/* Stack Tags */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                          {proj.stack?.slice(0, 3).map((st, i) => (
                            <span
                              key={st}
                              className="px-1.5 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[10px]"
                            >
                              {st}
                            </span>
                          ))}
                          {(proj.stack?.length || 0) > 3 && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              +{(proj.stack?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            proj.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : proj.status === 'active' || proj.status === 'open source'
                              ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                              : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(proj)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            proj.isFeatured
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-[var(--text-muted)] hover:text-amber-400/70'
                          }`}
                          title={proj.isFeatured ? 'Featured (Click to unfeature)' : 'Mark as Featured'}
                        >
                          <Star
                            className={`w-4 h-4 ${proj.isFeatured ? 'fill-current' : ''}`}
                          />
                        </button>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                            proj.isPublished
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 hover:bg-zinc-500/25'
                          }`}
                          title={proj.isPublished ? 'Click to hide (Draft)' : 'Click to publish'}
                        >
                          {proj.isPublished ? (
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
                            onClick={() => openEditModal(proj)}
                            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                            title="Edit Project Dossier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {proj.repoUrl && (
                            <a
                              href={proj.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-page)] transition-colors"
                              title="Open Repository"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {deleteConfirmId === proj.id ? (
                            <div className="inline-flex items-center gap-1 ml-1">
                              <button
                                onClick={() => handleDelete(proj.id)}
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
                              onClick={() => setDeleteConfirmId(proj.id)}
                              className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                              title="Delete Project"
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

      {/* High-Density Tabbed Project Modal */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl flex flex-col max-h-[90vh] font-mono text-xs text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/80">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {isNew ? 'Create New Project Dossier' : `Edit: ${editingProject.title || 'Untitled'}`}
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <button
                type="button"
                onClick={() => setModalTab('basics')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold cursor-pointer transition-colors ${
                  modalTab === 'basics'
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>General Info</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('architecture')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold cursor-pointer transition-colors ${
                  modalTab === 'architecture'
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture &amp; Notes</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('stack')}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold cursor-pointer transition-colors ${
                  modalTab === 'stack'
                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Stack &amp; Lessons</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModal} className="p-5 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Tab 1: Basics */}
              {modalTab === 'basics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editingProject.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. AI Study Notes Summarizer"
                        required
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Slug (URL identifier) *
                      </label>
                      <input
                        type="text"
                        value={editingProject.slug || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, slug: e.target.value }))
                        }
                        placeholder="e.g. ai-study-notes-summarizer"
                        required
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={editingProject.subtitle || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, subtitle: e.target.value }))
                        }
                        placeholder="e.g. PROJECT 01 · PYTHON / AI TOOLING"
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Status Label
                      </label>
                      <select
                        value={editingProject.status || 'active'}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      >
                        <option value="active">Active Exploration</option>
                        <option value="completed">Completed</option>
                        <option value="open source">Open Source</option>
                        <option value="idea">Idea / Concept</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      Problem Statement
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.problem || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, problem: e.target.value }))
                      }
                      placeholder="What problem does this project address?"
                      className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Repository URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.repoUrl || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, repoUrl: e.target.value }))
                        }
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                        Live Demo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.demoUrl || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, demoUrl: e.target.value }))
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProject.isPublished)}
                        onChange={(e) =>
                          setEditingProject((prev) => ({
                            ...prev,
                            isPublished: e.target.checked,
                          }))
                        }
                        className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                      />
                      <span className="text-xs">Published on Public Site</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProject.isFeatured)}
                        onChange={(e) =>
                          setEditingProject((prev) => ({
                            ...prev,
                            isFeatured: e.target.checked,
                          }))
                        }
                        className="rounded border-[var(--border-subtle)] text-amber-400"
                      />
                      <span className="text-xs">Feature in Showcase Stage</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 2: Architecture & Details */}
              {modalTab === 'architecture' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      What Was Built (Short Summary)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.built || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, built: e.target.value }))
                      }
                      placeholder="Concise overview of what was implemented..."
                      className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      Architecture &amp; Pipeline Design
                    </label>
                    <textarea
                      rows={4}
                      value={editingProject.architecture || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, architecture: e.target.value }))
                      }
                      placeholder="Step-by-step architectural breakdown..."
                      className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      Key Takeaway
                    </label>
                    <input
                      type="text"
                      value={editingProject.keyTakeaway || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, keyTakeaway: e.target.value }))
                      }
                      placeholder="One-sentence primary takeaway..."
                      className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Stack & Lessons */}
              {modalTab === 'stack' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      Tech Stack Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={stackInput}
                        onChange={(e) => setStackInput(e.target.value)}
                        placeholder="Add technology (e.g. Python, SQLite)"
                        className="flex-1 px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddStack}
                        className="px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer text-xs"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {editingProject.stack?.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[11px]"
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
                  </div>

                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                      Lessons Learned &amp; Insights
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={lessonInput}
                        onChange={(e) => setLessonInput(e.target.value)}
                        placeholder="Add engineering insight or lesson..."
                        className="flex-1 px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddLesson}
                        className="px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] cursor-pointer text-xs"
                      >
                        Add Point
                      </button>
                    </div>

                    <ul className="space-y-1.5">
                      {editingProject.lessonsLearned?.map((lesson, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-2 p-2 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs"
                        >
                          <span>• {lesson}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(idx)}
                            className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer shrink-0 mt-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
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
                  <span>{submitting ? 'Saving...' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
