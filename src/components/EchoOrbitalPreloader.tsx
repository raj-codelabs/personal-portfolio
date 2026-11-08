/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Compass, X } from 'lucide-react';

interface EchoOrbitalPreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const EchoOrbitalPreloader: React.FC<EchoOrbitalPreloaderProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (forceShow) return true;
    try {
      return sessionStorage.getItem('echo_preloader_seen') !== '1';
    } catch {
      return false;
    }
  });

  const [statusMessage, setStatusMessage] = useState<string>('INIT_ORBITAL_CANVAS');
  const [progress, setProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem('echo_preloader_seen', '1');
    } catch {
      // Storage unavailable
    }
    setIsVisible(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  // Listen for global custom replay event
  useEffect(() => {
    const handleReplayEvent = () => {
      setIsVisible(true);
      setProgress(0);
      startTimeRef.current = Date.now();
    };

    window.addEventListener('echo:replay-preloader', handleReplayEvent);
    return () => window.removeEventListener('echo:replay-preloader', handleReplayEvent);
  }, []);

  // Keyboard escape listener to skip
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDismiss]);

  // Reduced motion: finish immediately
  useEffect(() => {
    if (reducedMotion && isVisible && !forceShow) {
      handleDismiss();
    }
  }, [reducedMotion, isVisible, forceShow, handleDismiss]);

  // Canvas Orbital Physics Loop
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const DURATION = 2400; // 2.4s intro sequence
    let startTimestamp: number | null = null;

    // Terminal boot logs for stdout
    const stdoutLogs = [
      'ALLOC_MEM_ARENA: 0x7FFE9B40',
      'RESOLVING_SYSTEM_VECTORS',
      'COMPUTING_ORBITAL_HARMONICS',
      'KINETIC_STAGE_SYNC: 120FPS',
      'DISPATCHING_EDITORIAL_PAYLOAD',
    ];

    // Margin notes logs
    const notebookLogs = [
      'Calibrating drafting compass',
      'Establishing Euclidean baseline',
      'Tracing radial coordinates',
      'Aligning archival ruled grid',
      'Opening engineering journal',
    ];

    const render = (time: number) => {
      if (!startTimestamp) startTimestamp = time;
      const elapsed = time - startTimestamp;
      const t = Math.min(elapsed / DURATION, 1);
      setProgress(Math.round(t * 100));

      const logIndex = Math.min(
        Math.floor(t * (isStdout ? stdoutLogs.length : notebookLogs.length)),
        (isStdout ? stdoutLogs.length : notebookLogs.length) - 1
      );
      setStatusMessage(isStdout ? stdoutLogs[logIndex] : notebookLogs[logIndex]);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.22;

      if (isStdout) {
        // ==========================================
        // STDOUT (Dark) — Precision Orbital Radar
        // ==========================================
        // 1. Grid crosshairs
        ctx.strokeStyle = 'rgba(0, 229, 192, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(centerX - baseRadius * 1.6, centerY);
        ctx.lineTo(centerX + baseRadius * 1.6, centerY);
        ctx.moveTo(centerX, centerY - baseRadius * 1.6);
        ctx.lineTo(centerX, centerY + baseRadius * 1.6);
        ctx.stroke();

        // 2. Base reference rings
        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(0, 229, 192, 0.15)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 229, 192, 0.25)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Wavy Orbital Dot Ring with Harmonic Modulation
        const dotCount = 48;
        const speed = (time * 0.003) % (Math.PI * 2);

        for (let i = 0; i < dotCount; i++) {
          const theta = (i / dotCount) * Math.PI * 2 + speed;
          // Harmonic wave distortion
          const wave = Math.sin(theta * 6 + speed * 2) * 12 * Math.sin(t * Math.PI);
          const r = baseRadius + wave;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;

          const dotAlpha = 0.3 + 0.7 * Math.sin(theta * 2 + speed);
          const dotSize = 1.8 + Math.sin(theta * 4 + speed) * 1.2;

          ctx.fillStyle = `rgba(0, 229, 192, ${Math.max(0.1, dotAlpha)})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();

          // Connect leading satellite nodes with faint lines
          if (i % 8 === 0) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Outer satellite dot
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(x, y, dotSize + 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 4. Central pulsing coordinate core
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + Math.sin(time * 0.006) * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // ==========================================
        // MARGIN-NOTES (Light) — Drafting Compass Arc
        // ==========================================
        ctx.strokeStyle = 'rgba(29, 78, 216, 0.15)';
        ctx.lineWidth = 1;

        // Faint construction guide lines
        ctx.beginPath();
        ctx.moveTo(centerX - baseRadius * 1.4, centerY);
        ctx.lineTo(centerX + baseRadius * 1.4, centerY);
        ctx.moveTo(centerX, centerY - baseRadius * 1.4);
        ctx.lineTo(centerX, centerY + baseRadius * 1.4);
        ctx.stroke();

        // Compass drawn circle arc: progresses with time
        const sweepAngle = t * Math.PI * 2;
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, -Math.PI / 2, -Math.PI / 2 + sweepAngle);
        ctx.stroke();

        // Compass lead needle point at current arc head
        const headX = centerX + Math.cos(-Math.PI / 2 + sweepAngle) * baseRadius;
        const headY = centerY + Math.sin(-Math.PI / 2 + sweepAngle) * baseRadius;

        ctx.fillStyle = '#c25e38'; // Sepia / terracotta compass pin
        ctx.beginPath();
        ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pivot point at center
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Fine degree tick marks around circle
        ctx.strokeStyle = 'rgba(120, 113, 108, 0.35)';
        ctx.lineWidth = 0.8;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
          const innerX = centerX + Math.cos(a) * (baseRadius - 5);
          const innerY = centerY + Math.sin(a) * (baseRadius - 5);
          const outerX = centerX + Math.cos(a) * (baseRadius + 5);
          const outerY = centerY + Math.sin(a) * (baseRadius + 5);
          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(outerX, outerY);
          ctx.stroke();
        }
      }

      if (elapsed < DURATION) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Complete smoothly
        setTimeout(handleDismiss, 200);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible, isStdout, reducedMotion, handleDismiss]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Loading portfolio experience"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 select-none ${
          isStdout
            ? 'bg-[#0d1117] text-[#f1f5f9]'
            : 'bg-[#fbf7ee] text-[#1c1917]'
        }`}
      >
        {/* Canvas for Orbital / Compass Physics */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Top Header: System Spec & Skip Button */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {isStdout ? (
              <div className="flex items-center gap-2 font-mono text-[#3b82f6]">
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-bold tracking-wider">ECHO_SYSTEM // ORBITAL_RESOLVER</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-serif text-[#1d4ed8]">
                <Compass className="w-4 h-4 animate-spin text-[#b87333]" />
                <span className="font-bold tracking-wide">Archival Draftsman / Baseline Init</span>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className={`px-3 py-1.5 text-xs rounded border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              isStdout
                ? 'border-[#242e40] bg-[#121722]/80 text-[#94a3b8] hover:text-[#3b82f6] hover:border-[#3b82f6] font-mono'
                : 'border-[#e2dbce] bg-[#ffffff]/80 text-[#78716c] hover:text-[#1d4ed8] hover:border-[#1d4ed8] font-serif'
            }`}
            aria-label="Skip intro animation"
          >
            <span>Skip [Esc]</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Brand Specimen Reveal */}
        <div className="relative z-10 mx-auto text-center space-y-3 pointer-events-none">
          <div
            className={`text-3xl sm:text-5xl font-bold tracking-tight ${
              isStdout ? 'font-mono text-[#f1f5f9]' : 'font-serif text-[#1c1917]'
            }`}
          >
            {isStdout ? (
              <span className="inline-block">
                $ raj-golder<span className="text-[#3b82f6] animate-pulse">_</span>
              </span>
            ) : (
              <span>Raj Golder</span>
            )}
          </div>
          <p
            className={`text-xs sm:text-sm font-medium tracking-wider uppercase ${
              isStdout ? 'font-mono text-[#b87333]' : 'font-serif text-[#b87333]'
            }`}
          >
            First-Principles Learning · Practical Software
          </p>
        </div>

        {/* Bottom Bar: Progress Metric & Technical Resolver State */}
        <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`font-mono font-bold text-sm ${
                isStdout ? 'text-[#3b82f6]' : 'text-[#1d4ed8]'
              }`}
            >
              {progress.toString().padStart(3, '0')}%
            </span>
            <div
              className={`w-32 sm:w-48 h-1 rounded-full overflow-hidden ${
                isStdout ? 'bg-[#242e40]' : 'bg-[#e2dbce]'
              }`}
            >
              <div
                className={`h-full transition-all duration-75 ${
                  isStdout ? 'bg-[#3b82f6]' : 'bg-[#1d4ed8]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`text-xs uppercase tracking-wider ${
              isStdout ? 'font-mono text-[#94a3b8]' : 'font-serif text-[#78716c]'
            }`}
          >
            {statusMessage}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
