import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import {
  RotateCcw,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Cpu,
  ShieldCheck,
  QrCode,
  Sparkles,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export const DeveloperIdCard: React.FC = () => {
  const { profile, projects, skillCategories } = useCms();
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect touch devices and reduced-motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isTouchDevice || reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1)
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      // Restrained tilt angle: 3 to 5 degrees max
      const maxTilt = 4.5;
      const tiltX = -normY * maxTilt;
      const tiltY = normX * maxTilt;

      setTilt({ x: tiltX, y: tiltY });
      setShine({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.18,
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
        // Prevent page scroll on space
        e.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip]
  );

  // Profile data bindings
  const name = profile?.name || 'Raj Golder';
  const title = profile?.title || 'B.Tech CSE (AI/ML) Undergraduate';
  const department = profile?.department || 'Department of Computer Science & Engineering';
  const semester = profile?.semester || 'First Year · Undergrad';
  const avatarUrl = profile?.avatarUrl;
  const email = profile?.contact?.email || 'raj.golder@example.edu';
  const github = profile?.contact?.github || '';
  const linkedin = profile?.contact?.linkedin || '';
  const location = profile?.contact?.location || 'Campus Residence';
  const badgeId = (profile as any)?.idBadgeNumber || 'RG-8192-SYS';
  const qrDestination = (profile as any)?.idBadgeQrUrl || (github.startsWith('http') ? github : '');

  // Select top 3 skills to display on card front
  const primarySkills =
    profile?.currentInterests && profile.currentInterests.length > 0
      ? profile.currentInterests.slice(0, 3)
      : ['Systems & C Allocators', 'Scalar Autograd DAGs', 'Deterministic Invariants'];

  // Calculate dynamic transform incorporating tilt and flip
  const transformStyle = reducedMotion
    ? isFlipped
      ? 'rotateY(180deg)'
      : 'none'
    : isFlipped
    ? `rotateY(${180 + tilt.y}deg) rotateX(${-tilt.x}deg)`
    : `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`;

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto select-none font-mono"
      style={{ perspective: '1200px' }}
      aria-label={`Developer identification badge for ${name}. Press Enter or Space to flip between identity card and technical dossier.`}
    >
      {/* Outer 3D Card Shell */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          // If the user clicked an interactive anchor or button inside, let it execute without flipping
          const target = e.target as HTMLElement;
          if (target.closest('a') || target.closest('button')) return;
          toggleFlip();
        }}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-[540px] rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0e14] transition-shadow duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: transformStyle,
          transition: isHovered && !isTouchDevice ? 'transform 100ms ease-out' : 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Specular Highlight / Sheen Layer */}
        {!reducedMotion && !isTouchDevice && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              opacity: shine.opacity,
              background: `radial-gradient(circle 260px at ${shine.x}% ${shine.y}%, rgba(0, 229, 192, 0.22), transparent 75%)`,
            }}
          />
        )}

        {/* ============================================================ */}
        {/* FRONT FACE: Digital Developer Identification Badge          */}
        {/* ============================================================ */}
        <div
          aria-hidden={isFlipped}
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#0d121c] border border-[#24334a] p-6 flex flex-col justify-between shadow-2xl overflow-hidden text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 229, 192, 0.15)',
          }}
        >
          {/* Subtle Cybernetic Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #00e5c0 1px, transparent 1px), linear-gradient(to bottom, #00e5c0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Lanyard Clip Slot & Security Chip */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1c2738] pb-3">
            {/* Lanyard Hole Mockup */}
            <div className="w-16 h-2 rounded-full bg-[#070a0f] border border-[#2b3c54] mx-auto absolute left-0 right-0 top-0 shadow-inner" />

            <div className="flex items-center gap-2 pt-2">
              <div className="w-7 h-5 rounded bg-gradient-to-tr from-[#00e5c0]/30 to-[#e27d60]/30 border border-[#00e5c0]/40 flex items-center justify-center shadow-xs">
                <div className="w-4 h-3 border border-[#00e5c0]/60 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-[#00e5c0]/40 rounded-xxs" />
                  <div className="bg-[#00e5c0]/40 rounded-xxs" />
                  <div className="bg-[#00e5c0]/40 rounded-xxs" />
                  <div className="bg-[#00e5c0]/40 rounded-xxs" />
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-[9px] tracking-wider text-[#00e5c0] font-bold">SYSTEMS RESEARCH</div>
                <div className="text-[8px] text-[#64748b]">SYS-ID // L1 CLEARANCE</div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <div className="text-[10px] font-bold text-[#f1f5f9] tracking-wider">{badgeId}</div>
              <div className="text-[8px] text-[#64748b]">VALID: 2026-2030</div>
            </div>
          </div>

          {/* Middle Identity Section */}
          <div className="relative z-10 space-y-4 my-auto">
            {/* Photo / Silhouette Area */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl bg-[#141b27] border border-[#00e5c0]/40 p-1 shrink-0 overflow-hidden shadow-md group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-[#0a0e14] border border-[#233144] flex flex-col items-center justify-center text-[#64748b] relative">
                    {/* Reticle crosshair lines */}
                    <div className="absolute inset-x-2 top-1/2 h-px bg-[#00e5c0]/20" />
                    <div className="absolute inset-y-2 left-1/2 w-px bg-[#00e5c0]/20" />
                    <Cpu className="w-7 h-7 text-[#00e5c0]/60 z-10" />
                    <span className="text-[7px] text-[#64748b] font-mono mt-0.5 z-10">PLACEHOLDER</span>
                  </div>
                )}
                {/* Corner Targeting Brackets */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#00e5c0]" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#00e5c0]" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#00e5c0]" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#00e5c0]" />
              </div>

              {/* Name & Academic Credentials */}
              <div className="space-y-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00e5c0]/10 border border-[#00e5c0]/30 text-[9px] text-[#00e5c0] font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c0] animate-pulse" />
                  <span>ACTIVE INVARIANTS LAB</span>
                </div>
                <h3 className="text-lg font-bold text-[#f8fafc] tracking-tight truncate font-display">
                  {name}
                </h3>
                <p className="text-[10px] text-[#94a3b8] leading-tight line-clamp-2">
                  {department}
                </p>
                <div className="text-[9px] text-[#e27d60] font-mono font-medium">
                  {semester.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Core Verification Tags */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[9px] text-[#64748b] uppercase tracking-wider flex items-center justify-between">
                <span>Verified Competencies:</span>
                <span className="text-[#00e5c0]/70 font-mono">AUTONOMOUS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {primarySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-[#162030] border border-[#2b3d56] text-[#94a3b8] text-[9px] font-mono tracking-tight"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Barcode / Real QR Area & Flip Control */}
          <div className="relative z-10 pt-3 border-t border-[#1c2738] space-y-3">
            <div className="flex items-center justify-between gap-2">
              {/* Machine-readable barcode strip */}
              <div className="space-y-1 flex-1">
                <div className="h-6 flex items-stretch gap-0.5 opacity-70">
                  <div className="w-1 bg-[#f1f5f9]" />
                  <div className="w-0.5 bg-[#f1f5f9]" />
                  <div className="w-1.5 bg-[#f1f5f9]" />
                  <div className="w-0.5 bg-[#f1f5f9]" />
                  <div className="w-2 bg-[#f1f5f9]" />
                  <div className="w-0.5 bg-[#f1f5f9]" />
                  <div className="w-1 bg-[#f1f5f9]" />
                  <div className="w-2 bg-[#f1f5f9]" />
                  <div className="w-0.5 bg-[#f1f5f9]" />
                  <div className="w-1 bg-[#f1f5f9]" />
                  <div className="w-1.5 bg-[#f1f5f9]" />
                  <div className="w-0.5 bg-[#f1f5f9]" />
                  <div className="w-1 bg-[#f1f5f9]" />
                  <div className="w-2 bg-[#f1f5f9]" />
                </div>
                <div className="text-[7.5px] text-[#64748b] tracking-widest font-mono">
                  HEX: 0x7F454C46 · LINUX-C99
                </div>
              </div>

              {/* QR-code area ONLY if a real destination is configured */}
              {qrDestination ? (
                <a
                  href={qrDestination}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={(e) => e.stopPropagation()}
                  title={`Open real destination: ${qrDestination}`}
                  className="w-11 h-11 p-1 rounded-md bg-white border border-[#00e5c0]/50 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                >
                  {/* Clean SVG QR matrix placeholder representing real URL */}
                  <svg viewBox="0 0 25 25" className="w-full h-full fill-[#0b0e14]">
                    <rect x="0" y="0" width="7" height="7" />
                    <rect x="1" y="1" width="5" height="5" fill="white" />
                    <rect x="2" y="2" width="3" height="3" />
                    <rect x="18" y="0" width="7" height="7" />
                    <rect x="19" y="1" width="5" height="5" fill="white" />
                    <rect x="20" y="2" width="3" height="3" />
                    <rect x="0" y="18" width="7" height="7" />
                    <rect x="1" y="19" width="5" height="5" fill="white" />
                    <rect x="2" y="20" width="3" height="3" />
                    <rect x="9" y="2" width="2" height="4" />
                    <rect x="13" y="1" width="3" height="2" />
                    <rect x="9" y="8" width="4" height="2" />
                    <rect x="4" y="10" width="2" height="4" />
                    <rect x="10" y="11" width="5" height="4" />
                    <rect x="17" y="9" width="2" height="6" />
                    <rect x="19" y="17" width="5" height="2" />
                    <rect x="9" y="18" width="2" height="5" />
                    <rect x="13" y="19" width="4" height="4" />
                  </svg>
                </a>
              ) : (
                /* Standard NFC / Cryptographic verification glyph */
                <div className="w-10 h-10 rounded-md bg-[#162030] border border-[#2b3d56] flex flex-col items-center justify-center text-[#00e5c0] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[6.5px] text-[#64748b]">NFC</span>
                </div>
              )}
            </div>

            {/* Explicit Flip Control Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[8px] text-[#64748b] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#00e5c0]" />
                <span>CLICK CARD TO FLIP</span>
              </span>

              <button
                type="button"
                tabIndex={isFlipped ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#162233] border border-[#00e5c0]/40 text-[9px] font-semibold text-[#00e5c0] hover:bg-[#00e5c0] hover:text-[#0b0e14] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>FLIP TO DOSSIER</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BACK FACE: Technical Specification & Research Dossier       */}
        {/* ============================================================ */}
        <div
          aria-hidden={!isFlipped}
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#090d15] border border-[#24334a] p-6 flex flex-col justify-between shadow-2xl overflow-hidden text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 229, 192, 0.15)',
          }}
        >
          {/* Top Dossier Header */}
          <div className="relative z-10 border-b border-[#1c2738] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00e5c0]" />
              <div>
                <div className="text-[9px] text-[#00e5c0] font-bold tracking-wider">ENGINEERING DOSSIER</div>
                <div className="text-[7.5px] text-[#64748b]">TELEMETRY & INVARIANT SPEC</div>
              </div>
            </div>
            <div className="text-[9px] text-[#e27d60] font-mono">NODE // SEC-1</div>
          </div>

          {/* Dossier Body */}
          <div className="relative z-10 space-y-3.5 my-auto text-xs font-mono">
            {/* System Invariant Parameters */}
            <div className="grid grid-cols-2 gap-2 text-[8.5px] p-2.5 rounded-lg bg-[#101724] border border-[#1e2a3c]">
              <div>
                <span className="text-[#64748b] block">PARADIGM</span>
                <span className="text-[#f1f5f9] font-semibold">First-Principles C99</span>
              </div>
              <div>
                <span className="text-[#64748b] block">TARGET ARCH</span>
                <span className="text-[#f1f5f9] font-semibold">x86_64 / Silicon</span>
              </div>
              <div>
                <span className="text-[#64748b] block">DISPATCH</span>
                <span className="text-[#00e5c0] font-semibold">Deterministic DAG</span>
              </div>
              <div>
                <span className="text-[#64748b] block">LOCATION</span>
                <span className="text-[#f1f5f9] font-semibold truncate block">{location}</span>
              </div>
            </div>

            {/* Core Philosophy Statement */}
            <div className="p-2.5 rounded-lg bg-[#0e141f] border border-[#1b2636] space-y-1">
              <div className="text-[8px] text-[#e27d60] font-bold uppercase tracking-wider">
                Operational Invariant:
              </div>
              <p className="text-[9px] text-[#94a3b8] italic leading-relaxed">
                "{profile?.philosophy || 'Never trust a library until you have built its bare-metal scalar equivalent from scratch.'}"
              </p>
            </div>

            {/* Real Communication Channels */}
            <div className="space-y-1.5 pt-0.5">
              <div className="text-[8px] text-[#64748b] uppercase tracking-wider">Direct Verified Channels:</div>

              <div className="space-y-1 text-[9px]">
                <a
                  href={`mailto:${email}`}
                  tabIndex={isFlipped ? 0 : -1}
                  className="flex items-center justify-between p-1.5 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-[#00e5c0] shrink-0" />
                    <span className="truncate">{email}</span>
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                </a>

                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isFlipped ? 0 : -1}
                    className="flex items-center justify-between p-1.5 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Github className="w-3 h-3 text-[#00e5c0] shrink-0" />
                      <span className="truncate">{github.replace(/^https?:\/\//, '')}</span>
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                  </a>
                )}

                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isFlipped ? 0 : -1}
                    className="flex items-center justify-between p-1.5 rounded bg-[#121926] border border-[#212f45] text-[#cbd5e1] hover:text-[#00e5c0] hover:border-[#00e5c0] transition-colors"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Linkedin className="w-3 h-3 text-[#00e5c0] shrink-0" />
                      <span className="truncate">{linkedin.replace(/^https?:\/\//, '')}</span>
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Magnetic Stripe & Return Action */}
          <div className="relative z-10 pt-3 border-t border-[#1c2738] space-y-2">
            {/* Magnetic Stripe graphic */}
            <div className="h-4 bg-[#141d2a] border border-[#202d40] rounded-xs flex items-center px-2 justify-between">
              <span className="text-[6.5px] text-[#64748b] tracking-widest font-mono">MAG-TRACK // RECORD 0x992B</span>
              <span className="text-[6.5px] text-[#00e5c0]">CRC: OK</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href="#projects"
                tabIndex={isFlipped ? 0 : -1}
                className="text-[8.5px] text-[#94a3b8] hover:text-[#00e5c0] flex items-center gap-1 transition-colors"
              >
                <span>View Repositories</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </a>

              <button
                type="button"
                tabIndex={isFlipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#162233] border border-[#00e5c0]/40 text-[9px] font-semibold text-[#00e5c0] hover:bg-[#00e5c0] hover:text-[#0b0e14] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RETURN TO FRONT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasteful helper caption beneath card */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
        <Sparkles className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
        <span>Click card or press Enter to flip badge · 3D motion follows cursor</span>
      </div>
    </div>
  );
};
