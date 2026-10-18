import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { api } from '../services/api';
import {
  Mail,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  GitFork,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [copied, setCopied] = useState(false);
  const isStdout = theme === 'stdout';

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const contactData = profile?.contact || {
    email: 'contact@rajgolder.dev',
    github: 'https://github.com/raj-codelabs',
    linkedin: 'https://linkedin.com/in/rajgolder',
    location: 'MATS University · India',
    statusLabel: 'FIRST-YEAR CSE STUDENT · LEARNING & BUILDING',
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
        text: res.message || 'Your message has been sent. Thank you for reaching out!',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setFormFeedback({
        type: 'error',
        text: 'Failed to send message. Please reach out directly to contact@rajgolder.dev',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        {isStdout ? (
          <div className="text-xs font-mono text-[#00e5c0] mb-1 uppercase tracking-wider">
            GET IN TOUCH
          </div>
        ) : (
          <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
            Correspondence &amp; Contact
          </div>
        )}
        <h2
          id="contact-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Get in Touch
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Open to internships, freelance projects, and collaborations. I reply promptly by email.
        </p>
      </div>

      {/* Contact Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Card */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[#242e40] text-[#00e5c0]' : 'border-[#e2dbce] text-[#1d4ed8]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="font-bold">Email</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-sans">
              Direct communication for projects, internships, and queries.
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] break-all font-mono">
              {contactData.email}
            </div>
          </div>

          <div
            className={`flex items-center gap-2 pt-4 mt-4 border-t ${
              isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
            }`}
          >
            <a
              href={`mailto:${contactData.email}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] font-mono font-bold'
                  : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif font-medium'
              }`}
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Email</span>
            </a>

            <button
              onClick={copyEmail}
              aria-label="Copy email address to clipboard"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border cursor-pointer transition-colors ${
                isStdout
                  ? 'border-[#242e40] text-[#f1f5f9] hover:border-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border-[#e2dbce] text-[#1c1917] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GitHub Card */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[#242e40] text-[#00e5c0]' : 'border-[#e2dbce] text-[#1d4ed8]'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span className="font-bold">GitHub</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-sans">
              Explore public repositories, code commits, and project files.
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-mono">
              github.com/raj-codelabs
            </div>
          </div>

          <div
            className={`pt-4 mt-4 border-t ${
              isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
            }`}
          >
            <a
              href="https://github.com/raj-codelabs"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'border border-[#242e40] text-[#00e5c0] hover:border-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border border-[#e2dbce] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[#242e40] text-[#00e5c0]' : 'border-[#e2dbce] text-[#1d4ed8]'
              }`}
            >
              <Linkedin className="w-4 h-4" />
              <span className="font-bold">LinkedIn</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-sans">
              Connect professionally and follow my undergraduate development.
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-mono">
              linkedin.com/in/rajgolder
            </div>
          </div>

          <div
            className={`pt-4 mt-4 border-t ${
              isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
            }`}
          >
            <a
              href="https://linkedin.com/in/rajgolder"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'border border-[#242e40] text-[#00e5c0] hover:border-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border border-[#e2dbce] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Direct Transmission Form */}
      <div
        className={`p-6 sm:p-8 rounded-lg border shadow-xs space-y-6 ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] font-mono'
            : 'border-[#e2dbce] bg-[#ffffff] font-serif'
        }`}
      >
        <div
          className={`border-b pb-4 space-y-1 ${
            isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-xs font-bold ${
              isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SEND A MESSAGE</span>
          </div>
          <h3
            className={`text-lg font-bold ${
              isStdout ? 'text-[#f1f5f9]' : 'text-[#1c1917]'
            }`}
          >
            Send a Direct Message
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            I reply promptly by email.
          </p>
        </div>

        {formFeedback && (
          <div
            aria-live="polite"
            className={`p-3.5 rounded text-xs flex items-center gap-2 ${
              formFeedback.type === 'success'
                ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
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

        <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-sender-name" className="text-[var(--text-secondary)]">
                Your Name *
              </label>
              <input
                id="contact-sender-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={`w-full px-3 py-2 rounded border focus:outline-none ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9] focus:border-[#00e5c0]'
                    : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917] focus:border-[#1d4ed8]'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-sender-email" className="text-[var(--text-secondary)]">
                Your Email Address *
              </label>
              <input
                id="contact-sender-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-3 py-2 rounded border focus:outline-none ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9] focus:border-[#00e5c0]'
                    : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917] focus:border-[#1d4ed8]'
                }`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="contact-subject" className="text-[var(--text-secondary)]">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className={`w-full px-3 py-2 rounded border focus:outline-none ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9] focus:border-[#00e5c0]'
                    : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917] focus:border-[#1d4ed8]'
                }`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="contact-message-body" className="text-[var(--text-secondary)]">
                Message *
              </label>
              <textarea
                id="contact-message-body"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can I help?"
                className={`w-full px-3 py-2 rounded border focus:outline-none text-xs leading-relaxed ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9] focus:border-[#00e5c0]'
                    : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917] focus:border-[#1d4ed8]'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[var(--text-muted)] font-sans">
              I reply promptly by email.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                isStdout
                  ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0]'
                  : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]'
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
