import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { theme } = useTheme();
  const { login, setupFirstAdmin, needsSetup, loading, error, clearError } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (needsSetup) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
    }

    try {
      setSubmitting(true);
      if (needsSetup) {
        await setupFirstAdmin(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDefault = () => {
    setEmail('admin@rajgolder.dev');
    setPassword('AdminPassword2026!');
    if (needsSetup) {
      setConfirmPassword('AdminPassword2026!');
    }
  };

  const displayedError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-page)] text-[var(--text-primary)]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[var(--border-subtle)] text-xs font-mono text-[var(--accent-primary)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{needsSetup ? 'INITIAL SETUP' : 'RESTRICTED ADMIN'}</span>
            </div>
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Site</span>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
            {needsSetup ? 'Initialize Primary Administrator' : 'Administrator Sign In'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed">
            {needsSetup
              ? 'No administrator is currently provisioned. Click "Fill Credentials" below to initialize with default credentials, or enter your custom administrator details.'
              : 'Sign in with your authorized credentials to manage portfolio content, projects, and site invariants.'}
          </p>
        </div>

        {/* Quick Credentials / Default Info Helper */}
        <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Default Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDefault}
              className="text-[11px] font-mono text-[var(--accent-primary)] hover:underline cursor-pointer font-bold"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] font-mono text-[var(--text-secondary)] space-y-0.5">
            <div><span className="text-[var(--text-muted)]">Email:</span> admin@rajgolder.dev</div>
            <div><span className="text-[var(--text-muted)]">Password:</span> AdminPassword2026!</div>
          </div>
        </div>

        {/* Error Alert */}
        {displayedError && (
          <div className="p-3 rounded border border-rose-500/50 bg-rose-500/10 text-xs text-rose-400 font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{displayedError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs text-left">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-[var(--text-secondary)]">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.edu"
                className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-[var(--text-secondary)]">
              Password {needsSetup && <span className="text-[var(--accent-copper)]">(Min 8 chars)</span>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                id="admin-password"
                type="password"
                autoComplete={needsSetup ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          {needsSetup && (
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-[var(--text-secondary)]">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-2.5 px-4 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : needsSetup ? 'Initialize Administrator' : 'Enter Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Disclaimers */}
        <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] space-y-1 text-left">
          <p>• Zero client-side verification: Passwords scrypt-hashed server-side.</p>
          <p>• Session state transmitted via secure HTTP-only cookies.</p>
          <p>• Brute-force rate limiting active (5 attempts / 15-min lockout).</p>
        </div>
      </div>
    </div>
  );
};
