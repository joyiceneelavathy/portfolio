import React, { useState, useEffect } from 'react';
import { certificateService, uploadService } from '../../services/api';
import { Certificate } from '../../types';

const empty: Partial<Certificate> = { name: '', issuingOrganization: '', issueDate: '', certificateId: '', imageUrl: '', pdfUrl: '', credentialUrl: '', description: '' };

const CertificateManager: React.FC = () => {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Certificate>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => { const res = await certificateService.getAll(); if (res.success) setItems(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showAlertMsg = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await certificateService.update(editId, form); showAlertMsg('success', '✅ Certificate updated!'); }
      else { await certificateService.create(form); showAlertMsg('success', '✅ Certificate added!'); }
      await load(); setForm(empty); setEditId(null); setShowForm(false);
    } catch (err: any) { showAlertMsg('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certificate?')) return;
    try { await certificateService.delete(id); showAlertMsg('success', '✅ Deleted.'); await load(); }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Delete failed.'); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'pdfUrl') => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const res = await uploadService.uploadFile(file); if (res.success) { setForm((f) => ({ ...f, [field]: res.fileUrl })); showAlertMsg('success', '✅ File uploaded!'); } }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const ch = (field: keyof Certificate, val: string) => setForm((f) => ({ ...f, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#fff3e0' }}>
            <i className="bi bi-patch-check text-warning fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Certificates Management</h5>
            <p className="text-muted small mb-0">{items.length} certificates</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Certificate
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-3`}>{alert.msg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #ffc107' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Certificate' : 'Add New Certificate'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-medium">Certificate Name <span className="text-danger">*</span></label>
                <input className="form-control" value={form.name || ''} onChange={(e) => ch('name', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Issue Date <span className="text-danger">*</span></label>
                <input className="form-control" value={form.issueDate || ''} onChange={(e) => ch('issueDate', e.target.value)} required placeholder="August 2024" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Issuing Organization <span className="text-danger">*</span></label>
                <input className="form-control" value={form.issuingOrganization || ''} onChange={(e) => ch('issuingOrganization', e.target.value)} required placeholder="Coursera, NPTEL, etc." />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Certificate ID</label>
                <input className="form-control" value={form.certificateId || ''} onChange={(e) => ch('certificateId', e.target.value)} placeholder="META-FS-892147" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Credential URL</label>
                <input type="url" className="form-control" value={form.credentialUrl || ''} onChange={(e) => ch('credentialUrl', e.target.value)} placeholder="https://verify.example.com/..." />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Certificate Image</label>
                <div className="d-flex gap-2 mb-1">
                  <input className="form-control form-control-sm" value={form.imageUrl || ''} onChange={(e) => ch('imageUrl', e.target.value)} placeholder="Image URL" />
                  <label className="btn btn-outline-secondary btn-sm rounded-3 flex-shrink-0" htmlFor="cert-img-upload">
                    {uploading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-upload" />}
                  </label>
                  <input type="file" id="cert-img-upload" className="d-none" accept="image/*" onChange={(e) => handleUpload(e, 'imageUrl')} />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Certificate PDF</label>
                <div className="d-flex gap-2 mb-1">
                  <input className="form-control form-control-sm" value={form.pdfUrl || ''} onChange={(e) => ch('pdfUrl', e.target.value)} placeholder="PDF URL" />
                  <label className="btn btn-outline-secondary btn-sm rounded-3 flex-shrink-0" htmlFor="cert-pdf-upload">
                    <i className="bi bi-file-earmark-pdf" />
                  </label>
                  <input type="file" id="cert-pdf-upload" className="d-none" accept=".pdf" onChange={(e) => handleUpload(e, 'pdfUrl')} />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Description</label>
                <textarea className="form-control" rows={3} value={form.description || ''} onChange={(e) => ch('description', e.target.value)} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-warning text-dark rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Certificate
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="row g-3">
        {items.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No certificates yet.</div>
        ) : items.map((item) => (
          <div key={item._id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <img src={item.imageUrl || 'https://via.placeholder.com/400x180?text=Certificate'} alt={item.name} className="card-img-top" style={{ height: 130, objectFit: 'cover' }} />
              <div className="card-body p-3">
                <h6 className="fw-bold small mb-1">{item.name}</h6>
                <p className="text-muted mb-2" style={{ fontSize: 12 }}>{item.issuingOrganization} · {item.issueDate}</p>
                {item.certificateId && <div className="text-muted mb-2" style={{ fontSize: 11 }}>ID: {item.certificateId}</div>}
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary rounded-3 flex-grow-1" onClick={() => { setForm(item); setEditId(item._id); setShowForm(true); }}>
                    <i className="bi bi-pencil me-1" />Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(item._id)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateManager;
