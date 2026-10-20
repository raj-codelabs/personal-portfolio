import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import {
  RotateCcw,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Cpu,
  ArrowRight,
  Terminal,
  Camera,
} from 'lucide-react';
import { PhotoChangeModal } from './PhotoChangeModal';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const DeveloperIdCard: React.FC = () => {
  const { profile } = useCms();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const reducedMotion = useReducedMotionGlobal();
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect touch devices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isTouchDevice || reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      // Section 7.4: tilt max 6deg
      const maxTilt = 6;
      const tiltX = Math.max(-6, Math.min(6, -normY * maxTilt));
      const tiltY = Math.max(-6, Math.min(6, normX * maxTilt));

      setTilt({ x: tiltX, y: tiltY });
      setShine({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.15,
      });
      setIsHovered(true);
    },
    [isTouchDevice, reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setShine((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip]
  );

  // Profile data bindings
  const name = profile?.name || 'Raj Golder';
  const role = profile?.title || 'B.Tech CSE (AI/ML) Student';
  const email = profile?.contact?.email || 'contact@rajgolder.dev';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';
  const linkedin = profile?.contact?.linkedin || 'https://linkedin.com/in/rajgolder';

  const primarySkills = ['Python', 'C Programming', 'CS50x & CS50P'];

  const transformStyle = reducedMotion
    ? isFlipped
      ? 'rotateY(180deg)'
      : 'none'
    : isFlipped
    ? `rotateY(${180 + tilt.y}deg) rotateX(${-tilt.x}deg)`
    : `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`;

  // Section 1 & 7.4: Flip uses physical spring (underdamped ~0.7); hover tilt uses settle
  const transitionStyle = reducedMotion
    ? 'none'
    : isHovered && !isTouchDevice
    ? 'transform 140ms cubic-bezier(0.23, 1, 0.32, 1)' // settle spring
    : 'transform 650ms cubic-bezier(0.34, 1.45, 0.64, 1)'; // physical underdamped spring for badge flip ONLY

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto select-none font-mono"
      style={{ perspective: '1200px' }}
      aria-label={`Student identification credential for ${name}. Press Enter or Space to flip between ID card and academic profile.`}
    >
      {/* Outer 3D Card Shell */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('a') || target.closest('button')) return;
          toggleFlip();
        }}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-[560px] rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#00e5c0] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0e14] transition-shadow duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: transformStyle,
          transition: transitionStyle,
        }}
      >
        {/* Specular Highlight Layer */}
        {!reducedMotion && !isTouchDevice && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              opacity: shine.opacity,
              background: `radial-gradient(circle 260px at ${shine.x}% ${shine.y}%, rgba(255, 255, 255, 0.08), transparent 75%)`,
            }}
          />
        )}

        {/* FRONT FACE: Credential Card */}
        <div
          aria-hidden={isFlipped}
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#0d121c] border border-[#24334a] p-5 sm:p-6 flex flex-col justify-between shadow-xl overflow-hidden text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #00e5c0 1px, transparent 1px), linear-gradient(to bottom, #00e5c0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1c2738] pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded bg-[#00e5c0]/15 border border-[#00e5c0]/40 flex items-center justify-center transition-transform duration-100 ease-out"
                style={{
                  transform: reducedMotion ? 'none' : `translate3d(${tilt.y * 0.5}px, ${-tilt.x * 0.5}px, 8px)`,
                }}
              >
                <Cpu className="w-3.5 h-3.5 text-[#00e5c0]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] tracking-wider text-[#00e5c0] font-bold">ENGINEERING ID</div>
                <div className="text-[10px] text-[#94a3b8]">B.TECH CSE (AI/ML)</div>
              </div>
            </div>

            <div className="text-right leading-tight">
              <div className="text-[10px] font-bold text-[#f1f5f9] tracking-wider">MATS UNIVERSITY</div>
              <div className="text-[10px] text-[#e27d60] font-mono font-medium">CLASS OF 2030</div>
            </div>
          </div>

          {/* UPPER HALF: ID Photo occupying the upper half space of the ID card */}
          <div className="relative z-10 my-1">
            <div
              className="relative w-full h-[225px] rounded-xl bg-[#141b27] border border-[#00e5c0]/45 overflow-hidden shadow-lg group/photo cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsPhotoModalOpen(true);
              }}
              title="Click to change ID photo"
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/photo:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#111a28] via-[#0d1420] to-[#080d14] flex flex-col items-center justify-center text-center p-4">
                  <div className="relative w-16 h-16 rounded-full bg-[#162030] border-2 border-[#00e5c0]/50 flex items-center justify-center mb-2 shadow-inner group-hover/photo:border-[#00e5c0] transition-colors">
                    <Cpu className="w-8 h-8 text-[#00e5c0]" />
                  </div>
                  <div className="relative text-xs font-bold text-[#f1f5f9] tracking-wider font-mono">
                    {name}
                  </div>
                  <div className="relative text-[10px] text-[#00e5c0] font-mono mt-0.5">
                    STUDENT CREDENTIAL
                  </div>
                  <div className="relative text-[9px] text-[#94a3b8] font-mono mt-1">
                    Click to upload or select photo
                  </div>
                </div>
              )}

              {/* Holographic Scanline Overlay on Photo */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00e5c0]/5 to-transparent opacity-40 mix-blend-screen" />

              {/* Top Badge Tag */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0b0f19]/80 backdrop-blur-md border border-[#00e5c0]/40 text-[9px] text-[#00e5c0] font-mono font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c0] animate-pulse" />
                <span>STUDENT ID</span>
              </div>

              {/* Cyber Corner Marks */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00e5c0] pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00e5c0] pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00e5c0] pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00e5c0] pointer-events-none" />

              {/* Prominent Change Photo Floating Button */}
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0b0f19]/85 hover:bg-[#00e5c0] text-[#00e5c0] hover:text-[#0a0e14] border border-[#00e5c0]/60 text-[10px] font-mono font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer"
                  title="Change ID photo"
                >
                  <Camera className="w-3 h-3" />
                  <span>Change photo</span>
                </button>
              </div>

              {/* Hover Hint Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-[#00e5c0] transition-opacity duration-200 pointer-events-none">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[11px] font-mono font-bold tracking-wider">CHANGE PHOTO</span>
                <span className="text-[9px] text-slate-300 font-mono mt-0.5">Upload file or paste URL</span>
              </div>
            </div>
          </div>

          {/* LOWER HALF: Identity Details, Verified Skills & Barcode */}
          <div className="relative z-10 space-y-2.5 pt-1">
            {/* Name & Academic Rank */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-[#f8fafc] tracking-tight truncate">
                  {name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00e5c0]/10 border border-[#00e5c0]/30 text-[10px] text-[#00e5c0] font-semibold shrink-0">
                  UNDERGRAD
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94a3b8] font-mono mt-0.5">
                <span>{role}</span>
                <span className="text-[#e27d60] font-medium">MATS University</span>
              </div>
            </div>

            {/* Verified Foundations */}
            <div className="space-y-1">
              <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider flex items-center justify-between">
                <span>Verified Foundations:</span>
                <span className="text-[#00e5c0] font-mono text-[10px]">CS50x &amp; CS50P</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {primarySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#162030] border border-[#2b3d56] text-[#e2e8f0] text-[10px] font-mono tracking-tight"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Barcode & Credential Serial */}
            <div className="flex items-center justify-between pt-1 border-t border-[#1c2738] text-[10px] text-[#64748b] font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[#00e5c0]">ID:</span>
                <span className="text-[#cbd5e1] tracking-wider">RG-2026-MATS-8472</span>
              </div>
              {/* Micro barcode decoration with depth shift */}
              <div
                className="flex items-center gap-[2px] h-3.5 opacity-60 transition-transform duration-100 ease-out"
                style={{
                  transform: reducedMotion ? 'none' : `translate3d(${tilt.y * 0.4}px, ${-tilt.x * 0.4}px, 6px)`,
                }}
                aria-hidden="true"
              >
                {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 2].map((w, i) => (
                  <span key={i} className="h-full bg-[#94a3b8]" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Flip Control */}
          <div className="relative z-10 pt-2 border-t border-[#1c2738] flex items-center justify-between">
            <span className="text-[10px] text-[#94a3b8]">
              Press Enter or click to flip
            </span>

            <button
              type="button"
              tabIndex={isFlipped ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#162233] border border-[#00e5c0]/40 text-[11px] font-semibold text-[#00e5c0] hover:bg-[#00e5c0] hover:text-[#0b0e14] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>PROFILE DETAILS</span>
            </button>
          </div>
        </div>

        {/* BACK FACE: Academic Profile */}
        <div
          aria-hidden={!isFlipped}
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#090d15] border border-[#24334a] p-6 flex flex-col justify-between shadow-2xl overflow-hidden text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Top Header */}
          <div className="relative z-10 border-b border-[#1c2738] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00e5c0]" />
              <div>
                <div className="text-[11px] text-[#00e5c0] font-bold tracking-wider">STUDENT PROFILE</div>
                <div className="text-[11px] text-[#94a3b8]">ACADEMIC VERIFICATION</div>
              </div>
            </div>
            <div className="text-[11px] text-[#e27d60] font-mono">B.TECH CSE</div>
          </div>

          {/* Body */}
          <div className="relative z-10 space-y-3.5 my-auto text-xs font-mono">
            <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-lg bg-[#101724] border border-[#1e2a3c]">
              <div>
                <span className="text-[#64748b] block text-[10px]">PROGRAM</span>
                <span className="text-[#f1f5f9] font-semibold">B.Tech CSE (AI/ML)</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">INSTITUTION</span>
                <span className="text-[#f1f5f9] font-semibold">MATS University</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">CERTIFICATES</span>
                <span className="text-[#00e5c0] font-semibold">CS50x &amp; CS50P</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[10px]">GRADUATION</span>
                <span className="text-[#f1f5f9] font-semibold">2030</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider">Verified Links:</div>

              <div className="space-y-1.5 text-[11px]">
                <a
                  href={`mailto:${email}`}
                  tabIndex={isFlipped ? 0 : -1}
                  className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#00e5c0] shrink-0" />
                    <span className="truncate">{email}</span>
                  </span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                </a>

                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isFlipped ? 0 : -1}
                    className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Github className="w-3.5 h-3.5 text-[#00e5c0] shrink-0" />
                      <span className="truncate">github.com/raj-codelabs</span>
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                  </a>
                )}

                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isFlipped ? 0 : -1}
                    className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Linkedin className="w-3.5 h-3.5 text-[#00e5c0] shrink-0" />
                      <span className="truncate">linkedin.com/in/rajgolder</span>
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Return Action */}
          <div className="relative z-10 pt-3 border-t border-[#1c2738] flex items-center justify-between">
            <a
              href="#projects"
              tabIndex={isFlipped ? 0 : -1}
              className="text-[11px] text-[#94a3b8] hover:text-[#00e5c0] flex items-center gap-1 transition-colors"
            >
              <span>See my work</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            <button
              type="button"
              tabIndex={isFlipped ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#162233] border border-[#00e5c0]/40 text-[11px] font-semibold text-[#00e5c0] hover:bg-[#00e5c0] hover:text-[#0b0e14] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>FRONT VIEW</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-[var(--text-muted)] font-mono">
        Click card or press Enter to flip credential
      </div>

      {/* Photo Change Modal */}
      <PhotoChangeModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        initialMode="id-card"
      />
    </div>
  );
};
