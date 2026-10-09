import React from 'react';
import { aboutService } from '../../services/api';
import { About } from '../../types';

const AboutManager: React.FC = () => {
  const [data, setData] = React.useState<Partial<About>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  React.useEffect(() => {
    aboutService.get().then((res) => { if (res.success) setData(res.data); }).finally(() => setLoading(false));
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await aboutService.update(data);
      if (res.success) { setData(res.data); showAlert('success', '✅ About section updated!'); }
    } catch (err: any) { showAlert('danger', err?.message || 'Failed to update.'); }
    finally { setSaving(false); }
  };

  const ch = (field: keyof About, val: string) => setData((d) => ({ ...d, [field]: val }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 p-2" style={{ background: '#e8f5e9' }}>
          <i className="bi bi-info-circle text-success fs-4" />
        </div>
        <div>
          <h5 className="mb-0 fw-bold">About Management</h5>
          <p className="text-muted small mb-0">Edit your about section content and career narrative</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} border-0 rounded-3 d-flex align-items-center gap-2 mb-4`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-medium small text-dark">Section Title</label>
              <input className="form-control" value={data.title || ''} onChange={(e) => ch('title', e.target.value)} placeholder="About Me" />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium small text-dark">About Description</label>
              <textarea className="form-control" rows={4} value={data.description || ''} onChange={(e) => ch('description', e.target.value)} placeholder="A brief description of who you are..." />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium small text-dark">Career Goal</label>
              <textarea className="form-control" rows={3} value={data.careerGoal || ''} onChange={(e) => ch('careerGoal', e.target.value)} placeholder="What are your career aspirations?" />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium small text-dark">Professional Summary</label>
              <textarea className="form-control" rows={4} value={data.professionalSummary || ''} onChange={(e) => ch('professionalSummary', e.target.value)} placeholder="Your professional background and expertise..." />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium small text-dark">Personal Introduction</label>
              <textarea className="form-control" rows={4} value={data.personalIntroduction || ''} onChange={(e) => ch('personalIntroduction', e.target.value)} placeholder="A personal note about yourself..." />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-success px-4 rounded-3" disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-circle me-2" />Save About</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
