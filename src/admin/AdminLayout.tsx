import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GitBranch,
  BookOpen,
  Mail,
  Sliders,
  Image,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'journey'
  | 'about'
  | 'contact'
  | 'visibility'
  | 'media'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewPublicSite,
  children,
}) => {
  const { admin, logout } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems: Array<{ id: AdminTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects & Repositories', icon: FolderGit2 },
    { id: 'skills', label: 'Skills & Apparatus', icon: Cpu },
    { id: 'journey', label: 'Milestone DAG & Journey', icon: GitBranch },
    { id: 'about', label: 'About & Monograph', icon: BookOpen },
    { id: 'contact', label: 'Contact & Channels', icon: Mail },
    { id: 'visibility', label: 'Sections & Layout', icon: Sliders },
    { id: 'media', label: 'Media Manager', icon: Image },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-page)] text-[var(--text-primary)] font-body">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <span className="font-display font-bold text-sm tracking-tight">Portfolio Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:flex flex-col justify-between w-full md:w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 z-30`}
      >
        <div className="p-4 sm:p-5 space-y-6">
          {/* Brand & Admin Badge */}
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="font-display font-bold text-base tracking-tight">Portfolio CMS</span>
              </div>
              <p className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[180px]">
                {admin?.email}
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-mono text-xs text-left" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2 font-mono text-xs">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-left">
        <div className="max-w-5xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
