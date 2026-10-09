import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/api';
import { Service } from '../../types';

const empty: Partial<Service> = { title: '', description: '', icon: 'bi-code-square', order: 0 };

const ServiceManager: React.FC = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Service>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const load = async () => { const res = await serviceService.getAll(); if (res.success) setItems(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);
  const showAlertMsg = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await serviceService.update(editId, form); showAlertMsg('success', '✅ Service updated!'); }
      else { await serviceService.create(form); showAlertMsg('success', '✅ Service added!'); }
      await load(); setForm(empty); setEditId(null); setShowForm(false);
    } catch (err: any) { showAlertMsg('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try { await serviceService.delete(id); showAlertMsg('success', '✅ Deleted.'); await load(); }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Delete failed.'); }
  };

  const ch = (field: keyof Service, val: any) => setForm((f) => ({ ...f, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#fce4ec' }}>
            <i className="bi bi-gear text-danger fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Services Management</h5>
            <p className="text-muted small mb-0">{items.length} services offered</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Service
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-3`}>{alert.msg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #dc3545' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Service' : 'Add New Service'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-medium">Service Title <span className="text-danger">*</span></label>
                <input className="form-control" value={form.title || ''} onChange={(e) => ch('title', e.target.value)} required placeholder="Web Development" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Bootstrap Icon Class</label>
                <input className="form-control" value={form.icon || ''} onChange={(e) => ch('icon', e.target.value)} placeholder="bi-laptop" />
                {form.icon && <div className="mt-1"><i className={`bi ${form.icon} text-danger fs-4`} /></div>}
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-medium">Order</label>
                <input type="number" className="form-control" value={form.order ?? 0} onChange={(e) => ch('order', Number(e.target.value))} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Description <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={3} value={form.description || ''} onChange={(e) => ch('description', e.target.value)} required />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-danger rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Service
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="row g-3">
        {items.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No services yet.</div>
        ) : items.map((item) => (
          <div key={item._id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="rounded-3 p-2 flex-shrink-0" style={{ background: '#fce4ec' }}>
                  <i className={`bi ${item.icon || 'bi-gear'} text-danger fs-5`} />
                </div>
                <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
              </div>
              <p className="text-muted small mb-3">{item.description}</p>
              <div className="d-flex gap-2 mt-auto">
                <button className="btn btn-sm btn-outline-primary rounded-3 flex-grow-1" onClick={() => { setForm(item); setEditId(item._id || null); setShowForm(true); }}>
                  <i className="bi bi-pencil me-1" />Edit
                </button>
                <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(item._id!)}>
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;
