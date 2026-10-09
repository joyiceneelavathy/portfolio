import React, { useState } from 'react';
import { Profile } from '../types';
import { profileService, uploadService } from '../services/api';

interface HeroProps {
  profile: Profile | null;
  editMode?: boolean;
  onProfileUpdated?: (updated: Profile) => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, editMode = false, onProfileUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const name = profile?.name || 'Joyice Neelavathy';
  const subtitle = profile?.subtitle || 'B.Tech Information Technology Student';
  const role = profile?.role || profile?.title || 'Aspiring Full-Stack Developer & Software Engineer';
  const bio =
    profile?.bio ||
    profile?.shortIntro ||
    'Passionate IT student driven by building scalable web applications and intuitive digital experiences. Dedicated to writing clean code with React, TypeScript, Node.js, and MongoDB.';
  const resumeUrl = profile?.resumeUrl || '#resume';
  const avatarUrl =
    profile?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenEdit = () => {
    if (profile) {
      setFormData({ ...profile });
    } else {
      setFormData({
        name,
        subtitle,
        title: role,
        role,
        bio,
        avatarUrl,
        email: 'joyiceneelavathy@gmail.com',
        location: 'Tamil Nadu, India',
        resumeUrl,
      });
    }
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.fileUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: res.fileUrl }));
        showToast('📸 Avatar uploaded!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.update({
        ...formData,
        role: formData.role || formData.title,
        title: formData.title || formData.role,
      });
      if (res.success && res.data) {
        showToast('✅ Profile updated in MongoDB!');
        onProfileUpdated?.(res.data);
        setModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save profile to database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="home" className="hero-section position-relative">
      {toastMsg && (
        <div
          className="position-fixed top-0 end-0 m-4 z-3 alert alert-success shadow-lg border-0 rounded-4 px-4 py-3 d-flex align-items-center gap-2"
          style={{ animation: 'fadeIn 0.3s' }}
        >
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <span className="fw-semibold">{toastMsg}</span>
        </div>
      )}

      {editMode && (
        <div className="position-absolute top-0 end-0 m-3 z-2">
          <button
            onClick={handleOpenEdit}
            className="btn btn-warning rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 px-3 py-2"
          >
            <i className="bi bi-pencil-square"></i> Edit Hero Section
          </button>
        </div>
      )}

      <div className="container">
        <div className="row align-items-center min-vh-75 py-4">
          <div className="col-lg-7 text-center text-lg-start mb-5 mb-lg-0">
            <div className="mb-3">
              <span className="hero-badge shadow-sm">
                <span className="pulse-dot"></span>
                Available for Software Engineering Internships & Projects
              </span>
            </div>

            <h1 className="hero-title mb-3">
              Hi, I'm <span className="hero-highlight">{name}</span>
            </h1>

            <h2 className="h4 text-primary fw-semibold mb-3">
              {subtitle} <span className="text-secondary fw-normal">|</span>{' '}
              <span className="text-dark">{role}</span>
            </h2>

            <p className="lead text-muted mb-4 pe-lg-4" style={{ fontSize: '1.15rem' }}>
              {bio}
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <a href="#projects" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm fw-semibold">
                View My Projects <i className="bi bi-arrow-right ms-1"></i>
              </a>
              <a
                href={resumeUrl}
                target={resumeUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="btn btn-outline-primary btn-lg rounded-pill px-4 fw-semibold"
              >
                <i className="bi bi-file-earmark-person me-1"></i> Download Resume
              </a>
              <a href="#contact" className="btn btn-light btn-lg rounded-pill px-4 border fw-semibold">
                Contact Me
              </a>
            </div>

            <div className="mt-4 pt-2 d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
              <span className="text-muted small fw-medium">Connect:</span>
              <a
                href={profile?.githubUrl || 'https://github.com/joyiceneelavathy'}
                target="_blank"
                rel="noreferrer"
                className="social-icon-circle"
                title="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href={profile?.linkedinUrl || 'https://linkedin.com/in/joyice-neelavathy'}
                target="_blank"
                rel="noreferrer"
                className="social-icon-circle"
                title="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href={`mailto:${profile?.email || 'joyiceneelavathy@gmail.com'}`}
                className="social-icon-circle"
                title="Email"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="social-icon-circle" title="Phone">
                  <i className="bi bi-telephone-fill"></i>
                </a>
              )}
            </div>
          </div>

          <div className="col-lg-5 text-center">
            <div className="hero-avatar-wrapper position-relative mx-auto">
              <div className="hero-avatar-blob"></div>
              <div className="hero-avatar-circle shadow-lg">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="hero-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="experience-badge shadow-sm">
                <i className="bi bi-laptop text-primary fs-4"></i>
                <div>
                  <div className="fw-bold text-dark lh-1">B.Tech IT</div>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Full-Stack Focus</small>
                </div>
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="btn btn-dark btn-sm rounded-pill position-absolute bottom-0 start-50 translate-middle-x mb-2 shadow"
                  style={{ fontSize: '12px' }}
                >
                  <i className="bi bi-camera me-1"></i> Change Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile / Hero Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">✏️ Edit Hero & Profile Info</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Primary Title / Role</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.title || formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, role: e.target.value })}
                        placeholder="e.g. Full-Stack Developer & Software Engineer"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Subtitle / Degree Status</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="e.g. B.Tech Information Technology Student"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Location</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Chennai, Tamil Nadu, India"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Hero Intro / Bio</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={formData.bio || formData.shortIntro || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value, shortIntro: e.target.value })
                        }
                        placeholder="Short compelling summary shown in the hero section..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Avatar Image URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.avatarUrl || ''}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div className="mt-2">
                        <label className="btn btn-sm btn-outline-secondary rounded-pill cursor-pointer">
                          <i className="bi bi-upload me-1"></i> {uploading ? 'Uploading...' : 'Or Upload Local Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Resume File URL</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.resumeUrl || ''}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                        placeholder="/resume.pdf or Google Drive link"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">GitHub URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.githubUrl || ''}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">LinkedIn URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.linkedinUrl || ''}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving to DB...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> Save to MongoDB
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
