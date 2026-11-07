/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { LiquidMeshCanvas } from './LiquidMeshCanvas';
import { ChevronUp, ChevronDown, ExternalLink, Terminal, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { spring } from '../motion/motion-tokens';

interface WorksWheel3DProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

interface DragGestureState {
  startY: number;
  startAngle: number;
  velocity: number;
  lastY: number;
  lastTime: number;
}

export const WorksWheel3D: React.FC<WorksWheel3DProps> = ({ projects, onSelectProject }) => {
  const reducedMotion = useReducedMotionGlobal();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragTrackerRef = useRef<DragGestureState>({
    startY: 0,
    startAngle: 0,
    velocity: 0,
    lastY: 0,
    lastTime: Date.now(),
  });
  const inertiaFrameRef = useRef<number | null>(null);

  const itemCount = projects.length;
  // Angle step between each cylinder facet
  const angleStep = 360 / Math.max(itemCount, 4);
  const cylinderRadius = 260; // 3D translateZ distance

  // Active project index facing camera (nearest to 0 degrees)
  const normalizedIndex = Math.round(-rotationAngle / angleStep);
  const activeIndex = ((normalizedIndex % itemCount) + itemCount) % itemCount;

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    setIsDragging(true);
    dragTrackerRef.current = {
      startY: e.clientY,
      startAngle: rotationAngle,
      velocity: 0,
      lastY: e.clientY,
      lastTime: Date.now(),
    };
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || reducedMotion) return;
    const tracker = dragTrackerRef.current;
    const deltaY = e.clientY - tracker.startY;
    // Map vertical movement to rotational degrees
    const nextAngle = tracker.startAngle + deltaY * 0.45;
    setRotationAngle(nextAngle);

    // Compute instantaneous velocity
    const now = Date.now();
    const dt = Math.max(now - tracker.lastTime, 1);
    const dy = e.clientY - tracker.lastY;
    tracker.velocity = (dy / dt) * 12;
    tracker.lastY = e.clientY;
    tracker.lastTime = now;
  };

  const handlePointerUp = () => {
    if (!isDragging || reducedMotion) return;
    setIsDragging(false);

    // Apply inertia momentum
    let currentVel = dragTrackerRef.current.velocity;
    const runInertia = () => {
      if (Math.abs(currentVel) > 0.3) {
        currentVel *= 0.92; // Friction decay
        setRotationAngle((prev) => prev + currentVel * 0.3);
        inertiaFrameRef.current = requestAnimationFrame(runInertia);
      } else {
        // Snap to nearest facet
        setRotationAngle((prev) => {
          const nearest = Math.round(prev / angleStep) * angleStep;
          return nearest;
        });
      }
    };
    inertiaFrameRef.current = requestAnimationFrame(runInertia);
  };

  // Mouse wheel rotation support
  const handleWheel = (e: React.WheelEvent) => {
    if (reducedMotion) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -angleStep : angleStep;
    setRotationAngle((prev) => Math.round((prev + delta * 0.5) / (angleStep * 0.5)) * (angleStep * 0.5));
  };

  const stepNext = () => {
    setRotationAngle((prev) => prev - angleStep);
  };

  const stepPrev = () => {
    setRotationAngle((prev) => prev + angleStep);
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (inertiaFrameRef.current) cancelAnimationFrame(inertiaFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-4 font-mono text-left">
      {/* 3D Drum Header Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#242e40] text-xs text-[#94a3b8]">
        <div className="flex items-center gap-2 text-[#00e5c0]">
          <Layers className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-bold tracking-wider">WORKSWHEEL_3D // DRUM_REEL</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#64748b]">Drag or scrub to rotate drum</span>
          <div className="flex items-center gap-1 border border-[#242e40] rounded p-0.5 bg-[#0d121c]">
            <button
              type="button"
              onClick={stepPrev}
              aria-label="Previous project"
              className="p-1 hover:text-[#00e5c0] hover:bg-[#1a2332] rounded transition-colors cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={stepNext}
              aria-label="Next project"
              className="p-1 hover:text-[#00e5c0] hover:bg-[#1a2332] rounded transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Viewport Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative h-[420px] w-full flex items-center justify-center overflow-hidden rounded-xl border border-[#242e40] bg-[#0b0e14] select-none cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Subtle background coordinate crosshairs */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#00e5c0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* 3D Rotating Drum Reel Container */}
        <div
          className={`relative w-[340px] sm:w-[480px] h-[260px] ${
            isDragging ? 'transition-none' : 'transition-transform duration-150 ease-out'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationAngle}deg)`,
          }}
        >
          {projects.map((project, idx) => {
            const cardAngle = idx * angleStep;
            const currentAngularDiff = Math.abs(((rotationAngle + cardAngle) % 360 + 540) % 360 - 180);
            const isFacing = currentAngularDiff < angleStep * 0.55;

            return (
              <div
                key={project.id || idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateX(${-cardAngle}deg) translateZ(${cylinderRadius}px)`,
                  backfaceVisibility: 'hidden',
                }}
                className={`rounded-xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
                  isFacing
                    ? 'border-[#00e5c0] bg-[#121722]/95 shadow-[0_0_24px_rgba(0,229,192,0.25)] text-[#f1f5f9]'
                    : 'border-[#242e40] bg-[#0d121c]/70 opacity-40 text-[#64748b]'
                }`}
              >
                {/* Real-time WebGL liquid lens shader on active facing card */}
                {isFacing && <LiquidMeshCanvas intensity={0.4} />}

                {/* Card Header */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#242e40]">
                    <span className="text-[#00e5c0] font-bold">
                      CYLINDER FACET #{idx + 1}
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      {project.status || 'Active'}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold tracking-tight text-[#f1f5f9]">
                    {project.title}
                  </h4>

                  <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                    {project.subtitle || project.built}
                  </p>
                </div>

                {/* Card Stack & Trigger */}
                <div className="relative z-10 pt-3 border-t border-[#242e40] flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748b]">
                    {project.stack.slice(0, 3).map((st) => (
                      <span key={st} className="px-1.5 py-0.5 rounded bg-[#1a2332] text-[#94a3b8]">
                        {st}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
