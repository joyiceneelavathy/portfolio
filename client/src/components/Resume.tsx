import React, { useState, useEffect } from 'react';
import { Profile, Resume as ResumeType } from '../types';
import { resumeService, profileService, uploadService } from '../services/api';

interface ResumeProps {
  profile: Profile | null;
  editMode?: boolean;
  onProfileUpdated?: (updated: Profile) => void;
}

export const Resume: React.FC<ResumeProps> = ({ profile, editMode = false, onProfileUpdated }) => {
  const [resumeData, setResumeData] = useState<Partial<ResumeType>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ResumeType>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchResume = async () => {
    try {
      const res = await resumeService.get();
      if (res.success && res.data) {
        setResumeData(res.data);
      }
    } catch (err) {
      console.warn('Could not load resume data:', err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenEdit = () => {
    setFormData({
      title: resumeData.title || `${profile?.name || 'Joyice Neelavathy'} - Resume`,
      summary:
        resumeData.summary ||
        'Ambitious and disciplined Information Technology undergraduate with a solid conceptual foundation in computer science and modern full-stack web engineering. Experienced in building end-to-end applications utilizing React, TypeScript, Node.js, Express, and MongoDB. Demonstrated ability to craft responsive user interfaces, design clean RESTful microservices, and collaborate effectively using Git and GitHub.',
      fileUrl: resumeData.fileUrl || profile?.resumeUrl || '/resume.pdf',
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.fileUrl) {
        setFormData((prev) => ({ ...prev, fileUrl: res.fileUrl }));
        showToast('📄 Resume PDF uploaded!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload PDF resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await resumeService.update(formData);
      if (res.success && res.data) {
        setResumeData(res.data);
      }

      if (profile && formData.fileUrl) {
        const profRes = await profileService.update({
          ...profile,
          resumeUrl: formData.fileUrl,
        });
        if (profRes.success && profRes.data) {
          onProfileUpdated?.(profRes.data);
        }
      }

      showToast('✅ Resume details updated in MongoDB!');
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save resume details.');
    } finally {
      setSaving(false);
    }
  };

  const resumeUrl = resumeData.fileUrl || profile?.resumeUrl || '/resume.pdf';
  const name = profile?.name || 'Joyice Neelavathy';
  const role = profile?.role || profile?.title || 'Information Technology Student / Aspiring Full-Stack Developer';
  const summary =
    resumeData.summary ||
    'Ambitious and disciplined Information Technology undergraduate with a solid conceptual foundation in computer science and modern full-stack web engineering. Experienced in building end-to-end applications utilizing React, TypeScript, Node.js, Express, and MongoDB. Demonstrated ability to craft responsive user interfaces, design clean RESTful microservices, and collaborate effectively using Git and GitHub. Eager to contribute technical skills and enthusiasm as a software engineering intern or associate developer.';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="py-5 bg-white position-relative">
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
            <i className="bi bi-pencil-square"></i> Edit Resume Section
          </button>
        </div>
      )}

      <div className="container py-4">
        <div className="text-center">
          <span className="section-tag">Curriculum Vitae</span>
          <h2 className="section-title">Resume & Qualifications</h2>
          <p className="section-lead">
            A structured summary of my education, technical strengths, projects, and career preparedness.
          </p>
        </div>

        <div className="row g-4 align-items-center justify-content-center">
          <div className="col-lg-10">
            <div className="custom-card p-4 p-md-5 border-primary border-opacity-25 bg-white">
              {/* Top Banner with Action Button */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-4 border-bottom mb-4">
                <div>
                  <h3 className="fw-bold text-dark mb-1">{name}</h3>
                  <p className="text-primary fw-medium mb-0">{role}</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill"></i> Download Resume
                  </button>
                </div>
              </div>

              {/* Resume Summary */}
              <div className="mb-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-person-lines-fill text-primary"></i> Professional Summary
                </h5>
                <p className="text-secondary mb-0">{summary}</p>
              </div>

              {/* Highlights Matrix */}
              <div className="row g-4 pt-3 border-top">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 h-100 border border-light-subtle">
                    <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-code-slash text-primary"></i> Core Strengths
                    </h6>
                    <ul className="list-unstyled small text-secondary mb-0">
                      <li className="mb-1">• React & TypeScript Web Apps</li>
                      <li className="mb-1">• Node.js & Express RESTful APIs</li>
                      <li className="mb-1">• MongoDB Schema Architecture</li>
                      <li>• Bootstrap 5 Responsive UI/UX</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 h-100 border border-light-subtle">
                    <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-mortarboard text-success"></i> Academic Highlights
                    </h6>
                    <ul className="list-unstyled small text-secondary mb-0">
                      <li className="mb-1">• B.Tech in Information Technology</li>
                      <li className="mb-1">• Data Structures & OOP In Depth</li>
                      <li className="mb-1">• Database Management Systems</li>
                      <li>• Computer Networking & OS</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3 h-100 border border-light-subtle">
                    <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-gear-wide-connected text-warning"></i> Developer Tools
                    </h6>
                    <ul className="list-unstyled small text-secondary mb-0">
                      <li className="mb-1">• Git, GitHub & Version Control</li>
                      <li className="mb-1">• Postman & Swagger OpenAPI Docs</li>
                      <li className="mb-1">• VS Code & Modern DevTools</li>
                      <li>• Vite Fast Build Pipeline</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Resume Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">✏️ Edit Resume & CV Information</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Resume Title</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Professional Summary</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={5}
                        value={formData.summary || ''}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Resume File URL (PDF)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.fileUrl || ''}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        placeholder="/resume.pdf or cloud link"
                        required
                      />
                      <div className="mt-2">
                        <label className="btn btn-sm btn-outline-secondary rounded-pill cursor-pointer">
                          <i className="bi bi-upload me-1"></i> {uploading ? 'Uploading...' : 'Or Upload Resume PDF'}
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
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
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving to MongoDB...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> Save Resume Details
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

export default Resume;
