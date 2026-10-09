import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import { ContactMessage } from '../../types';

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const loadMessages = async () => {
    try {
      const res = await contactService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleToggleRead = async (id?: string, currentStatus?: boolean) => {
    if (!id) return;
    try {
      await contactService.markAsRead(id, !currentStatus);
      showAlert('success', !currentStatus ? 'Marked as read' : 'Marked as unread');
      await loadMessages();
    } catch (err: any) {
      showAlert('danger', err?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactService.delete(id);
      showAlert('success', 'Message deleted.');
      await loadMessages();
    } catch (err: any) {
      showAlert('danger', err?.message || 'Delete failed.');
    }
  };

  const filtered = filter === 'unread' ? messages.filter((m) => !m.isRead) : messages;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#fff3cd' }}>
            <i className="bi bi-envelope-fill text-warning fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Contact Messages</h5>
            <p className="text-muted small mb-0">
              {messages.length} total messages ({unreadCount} unread)
            </p>
          </div>
        </div>

        <div className="btn-group rounded-pill overflow-hidden border">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setFilter('all')}
          >
            All ({messages.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} border-0 rounded-3 d-flex align-items-center gap-2 mb-4`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center text-muted">
          <i className="bi bi-inbox fs-1 mb-2 text-secondary opacity-50" />
          <h6>No messages found</h6>
          <p className="small mb-0">Any inquiries submitted through the contact form will appear here.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((msg) => (
            <div key={msg._id} className="col-12">
              <div
                className={`card border-0 rounded-4 shadow-sm p-4 transition-all ${
                  !msg.isRead ? 'border-start border-warning border-4' : ''
                }`}
                style={{ background: !msg.isRead ? '#fffdf7' : '#ffffff' }}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="fw-bold mb-0 text-dark">{msg.name}</h6>
                      {!msg.isRead && (
                        <span className="badge bg-warning text-dark rounded-pill small">New</span>
                      )}
                    </div>
                    <div className="small text-muted">
                      <i className="bi bi-envelope me-1" />
                      <a href={`mailto:${msg.email}`} className="text-decoration-none text-muted">
                        {msg.email}
                      </a>
                      {msg.createdAt && (
                        <>
                          <span className="mx-2">•</span>
                          <i className="bi bi-clock me-1" />
                          {new Date(msg.createdAt).toLocaleString()}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      onClick={() => handleToggleRead(msg._id, msg.isRead)}
                      title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      <i className={`bi ${msg.isRead ? 'bi-envelope' : 'bi-envelope-open'} me-1`} />
                      {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="btn btn-sm btn-outline-primary rounded-pill"
                    >
                      <i className="bi bi-reply-fill me-1" />
                      Reply
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => handleDelete(msg._id)}
                      title="Delete Message"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>

                <div className="fw-semibold text-secondary mb-2">Subject: {msg.subject}</div>
                <div className="p-3 bg-light rounded-3 text-dark small" style={{ whiteSpace: 'pre-line' }}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
