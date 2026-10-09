import React, { useState } from 'react';
import { profileService, uploadService } from '../../services/api';
import { Profile } from '../../types';

const ProfileManager: React.FC = () => {
  const [profile, setProfile] = React.useState<Partial<Profile>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: 'success' | 'danger'; msg: string } | null>(null);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    profileService.get().then((res) => {
      if (res.success) setProfile(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.update(profile);
      if (res.success) {
        setProfile(res.data);
        showAlert('success', '✅ Profile updated successfully!');
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setProfile((p) => ({ ...p, avatarUrl: res.fileUrl }));
        showAlert('success', '📷 Profile image uploaded!');
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field: keyof Profile, value: string | boolean) =>
    setProfile((p) => ({ ...p, [field]: value }));

  if (loading) return <div className="text-center py-5"><span className="spinner-border text-primary" /></div>;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 p-2" style={{ background: '#e3f2fd' }}>
          <i className="bi bi-person-circle text-primary fs-4" />
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Profile Management</h5>
          <p className="text-muted small mb-0">Update your personal information, photo, and visibility settings</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} d-flex align-items-center gap-2 rounded-3 border-0 mb-4`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* Left: photo */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
              <h6 className="fw-semibold text-dark mb-3">Profile Photo</h6>
              <div className="position-relative d-inline-block mx-auto mb-3">
                <img
                  src={profile.avatarUrl || 'https://via.placeholder.com/120?text=Photo'}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover border border-3 border-primary"
                  style={{ width: 120, height: 120 }}
                />
                {uploading && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <span className="spinner-border spinner-border-sm text-white" />
                  </div>
                )}
              </div>
              <label className="btn btn-outline-primary btn-sm rounded-pill" htmlFor="avatar-upload">
                <i className="bi bi-upload me-1" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="d-none"
                onChange={handleFileUpload}
              />
              <div className="mt-3">
                <label className="form-label text-muted small">Or paste image URL</label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  value={profile.avatarUrl || ''}
                  onChange={(e) => handleChange('avatarUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Right: fields */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Full Name <span className="text-danger">*</span></label>
                  <input className="form-control" value={profile.name || ''} onChange={(e) => handleChange('name', e.target.value)} required placeholder="Your Full Name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Professional Title <span className="text-danger">*</span></label>
                  <input className="form-control" value={profile.title || ''} onChange={(e) => handleChange('title', e.target.value)} required placeholder="e.g. Full-Stack Developer" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Subtitle</label>
                  <input className="form-control" value={profile.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} placeholder="e.g. B.Tech IT Student" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Phone</label>
                  <input className="form-control" value={profile.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Location</label>
                  <input className="form-control" value={profile.location || ''} onChange={(e) => handleChange('location', e.target.value)} placeholder="Chennai, India" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">LinkedIn URL</label>
                  <input type="url" className="form-control" value={profile.linkedinUrl || ''} onChange={(e) => handleChange('linkedinUrl', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">GitHub URL</label>
                  <input type="url" className="form-control" value={profile.githubUrl || ''} onChange={(e) => handleChange('githubUrl', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-dark">Short Introduction</label>
                  <textarea className="form-control" rows={2} value={profile.shortIntro || ''} onChange={(e) => handleChange('shortIntro', e.target.value)} placeholder="One-liner about you..." />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-dark">About Description</label>
                  <textarea className="form-control" rows={4} value={profile.aboutDescription || ''} onChange={(e) => handleChange('aboutDescription', e.target.value)} placeholder="Detailed about paragraph..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-dark">Resume URL</label>
                  <input className="form-control" value={profile.resumeUrl || ''} onChange={(e) => handleChange('resumeUrl', e.target.value)} placeholder="/resume.pdf or full URL" />
                </div>
                <div className="col-md-6 d-flex align-items-center gap-3 pt-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="profileVisible"
                      checked={profile.isVisible !== false}
                      onChange={(e) => handleChange('isVisible', e.target.checked)}
                    />
                    <label className="form-check-label fw-medium small text-dark" htmlFor="profileVisible">
                      Profile Visible on Portfolio
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button type="submit" className="btn btn-primary px-4 rounded-3" disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-circle me-2" />Save Profile</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManager;
