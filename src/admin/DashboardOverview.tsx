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
      setRecentMessages(messagesRes.slice(0, 4));
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
    <div className="space-y-8 font-body">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONAL TELEMETRY & CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Command Center Overview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Manage public portfolio state, projects, milestones DAG, skills taxonomy, and correspondence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            title="Refresh statistics"
            className="p-2 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadBackup}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
            <span>{exporting ? 'Exporting...' : 'Backup JSON'}</span>
          </button>
          <button
            onClick={onViewPublicSite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-mono font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] transition-all cursor-pointer shadow-xs"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Projects */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Projects</span>
            <div className="p-2 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors">
              <FolderGit2 className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[var(--text-primary)]">
              {stats?.projectsCount ?? 0}
            </span>
            <span className="text-xs font-mono text-[var(--accent-success)]">
              ({stats?.publishedProjectsCount ?? 0} published)
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <span>Manage repositories</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Skills */}
        <div
          onClick={() => onSelectTab('skills')}
          className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-copper)] transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Foundations</span>
            <div className="p-2 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-copper)] transition-colors">
              <Cpu className="w-4 h-4 text-[var(--accent-copper)]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[var(--text-primary)]">
              {stats?.skillsCount ?? 0}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              in {stats?.categoriesCount ?? 0} categories
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <span>Manage taxonomy</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Journey Milestones */}
        <div
          onClick={() => onSelectTab('journey')}
          className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Milestones DAG</span>
            <div className="p-2 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors">
              <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[var(--text-primary)]">
              {stats?.milestonesCount ?? 0}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              commit logs
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <span>Edit timeline events</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Contact Inquiries */}
        <div
          onClick={() => onSelectTab('contact')}
          className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Inquiries</span>
            <div className="p-2 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] group-hover:border-amber-400 transition-colors">
              <Mail className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[var(--text-primary)]">
              {stats?.messagesCount ?? 0}
            </span>
            {(stats?.unreadMessagesCount ?? 0) > 0 ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                {stats?.unreadMessagesCount} unread
              </span>
            ) : (
              <span className="text-xs font-mono text-[var(--text-muted)]">all read</span>
            )}
          </div>
          <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <span>View incoming inbox</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Launch & Invariant Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inquiries Stream & Quick Action Bar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Quick Operations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <button
                onClick={() => onSelectTab('projects')}
                className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <PlusCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => onSelectTab('journey')}
                className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>Add Milestone</span>
              </button>
              <button
                onClick={() => onSelectTab('profile')}
                className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <Clock className="w-4 h-4 text-[var(--accent-copper)]" />
                <span>Update Profile</span>
              </button>
              <button
                onClick={() => onSelectTab('settings')}
                className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-all cursor-pointer flex flex-col items-center gap-2 text-center"
              >
                <Database className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>Site Config</span>
              </button>
            </div>
          </div>

          {/* Recent Inquiries List */}
          <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Recent Correspondence
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Direct inquiries received through the contact verification module
                </p>
              </div>
              <button
                onClick={() => onSelectTab('contact')}
                className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({stats?.messagesCount ?? 0})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded">
                No inquiries logged yet.
              </div>
            ) : (
              <div className="space-y-2.5 font-mono text-xs">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onSelectTab('contact')}
                    className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-primary)] truncate">
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] truncate">
                          &lt;{msg.email}&gt;
                        </span>
                        {msg.status === 'unread' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {msg.subject}: <span className="text-[var(--text-muted)]">{msg.message}</span>
                      </p>
                    </div>

                    <span className="text-[10px] text-[var(--text-muted)] shrink-0 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: System Health & Persistence */}
        <div className="space-y-6">
          <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
            <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              System Invariants
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Storage Engine</span>
                <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  SQLite (Native Sync)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Database Path</span>
                <span className="text-[var(--text-primary)] text-[11px] font-mono">
                  /.data/portfolio.db
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Session State</span>
                <span className="text-[var(--accent-success)] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Secure HTTP-only
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Last Content Sync</span>
                <span className="text-[var(--text-muted)] text-[10px]">
                  {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Recent'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Supported Palettes</span>
                <span className="text-[var(--accent-copper)] text-[11px]">
                  stdout & margin-notes
                </span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[var(--text-primary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Real-Time Publishing</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed font-body">
              Edits made in any tab are immediately committed to persistent database storage and reflect in real time on the public portfolio for visitors. Use the draft toggle on any project or milestone to stage changes before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
