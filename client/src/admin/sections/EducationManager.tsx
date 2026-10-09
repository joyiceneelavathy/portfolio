import React, { useState, useEffect } from 'react';
import { educationService } from '../../services/api';
import { Education } from '../../types';

const emptyForm: Partial<Education> = {
  degree: '', department: '', institution: '', startYear: '', endYear: '', description: '', percentageOrCgpa: '', order: 0,
};

const EducationManager: React.FC = () => {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Education>>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const res = await educationService.getAll();
    if (res.success) setItems(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await educationService.update(editId, form);
        showAlert('success', '✅ Education record updated!');
      } else {
        await educationService.create(form);
        showAlert('success', '✅ Education record added!');
      }
      await load();
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Education) => {
    setForm(item);
    setEditId(item._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      await educationService.delete(id);
      showAlert('success', '✅ Education record deleted.');
      await load();
    } catch (err: any) {
      showAlert('danger', err?.message || 'Delete failed.');
    }
  };

  const ch = (field: keyof Education, val: string | number) => setForm((f) => ({ ...f, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#e3f2fd' }}>
            <i className="bi bi-mortarboard text-primary fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Education Management</h5>
            <p className="text-muted small mb-0">{items.length} education records</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Education
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} border-0 rounded-3 d-flex align-items-center gap-2 mb-3`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #0d6efd' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Education Record' : 'Add New Education Record'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Degree <span className="text-danger">*</span></label>
                <input className="form-control" value={form.degree || ''} onChange={(e) => ch('degree', e.target.value)} required placeholder="B.Tech, M.Tech, B.Sc..." />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Department <span className="text-danger">*</span></label>
                <input className="form-control" value={form.department || ''} onChange={(e) => ch('department', e.target.value)} required placeholder="Information Technology" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Institution <span className="text-danger">*</span></label>
                <input className="form-control" value={form.institution || ''} onChange={(e) => ch('institution', e.target.value)} required placeholder="College / University Name" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Start Year <span className="text-danger">*</span></label>
                <input className="form-control" value={form.startYear || ''} onChange={(e) => ch('startYear', e.target.value)} required placeholder="2022" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">End Year <span className="text-danger">*</span></label>
                <input className="form-control" value={form.endYear || ''} onChange={(e) => ch('endYear', e.target.value)} required placeholder="2026" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Percentage / CGPA <span className="text-danger">*</span></label>
                <input className="form-control" value={form.percentageOrCgpa || ''} onChange={(e) => ch('percentageOrCgpa', e.target.value)} required placeholder="8.6 CGPA / 92%" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Display Order</label>
                <input type="number" className="form-control" value={form.order || 0} onChange={(e) => ch('order', Number(e.target.value))} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Description</label>
                <textarea className="form-control" rows={3} value={form.description || ''} onChange={(e) => ch('description', e.target.value)} placeholder="Key subjects, achievements..." />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Record
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="small text-muted fw-semibold py-3 ps-4">Degree / Institution</th>
                <th className="small text-muted fw-semibold py-3">Years</th>
                <th className="small text-muted fw-semibold py-3">Score</th>
                <th className="small text-muted fw-semibold py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted py-5">No education records yet. Click "Add Education" to get started.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4 py-3">
                      <div className="fw-semibold text-dark small">{item.degree}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{item.department} • {item.institution}</div>
                    </td>
                    <td className="small text-muted">{item.startYear} – {item.endYear}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle small">
                        {item.percentageOrCgpa}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary rounded-3 me-2" onClick={() => handleEdit(item)}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(item._id!)}>
                        <i className="bi bi-trash" />
                      </button>
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

export default EducationManager;
