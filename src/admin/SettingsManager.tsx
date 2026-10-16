import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import type { CmsSiteSettings } from '../types/cms';
import {
  Settings,
  Save,
  Download,
  Upload,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  Database,
  ShieldCheck,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { siteSettings, refreshCms } = useCms();
  const [formData, setFormData] = useState<CmsSiteSettings>(siteSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Backup & Restore State
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setSettingsStatus(null);
      await api.updateSettings(formData);
      await refreshCms();
      setSettingsStatus({ type: 'success', text: 'Site settings and layout configuration saved.' });
      setTimeout(() => setSettingsStatus(null), 4000);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setSettingsStatus({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({ type: 'error', text: 'Current password is required.' });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setChangingPassword(true);
      await api.changePassword(currentPassword, newPassword);
      setPasswordStatus({ type: 'success', text: 'Administrator password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus(null), 4000);
    } catch (err: any) {
      console.error('Password change failed:', err);
      setPasswordStatus({ type: 'error', text: err.message || 'Password update failed.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const backup = await api.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Warning: Importing this backup will replace current portfolio content with the backup file data. Proceed?')) {
      return;
    }

    try {
      setImporting(true);
      setImportStatus(null);
      const text = await file.text();
      const json = JSON.parse(text);
      await api.importBackup(json);
      await refreshCms();
      setImportStatus({ type: 'success', text: 'Portfolio database restored successfully.' });
    } catch (err: any) {
      console.error('Import failed:', err);
      setImportStatus({ type: 'error', text: 'Failed to restore backup: ' + err.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>GLOBAL CONFIGURATION & SECURITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Site Settings & Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Control default visual themes, section visibility, security credentials, and database backups.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {settingsStatus && (
        <div
          className={`p-3.5 rounded text-xs font-mono flex items-center gap-2 ${
            settingsStatus.type === 'success'
              ? 'border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
              : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
          }`}
        >
          {settingsStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{settingsStatus.text}</span>
        </div>
      )}

      {/* 1. Global SEO & Themes */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>1. Appearance & Theme Invariants</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[var(--text-secondary)]">Site Title (HTML &lt;title&gt; and Meta)</label>
              <input
                type="text"
                required
                value={formData.siteTitle || ''}
                onChange={(e) => setFormData((s) => ({ ...s, siteTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[var(--text-secondary)]">Site Meta Description</label>
              <textarea
                rows={2}
                value={formData.siteDescription || ''}
                onChange={(e) => setFormData((s) => ({ ...s, siteDescription: e.target.value }))}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[var(--text-secondary)]">Default Canonical Theme</label>
              <select
                value={formData.defaultTheme || 'stdout'}
                onChange={(e) => setFormData((s) => ({ ...s, defaultTheme: e.target.value as 'stdout' | 'margin-notes' }))}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="stdout">stdout (Dark Silicon Lithography)</option>
                <option value="margin-notes">margin-notes (Light Titanium Blueprint)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.themeToggleVisible !== false}
                  onChange={(e) => setFormData((s) => ({ ...s, themeToggleVisible: e.target.checked }))}
                  className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                />
                <span className="text-[var(--text-primary)] font-semibold">
                  Display theme switch button in navbar
                </span>
              </label>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[var(--text-secondary)]">Footer Disclaimers / Academic Notice</label>
              <input
                type="text"
                value={formData.footerNote || ''}
                onChange={(e) => setFormData((s) => ({ ...s, footerNote: e.target.value }))}
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>

        {/* 2. Section Visibility */}
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
          <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--accent-copper)]" />
            <span>2. Portfolio Sections Visibility</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            {(
              [
                ['hero', '01 // Hero & Invariant Workbench'],
                ['projects', '02 // Projects & Blueprints'],
                ['journey', '03 // Milestones & DAG Graph'],
                ['skills', '04 // Apparatus & Skills'],
                ['about', '05 // About & Manifesto'],
                ['contact', '06 // Contact & Inquiries'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] flex items-center gap-2.5 cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.sectionsVisibility?.[key] !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sectionsVisibility: {
                        ...prev.sectionsVisibility,
                        [key]: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-[var(--border-subtle)] text-[var(--accent-primary)]"
                />
                <span className="font-semibold text-[var(--text-primary)]">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </form>

      {/* 3. Database Backup & Restore */}
      <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
        <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-[var(--accent-primary)]" />
          <span>3. Database Snapshot Backup & Restore</span>
        </h2>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-body">
          Download a complete, offline JSON snapshot of all portfolio content (profile, projects, milestones, skills, site settings, and inquiries), or restore previous configurations.
        </p>

        {importStatus && (
          <div
            className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{importStatus.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportBackup}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[var(--accent-copper)]" />
            <span>{exporting ? 'Preparing Snapshot...' : 'Export JSON Backup'}</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>{importing ? 'Restoring...' : 'Restore from Backup JSON'}</span>
            <input
              type="file"
              accept=".json,application/json"
              disabled={importing}
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4. Administrator Account Security */}
      <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
        <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>4. Administrator Security & Password</span>
        </h2>

        {passwordStatus && (
          <div
            className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
            }`}
          >
            {passwordStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 font-mono text-xs max-w-md">
          <div className="space-y-1.5">
            <label className="text-[var(--text-secondary)]">Current Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[var(--text-secondary)]">New Password (Min 8 characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[var(--text-secondary)]">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-4 py-2 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] cursor-pointer shadow-xs disabled:opacity-50"
          >
            {changingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
