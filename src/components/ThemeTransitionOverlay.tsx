import React, { useEffect, useMemo, useRef } from 'react';
import { Theme } from '../types';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface ThemeTransitionOverlayProps {
  animating: boolean;
  targetTheme: Theme | null;
  origin?: { x: number; y: number };
  onComplete: () => void;
}

interface CapillarySeed {
  angle: number;
  baseLength: number;
  bend: number;
  branchAngle: number;
  branchRatio: number;
  stochasticJitter: number;
}

interface SplatterSeed {
  angle: number;
  speed: number;
  size: number;
  distOffset: number;
}

/**
 * 1. TRANSLUCENT INK SPREAD CANVAS (Dark -> Light / margin-notes)
 * - Single continuous fluid expansion from (cx, cy)
 * - 72 density-scaled stochastic capillaries simulating paper fiber grain
 * - Translucent smoky India ink glaze with archival paper (#f6f5f1) core & dot grid
 * - Eliminates background swap luminance jumps
 */
const TranslucentInkSpreadCanvas: React.FC<{
  cx: number;
  cy: number;
  maxRadius: number;
  onComplete: () => void;
}> = ({ cx, cy, maxRadius, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 72 stochastic capillary seeds along paper grain fibers
  const capillarySeeds: CapillarySeed[] = useMemo(() => {
    const list: CapillarySeed[] = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2 + Math.sin(i * 2.3) * 0.04;
      const baseLength = 32 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 44;
      const bend = Math.cos(i * 4.1) * 10;
      const branchAngle = angle + (i % 2 === 0 ? 0.32 : -0.32);
      const branchRatio = 0.38 + (Math.sin(i * 5.1) * 0.5 + 0.5) * 0.2;
      const stochasticJitter = Math.sin(i * 19.3) * 0.5 + Math.cos(i * 37.7) * 0.5;
      list.push({ angle, baseLength, bend, branchAngle, branchRatio, stochasticJitter });
    }
    return list;
  }, []);

  // Translucent satellite ink droplets
  const splatterSeeds: SplatterSeed[] = useMemo(() => {
    const list: SplatterSeed[] = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2 + Math.cos(i * 3.1) * 0.14;
      const speed = 1.12 + (Math.sin(i * 2.1) * 0.5 + 0.5) * 0.36;
      const size = 2.2 + (Math.sin(i * 4.3) * 0.5 + 0.5) * 3.6;
      const distOffset = (Math.cos(i * 5.7) * 0.5 + 0.5) * 40;
      list.push({ angle, speed, size, distOffset });
    }
    return list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 480; // ms

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();
    window.addEventListener('resize', setupCanvasSize);

    // Stochastic multi-octave paper bleed contour
    const getRadiusAtAngle = (theta: number, baseRadius: number, timeNorm: number) => {
      const n1 = Math.sin(theta * 5 + timeNorm * 2.2) * (baseRadius * 0.07 + 12);
      const n2 = Math.cos(theta * 9 - timeNorm * 1.5) * (baseRadius * 0.045 + 8);
      const n3 = Math.sin(theta * 17 + 1.4) * (baseRadius * 0.025 + 4);
      const n4 = Math.cos(theta * 33 + 2.1) * 3.0;
      return Math.max(0, baseRadius + n1 + n2 + n3 + n4);
    };

    const render = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.max(0, Math.min(1, elapsed / duration));

      // Smooth ease-out power curve
      const eased = Math.max(0, 1 - Math.pow(Math.max(0, 1 - progress), 2.7));
      const currentRadius = Math.max(0, eased * (maxRadius + 150));

      // Graceful opacity handoff as wave overtakes the viewport
      const globalOpacity = progress > 0.72 ? Math.max(0, (1 - progress) / 0.28) : 1;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = globalOpacity;

      // 1. Build organic fluid perimeter
      const points: { x: number; y: number; r: number; angle: number }[] = [];
      const numPoints = 120;
      for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        const r = getRadiusAtAngle(theta, currentRadius, progress);
        points.push({
          x: cx + Math.cos(theta) * r,
          y: cy + Math.sin(theta) * r,
          r,
          angle: theta,
        });
      }

      // 2. Archival Notebook Paper Core (#f6f5f1)
      if (points.length > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        // Authentic margin-notes background fill
        ctx.fillStyle = '#f6f5f1';
        ctx.fill();

        // Clip to draw notebook dot grid inside
        ctx.clip();

        const dotSpacing = 24;
        const startX = Math.max(0, Math.floor((cx - currentRadius) / dotSpacing) * dotSpacing);
        const endX = Math.min(width, Math.ceil((cx + currentRadius) / dotSpacing) * dotSpacing);
        const startY = Math.max(0, Math.floor((cy - currentRadius) / dotSpacing) * dotSpacing);
        const endY = Math.min(height, Math.ceil((cy + currentRadius) / dotSpacing) * dotSpacing);

        ctx.fillStyle = '#d6cec2';
        for (let gx = startX; gx <= endX; gx += dotSpacing) {
          for (let gy = startY; gy <= endY; gy += dotSpacing) {
            ctx.beginPath();
            ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Inner watercolor diffusion glaze
        ctx.lineWidth = Math.min(36, 12 + currentRadius * 0.025);
        ctx.strokeStyle = 'rgba(17, 21, 28, 0.16)';
        ctx.stroke();

        ctx.restore();
      }

      // 3. Translucent India Ink Wash & Meniscus
      if (points.length > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        // Smoky translucent ink rim
        ctx.lineWidth = Math.min(28, 8 + currentRadius * 0.022);
        ctx.strokeStyle = 'rgba(9, 12, 16, 0.52)';
        ctx.stroke();

        // Core dense liquid ink stroke
        ctx.lineWidth = Math.min(12, 3 + currentRadius * 0.01);
        ctx.strokeStyle = 'rgba(4, 6, 9, 0.68)';
        ctx.stroke();
        ctx.restore();
      }

      // 4. Density-scaled Capillary Bleed Tendrils (72 seeds)
      ctx.save();
      for (const cap of capillarySeeds) {
        const rBase = getRadiusAtAngle(cap.angle, currentRadius, progress);
        const bx = cx + Math.cos(cap.angle) * rBase;
        const by = cy + Math.sin(cap.angle) * rBase;

        const dynamicLength = (cap.baseLength + cap.stochasticJitter * 8) * Math.max(0.2, 1 - progress * 0.35);
        const tipDist = rBase + dynamicLength;
        const tx = cx + Math.cos(cap.angle) * tipDist + Math.sin(cap.angle) * cap.bend;
        const ty = cy + Math.sin(cap.angle) * tipDist - Math.cos(cap.angle) * cap.bend;

        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(
          (bx + tx) / 2 + cap.bend,
          (by + ty) / 2 - cap.bend,
          tx,
          ty
        );
        ctx.strokeStyle = 'rgba(8, 11, 16, 0.55)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Micro-branching capillary twig
        const branchLen = dynamicLength * cap.branchRatio;
        const branchTipX = tx + Math.cos(cap.branchAngle) * branchLen;
        const branchTipY = ty + Math.sin(cap.branchAngle) * branchLen;
        ctx.beginPath();
        ctx.moveTo((bx + tx) / 2, (by + ty) / 2);
        ctx.lineTo(branchTipX, branchTipY);
        ctx.strokeStyle = 'rgba(12, 16, 22, 0.38)';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
      ctx.restore();

      // 5. Translucent Satellite Ink Droplets
      if (currentRadius > 10) {
        ctx.fillStyle = 'rgba(6, 8, 12, 0.52)';
        for (const drop of splatterSeeds) {
          const dropDist = Math.min(
            maxRadius + 180,
            currentRadius * drop.speed + drop.distOffset
          );
          const dx = cx + Math.cos(drop.angle) * dropDist;
          const dy = cy + Math.sin(drop.angle) * dropDist;

          ctx.beginPath();
          ctx.arc(dx, dy, Math.max(0, drop.size), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Initial fountain pen droplet impact ring at origin
      if (progress < 0.36) {
        const splashRadius = Math.max(0, 12 + progress * 85);
        const splashAlpha = Math.max(0, 1 - progress * 2.8);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, splashRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(8, 11, 16, ${splashAlpha * 0.45})`;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onCompleteRef.current();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupCanvasSize);
    };
  }, [cx, cy, maxRadius, capillarySeeds, splatterSeeds]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

/**
 * 2. DIGITAL GLITCH WASH CANVAS (Light -> Dark / stdout)
 * - Single continuous CRT raster hardware-failure simulation originating from (cx, cy)
 * - True horizontal scanline desynchronization offsets
 * - Real RGB chromatic aberration (cyan #00f0ff and magenta #ff0055 channel shear)
 * - Sweeping phosphor beam & 3px CRT raster grid settling into solid #11151c
 * - Zero static DOM slices, zero mix-blend washed out white artifacts
 */
const DigitalGlitchCanvas: React.FC<{
  cx: number;
  cy: number;
  maxRadius: number;
  onComplete: () => void;
}> = ({ cx, cy, maxRadius, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 460; // ms

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasSize();
    window.addEventListener('resize', setupCanvasSize);

    const render = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.max(0, Math.min(1, elapsed / duration));

      // Smooth ease-out power expansion from button
      const eased = Math.max(0, 1 - Math.pow(Math.max(0, 1 - progress), 2.5));
      const currentRadius = Math.max(0, eased * (maxRadius + 140));

      // Damped electromagnetic jitter decaying to 0 at the end
      const jitterDecay = Math.max(0, 1 - progress * 1.15);

      ctx.clearRect(0, 0, width, height);

      // 1. Digital Graphite Wash expanding from (cx, cy)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = '#11151c';
      ctx.fill();
      ctx.restore();

      // 2. High-Frequency Horizontal Raster Scanline Desynchronization
      // Generates 16 dynamic raster-line displacement bands
      const numBands = 16;
      for (let b = 0; b < numBands; b++) {
        // Pseudo-random bands distributed vertically
        const bandY = (height / numBands) * b + Math.sin(now * 0.05 + b) * 8;
        const bandHeight = 6 + (Math.sin(b * 3.3 + now * 0.02) * 0.5 + 0.5) * 18;

        // Shift offsets proportional to jitter decay
        const shiftX = Math.sin(now * 0.12 + b * 2.7) * 36 * jitterDecay;

        // Draw RGB channel separated slices
        if (Math.abs(shiftX) > 2) {
          // Cyan chromatic channel
          ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
          ctx.fillRect(shiftX * 1.1, bandY, width, bandHeight);

          // Magenta chromatic channel
          ctx.fillStyle = 'rgba(255, 0, 85, 0.42)';
          ctx.fillRect(-shiftX * 0.9, bandY, width, bandHeight);

          // Terminal cobalt core slice
          ctx.fillStyle = 'rgba(59, 130, 246, 0.55)';
          ctx.fillRect(shiftX * 0.4, bandY, width, bandHeight);
        }
      }

      // 3. Directional Phosphor Beam Line Sweeping Down from Toggle Button
      const beamY = cy + progress * (height + 120);
      if (beamY <= height + 60) {
        const beamGrad = ctx.createLinearGradient(0, beamY, width, beamY);
        beamGrad.addColorStop(0, 'transparent');
        beamGrad.addColorStop(0.25, 'rgba(59, 130, 246, 0.6)');
        beamGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.95)');
        beamGrad.addColorStop(0.75, 'rgba(59, 130, 246, 0.6)');
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, beamY - 3, width, 6);

        // Glow halo
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.fillRect(0, beamY - 14, width, 28);
      }

      // 4. Radial Electromagnetic Pulse from origin
      if (progress < 0.5) {
        const pulseRadius = Math.max(0, progress * 320);
        const pulseAlpha = Math.max(0, 1 - progress * 2.2);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0, pulseRadius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${pulseAlpha * 0.75})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();
      }

      // 5. CRT 3px Scanline Raster Grid Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.2);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onCompleteRef.current();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupCanvasSize);
    };
  }, [cx, cy, maxRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({
  animating,
  targetTheme,
  origin,
  onComplete,
}) => {
  const reducedMotion = useReducedMotionGlobal();

  // Viewport dimensions & toggle button origin
  const { cx, cy, maxRadius } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { cx: 500, cy: 300, maxRadius: 1000 };
    }
    const defaultX = window.innerWidth * 0.85;
    const defaultY = 32;
    const x = origin?.x ?? defaultX;
    const y = origin?.y ?? defaultY;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    return { cx: x, cy: y, maxRadius: radius };
  }, [origin]);

  if (!animating || reducedMotion || !targetTheme) {
    return null;
  }

  const isToLight = targetTheme === 'margin-notes';

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {isToLight ? (
        <TranslucentInkSpreadCanvas
          cx={cx}
          cy={cy}
          maxRadius={maxRadius}
          onComplete={onComplete}
        />
      ) : (
        <DigitalGlitchCanvas
          cx={cx}
          cy={cy}
          maxRadius={maxRadius}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};
