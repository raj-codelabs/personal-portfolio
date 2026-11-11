import React, { useState, useRef, useEffect } from 'react';
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
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const reducedMotion = useReducedMotionGlobal();
  const [copied, setCopied] = useState(false);
  const isStdout = theme === 'stdout';

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formContainerRef = useRef<HTMLDivElement>(null);

  const contactEmail = 'contact@rajgolder.example';
  const districtLocation = 'Raipur District, India';

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
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
      setFormFeedback({ type: 'error', text: 'Please include a message (minimum 5 characters).' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'Software Inquiry',
        message: message.trim(),
      });

      setSubmitSuccess(true);
      setFormFeedback({
        type: 'success',
        text: res.message || 'Your inquiry has been transmitted successfully.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setFormFeedback({
        type: 'error',
        text: 'Failed to transmit message. Please send an email directly to contact@rajgolder.example',
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
      <div className="relative pb-4">
        <div>
          {isStdout ? (
            <div className="text-xs font-mono text-[var(--accent-copper)] mb-1 uppercase tracking-wider">
              CORRESPONDENCE &amp; INQUIRY
            </div>
          ) : (
            <div className="text-sm font-serif italic text-[var(--accent-copper)] font-semibold mb-1">
              Correspondence &amp; Contact
            </div>
          )}
        </div>

        <h2
          id="contact-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Direct Inquiries &amp; Channels
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Available for software engineering internships, technical collaborations, and open-source contributions.
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Interactive Contact Cards (Lift 2px on hover) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Card */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-all duration-150 ease-out select-none hover:-translate-y-[2px] ${
            isStdout
              ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-mono'
              : 'border-[#e0d9cd] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[var(--border-subtle)] text-[var(--accent-primary)]' : 'border-[#e0d9cd] text-[#1d4ed8]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="font-bold">Direct Email</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-sans">
              Direct inbox for technical opportunities and academic queries.
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] break-all font-mono">
              {contactEmail}
            </div>
          </div>

          <div
            className={`flex items-center gap-2 pt-4 mt-4 border-t ${
              isStdout ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'
            }`}
          >
            <a
              href={`mailto:${contactEmail}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                isStdout
                  ? 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] font-mono'
                  : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
              }`}
            >
              <span>Compose Message</span>
              <Send className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? 'Email address copied' : 'Copy email address'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                isStdout
                  ? 'border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-[var(--bg-page)] font-mono'
                  : 'border-[#e0d9cd] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  <span>Copy Address</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* GitHub Card */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-all duration-150 ease-out select-none hover:-translate-y-[2px] ${
            isStdout
              ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-mono'
              : 'border-[#e0d9cd] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[var(--border-subtle)] text-[var(--accent-primary)]' : 'border-[#e0d9cd] text-[#1d4ed8]'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span className="font-bold">GitHub Repositories</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3 font-sans">
              Explore public utility commits, code reviews, and experiments.
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-mono">
              github.com/raj-codelabs
            </div>
          </div>

          <div
            className={`pt-4 mt-4 border-t ${
              isStdout ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'
            }`}
          >
            <a
              href="https://github.com/raj-codelabs"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                isStdout
                  ? 'border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-[var(--bg-page)] font-mono'
                  : 'border border-[#e0d9cd] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>Explore Repositories</span>
              <ExternalLink className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Location & Professional Network */}
        <div
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-all duration-150 ease-out select-none hover:-translate-y-[2px] ${
            isStdout
              ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-mono'
              : 'border-[#e0d9cd] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 pb-2 mb-2 border-b text-xs ${
                isStdout ? 'border-[var(--border-subtle)] text-[var(--accent-primary)]' : 'border-[#e0d9cd] text-[#1d4ed8]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-bold">Location &amp; Network</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-2 font-sans">
              District location as per house rules:
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] font-mono mb-2">
              {districtLocation}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              MATS University Campus
            </div>
          </div>

          <div
            className={`pt-4 mt-4 border-t ${
              isStdout ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'
            }`}
          >
            <a
              href="https://linkedin.com/in/rajgolder"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                isStdout
                  ? 'border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] bg-[var(--bg-page)] font-mono'
                  : 'border border-[#e0d9cd] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>Connect On LinkedIn</span>
              <ExternalLink className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Direct Transmission Form */}
      <div
        ref={formContainerRef}
        className={`p-6 sm:p-8 rounded-lg border shadow-xs space-y-6 ${
          isStdout
            ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono'
            : 'border-[#e0d9cd] bg-[#ffffff] font-serif'
        }`}
      >
        <div
          className={`border-b pb-4 space-y-1 ${
            isStdout ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              isStdout ? 'text-[var(--accent-copper)]' : 'text-[#1d4ed8]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Inquiry</span>
          </div>
          <h3
            className={`text-lg font-bold ${
              isStdout ? 'text-[var(--text-primary)]' : 'text-[#1c1917]'
            }`}
          >
            Transmit Direct Inquiry
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            Responses sent directly via verified email within 24 hours.
          </p>
        </div>

        {/* Inline validation error / feedback */}
        <AnimatePresence>
          {formFeedback && (
            <motion.div
              aria-live="polite"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={spring.settle}
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
            </motion.div>
          )}
        </AnimatePresence>

        {submitSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[var(--text-primary)]">
              Transmission Confirmed
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed font-sans">
              Thank you for reaching out. Your inquiry has been routed to contact@rajgolder.example.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 text-xs font-semibold rounded cursor-pointer transition-all border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] bg-[var(--bg-page)] hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                Send Another Inquiry
              </button>
            </div>
          </div>
        ) : (
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
                  placeholder="Full name"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-[border-color,box-shadow] duration-150 ease-out focus:shadow-[0_0_0_2px_var(--focus-ring)]"
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
                  placeholder="user@domain.example"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-[border-color,box-shadow] duration-150 ease-out focus:shadow-[0_0_0_2px_var(--focus-ring)]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="contact-subject" className="text-[var(--text-secondary)]">
                  Subject Line
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Software engineering inquiry"
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-[border-color,box-shadow] duration-150 ease-out focus:shadow-[0_0_0_2px_var(--focus-ring)]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="contact-message-body" className="text-[var(--text-secondary)]">
                  Inquiry Details *
                </label>
                <textarea
                  id="contact-message-body"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide scope, timelines, or collaboration details..."
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs leading-relaxed transition-[border-color,box-shadow] duration-150 ease-out focus:shadow-[0_0_0_2px_var(--focus-ring)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[var(--text-muted)] font-sans">
                District: Raipur, India
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="relative inline-flex items-center justify-center px-5 py-2.5 rounded font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 min-w-[140px] focus-visible:outline-2 bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
