import React, { useState, useEffect } from 'react';
import { experienceService } from '../../services/api';
import { Experience } from '../../types';

const empty: Partial<Experience> = { title: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '', technologies: [], order: 0 };

const ExperienceManager: React.FC = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Experience>>(empty);
  const [techInput, setTechInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const load = async () => { const res = await experienceService.getAll(); if (res.success) setItems(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);
  const showAlertMsg = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const techArr = techInput ? techInput.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const payload = { ...form, technologies: techArr };
    try {
      if (editId) { await experienceService.update(editId, payload); showAlertMsg('success', '✅ Experience updated!'); }
      else { await experienceService.create(payload); showAlertMsg('success', '✅ Experience added!'); }
      await load(); setForm(empty); setTechInput(''); setEditId(null); setShowForm(false);
    } catch (err: any) { showAlertMsg('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this experience?')) return;
    try { await experienceService.delete(id); showAlertMsg('success', '✅ Deleted.'); await load(); }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Delete failed.'); }
  };

  const ch = (field: keyof Experience, val: any) => setForm((f) => ({ ...f, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#e3f2fd' }}>
            <i className="bi bi-briefcase text-primary fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Experience Management</h5>
            <p className="text-muted small mb-0">{items.length} experience records</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(empty); setTechInput(''); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Experience
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-3`}>{alert.msg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #0d6efd' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Experience' : 'Add New Experience'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Job / Internship Title <span className="text-danger">*</span></label>
                <input className="form-control" value={form.title || ''} onChange={(e) => ch('title', e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Company <span className="text-danger">*</span></label>
                <input className="form-control" value={form.company || ''} onChange={(e) => ch('company', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Location</label>
                <input className="form-control" value={form.location || ''} onChange={(e) => ch('location', e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Start Date <span className="text-danger">*</span></label>
                <input className="form-control" value={form.startDate || ''} onChange={(e) => ch('startDate', e.target.value)} required placeholder="May 2024" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">End Date</label>
                <input className="form-control" value={form.endDate || ''} onChange={(e) => ch('endDate', e.target.value)} placeholder="July 2024" disabled={form.currentlyWorking} />
              </div>
              <div className="col-md-2 d-flex align-items-end pb-1">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="currently-working" checked={form.currentlyWorking || false} onChange={(e) => ch('currentlyWorking', e.target.checked)} />
                  <label className="form-check-label small" htmlFor="currently-working">Currently Working</label>
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Description <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={4} value={form.description || ''} onChange={(e) => ch('description', e.target.value)} required />
              </div>
              <div className="col-md-10">
                <label className="form-label small fw-medium">Technologies (comma-separated)</label>
                <input className="form-control" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, MongoDB..." />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-medium">Order</label>
                <input type="number" className="form-control" value={form.order ?? 0} onChange={(e) => ch('order', Number(e.target.value))} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Experience
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="small text-muted fw-semibold py-3 ps-4">Title / Company</th>
                <th className="small text-muted fw-semibold py-3">Duration</th>
                <th className="small text-muted fw-semibold py-3">Technologies</th>
                <th className="small text-muted fw-semibold py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted py-5">No experience records yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}>
                  <td className="ps-4 py-3">
                    <div className="fw-semibold text-dark small">{item.title}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{item.company} {item.location ? `· ${item.location}` : ''}</div>
                  </td>
                  <td className="small text-muted">
                    {item.startDate} – {item.currentlyWorking ? <span className="badge bg-success-subtle text-success">Present</span> : item.endDate}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {(item.technologies || []).slice(0, 3).map((t) => (
                        <span key={t} className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: 10 }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end pe-4">
                    <button className="btn btn-sm btn-outline-primary rounded-3 me-2" onClick={() => { setForm(item); setTechInput((item.technologies || []).join(', ')); setEditId(item._id || null); setShowForm(true); }}>
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(item._id!)}>
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExperienceManager;
