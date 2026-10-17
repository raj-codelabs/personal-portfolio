import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import {
  RotateCcw,
  Sparkles,
  Palette,
  Eye,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SketchRevealProps {
  brushRadius?: number; // Brush size in pixels, default 42
}

export const SketchReveal: React.FC<SketchRevealProps> = ({ brushRadius = 42 }) => {
  const { profile } = useCms();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenMaskRef = useRef<HTMLCanvasElement | null>(null);
  const colorImgRef = useRef<HTMLImageElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);

  // Status and configuration
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [revealedPercent, setRevealedPercent] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Source images: configured via CMS or default editorial SVG assets
  const grayscaleSrc = (profile as any)?.sketchGrayscaleUrl || '/assets/sketch-grayscale.svg';
  const colorSrc = (profile as any)?.sketchColorUrl || '/assets/sketch-color.svg';
  const editorialCaption =
    (profile as any)?.sketchCaption ||
    'FIG. 01 — Architectural pencil study with scalar autograd DAGs & drafting ink annotations.';

  // Check reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Initialize and load images
  useEffect(() => {
    let active = true;
    setImagesLoaded(false);
    setLoadError(false);

    const colorImg = new Image();
    colorImg.crossOrigin = 'anonymous';

    colorImg.onload = () => {
      if (!active) return;
      colorImgRef.current = colorImg;
      setImagesLoaded(true);
      requestRender();
    };

    colorImg.onerror = () => {
      if (!active) return;
      console.warn('Could not load color sketch asset, checking fallback');
      setLoadError(true);
    };

    colorImg.src = colorSrc;

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [colorSrc]);

  // Handle canvas sizing & high-DPI scaling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const pixelWidth = Math.round(rect.width * dpr);
    const pixelHeight = Math.round(rect.height * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;

      // Setup or resize offscreen mask canvas
      if (!offscreenMaskRef.current) {
        offscreenMaskRef.current = document.createElement('canvas');
      }
      const maskCanvas = offscreenMaskRef.current;

      // Retain existing mask if resizing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = maskCanvas.width;
      tempCanvas.height = maskCanvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx && maskCanvas.width > 0) {
        tempCtx.drawImage(maskCanvas, 0, 0);
      }

      maskCanvas.width = pixelWidth;
      maskCanvas.height = pixelHeight;

      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx && tempCanvas.width > 0) {
        maskCtx.drawImage(tempCanvas, 0, 0, pixelWidth, pixelHeight);
      }

      requestRender();
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  // Request high-performance RAF render
  const requestRender = useCallback(() => {
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const canvas = canvasRef.current;
      const maskCanvas = offscreenMaskRef.current;
      const colorImg = colorImgRef.current;

      if (!canvas || !maskCanvas || !colorImg) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Clear visible reveal canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Draw the high-detail color image
      ctx.drawImage(colorImg, 0, 0, canvas.width, canvas.height);

      // 3. Composite with persistent user brush mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    });
  }, []);

  // Paint feathered color splat at pointer location
  const paintBrush = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const maskCanvas = offscreenMaskRef.current;
      if (!canvas || !maskCanvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      const radius = brushRadius * scaleX;

      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      // Soft feathered watercolor brush gradient
      const grad = maskCtx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.85, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

      maskCtx.fillStyle = grad;
      maskCtx.beginPath();
      maskCtx.arc(x, y, radius, 0, Math.PI * 2);
      maskCtx.fill();

      requestRender();
      setIsInteracting(true);
    },
    [brushRadius, requestRender]
  );

  // Pointer event handlers (smooth across mouse, pen, and touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    paintBrush(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Reveal color on hover for mouse/pen; on drag for touch
    if (e.pointerType === 'mouse' || isPointerDownRef.current) {
      paintBrush(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  // Reset to original black-and-white sketch
  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = offscreenMaskRef.current;
    if (!canvas || !maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setIsFullyRevealed(false);
    setIsInteracting(false);
    setRevealedPercent(0);
  }, []);

  // Full reveal control
  const handleRevealAll = useCallback(() => {
    const maskCanvas = offscreenMaskRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.fillStyle = '#000000';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    requestRender();
    setIsFullyRevealed(true);
    setIsInteracting(true);
    setRevealedPercent(100);
  }, [requestRender]);

  return (
    <div className="w-full max-w-[380px] mx-auto font-mono text-left select-none">
      {/* Notebook Engineering Card Container */}
      <div className="rounded-xl border border-[#cbd5e1] bg-[#ffffff] shadow-lg p-3 sm:p-4 space-y-3 relative overflow-hidden transition-all duration-200">
        {/* Top Notebook Drafting Header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 text-[10px] text-[#0284c7]">
          <div className="flex items-center gap-1.5 font-bold tracking-wider">
            <Palette className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>FIELD PORTRAIT NOTEBOOK</span>
          </div>
          <span className="text-[#64748b] text-[9px] font-mono">DRAFTING INK · 1:1</span>
        </div>

        {/* Interactive Dual-Layer Reveal Canvas Viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-[#cbd5e1] bg-[#fafafa] cursor-crosshair touch-none shadow-inner"
          title="Move your cursor across the sketch to reveal color"
          role="region"
          aria-label="Interactive color-reveal portrait. Move your mouse or drag your finger over the sketch to reveal color."
        >
          {/* Base Layer: Black-and-white pencil sketch */}
          <img
            src={grayscaleSrc}
            alt="Pencil sketch portrait"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            onError={() => setLoadError(true)}
          />

          {/* Reveal Overlay Layer: Canvas drawing the color image through user's brush mask */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* Fallback warning if custom image fails to load */}
          {loadError && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-4 text-center z-20 space-y-2 text-xs text-[#0f172a]">
              <AlertCircle className="w-6 h-6 text-[#c25e38]" />
              <div className="font-bold">Image Source Notice</div>
              <p className="text-[11px] text-[#475569]">
                Configure matching grayscale and color portrait URLs in Admin Dashboard &gt; Profile.
              </p>
              <button
                onClick={() => setLoadError(false)}
                className="px-3 py-1 rounded bg-[#0284c7] text-white text-xs font-semibold cursor-pointer"
              >
                Retry Standard Study
              </button>
            </div>
          )}

          {/* Subtle Technical Grid Reticle Accent */}
          <div className="absolute top-2 left-2 pointer-events-none z-15 text-[8px] text-[#0284c7]/70 font-mono">
            <span>[X, Y] VERIFIED</span>
          </div>

          <div className="absolute top-2 right-2 pointer-events-none z-15 text-[8px] text-[#64748b] font-mono">
            <span>RES: 600×800</span>
          </div>

          {/* Interactive floating hint - visible until user moves cursor */}
          {!isInteracting && (
            <div className="absolute inset-x-4 bottom-4 pointer-events-none z-20 flex justify-center">
              <div className="px-3 py-1.5 rounded-full bg-white/95 border border-[#0284c7]/50 shadow-md backdrop-blur-xs flex items-center gap-1.5 text-[10px] text-[#0284c7] font-semibold animate-bounce">
                <Sparkles className="w-3 h-3 text-[#0284c7]" />
                <span>Move your cursor to bring the sketch to life</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar & Engineering Notation */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            {/* Reset Control */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] hover:bg-[#e2e8f0] hover:border-[#94a3b8] active:scale-[0.98] transition-all text-[11px] font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0284c7]"
              aria-label="Reset portrait to original black and white pencil sketch"
            >
              <RotateCcw className="w-3 h-3 text-[#0284c7]" />
              <span>Reset Sketch</span>
            </button>

            {/* Quick Reveal All */}
            <button
              type="button"
              onClick={handleRevealAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] text-[#0284c7] hover:bg-[#eff6ff] hover:text-[#0369a1] transition-colors cursor-pointer"
              aria-label="Reveal entire color portrait"
            >
              <Eye className="w-3 h-3" />
              <span>Reveal Full Color</span>
            </button>
          </div>

          {/* Editorial Caption */}
          <p className="text-[10px] text-[#475569] leading-tight italic pt-0.5 border-t border-[#f1f5f9]">
            {editorialCaption}
          </p>
        </div>
      </div>

      {/* Helpful accessibility description */}
      <div className="mt-2 px-1 text-[9px] text-[#64748b] leading-tight flex items-start gap-1">
        <Info className="w-3 h-3 text-[#0284c7] shrink-0 mt-0.5" />
        <span>
          Persistent watercolor reveal mask. Drag with mouse or finger to paint color over the graphite lines.
        </span>
      </div>
    </div>
  );
};
