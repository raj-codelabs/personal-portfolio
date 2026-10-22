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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const reducedMotion = useReducedMotionGlobal();
  const [copied, setCopied] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
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
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const contactData = profile?.contact || {
    email: 'contact@rajgolder.dev',
    github: 'https://github.com/raj-codelabs',
    linkedin: 'https://linkedin.com/in/rajgolder',
    location: 'Raipur, India',
    statusLabel: 'FIRST-YEAR CSE STUDENT · LEARNING & BUILDING',
    customLinks: [],
  };

  // Section 7.3: Copy button reverts after 1.8s
  const copyEmail = () => {
    navigator.clipboard.writeText(contactData.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    // Section 7.3: Inline validation errors slide down 6px + fade; no shake
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

    // Capture height to avoid layout jump on success crossfade (Section 7.3)
    if (formContainerRef.current) {
      setContainerHeight(formContainerRef.current.offsetHeight);
    }

    try {
      setSubmitting(true);
      const res = await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'Portfolio Inquiry',
        message: message.trim(),
      });

      setSubmitSuccess(true);
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
      {/* Section Header with Section 5 reveals */}
      <div className="relative pb-4">
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
        >
          {isStdout ? (
            <div className="text-xs font-mono text-[#00e5c0] mb-1 uppercase tracking-wider">
              GET IN TOUCH
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Correspondence &amp; Contact
            </div>
          )}
        </motion.div>

        <motion.h2
          id="contact-heading"
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Get in Touch
        </motion.h2>

        <motion.p
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl"
        >
          Open to internships, freelance projects, and collaborations. I reply promptly by email.
        </motion.p>

        {/* Section hairline rule: scaleX 0 to 1, origin left, soft spring (Section 5) */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.soft}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Interactive Contact Cards (Section 7.1: translateY(-3px) on hover, scale(0.99) on press) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Card */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0 }}
          whileHover={
            reducedMotion || isTouch
              ? undefined
              : {
                  y: -2,
                  transition: spring.snap,
                }
          }
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-colors select-none ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] hover:border-[#00e5c0] hover:shadow-[0_0_16px_rgba(0,229,192,0.2)] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
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
                  ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] font-mono'
                  : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
              }`}
            >
              <span>Compose</span>
              <Send className="w-3 h-3" />
            </a>

            {/* Section 7.3: Copy button label swaps to Copied with check icon (scale 0.8 to 1 with snap), reverts after 1.8s, aria-live */}
            <motion.button
              type="button"
              onClick={copyEmail}
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              aria-label={copied ? 'Email address copied' : 'Copy email address'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                isStdout
                  ? 'border-[#242e40] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border-[#e2dbce] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span aria-live="polite" className="flex items-center gap-1.5">
                {copied ? (
                  <motion.span
                    initial={reducedMotion ? false : { scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={spring.snap}
                    className="flex items-center gap-1.5 text-emerald-400 font-bold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </motion.span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* GitHub Card */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          whileHover={
            reducedMotion || isTouch
              ? undefined
              : {
                  y: -3,
                  transition: spring.snap,
                }
          }
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-colors select-none ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] hover:border-[#00e5c0] hover:shadow-[0_0_16px_rgba(0,229,192,0.2)] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
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
              Explore public repositories, code experiments, and study notes.
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
            <motion.a
              href="https://github.com/raj-codelabs"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'border border-[#242e40] text-[#00e5c0] hover:border-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border border-[#e2dbce] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>Explore GitHub</span>
              <ExternalLink className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </motion.div>

        {/* LinkedIn Card */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          whileHover={
            reducedMotion || isTouch
              ? undefined
              : {
                  y: -3,
                  transition: spring.snap,
                }
          }
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          className={`p-6 rounded-lg border flex flex-col justify-between shadow-xs transition-colors select-none ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] hover:border-[#00e5c0] hover:shadow-[0_0_16px_rgba(0,229,192,0.2)] font-mono'
              : 'border-[#e2dbce] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif'
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
            <motion.a
              href="https://linkedin.com/in/rajgolder"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'border border-[#242e40] text-[#00e5c0] hover:border-[#00e5c0] bg-[#0d121c] font-mono'
                  : 'border border-[#e2dbce] text-[#1d4ed8] hover:border-[#1d4ed8] bg-[#fbf9f6] font-serif'
              }`}
            >
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Direct Transmission Form */}
      <motion.div
        ref={formContainerRef}
        data-reveal
        initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
        transition={spring.settle}
        style={{ minHeight: containerHeight }}
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

        {/* Section 7.3: Inline validation error / feedback: slides down 6px + fades; no shake */}
        <AnimatePresence>
          {formFeedback && (
            <motion.div
              aria-live="polite"
              initial={reducedMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
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
          /* Section 7.3: Success crossfade with container height held */
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.settle}
            className="py-8 text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[var(--text-primary)]">
              Transmission Confirmed
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed font-sans">
              Thank you for reaching out. Your message has been routed to my direct inbox at contact@rajgolder.dev.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className={`px-4 py-2 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  isStdout
                    ? 'border border-[#242e40] text-[#00e5c0] hover:border-[#00e5c0]'
                    : 'border border-[#e2dbce] text-[#1d4ed8] hover:border-[#1d4ed8]'
                }`}
              >
                Send another message
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="contact-sender-name" className="text-[var(--text-secondary)]">
                  Your Name *
                </label>
                {/* Section 7.3: Input focus ring fades in (~150ms) via box-shadow */}
                <input
                  id="contact-sender-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={`w-full px-3 py-2 rounded border focus:outline-none transition-shadow duration-150 focus:shadow-[0_0_0_2px_var(--focus-ring)] ${
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
                  className={`w-full px-3 py-2 rounded border focus:outline-none transition-shadow duration-150 focus:shadow-[0_0_0_2px_var(--focus-ring)] ${
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
                  className={`w-full px-3 py-2 rounded border focus:outline-none transition-shadow duration-150 focus:shadow-[0_0_0_2px_var(--focus-ring)] ${
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
                  className={`w-full px-3 py-2 rounded border focus:outline-none text-xs leading-relaxed transition-shadow duration-150 focus:shadow-[0_0_0_2px_var(--focus-ring)] ${
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

              {/* Submit: button label to spinner to check icon (opacity crossfade, Section 7.3) */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={reducedMotion || submitting ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`relative inline-flex items-center justify-center px-5 py-2.5 rounded font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 min-w-[140px] focus-visible:outline-2 ${
                  isStdout
                    ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0]'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {submitting ? (
                    <motion.div
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
};
