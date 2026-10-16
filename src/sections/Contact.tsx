import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import {
  Mail,
  GitFork,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [copied, setCopied] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const contactData = profile?.contact || {
    email: 'raj.golder.cse@university.edu',
    github: 'https://github.com/raj-golder',
    linkedin: 'https://linkedin.com/in/raj-golder',
    location: 'Bangalore, India',
    statusLabel: 'Active Undergraduate · Open to Systems Invariant Collaborations',
    customLinks: [],
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(contactData.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!name.trim()) {
      setFormFeedback({ type: 'error', text: 'Please enter your name.' });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setFormFeedback({ type: 'error', text: 'Please include a message (min 5 characters).' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'Portfolio Inquiry',
        message: message.trim(),
      });

      setFormFeedback({
        type: 'success',
        text: res.message || 'Your correspondence has been securely logged. Thank you for reaching out.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setFormFeedback({
        type: 'error',
        text: err?.message || 'Failed to send message. Please reach out directly via email.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="text-xs font-mono text-[var(--accent-primary)] mb-1">
          05 // SECURE CORRESPONDENCE & COLLABORATION
        </div>
        <h2
          id="contact-heading"
          className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]"
        >
          Direct Correspondence
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Open to discussions on systems research, compiler internals, reproducible ML pipelines, and undergraduate engineering apprenticeships.
        </p>
      </div>

      {/* Contact Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Direct Email Card */}
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Institutional Inbox</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-body mb-3">
              Direct inbox for technical inquiries and research opportunities:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold break-all">
              {contactData.email}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[var(--border-subtle)]">
            <a
              href={`mailto:${contactData.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.97] transition-all"
            >
              <span>Compose</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={copyEmail}
              aria-label="Copy email address to clipboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] [@media(hover:hover)_and_(pointer:fine)]:active:scale-[0.97] transition-[transform,border-color,background-color] duration-140 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 transition-[filter,opacity] duration-160 ease-out">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent-success)]" />
                    <span className="text-[var(--accent-success)]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* GitHub Card */}
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              <GitFork className="w-4 h-4 text-[var(--accent-copper)]" />
              <span>Version Control & Invariants</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-body mb-3">
              Explore commit trees, reproducible lab notebooks, and personal builds:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold truncate">
              {contactData.github.replace(/^https?:\/\//, '')}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
            <a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] active:scale-[0.97] transition-all"
            >
              <span>Visit Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              <Linkedin className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Academic Network</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-body mb-3">
              Connect for academic collaboration, reading groups, and symposiums:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold truncate">
              {contactData.linkedin.replace(/^https?:\/\//, '')}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] active:scale-[0.97] transition-all"
            >
              <span>Connect</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Direct Transmission Terminal */}
      <div className="p-6 sm:p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)]">
            <MessageSquare className="w-4 h-4" />
            <span>DISPATCH CORRESPONDENCE INQUIRY</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[var(--text-primary)]">
            Send Invariant Inquiry or Apprenticeship Proposal
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-body">
            Messages are transmitted directly to the secure portfolio inbox.
          </p>
        </div>

        {formFeedback && (
          <div
            className={`p-3.5 rounded text-xs font-mono flex items-center gap-2 ${
              formFeedback.type === 'success'
                ? 'border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10 text-[var(--accent-success)]'
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
            }`}
          >
            {formFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{formFeedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitInquiry} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-sender-name" className="text-[var(--text-secondary)]">
                Your Full Name / Identification *
              </label>
              <input
                id="contact-sender-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ada Lovelace"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-sender-email" className="text-[var(--text-secondary)]">
                Return Email Address *
              </label>
              <input
                id="contact-sender-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ada@analytical.engine.ac.uk"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="contact-subject" className="text-[var(--text-secondary)]">
                Subject / Focus Area
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Invariants in scalar autograd vs backward PyTorch tape"
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="contact-message-body" className="text-[var(--text-secondary)]">
                Message Body *
              </label>
              <textarea
                id="contact-message-body"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail technical context, discussion points, or collaboration questions..."
                className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-body text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[var(--text-muted)]">
              Securely stored in sqlite database.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging Correspondence...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Correspondence</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
