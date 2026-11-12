import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  X,
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<CmsMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMedia = useMemo(() => {
    if (!searchQuery.trim()) return mediaList;
    const q = searchQuery.toLowerCase();
    return mediaList.filter(
      (m) =>
        m.originalName?.toLowerCase().includes(q) ||
        m.filename?.toLowerCase().includes(q) ||
        m.altText?.toLowerCase().includes(q) ||
        m.mimeType?.toLowerCase().includes(q)
    );
  }, [mediaList, searchQuery]);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Image className="w-3.5 h-3.5" />
            <span>STATIC ASSETS &amp; MEDIA STORAGE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Media Manager ({mediaList.length})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            Upload schematics, sketches, and static assets with persistent URLs
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Utilitarian Compact Upload Strip */}
      <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Alt text description (optional)..."
            className="flex-1 w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
          />

          <label className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded bg-[var(--accent-primary)] text-[#0b0e14] font-semibold cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all text-xs shrink-0 w-full sm:w-auto">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Choose File to Upload'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </label>
        </div>
      </div>

      {/* Search Filter Strip */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by filename, alt text..."
            className="w-full pl-8 pr-7 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* High-Density Media Table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/60 text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-16 text-center font-semibold">Preview</th>
                <th className="py-2.5 px-3 min-w-[200px] font-semibold">Filename &amp; Alt</th>
                <th className="py-2.5 px-3 w-28 font-semibold">Type</th>
                <th className="py-2.5 px-3 w-24 font-semibold">Size</th>
                <th className="py-2.5 px-3 w-32 font-semibold">Uploaded</th>
                <th className="py-2.5 px-3 w-32 text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/60">
              {filteredMedia.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                    No media assets uploaded yet.
                  </td>
                </tr>
              ) : (
                filteredMedia.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-page)]/70 transition-colors group"
                  >
                    <td className="py-2 px-3 text-center">
                      {item.mimeType?.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.altText || item.originalName}
                          className="w-8 h-8 rounded object-cover border border-[var(--border-subtle)] inline-block"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] inline-flex">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-bold text-[var(--text-primary)] truncate max-w-xs">
                        {item.originalName || item.filename}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs font-body">
                        {item.altText || item.url}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)]">
                        {item.mimeType?.split('/')[1] || item.mimeType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-[var(--text-muted)]">
                      {formatFileSize(item.sizeBytes)}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-[var(--text-muted)]">
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 text-right pr-4">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleCopyUrl(item.url, item.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] transition-colors cursor-pointer ${
                            copiedId === item.id
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                          title="Copy file URL"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent-primary)] cursor-pointer"
                          title="Open Asset in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
