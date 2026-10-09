import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import portfolioService, { certificateService, uploadService } from '../services/api';

interface CertificatesProps {
  editMode?: boolean;
}

const emptyCert: Partial<Certificate> = {
  name: '',
  title: '',
  issuingOrganization: '',
  issueDate: '',
  certificateId: '',
  imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  credentialUrl: '',
  description: '',
  skills: ['Web Development', 'Full-Stack'],
};

export const Certificates: React.FC<CertificatesProps> = ({ editMode = false }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Edit / Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Certificate>>(emptyCert);
  const [skillsInput, setSkillsInput] = useState('Web Development, Full-Stack');
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await portfolioService.getCertificates();
      setCertificates(res.data || []);
    } catch (err: any) {
      console.error('Error fetching certificates:', err);
      setError(err.message || 'Unable to retrieve certificates from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setFormData(emptyCert);
    setSkillsInput('Web Development, Full-Stack');
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setFormData(cert);
    setSkillsInput(cert.skills?.join(', ') || '');
    setEditId(cert._id);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.fileUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.fileUrl }));
        showToast('📜 Certificate image uploaded!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload certificate image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const titleVal = formData.title || formData.name || '';
      const payload: Partial<Certificate> = {
        ...formData,
        name: titleVal,
        title: titleVal,
        skills,
      };

      if (editId) {
        await certificateService.update(editId, payload);
        showToast('✅ Certificate updated in MongoDB!');
      } else {
        await certificateService.create(payload);
        showToast('✅ New certificate saved in MongoDB!');
      }

      setModalOpen(false);
      setFormData(emptyCert);
      setEditId(null);
      await fetchCertificates();
    } catch (err: any) {
      alert(err.message || 'Failed to save certificate.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certificate from MongoDB?')) return;
    try {
      await certificateService.delete(id);
      showToast('🗑️ Certificate removed from MongoDB.');
      await fetchCertificates();
    } catch (err: any) {
      alert(err.message || 'Failed to delete certificate.');
    }
  };

  return (
    <section id="certificates" className="py-5 bg-light position-relative">
      {toastMsg && (
        <div
          className="position-fixed top-0 end-0 m-4 z-3 alert alert-success shadow-lg border-0 rounded-4 px-4 py-3 d-flex align-items-center gap-2"
          style={{ animation: 'fadeIn 0.3s' }}
        >
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <span className="fw-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="container py-4">
        <div className="text-center position-relative mb-5">
          <span className="section-tag">Credentials & Badges</span>
          <h2 className="section-title">Certifications & Achievements</h2>
          <p className="section-lead">
            Recognized certifications validating specialized knowledge in modern programming frameworks, cloud infrastructure, and databases.
          </p>

          {editMode && (
            <div className="mt-3">
              <button
                onClick={handleOpenAdd}
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Add Certificate
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row g-4 justify-content-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="col-md-6 col-lg-4">
                <div className="custom-card p-0 overflow-hidden placeholder-glow">
                  <div className="bg-secondary bg-opacity-25" style={{ height: '200px' }}></div>
                  <div className="p-4">
                    <span className="placeholder col-4 mb-2"></span>
                    <h5 className="placeholder col-8 mb-3"></h5>
                    <p className="placeholder col-12"></p>
                    <p className="placeholder col-7"></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center mx-auto" style={{ maxWidth: '650px' }}>
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
              <h5 className="mb-0 fw-bold">Certificates Connection Error</h5>
            </div>
            <p className="mb-3 text-muted">{error}</p>
            <button onClick={fetchCertificates} className="btn btn-outline-danger btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-clockwise me-1"></i> Retry Loading
            </button>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && !error && certificates.length > 0 && (
          <div className="row g-4 justify-content-center">
            {certificates.map((cert) => (
              <div key={cert._id} className="col-md-6 col-lg-4">
                <div className="custom-card h-100 d-flex flex-column position-relative">
                  {editMode && (
                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-1 z-2">
                      <button
                        onClick={() => handleOpenEdit(cert)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Edit Certificate"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-pencil-fill text-primary"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Delete Certificate"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </button>
                    </div>
                  )}

                  <div className="cert-card-img position-relative">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title || cert.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <span
                      className="position-absolute top-0 start-0 m-3 badge bg-white text-primary border shadow-sm fw-semibold"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="bi bi-calendar-check me-1"></i> {cert.issueDate}
                    </span>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="mb-2">
                      <span className="text-primary small fw-semibold d-inline-flex align-items-center gap-1">
                        <i className="bi bi-award-fill"></i> {cert.issuingOrganization}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{cert.title || cert.name}</h5>

                    {cert.description && (
                      <p className="text-secondary small mb-3 flex-grow-1">
                        {cert.description}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {cert.skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="badge bg-light text-secondary border small fw-normal"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-top mt-auto d-flex align-items-center justify-content-between gap-2">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1 fw-medium"
                      >
                        <i className="bi bi-eye"></i> View Certificate
                      </button>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-light btn-sm rounded-pill px-3 py-2 border d-inline-flex align-items-center justify-content-center gap-1 fw-medium text-dark"
                        >
                          Verify <i className="bi bi-box-arrow-up-right small"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewCert && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1055 }}
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-0">{previewCert.title || previewCert.name}</h5>
                  <span className="text-muted small">
                    Issued by {previewCert.issuingOrganization} • {previewCert.issueDate}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setPreviewCert(null)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="rounded-3 overflow-hidden border shadow-sm mb-3">
                  <img
                    src={previewCert.imageUrl}
                    alt={previewCert.title || previewCert.name}
                    className="img-fluid w-100"
                    style={{ maxHeight: '420px', objectFit: 'contain', backgroundColor: '#f8fafc' }}
                  />
                </div>
                {previewCert.description && (
                  <p className="text-secondary small">{previewCert.description}</p>
                )}
                {previewCert.credentialUrl && (
                  <a
                    href={previewCert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary rounded-pill px-4 mt-2"
                  >
                    <i className="bi bi-patch-check me-1"></i> Verify Credential
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editId ? '✏️ Edit Certificate' : '➕ Add Certificate to MongoDB'}
                </h5>
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
                      <label className="form-label small fw-semibold">Certificate Title / Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.title || formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        placeholder="e.g. Meta Front-End Developer Specialization"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Issuing Organization</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.issuingOrganization || ''}
                        onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                        placeholder="e.g. Coursera / Meta / Google"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Issue Date</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.issueDate || ''}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        placeholder="e.g. Dec 2024"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Credential ID</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.certificateId || ''}
                        onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                        placeholder="e.g. CR-12345ABC"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Verification URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.credentialUrl || ''}
                        onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                        placeholder="https://coursera.org/verify/..."
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Skills Learned (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="React, JavaScript, UX/UI, REST API"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Brief Description</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={2}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Core topics, projects completed..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Certificate Image URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        required
                      />
                      <div className="mt-2">
                        <label className="btn btn-sm btn-outline-secondary rounded-pill cursor-pointer">
                          <i className="bi bi-upload me-1"></i> {uploading ? 'Uploading...' : 'Or Upload Certificate Image'}
                          <input
                            type="file"
                            accept="image/*"
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
                        <i className="bi bi-save me-1"></i> Save Certificate
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

export default Certificates;
