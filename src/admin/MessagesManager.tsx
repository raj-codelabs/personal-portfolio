import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { CmsMessage } from '../types/cms';
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Archive,
  RefreshCw,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  X,
  Send,
  Save,
  Inbox,
} from 'lucide-react';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<CmsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<CmsMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMessages();
      setMessages(data);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err?.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = (msg: CmsMessage) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes || '');
    // If unread, mark as read automatically
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
    try {
      await api.updateMessage(id, { status });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      alert('Failed to update message status: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    try {
      setSavingNotes(true);
      await api.updateMessage(selectedMessage.id, { adminNotes });
      setMessages((prev) =>
        prev.map((m) => (m.id === selectedMessage.id ? { ...m, adminNotes } : m))
      );
      setSelectedMessage((prev) => (prev ? { ...prev, adminNotes } : null));
    } catch (err: any) {
      alert('Failed to save notes: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-8 font-body text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>INCOMING CORRESPONDENCE & RESEARCH INQUIRIES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]">
            Correspondence Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            View technical messages and collaboration offers submitted via the public contact terminal.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded font-mono text-xs border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'read'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filter === 'archived'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Archived
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
          />
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-2.5 font-mono text-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            <span>Retrieving messages from database...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded flex flex-col items-center justify-center gap-2">
            <Inbox className="w-6 h-6 text-[var(--text-muted)]" />
            <span>No inquiries match the current filter.</span>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                msg.status === 'unread'
                  ? 'border-amber-500/40 bg-[var(--bg-surface)] hover:border-amber-400 shadow-xs'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] opacity-85'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-bold ${msg.status === 'unread' ? 'text-[var(--text-primary)] text-sm' : 'text-[var(--text-secondary)]'}`}>
                    {msg.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    &lt;{msg.email}&gt;
                  </span>
                  {msg.status === 'unread' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                      UNREAD
                    </span>
                  )}
                  {msg.status === 'archived' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-[var(--text-muted)]/20 text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      ARCHIVED
                    </span>
                  )}
                  {msg.adminNotes && (
                    <span className="text-[10px] text-[var(--accent-copper)] italic truncate max-w-[200px]">
                      Note: {msg.adminNotes}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[var(--text-primary)] font-semibold truncate">
                  {msg.subject}
                </div>

                <p className="text-xs font-body text-[var(--text-secondary)] line-clamp-1">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[11px] text-[var(--text-muted)]">
                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl space-y-6 text-left">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>INQUIRY LOG ID: {selectedMessage.id}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text-primary)]">
                  {selectedMessage.subject}
                </h2>
                <div className="text-xs font-mono text-[var(--text-secondary)] mt-1 flex flex-wrap gap-2">
                  <span>From: <strong className="text-[var(--text-primary)]">{selectedMessage.name}</strong></span>
                  <span>&lt;{selectedMessage.email}&gt;</span>
                  <span>•</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-sm font-body text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedMessage.message}
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2 font-mono text-xs">
              <label className="text-[var(--text-secondary)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
                <span>Internal Admin Notes (Private)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Schedule reading group discussion; Send syllabus links..."
                  className="flex-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving...' : 'Save Note'}</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)] font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedMessage.id,
                      selectedMessage.status === 'unread' ? 'read' : 'unread'
                    )
                  }
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
                >
                  Mark as {selectedMessage.status === 'unread' ? 'Read' : 'Unread'}
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedMessage.id,
                      selectedMessage.status === 'archived' ? 'read' : 'archived'
                    )
                  }
                  className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] cursor-pointer flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{selectedMessage.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                </button>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-bold bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose Reply</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
