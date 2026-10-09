import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/api';
import { Skill } from '../../types';

const categories = ['Frontend', 'Backend', 'Programming Languages', 'Databases', 'Tools & Platforms', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const empty: Partial<Skill> = { name: '', category: 'Frontend', level: 'Intermediate', percentage: 80, icon: 'bi-code-slash', order: 0 };

const SkillManager: React.FC = () => {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Skill>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
  const [filterCat, setFilterCat] = useState('All');

  const load = async () => { const res = await skillService.getAll(); if (res.success) setItems(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showAlertMsg = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await skillService.update(editId, form); showAlertMsg('success', '✅ Skill updated!'); }
      else { await skillService.create(form); showAlertMsg('success', '✅ Skill added!'); }
      await load(); setForm(empty); setEditId(null); setShowForm(false);
    } catch (err: any) { showAlertMsg('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await skillService.delete(id); showAlertMsg('success', '✅ Skill deleted.'); await load(); }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Delete failed.'); }
  };

  const ch = (field: keyof Skill, val: string | number) => setForm((f) => ({ ...f, [field]: val }));

  const filtered = filterCat === 'All' ? items : items.filter((s) => s.category === filterCat);

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#f3e5f5' }}>
            <i className="bi bi-code-slash text-purple fs-4" style={{ color: '#6f42c1' }} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Skills Management</h5>
            <p className="text-muted small mb-0">{items.length} skills across {categories.length} categories</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Skill
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-3`}>{alert.msg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #6f42c1' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Skill' : 'Add New Skill'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-medium">Skill Name <span className="text-danger">*</span></label>
                <input className="form-control" value={form.name || ''} onChange={(e) => ch('name', e.target.value)} required placeholder="React, Node.js..." />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Category</label>
                <select className="form-select" value={form.category || 'Frontend'} onChange={(e) => ch('category', e.target.value)}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Level</label>
                <select className="form-select" value={form.level || 'Intermediate'} onChange={(e) => ch('level', e.target.value)}>
                  {levels.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Proficiency % (0–100)</label>
                <input type="number" className="form-control" min={0} max={100} value={form.percentage ?? 80} onChange={(e) => ch('percentage', Number(e.target.value))} />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Bootstrap Icon Class</label>
                <input className="form-control" value={form.icon || ''} onChange={(e) => ch('icon', e.target.value)} placeholder="bi-code-slash" />
                {form.icon && <div className="mt-1"><i className={`bi ${form.icon} text-primary fs-4`} /></div>}
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Display Order</label>
                <input type="number" className="form-control" value={form.order ?? 0} onChange={(e) => ch('order', Number(e.target.value))} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Skill
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); setForm(empty); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter pills */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {['All', ...categories].map((c) => (
          <button key={c} className={`btn btn-sm rounded-pill ${filterCat === c ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="small text-muted fw-semibold py-3 ps-4">Skill</th>
                <th className="small text-muted fw-semibold py-3">Category</th>
                <th className="small text-muted fw-semibold py-3">Level</th>
                <th className="small text-muted fw-semibold py-3">Proficiency</th>
                <th className="small text-muted fw-semibold py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-5">No skills yet.</td></tr>
              ) : filtered.map((item) => (
                <tr key={item._id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon || 'bi-code-slash'} text-primary fs-5`} />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle small">{item.category}</span></td>
                  <td><span className="text-muted small">{item.level}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: 6, maxWidth: 100 }}>
                        <div className="progress-bar bg-primary" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="small text-muted">{item.percentage}%</span>
                    </div>
                  </td>
                  <td className="text-end pe-4">
                    <button className="btn btn-sm btn-outline-primary rounded-3 me-2" onClick={() => { setForm(item); setEditId(item._id || null); setShowForm(true); }}>
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

export default SkillManager;
