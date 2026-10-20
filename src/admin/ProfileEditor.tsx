import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCms } from '../context/CmsContext';
import type { CmsProfile } from '../types/cms';
import {
  User,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Mail,
  Linkedin,
  GitFork,
  MapPin,
  FileText,
  Sliders,
  Camera,
} from 'lucide-react';
import { PhotoChangeModal } from '../components/PhotoChangeModal';

export interface ProfileEditorProps {
  initialSection?: 'all' | 'profile' | 'about' | 'contact';
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialSection = 'all' }) => {
  const { profile: cmsProfile, refreshCms } = useCms();
  const [activeSection, setActiveSection] = useState<'all' | 'profile' | 'about' | 'contact'>(initialSection);
  const [formData, setFormData] = useState<CmsProfile>(cmsProfile);
  const [interestInput, setInterestInput] = useState('');
  const [customLinkLabel, setCustomLinkLabel] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoModalMode, setPhotoModalMode] = useState<'id-card' | 'white-mode' | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (cmsProfile) {
      setFormData(cmsProfile);
    }
  }, [cmsProfile]);

  const handleTextChange = (field: keyof CmsProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    if (!formData.currentInterests?.includes(interestInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        currentInterests: [...(prev.currentInterests || []), interestInput.trim()],
      }));
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      currentInterests: prev.currentInterests?.filter((i) => i !== interest) || [],
    }));
  };

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkLabel.trim() || !customLinkUrl.trim()) return;
    const newLink = {
      id: `link-${Date.now()}`,
      label: customLinkLabel.trim(),
      url: customLinkUrl.trim(),
      isEnabled: true,
    };
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        customLinks: [...(prev.contact.customLinks || []), newLink],
      },
    }));
    setCustomLinkLabel('');
    setCustomLinkUrl('');
  };

  const handleRemoveCustomLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        customLinks: prev.contact.customLinks?.filter((l) => l.id !== id) || [],
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      await api.updateProfile(formData);
      await refreshCms();
      setStatusMessage({ type: 'success', text: 'Profile & identity successfully updated in database.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <User className="w-3.5 h-3.5" />
            <span>IDENTITY & HERO CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Profile & Hero Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Update biographical data, curriculum standing, guiding philosophy, and correspondence channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Committing Changes...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded text-xs font-mono flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
              : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Section Filter Pills */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
            activeSection === 'all'
              ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
              : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
          }`}
        >
          All Sections
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('profile')}
          className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
            activeSection === 'profile'
              ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
              : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
          }`}
        >
          1. Hero & Identity
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('about')}
          className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
            activeSection === 'about'
              ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
              : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
          }`}
        >
          2. About & Monograph
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
            activeSection === 'contact'
              ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
              : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
          }`}
        >
          3. Contact & Social Channels
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Identity */}
        {(activeSection === 'all' || activeSection === 'profile') && (
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>1. Core Identity & Institutional Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Full Name</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Academic Title / Tagline</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTextChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Department / Program</label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => handleTextChange('department', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Current Semester</label>
              <input
                type="text"
                value={formData.semester || ''}
                onChange={(e) => handleTextChange('semester', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[var(--text-secondary)]">Institutional Note / Header Subtitle</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => handleTextChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Avatar URL (Optional)</label>
              <input
                type="text"
                value={formData.avatarUrl || ''}
                onChange={(e) => handleTextChange('avatarUrl', e.target.value)}
                placeholder="/uploads/avatar.png or https://..."
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Resume / Curriculum Vitae URL</label>
              <input
                type="text"
                value={formData.resumeUrl || ''}
                onChange={(e) => handleTextChange('resumeUrl', e.target.value)}
                placeholder="/uploads/resume.pdf or https://drive.google.com/..."
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            {/* Signature Interaction 1: Dark Theme Developer ID Card */}
            <div className="sm:col-span-2 pt-3 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--accent-primary)] uppercase tracking-wider text-[11px]">
                    Dark Theme: Developer ID Card Settings
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">stdout theme hero</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoModalMode('id-card')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 text-xs font-mono font-medium cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change ID Photo</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Badge Clearance / Serial ID</label>
                  <input
                    type="text"
                    value={formData.idBadgeNumber || ''}
                    onChange={(e) => handleTextChange('idBadgeNumber', e.target.value)}
                    placeholder="RG-8192-SYS"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">
                    ID Card QR Real Destination URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.idBadgeQrUrl || ''}
                    onChange={(e) => handleTextChange('idBadgeQrUrl', e.target.value)}
                    placeholder="https://github.com/raj-golder or https://linkedin.com/..."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Only real destinations generate a QR code. If blank, a cryptographic security chip & barcode are rendered.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Interaction 2: White Theme Color-Reveal Notebook Sketch */}
            <div className="sm:col-span-2 pt-3 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--accent-copper)] uppercase tracking-wider text-[11px]">
                    White Theme: Notebook Color-Reveal Sketch Settings
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">margin-notes theme hero</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoModalMode('white-mode')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#c25e38]/40 text-[#c25e38] hover:bg-[#c25e38]/10 text-xs font-mono font-medium cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change White Mode Photos</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Pencil Sketch Source URL (Grayscale)</label>
                  <input
                    type="text"
                    value={formData.sketchGrayscaleUrl || ''}
                    onChange={(e) => handleTextChange('sketchGrayscaleUrl', e.target.value)}
                    placeholder="/assets/sketch-grayscale.svg or /uploads/my-sketch.png"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Default: Built-in high-detail systems researcher study.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[var(--text-secondary)]">Color Edition Portrait URL (Underlying)</label>
                  <input
                    type="text"
                    value={formData.sketchColorUrl || ''}
                    onChange={(e) => handleTextChange('sketchColorUrl', e.target.value)}
                    placeholder="/assets/sketch-color.svg or /uploads/my-portrait-color.png"
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Matching color version revealed along cursor/touch drag paths.
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[var(--text-secondary)]">Editorial Notebook Caption / Figure Note</label>
                  <input
                    type="text"
                    value={formData.sketchCaption || ''}
                    onChange={(e) => handleTextChange('sketchCaption', e.target.value)}
                    placeholder="FIG. 01 — Architectural pencil study with scalar autograd DAGs & drafting ink annotations."
                    className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Narrative & Philosophy */}
        {(activeSection === 'all' || activeSection === 'about') && (
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent-copper)]" />
            <span>2. Bio Synopsis & First-Principles Philosophy</span>
          </h2>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">
                Hero Introduction / Bio (Displayed in top thesis block)
              </label>
              <textarea
                rows={3}
                required
                value={formData.shortBio || ''}
                onChange={(e) => handleTextChange('shortBio', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">
                Guiding Philosophy & Manifesto (Detailed monograph in About section)
              </label>
              <textarea
                rows={4}
                required
                value={formData.philosophy || ''}
                onChange={(e) => handleTextChange('philosophy', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-sm leading-relaxed"
              />
            </div>

            {/* Current Research Interests Tags */}
            <div className="space-y-2 pt-2">
              <label className="text-[var(--text-secondary)]">Current Research Interests & Focus Badges</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.currentInterests?.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="e.g. Cache Hierarchy, LLVM Pass Plugins, Custom Kernels"
                  className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] font-mono text-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Badge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Call-to-Action Buttons */}
        {(activeSection === 'all' || activeSection === 'profile') && (
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>3. Hero Call to Action Buttons</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Primary Button Label</label>
              <input
                type="text"
                value={formData.primaryCtaText || ''}
                onChange={(e) => handleTextChange('primaryCtaText', e.target.value)}
                placeholder="Inspect Repositories"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Primary Button Link / Target</label>
              <input
                type="text"
                value={formData.primaryCtaLink || ''}
                onChange={(e) => handleTextChange('primaryCtaLink', e.target.value)}
                placeholder="#projects"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Secondary Button Label</label>
              <input
                type="text"
                value={formData.secondaryCtaText || ''}
                onChange={(e) => handleTextChange('secondaryCtaText', e.target.value)}
                placeholder="Milestone DAG Graph"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Secondary Button Link / Target</label>
              <input
                type="text"
                value={formData.secondaryCtaLink || ''}
                onChange={(e) => handleTextChange('secondaryCtaLink', e.target.value)}
                placeholder="#journey"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>
        )}

        {/* Contact & Social Links */}
        {(activeSection === 'all' || activeSection === 'contact') && (
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>4. Correspondence & External Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Primary Email</span>
              </label>
              <input
                type="email"
                required
                value={formData.contact?.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                required
                value={formData.contact?.github || ''}
                onChange={(e) => handleContactChange('github', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                required
                value={formData.contact?.linkedin || ''}
                onChange={(e) => handleContactChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Physical / Academic Location</span>
              </label>
              <input
                type="text"
                value={formData.contact?.location || ''}
                onChange={(e) => handleContactChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[var(--text-secondary)]">Status Pill / Availability Label</label>
              <input
                type="text"
                value={formData.contact?.statusLabel || ''}
                onChange={(e) => handleContactChange('statusLabel', e.target.value)}
                placeholder="Active Undergraduate · Available for Systems Apprenticeships"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Custom Channels / Social Links */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              Additional External Channels (e.g. Twitter/X, Discord, Personal Lab)
            </label>

            {formData.contact?.customLinks && formData.contact.customLinks.length > 0 && (
              <div className="space-y-2">
                {formData.contact.customLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-primary)]">{link.label}:</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent-primary)] hover:underline truncate max-w-[280px]"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(link.id)}
                      className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder="Channel Name (e.g. Twitter / X)"
                value={customLinkLabel}
                onChange={(e) => setCustomLinkLabel(e.target.value)}
                className="sm:w-1/3 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <input
                type="url"
                placeholder="https://..."
                value={customLinkUrl}
                onChange={(e) => setCustomLinkUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={handleAddCustomLink}
                className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] font-mono text-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Channel</span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Committing Changes...' : 'Save All Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Photo Change Modal */}
      {photoModalMode && (
        <PhotoChangeModal
          isOpen={Boolean(photoModalMode)}
          onClose={() => setPhotoModalMode(null)}
          initialMode={photoModalMode}
        />
      )}
    </div>
  );
};
