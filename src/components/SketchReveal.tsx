import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCms } from '../context/CmsContext';
import { AlertCircle, Camera } from 'lucide-react';
import { PhotoChangeModal } from './PhotoChangeModal';

interface SketchRevealProps {
  brushRadius?: number; // Brush size in pixels, default 40
}

export const SketchReveal: React.FC<SketchRevealProps> = ({ brushRadius = 40 }) => {
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
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Source images: configured via CMS or default editorial SVG assets
  const grayscaleSrc = (profile as any)?.sketchGrayscaleUrl || '/assets/sketch-grayscale.svg';
  const colorSrc = (profile as any)?.sketchColorUrl || '/assets/sketch-color.svg';
  const editorialCaption =
    (profile as any)?.sketchCaption ||
    'Drawn directly on open notebook paper · Carbon pencil study with autograd scalar DAGs in the margin.';

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
      console.warn('Could not load color sketch asset');
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

      if (!offscreenMaskRef.current) {
        offscreenMaskRef.current = document.createElement('canvas');
      }
      const maskCanvas = offscreenMaskRef.current;

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

      // 2. Draw the color image
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

  const fadeIntervalRef = useRef<number | null>(null);

  // Settle back to graphite slowly on pointer leave (Section 7.4)
  const handlePointerLeave = useCallback(() => {
    isPointerDownRef.current = false;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    let fadeSteps = 0;
    fadeIntervalRef.current = window.setInterval(() => {
      fadeSteps++;
      const maskCanvas = offscreenMaskRef.current;
      if (!maskCanvas) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.globalCompositeOperation = 'source-over';
        requestRender();
      }
      if (fadeSteps > 40) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, 40);
  }, [requestRender]);

  // Pointer event handlers with soft trail & pan-y compliance
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    isPointerDownRef.current = true;
    if (e.pointerType === 'mouse') {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    paintBrush(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (e.pointerType === 'mouse' || isPointerDownRef.current) {
      paintBrush(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    try {
      if (e.pointerType === 'mouse') {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      }
    } catch {
      // Ignore
    }
    handlePointerLeave();
  };

  // Reset to original black-and-white sketch
  const handleReset = useCallback(() => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
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

    setIsInteracting(false);
  }, []);

  // Full reveal control
  const handleRevealAll = useCallback(() => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const maskCanvas = offscreenMaskRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.fillStyle = '#000000';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    requestRender();
    setIsInteracting(true);
  }, [requestRender]);

  return (
    <div className="w-full max-w-[340px] sm:max-w-[380px] mx-auto text-left select-none space-y-2">
      {/* Top Blue-Ink Handwritten Hint */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-base sm:text-lg font-handwriting text-[#1d4ed8]">
          <span>Move your cursor across the sketch</span>
          <span className="text-xl leading-none">↴</span>
        </div>
        <span className="text-xs font-handwriting text-[#78716c] hidden sm:inline">
          (or touch to explore)
        </span>
      </div>

      {/* 
        NO CARD CONTAINER, NO BORDER, NO SHADOW, NO FLOATING PANEL.
        touch-action: pan-y ensures vertical page scroll is never hijacked (Section 7.4).
      */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="relative w-full aspect-[3/4] cursor-crosshair select-none"
        style={{
          touchAction: 'pan-y',
          maskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 75%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 75%, transparent 100%)',
        }}
        role="region"
        aria-label="Pencil sketch portrait drawn on notebook paper. Move your cursor or touch across the sketch to reveal color."
      >
        {/* Base Layer: Black-and-white graphite pencil sketch sitting directly on paper */}
        <img
          src={grayscaleSrc}
          alt="Black-and-white pencil portrait sketched on notebook paper"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none mix-blend-multiply"
          onError={() => setLoadError(true)}
        />

        {/* Reveal Layer: Canvas drawing the color wash through user's feathered brush strokes */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-multiply"
        />

        {/* Fallback warning if custom image fails to load */}
        {loadError && (
          <div className="absolute inset-0 bg-[#faf8f5]/95 flex flex-col items-center justify-center p-4 text-center z-20 space-y-2 text-xs font-serif text-[#1c1917]">
            <AlertCircle className="w-5 h-5 text-[#c25e38]" />
            <div className="font-bold">Portrait Image Notice</div>
            <p className="text-[11px] text-[#78716c]">
              Configure matching grayscale and color portrait URLs in Admin Dashboard &gt; Profile.
            </p>
            <button
              onClick={() => setLoadError(false)}
              className="text-[#1d4ed8] underline font-handwriting text-sm cursor-pointer"
            >
              Reload standard sketch study
            </button>
          </div>
        )}
      </div>

      {/* Notebook Margin Annotations & Controls */}
      <div className="px-1 pt-1 space-y-1.5 border-t border-[#e2dbce]/60">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs pt-0.5">
          {/* Discreet Reset Styled like a Handwritten Notebook Annotation */}
          <button
            type="button"
            onClick={handleReset}
            className="font-handwriting text-base text-[#1d4ed8] hover:text-[#1e40af] cursor-pointer inline-flex items-center gap-1 underline underline-offset-4 decoration-[#93c5fd] hover:decoration-[#1d4ed8] transition-colors focus-visible:outline-none"
            aria-label="Erase watercolor and restore black and white pencil sketch"
          >
            <span>↺ erase ink</span>
          </button>

          {/* Change photos in white mode */}
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="font-handwriting text-sm text-[#c25e38] hover:text-[#9c4220] cursor-pointer inline-flex items-center gap-1 transition-colors underline decoration-[#fdba74]"
            aria-label="Change sketch and portrait photos in white mode"
            title="Upload or change white mode photos"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>change sketch &amp; photo</span>
          </button>

          {/* Quick Reveal Wash Action */}
          <button
            type="button"
            onClick={handleRevealAll}
            className="font-handwriting text-sm text-[#78716c] hover:text-[#1d4ed8] cursor-pointer transition-colors focus-visible:outline-none"
            aria-label="Reveal entire watercolor edition"
          >
            <span>[reveal wash]</span>
          </button>
        </div>

        {/* Editorial Pencil Caption */}
        <p className="font-serif italic text-xs text-[#78716c] leading-relaxed">
          {editorialCaption}
        </p>
      </div>

      {/* Photo Change Modal for White Mode */}
      <PhotoChangeModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        initialMode="white-mode"
      />
    </div>
  );
};
