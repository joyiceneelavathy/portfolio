import React, { useState, useEffect } from 'react';
import { resumeService, uploadService } from '../../services/api';
import { Resume } from '../../types';

const ResumeManager: React.FC = () => {
  const [data, setData] = useState<Partial<Resume>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  useEffect(() => {
    resumeService.get().then((res) => { if (res.success) setData(res.data); }).finally(() => setLoading(false));
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await resumeService.update(data);
      if (res.success) { setData(res.data); showAlert('success', '✅ Resume information updated!'); }
    } catch (err: any) { showAlert('danger', err?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) { setData((d) => ({ ...d, fileUrl: res.fileUrl })); showAlert('success', '📄 Resume PDF uploaded successfully!'); }
    } catch (err: any) { showAlert('danger', err?.message || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const ch = (field: keyof Resume, val: string) => setData((d) => ({ ...d, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 p-2" style={{ background: '#e8f5e9' }}>
          <i className="bi bi-file-earmark-person text-success fs-4" />
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Resume Management</h5>
          <p className="text-muted small mb-0">Upload resume PDF and manage resume display content</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type} border-0 rounded-3 mb-4`}>{alert.msg}</div>}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* Upload card */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div className="rounded-3 d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 60, height: 60, background: '#e8f5e9' }}>
                <i className="bi bi-file-earmark-pdf text-success fs-3" />
              </div>
              <h6 className="fw-semibold mb-1">Resume PDF</h6>
              {data.fileUrl && (
                <div className="mb-3">
                  <a href={data.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success rounded-pill">
                    <i className="bi bi-eye me-1" />View Current PDF
                  </a>
                </div>
              )}
              <label className="btn btn-success btn-sm rounded-3" htmlFor="resume-upload">
                {uploading ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</> : <><i className="bi bi-upload me-2" />Upload New PDF</>}
              </label>
              <input type="file" id="resume-upload" className="d-none" accept=".pdf" onChange={handleUpload} />
              <div className="mt-3">
                <label className="form-label text-muted small">Or paste PDF URL</label>
                <input type="url" className="form-control form-control-sm" value={data.fileUrl || ''} onChange={(e) => ch('fileUrl', e.target.value)} placeholder="https://...resume.pdf" />
              </div>
            </div>
          </div>

          {/* Content fields */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-medium">Resume Title</label>
                  <input className="form-control" value={data.title || ''} onChange={(e) => ch('title', e.target.value)} placeholder="Joyice Neelavathy - Resume" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Professional Summary</label>
                  <textarea className="form-control" rows={4} value={data.summary || ''} onChange={(e) => ch('summary', e.target.value)} placeholder="Professional summary paragraph..." />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Skills Overview (one per line)</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={(data.skillsOverview || []).join('\n')}
                    onChange={(e) => setData((d) => ({ ...d, skillsOverview: e.target.value.split('\n').filter((s) => s.trim()) }))}
                    placeholder="Frontend: React, TypeScript&#10;Backend: Node.js, Express&#10;Databases: MongoDB"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Experience Summary</label>
                  <input className="form-control" value={data.experienceSummary || ''} onChange={(e) => ch('experienceSummary', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Education Summary</label>
                  <input className="form-control" value={data.educationSummary || ''} onChange={(e) => ch('educationSummary', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-success px-4 rounded-3" disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-circle me-2" />Save Resume Info</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeManager;
