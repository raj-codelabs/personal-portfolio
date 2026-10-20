import React, { useState, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Camera,
  Sparkles,
  Link as LinkIcon,
  Layers,
  User,
} from 'lucide-react';

interface PhotoChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'id-card' | 'white-mode';
}

export const PhotoChangeModal: React.FC<PhotoChangeModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'id-card',
}) => {
  const { profile, updateProfileDirectly } = useCms();
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  const [activeTab, setActiveTab] = useState<'id-card' | 'white-mode'>(initialMode);

  // ID Card State
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl || '');
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl || '');

  // White Mode State
  const [sketchGrayscaleUrl, setSketchGrayscaleUrl] = useState<string>(
    (profile as any)?.sketchGrayscaleUrl || '/assets/sketch-grayscale.svg'
  );
  const [sketchColorUrl, setSketchColorUrl] = useState<string>(
    (profile as any)?.sketchColorUrl || '/assets/sketch-color.svg'
  );
  const [sketchCaption, setSketchCaption] = useState<string>(
    (profile as any)?.sketchCaption ||
      'Drawn directly on open notebook paper · Carbon pencil study with autograd scalar DAGs in the margin.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File input refs
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const grayscaleFileRef = useRef<HTMLInputElement>(null);
  const colorFileRef = useRef<HTMLInputElement>(null);
  const singlePortraitFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Preset Avatar Options for ID Card
  const avatarPresets = [
    {
      id: 'default-chip',
      name: 'Hardware Chip Icon',
      url: '',
      thumb: 'CPU Chip (Default)',
    },
    {
      id: 'tech-avatar-1',
      name: 'Cyber Terminal Hacker',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      thumb: 'Portrait 1',
    },
    {
      id: 'tech-avatar-2',
      name: 'AI Engineering Student',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      thumb: 'Portrait 2',
    },
    {
      id: 'tech-avatar-3',
      name: 'Minimalist Tech Spec',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      thumb: 'Portrait 3',
    },
  ];

  // Preset White Mode Sketch Options
  const sketchPresets = [
    {
      id: 'field-study-default',
      name: 'Graphite Systems Field Study',
      grayscale: '/assets/sketch-grayscale.svg',
      color: '/assets/sketch-color.svg',
      caption:
        'Drawn directly on open notebook paper · Carbon pencil study with autograd scalar DAGs in the margin.',
    },
    {
      id: 'academic-dag',
      name: 'Compiler & Graph Theory Study',
      grayscale: '/assets/sketch-grayscale.svg',
      color: '/assets/sketch-color.svg',
      caption: 'FIG. 02 — Architectural pencil notes with computational graph traces.',
    },
  ];

  // Handle avatar file selection
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      setAvatarPreview(dataUrl);
      setErrorMsg(null);
    };
    reader.onerror = () => setErrorMsg('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  // Convert single uploaded image to grayscale pencil simulation and color wash
  const handleSinglePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSketchColorUrl(dataUrl);

      // Create an artistic grayscale pencil/charcoal edition on an offscreen canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          // Apply high-contrast desaturation and sketch tone
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Luminance
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            // Contrast boost for pencil look
            gray = gray > 180 ? Math.min(255, gray + 20) : Math.max(0, gray - 20);
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
          setSketchGrayscaleUrl(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setSketchGrayscaleUrl(dataUrl);
        }
      };
      img.src = dataUrl;
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGrayscaleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSketchGrayscaleUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleColorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSketchColorUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      if (activeTab === 'id-card') {
        await updateProfileDirectly({
          avatarUrl: avatarUrl.trim(),
        });
      } else {
        await updateProfileDirectly({
          sketchGrayscaleUrl: sketchGrayscaleUrl.trim(),
          sketchColorUrl: sketchColorUrl.trim(),
          sketchCaption: sketchCaption.trim(),
        });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to apply photo changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden transition-colors ${
          isStdout
            ? 'bg-[#0f141d] border-[#24334a] text-[#f1f5f9] font-mono'
            : 'bg-[#faf8f5] border-[#e2dbce] text-[#1c1917] font-serif'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isStdout ? 'border-[#1e2a3c] bg-[#121824]' : 'border-[#e2dbce] bg-[#f5f1e8]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Camera className="w-4 h-4 text-[var(--accent-primary)]" />
            <h2 id="photo-modal-title" className="text-sm font-bold tracking-tight">
              Portfolio Photo Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b text-xs ${
            isStdout ? 'border-[#1e2a3c] bg-[#0c1017]' : 'border-[#e2dbce] bg-[#efe9dc]'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('id-card')}
            className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'id-card'
                ? isStdout
                  ? 'border-[#00e5c0] text-[#00e5c0] bg-[#141b27]'
                  : 'border-[#1d4ed8] text-[#1d4ed8] bg-white'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Developer ID Card Photo (Dark Mode)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('white-mode')}
            className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'white-mode'
                ? isStdout
                  ? 'border-[#00e5c0] text-[#00e5c0] bg-[#141b27]'
                  : 'border-[#1d4ed8] text-[#1d4ed8] bg-white'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Notebook Sketch & Portrait (White Mode)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: DEVELOPER ID CARD PHOTO */}
          {activeTab === 'id-card' && (
            <div className="space-y-4">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Customize the profile photo displayed on your dark terminal Developer ID Card. You can upload a photo from your device, select a curated preset, or paste a link.
              </p>

              {/* Live Preview & Direct Upload Area */}
              <div
                className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center gap-4 ${
                  isStdout ? 'bg-[#141c28] border-[#223147]' : 'bg-white border-[#e2dbce]'
                }`}
              >
                {/* ID Avatar Preview Box */}
                <div className="relative w-24 h-24 rounded-xl bg-[#0a0e14] border-2 border-[#00e5c0] p-1 shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => setErrorMsg('Could not preview this image URL.')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#64748b]">
                      <User className="w-8 h-8 text-[#00e5c0]" />
                      <span className="text-[10px] text-[#94a3b8] mt-1 font-mono">CHIP ICON</span>
                    </div>
                  )}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#00e5c0]" />
                  <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#00e5c0]" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#00e5c0]" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#00e5c0]" />
                </div>

                {/* Upload & Action Controls */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {avatarUrl ? 'Custom Avatar Active' : 'Default Hardware Chip Active'}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Supports JPG, PNG, WebP, or SVG. Square aspect ratio recommended.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={avatarFileRef}
                      onChange={handleAvatarFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--accent-primary)] text-black font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarUrl('');
                          setAvatarPreview('');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-[var(--text-secondary)]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset to Chip Icon</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Paste URL */}
              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Or Paste Image URL</span>
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    setAvatarPreview(e.target.value);
                  }}
                  placeholder="https://avatars.githubusercontent.com/... or https://..."
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              {/* Presets */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <div className="font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Quick Avatar Presets</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {avatarPresets.map((preset) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(preset.url);
                          setAvatarPreview(preset.url);
                        }}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                            : 'border-[var(--border-subtle)] hover:border-[var(--text-secondary)] bg-[var(--bg-surface)]'
                        }`}
                      >
                        <div className="w-full aspect-square rounded bg-[#101724] border border-[#223147] mb-1.5 overflow-hidden flex items-center justify-center">
                          {preset.url ? (
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-[#00e5c0]" />
                          )}
                        </div>
                        <div className="text-[10px] font-semibold truncate text-[var(--text-primary)]">
                          {preset.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHITE MODE SKETCH & COLOR PORTRAIT */}
          {activeTab === 'white-mode' && (
            <div className="space-y-4">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                In White mode (Notebook / Blueprint), moving the cursor reveals color watercolor strokes over an underlying graphite sketch drawn directly onto the notebook paper.
              </p>

              {/* Easy 1-Click Single Portrait Uploader */}
              <div
                className={`p-4 rounded-lg border space-y-2 ${
                  isStdout ? 'bg-[#141c28] border-[#223147]' : 'bg-white border-[#e2dbce]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#c25e38]" />
                    <span>Upload 1 Portrait (Auto-Generate Sketch &amp; Color)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#c25e38]/10 text-[#c25e38] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Upload your portrait once. We automatically extract a high-contrast graphite pencil sketch and set the underlying color watercolor layer!
                </p>

                <div className="pt-1">
                  <input
                    type="file"
                    ref={singlePortraitFileRef}
                    onChange={handleSinglePortraitUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => singlePortraitFileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-[#1d4ed8] text-white font-semibold hover:bg-[#1e40af] transition-colors cursor-pointer text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Portrait Image</span>
                  </button>
                </div>
              </div>

              {/* Advanced Dual Image Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Grayscale Sketch */}
                <div className="space-y-2 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[var(--text-primary)]">
                      1. Pencil Sketch (Base)
                    </label>
                    <button
                      type="button"
                      onClick={() => grayscaleFileRef.current?.click()}
                      className="text-[10px] text-[#1d4ed8] underline cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                  <div className="w-full h-24 rounded border border-[var(--border-subtle)] bg-[#f8f5ee] flex items-center justify-center overflow-hidden">
                    {sketchGrayscaleUrl ? (
                      <img
                        src={sketchGrayscaleUrl}
                        alt="Grayscale sketch"
                        className="w-full h-full object-contain filter grayscale"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#94a3b8]" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={grayscaleFileRef}
                    onChange={handleGrayscaleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={sketchGrayscaleUrl}
                    onChange={(e) => setSketchGrayscaleUrl(e.target.value)}
                    placeholder="/assets/sketch-grayscale.svg or URL"
                    className="w-full px-2 py-1.5 text-[11px] rounded border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  />
                </div>

                {/* Color Portrait */}
                <div className="space-y-2 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[var(--text-primary)]">
                      2. Color Portrait (Revealed)
                    </label>
                    <button
                      type="button"
                      onClick={() => colorFileRef.current?.click()}
                      className="text-[10px] text-[#1d4ed8] underline cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                  <div className="w-full h-24 rounded border border-[var(--border-subtle)] bg-[#f8f5ee] flex items-center justify-center overflow-hidden">
                    {sketchColorUrl ? (
                      <img
                        src={sketchColorUrl}
                        alt="Color edition"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#94a3b8]" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={colorFileRef}
                    onChange={handleColorFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={sketchColorUrl}
                    onChange={(e) => setSketchColorUrl(e.target.value)}
                    placeholder="/assets/sketch-color.svg or URL"
                    className="w-full px-2 py-1.5 text-[11px] rounded border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  />
                </div>
              </div>

              {/* Caption field */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--text-secondary)]">
                  Notebook Margin Figure Note / Caption
                </label>
                <input
                  type="text"
                  value={sketchCaption}
                  onChange={(e) => setSketchCaption(e.target.value)}
                  placeholder="Drawn directly on open notebook paper..."
                  className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              {/* Quick Reset to Standard Built-in Sketches */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSketchGrayscaleUrl('/assets/sketch-grayscale.svg');
                    setSketchColorUrl('/assets/sketch-color.svg');
                    setSketchCaption(
                      'Drawn directly on open notebook paper · Carbon pencil study with autograd scalar DAGs in the margin.'
                    );
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Original Editorial Architectural Sketches</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-t ${
            isStdout ? 'border-[#1e2a3c] bg-[#121824]' : 'border-[#e2dbce] bg-[#f5f1e8]'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[var(--accent-primary)] text-black font-semibold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied!</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save &amp; Apply Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
