import React, { useState, useEffect } from 'react';
import { socialLinkService } from '../../services/api';
import { SocialLink } from '../../types';

const defaultPlatforms = [
  { name: 'GitHub', icon: 'bi-github' },
  { name: 'LinkedIn', icon: 'bi-linkedin' },
  { name: 'Twitter / X', icon: 'bi-twitter-x' },
  { name: 'Instagram', icon: 'bi-instagram' },
  { name: 'LeetCode', icon: 'bi-code-square' },
  { name: 'YouTube', icon: 'bi-youtube' },
  { name: 'Discord', icon: 'bi-discord' },
  { name: 'Website', icon: 'bi-globe' },
];

const empty: Partial<SocialLink> = {
  platform: 'GitHub',
  url: '',
  icon: 'bi-github',
  order: 0,
};

const SocialLinkManager: React.FC = () => {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<SocialLink>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const load = async () => {
    try {
      const res = await socialLinkService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to load social links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handlePlatformSelect = (plat: string) => {
    const matched = defaultPlatforms.find((p) => p.name === plat);
    setForm((f) => ({
      ...f,
      platform: plat,
      icon: matched ? matched.icon : f.icon || 'bi-link-45deg',
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await socialLinkService.update(editId, form);
        showAlert('success', 'Social link updated successfully!');
      } else {
        await socialLinkService.create(form);
        showAlert('success', 'Social link created successfully!');
      }
      await load();
      setForm(empty);
      setEditId(null);
      setShowForm(false);
    } catch (err: any) {
      showAlert('danger', err?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setForm(link);
    setEditId(link._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Delete this social link?')) return;
    try {
      await socialLinkService.delete(id);
      showAlert('success', 'Social link removed.');
      await load();
    } catch (err: any) {
      showAlert('danger', err?.message || 'Delete failed.');
    }
  };

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
          <div className="rounded-3 p-2" style={{ background: '#e0f2fe' }}>
            <i className="bi bi-share-fill text-primary fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Social Links Management</h5>
            <p className="text-muted small mb-0">Manage profiles, handles, and footer links</p>
          </div>
        </div>

        <button
          className="btn btn-primary rounded-3"
          onClick={() => {
            setForm(empty);
            setEditId(null);
            setShowForm(true);
          }}
        >
          <i className="bi bi-plus-circle me-2" />
          Add Link
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} border-0 rounded-3 d-flex align-items-center gap-2 mb-4`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      {showForm && (
        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">{editId ? 'Edit Social Link' : 'Add New Social Link'}</h6>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            />
          </div>

          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Platform</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={form.platform || ''}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    placeholder="e.g. GitHub, LinkedIn, Twitter"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Preset
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {defaultPlatforms.map((p) => (
                      <li key={p.name}>
                        <button
                          type="button"
                          className="dropdown-item d-flex align-items-center gap-2"
                          onClick={() => handlePlatformSelect(p.name)}
                        >
                          <i className={`bi ${p.icon}`} /> {p.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-medium">Icon (Bootstrap Icon Class)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className={`bi ${form.icon || 'bi-link'}`} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={form.icon || ''}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. bi-github, bi-linkedin"
                    required
                  />
                </div>
              </div>

              <div className="col-md-8">
                <label className="form-label small fw-medium">URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={form.url || ''}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://github.com/username"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-medium">Display Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.order || 0}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light rounded-3"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-3" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1" />
                    Save Link
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center text-muted">
          <i className="bi bi-share fs-1 mb-2 text-secondary opacity-50" />
          <h6>No social links added yet</h6>
          <p className="small mb-0">Add your social media and professional profile links above.</p>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 shadow-sm p-3 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                      style={{ width: 40, height: 40 }}
                    >
                      <i className={`bi ${item.icon} fs-5`} />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{item.platform}</h6>
                      <span className="badge bg-light text-muted border small">Order: {item.order || 0}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <button
                      className="btn btn-sm btn-light rounded-circle"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="btn btn-sm btn-light text-danger rounded-circle"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-truncate text-decoration-none text-muted small d-block"
                >
                  <i className="bi bi-box-arrow-up-right me-1" />
                  {item.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinkManager;
