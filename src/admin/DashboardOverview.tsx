import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { CmsMessage } from '../types/cms';
import {
  FolderGit2,
  Cpu,
  GitBranch,
  Mail,
  ShieldCheck,
  Download,
  PlusCircle,
  ExternalLink,
  Clock,
  ArrowRight,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';
import type { AdminTab } from './AdminLayout';

interface DashboardOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSelectTab, onViewPublicSite }) => {
  const [stats, setStats] = useState<{
    projectsCount: number;
    publishedProjectsCount: number;
    categoriesCount: number;
    skillsCount: number;
    milestonesCount: number;
    messagesCount: number;
    unreadMessagesCount: number;
    lastUpdated: string;
  } | null>(null);

  const [recentMessages, setRecentMessages] = useState<CmsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, messagesRes] = await Promise.all([
        api.getCmsStats(),
        api.getMessages(),
      ]);
      setStats(statsRes);
      setRecentMessages(messagesRes.slice(0, 5));
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadBackup = async () => {
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
      alert('Backup export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3 text-[var(--text-muted)] font-mono text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent-primary)]" />
        <span>Loading operational telemetry and metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body text-left">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COMMAND CENTER · SYSTEM TELEMETRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            Live database records, content publication state, and correspondence
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadData}
            title="Refresh statistics"
            className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadBackup}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
            <span>{exporting ? 'Exporting...' : 'Backup JSON'}</span>
          </button>
          <button
            onClick={onViewPublicSite}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-semibold bg-[var(--accent-primary)] text-[#0b0e14] hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4-KPI High-Density Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Metric 1: Projects */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>PROJECTS</span>
            <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.projectsCount ?? 0}
            </span>
            <span className="text-[11px] text-emerald-400">
              ({stats?.publishedProjectsCount ?? 0} live)
            </span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subtle)]/60">
            <span>Manage dossiers</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Skills */}
        <div
          onClick={() => onSelectTab('skills')}
          className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-copper)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>SKILLS &amp; TOOLS</span>
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.skillsCount ?? 0}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              in {stats?.categoriesCount ?? 0} categories
            </span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subtle)]/60">
            <span>Manage toolchain</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Journey Milestones */}
        <div
          onClick={() => onSelectTab('journey')}
          className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>MILESTONES</span>
            <GitBranch className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.milestonesCount ?? 0}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              commit logs
            </span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subtle)]/60">
            <span>View commit log</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Contact Inquiries */}
        <div
          onClick={() => onSelectTab('contact')}
          className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>INQUIRIES</span>
            <Mail className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.messagesCount ?? 0}
            </span>
            {(stats?.unreadMessagesCount ?? 0) > 0 ? (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {stats?.unreadMessagesCount} unread
              </span>
            ) : (
              <span className="text-[11px] text-[var(--text-muted)]">all read</span>
            )}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subtle)]/60">
            <span>Open inbox</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Correspondence Table + System Invariants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Density Recent Inquiries Table & Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Correspondence High-Density Table */}
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-page)]/80 border-b border-[var(--border-subtle)] font-mono text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Recent Inquiries
                </span>
              </div>
              <button
                onClick={() => onSelectTab('contact')}
                className="text-[11px] text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/40 text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-3 w-12 text-center font-semibold">Status</th>
                    <th className="py-2 px-3 w-40 font-semibold">Sender</th>
                    <th className="py-2 px-3 min-w-[200px] font-semibold">Subject</th>
                    <th className="py-2 px-3 w-24 text-right pr-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]/50">
                  {recentMessages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[var(--text-muted)] text-[11px]">
                        No inquiries logged yet.
                      </td>
                    </tr>
                  ) : (
                    recentMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => onSelectTab('contact')}
                        className="hover:bg-[var(--bg-page)]/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              msg.status === 'unread'
                                ? 'bg-[var(--accent-copper)] animate-pulse'
                                : 'bg-emerald-400/80'
                            }`}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-bold text-[var(--text-primary)] truncate max-w-[140px]">
                            {msg.name}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="text-[var(--text-primary)] truncate">
                            {msg.subject}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right pr-4 text-[11px] text-[var(--text-muted)]">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Operations Bar */}
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-xs">
            <div className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3 text-[11px]">
              Fast Navigation
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onSelectTab('projects')}
                className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                <span className="truncate">Add Project</span>
              </button>
              <button
                onClick={() => onSelectTab('journey')}
                className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center gap-2"
              >
                <GitBranch className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                <span className="truncate">Add Milestone</span>
              </button>
              <button
                onClick={() => onSelectTab('profile')}
                className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5 text-[var(--accent-copper)] shrink-0" />
                <span className="truncate">Edit Profile</span>
              </button>
              <button
                onClick={() => onSelectTab('settings')}
                className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                <span className="truncate">Site Config</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: System Telemetry */}
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
            <h2 className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-[11px] pb-2 border-b border-[var(--border-subtle)]">
              Database Invariants
            </h2>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Engine</span>
                <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  SQLite (node:sqlite)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Store Path</span>
                <span className="text-[var(--text-primary)] font-mono text-[10px]">
                  /.data/portfolio.db
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Session Auth</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  Secure HTTP-only
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Dual Palettes</span>
                <span className="text-[var(--accent-copper)] text-[10px]">
                  stdout &amp; margin-notes
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Publishing Discipline</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed font-body text-[11px]">
              Table edits are committed directly to SQLite storage. Toggle draft state on any project or milestone to stage changes before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
