import React, { useState, useRef, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import {
  RotateCcw,
  ExternalLink,
  Cpu,
  ArrowRight,
  Terminal,
  Camera,
  Mail,
  GitFork,
  Linkedin,
} from 'lucide-react';
import { PhotoChangeModal } from './PhotoChangeModal';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const DeveloperIdCard: React.FC = () => {
  const { profile } = useCms();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotionGlobal();
  const cardRef = useRef<HTMLDivElement>(null);

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

  const name = profile?.name || 'Raj Golder';
  const role = profile?.title || 'B.Tech CSE (AI/ML) Student';
  const email = profile?.contact?.email || 'contact@rajgolder.dev';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';
  const linkedin = profile?.contact?.linkedin || 'https://linkedin.com/in/rajgolder';

  const primarySkills = ['Python', 'C Systems', 'CS50x & CS50P'];

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto select-none font-mono"
      style={{ perspective: '1000px' }}
      aria-label={`Student identification credential for ${name}. Press Enter or Space to toggle view.`}
    >
      {/* Outer Card Shell with zero tilt */}
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
        className="relative w-full h-[520px] rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        {/* FRONT FACE: Credential Card */}
        <div
          aria-hidden={isFlipped}
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#0d121c] border border-[#24334a] p-5 sm:p-6 flex flex-col justify-between shadow-xl overflow-hidden text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1c2738] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#3b82f6]/15 border border-[#3b82f6]/40 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] tracking-wider text-[#3b82f6] font-bold">ENGINEERING ID</div>
                <div className="text-[10px] text-[#94a3b8]">B.TECH CSE (AI/ML)</div>
              </div>
            </div>

            <div className="text-right leading-tight">
              <div className="text-[10px] font-bold text-[#f1f5f9] tracking-wider">MATS UNIVERSITY</div>
              <div className="text-[10px] text-[#b87333] font-mono font-medium">CLASS OF 2030</div>
            </div>
          </div>

          {/* UPPER HALF: ID Photo with 1.02-1.03 hover zoom */}
          <div className="relative z-10 my-1">
            <div
              className="group/photo relative w-full h-[215px] rounded-xl bg-[#141b27] border border-[#3b82f6]/45 overflow-hidden shadow-lg cursor-pointer"
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
                  className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover/photo:scale-[1.025]"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#111a28] via-[#0d1420] to-[#080d14] flex flex-col items-center justify-center text-center p-4">
                  <div className="relative w-16 h-16 rounded-full bg-[#162030] border-2 border-[#3b82f6]/50 flex items-center justify-center mb-2 shadow-inner group-hover/photo:border-[#3b82f6] transition-transform duration-300 ease-out group-hover/photo:scale-[1.025]">
                    <Cpu className="w-8 h-8 text-[#3b82f6]" />
                  </div>
                  <div className="relative text-xs font-bold text-[#f1f5f9] tracking-wider font-mono">
                    {name}
                  </div>
                  <div className="relative text-[10px] text-[#3b82f6] font-mono mt-0.5">
                    STUDENT CREDENTIAL
                  </div>
                </div>
              )}

              {/* Holographic Scanline Overlay on Photo */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#3b82f6]/5 to-transparent opacity-40 mix-blend-screen" />

              {/* Top Credential Tag */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center px-2 py-0.5 rounded bg-[#0b0f19]/80 backdrop-blur-md border border-[#3b82f6]/30 text-[10px] text-[#3b82f6] font-mono font-medium tracking-wide">
                <span>Verified ID</span>
              </div>

              {/* Change Photo Floating Button */}
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0b0f19]/85 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-[#0a0e14] border border-[#3b82f6]/60 text-[10px] font-mono font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px]"
                  title="Update photo"
                >
                  <Camera className="w-3 h-3" />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>

          {/* LOWER HALF: Identity Details, Verified Skills & Barcode */}
          <div className="relative z-10 space-y-2 pt-1">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-[#f8fafc] tracking-tight truncate">
                  {name}
                </h3>
                <span className="text-xs text-[#b87333] font-medium tracking-wide shrink-0 font-mono">
                  Undergraduate
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#94a3b8] font-mono mt-0.5">
                <span>{role}</span>
                <span className="text-[#b87333] font-medium">MATS University</span>
              </div>
            </div>

            {/* Verified Foundations */}
            <div className="space-y-1">
              <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider flex items-center justify-between">
                <span>Verified Foundations:</span>
                <span className="text-[#3b82f6] font-mono text-[10px]">CS50x &amp; CS50P</span>
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

            {/* Barcode & Serial */}
            <div className="flex items-center justify-between pt-1 border-t border-[#1c2738] text-[10px] text-[#64748b] font-mono">
              <div className="flex items-center gap-1">
                <span className="text-[#b87333]">ID:</span>
                <span className="text-[#cbd5e1] tracking-wider">RG-2026-MATS-8472</span>
              </div>
              <div className="flex items-center gap-[2px] h-3.5 opacity-60" aria-hidden="true">
                {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 2].map((w, i) => (
                  <span key={i} className="h-full bg-[#94a3b8]" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Flip Trigger */}
          <div className="relative z-10 pt-2 border-t border-[#1c2738] flex items-center justify-between">
            <span className="text-[10px] text-[#94a3b8]">Verified Record</span>

            <button
              type="button"
              tabIndex={isFlipped ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#162233] border border-[#3b82f6]/40 text-[11px] font-semibold text-[#3b82f6] hover:bg-[#3b82f6] hover:text-[#0b0e14] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Inspect Profile</span>
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
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Top Header */}
          <div className="relative z-10 border-b border-[#1c2738] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#3b82f6]" />
              <div>
                <div className="text-[11px] text-[#3b82f6] font-bold tracking-wider">STUDENT PROFILE</div>
                <div className="text-[11px] text-[#94a3b8]">ACADEMIC VERIFICATION</div>
              </div>
            </div>
            <div className="text-[11px] text-[#b87333] font-mono">B.TECH CSE</div>
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
                <span className="text-[#3b82f6] font-semibold">CS50x &amp; CS50P</span>
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
                  className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#3b82f6] hover:border-[#3b82f6] hover:-translate-y-[2px] transition-all"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
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
                    className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#3b82f6] hover:border-[#3b82f6] hover:-translate-y-[2px] transition-all"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <GitFork className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
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
                    className="flex items-center justify-between p-2 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#3b82f6] hover:border-[#3b82f6] hover:-translate-y-[2px] transition-all"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Linkedin className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
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
              className="text-[11px] text-[#94a3b8] hover:text-[#3b82f6] flex items-center gap-1 transition-colors"
            >
              <span>Explore Builds</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            <button
              type="button"
              tabIndex={isFlipped ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#162233] border border-[#3b82f6]/40 text-[11px] font-semibold text-[#3b82f6] hover:bg-[#3b82f6] hover:text-[#0b0e14] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return Front</span>
            </button>
          </div>
        </div>
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
