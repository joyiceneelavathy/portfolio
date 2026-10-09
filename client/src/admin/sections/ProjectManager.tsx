import React, { useState, useEffect } from 'react';
import { projectService, uploadService } from '../../services/api';
import { Project } from '../../types';

const empty: Partial<Project> = {
  title: '', description: '', fullDescription: '', technologies: [], imageUrl: '',
  githubUrl: '', liveDemoUrl: '', startDate: '', endDate: '', category: 'Web Application', featured: true, order: 0,
};

const ProjectManager: React.FC = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Project>>(empty);
  const [techInput, setTechInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => { const res = await projectService.getAll(); if (res.success) setItems(res.data); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showAlertMsg = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const techArr = techInput ? techInput.split(',').map((t) => t.trim()).filter(Boolean) : (form.technologies || []);
    const payload = { ...form, technologies: techArr };
    try {
      if (editId) { await projectService.update(editId, payload); showAlertMsg('success', '✅ Project updated!'); }
      else { await projectService.create(payload); showAlertMsg('success', '✅ Project added!'); }
      await load(); setForm(empty); setTechInput(''); setEditId(null); setShowForm(false);
    } catch (err: any) { showAlertMsg('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleEdit = (item: Project) => {
    setForm(item); setTechInput((item.technologies || []).join(', ')); setEditId(item._id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try { await projectService.delete(id); showAlertMsg('success', '✅ Project deleted.'); await load(); }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Delete failed.'); }
  };

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const res = await uploadService.uploadFile(file); if (res.success) { setForm((f) => ({ ...f, imageUrl: res.fileUrl })); showAlertMsg('success', '🖼️ Image uploaded!'); } }
    catch (err: any) { showAlertMsg('danger', err?.message || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const ch = (field: keyof Project, val: any) => setForm((f) => ({ ...f, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2" style={{ background: '#e8f5e9' }}>
            <i className="bi bi-folder2-open text-success fs-4" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Projects Management</h5>
            <p className="text-muted small mb-0">{items.length} projects in portfolio</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setForm(empty); setTechInput(''); setEditId(null); setShowForm(true); }}>
          <i className="bi bi-plus-circle me-2" />Add Project
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-3`}>{alert.msg}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderLeft: '4px solid #198754' }}>
          <h6 className="fw-bold mb-3">{editId ? 'Edit Project' : 'Add New Project'}</h6>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-medium">Project Title <span className="text-danger">*</span></label>
                <input className="form-control" value={form.title || ''} onChange={(e) => ch('title', e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-medium">Category</label>
                <input className="form-control" value={form.category || ''} onChange={(e) => ch('category', e.target.value)} placeholder="Full Stack, ML..." />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Short Description <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={2} value={form.description || ''} onChange={(e) => ch('description', e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Full Description</label>
                <textarea className="form-control" rows={4} value={form.fullDescription || ''} onChange={(e) => ch('fullDescription', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-medium">Technologies (comma-separated) <span className="text-danger">*</span></label>
                <input className="form-control" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, TypeScript, Node.js, MongoDB" required={!editId} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">GitHub URL</label>
                <input type="url" className="form-control" value={form.githubUrl || ''} onChange={(e) => ch('githubUrl', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Live Demo URL</label>
                <input type="url" className="form-control" value={form.liveDemoUrl || ''} onChange={(e) => ch('liveDemoUrl', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-medium">Project Image</label>
                <div className="d-flex gap-2">
                  <input className="form-control" value={form.imageUrl || ''} onChange={(e) => ch('imageUrl', e.target.value)} placeholder="Image URL" />
                  <label className="btn btn-outline-secondary btn-sm rounded-3 flex-shrink-0" htmlFor="proj-img-upload">
                    {uploading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-upload" />}
                  </label>
                  <input type="file" id="proj-img-upload" className="d-none" accept="image/*" onChange={handleImgUpload} />
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 rounded-2 w-100" style={{ maxHeight: 100, objectFit: 'cover' }} />}
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Start Date</label>
                <input className="form-control" value={form.startDate || ''} onChange={(e) => ch('startDate', e.target.value)} placeholder="Jan 2024" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">End Date</label>
                <input className="form-control" value={form.endDate || ''} onChange={(e) => ch('endDate', e.target.value)} placeholder="Apr 2024" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-medium">Display Order</label>
                <input type="number" className="form-control" value={form.order ?? 0} onChange={(e) => ch('order', Number(e.target.value))} />
              </div>
              <div className="col-md-3 d-flex align-items-end pb-1">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="proj-featured" checked={form.featured !== false} onChange={(e) => ch('featured', e.target.checked)} />
                  <label className="form-check-label small fw-medium" htmlFor="proj-featured">Featured Project</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-success rounded-3" disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle me-2" />}
                {editId ? 'Update' : 'Add'} Project
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="row g-3">
        {items.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No projects yet.</div>
        ) : items.map((item) => (
          <div key={item._id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <img src={item.imageUrl || 'https://via.placeholder.com/400x200?text=Project'} alt={item.title} className="card-img-top" style={{ height: 140, objectFit: 'cover' }} />
              <div className="card-body p-3">
                <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                  <h6 className="fw-bold text-dark small mb-0">{item.title}</h6>
                  {item.featured && <span className="badge bg-warning text-dark" style={{ fontSize: 10 }}>Featured</span>}
                </div>
                <p className="text-muted mb-2" style={{ fontSize: 12, lineHeight: 1.4 }}>{item.description?.slice(0, 80)}...</p>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {(item.technologies || []).slice(0, 3).map((t) => (
                    <span key={t} className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: 10 }}>{t}</span>
                  ))}
                  {(item.technologies || []).length > 3 && <span className="badge bg-secondary-subtle text-secondary border" style={{ fontSize: 10 }}>+{item.technologies.length - 3}</span>}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary rounded-3 flex-grow-1" onClick={() => handleEdit(item)}>
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

export default ProjectManager;
