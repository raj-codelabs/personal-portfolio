import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { CmsMediaItem } from '../types/cms';
import {
  Image,
  Upload,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<CmsMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await api.getMedia();
      setMediaList(list);
    } catch (err: any) {
      console.error('Failed to load media:', err);
      setError(err?.message || 'Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      await api.uploadMedia(file, altText);
      setAltText('');
      await fetchMedia();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err?.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this asset file permanently?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert('Failed to delete media asset: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Image className="w-3.5 h-3.5" />
            <span>STATIC ASSETS & ARCHITECTURAL MEDIA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Media Asset Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Upload hardware schematics, memory layouts, neural DAG visualizations, and document attachments.
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded font-mono text-xs border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
          Upload New File
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[var(--text-secondary)]">Description / Alt Text</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Free-list buddy allocator block split diagram"
              className="w-full px-3 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                disabled={uploading}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.svg"
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
          Stored Assets ({mediaList.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            <span>Scanning /uploads directory...</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded">
            No media files uploaded yet. Select a file above to upload to persistent storage.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {mediaList.map((item) => {
              const isImage = item.mimeType?.startsWith('image/');
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {/* Preview */}
                    <div className="h-36 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={item.url}
                          alt={item.altText || item.filename}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                          <FileText className="w-8 h-8 text-[var(--accent-copper)]" />
                          <span className="text-[10px] uppercase font-bold">{item.mimeType}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-[var(--text-primary)] truncate" title={item.originalName || item.filename}>
                        {item.originalName || item.filename}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {(item.sizeBytes / 1024).toFixed(1)} KB • {new Date(item.uploadedAt).toLocaleDateString()}
                      </div>
                      {item.altText && (
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">
                          "{item.altText}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="inline-flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[var(--accent-success)]" />
                          <span className="text-[var(--accent-success)]">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        title="Open file in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
