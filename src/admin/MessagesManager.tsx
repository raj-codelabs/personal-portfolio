import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Send,
  Save,
  Inbox,
  AlertCircle,
  Eye,
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
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
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

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, search]);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6 font-body text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>INCOMING CORRESPONDENCE &amp; INQUIRIES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-mono">
            Inbox ({messages.length})
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            {unreadCount > 0 ? (
              <span className="text-[var(--accent-copper)] font-semibold">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
            ) : (
              'All messages read'
            )}{' '}
            · Direct technical inquiries from the contact form
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, subject..."
            className="w-full pl-8 pr-7 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'unread'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'read'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            Read ({messages.filter((m) => m.status === 'read').length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              filter === 'archived'
                ? 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            Archived ({messages.filter((m) => m.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* High-Density Messages Table */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)]/60 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-12 text-center font-semibold">Status</th>
                <th className="py-2.5 px-3 w-48 font-semibold">Sender</th>
                <th className="py-2.5 px-3 min-w-[260px] font-semibold">Subject &amp; Excerpt</th>
                <th className="py-2.5 px-3 w-32 font-semibold">Received</th>
                <th className="py-2.5 px-3 w-28 text-right pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/60 font-mono">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                    No messages matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`hover:bg-[var(--bg-page)]/70 transition-colors cursor-pointer group ${
                      msg.status === 'unread' ? 'bg-[var(--accent-primary)]/5 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          msg.status === 'unread'
                            ? 'bg-[var(--accent-copper)] animate-pulse'
                            : msg.status === 'read'
                            ? 'bg-emerald-400/80'
                            : 'bg-zinc-500'
                        }`}
                        title={msg.status}
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[var(--text-primary)]">{msg.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{msg.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-[var(--text-primary)] line-clamp-1">{msg.subject}</div>
                      <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 font-body">
                        {msg.message}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer"
                          title="Open Message Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              msg.id,
                              msg.status === 'archived' ? 'read' : 'archived'
                            )
                          }
                          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] cursor-pointer"
                          title={msg.status === 'archived' ? 'Unarchive' : 'Archive'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-page)] cursor-pointer"
                          title="Delete Message"
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

      {/* Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-5 font-mono text-xs text-left flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {selectedMessage.subject}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="p-3 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">From:</span>
                  <span className="font-bold text-[var(--text-primary)]">{selectedMessage.name} &lt;{selectedMessage.email}&gt;</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Date:</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Status:</span>
                  <span className="uppercase text-[10px] font-bold text-[var(--accent-primary)]">{selectedMessage.status}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Message Content
                </label>
                <div className="p-3 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs font-body leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Private internal notes regarding this inquiry..."
                  className="w-full px-3 py-1.5 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--accent-primary)] text-[#0b0e14] font-semibold hover:opacity-90 cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
                >
                  <Save className="w-3 h-3" />
                  <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
