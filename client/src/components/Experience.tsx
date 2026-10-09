import React, { useState, useEffect } from 'react';
import { experienceService } from '../services/api';
import { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  editMode?: boolean;
}

const emptyExp: Partial<ExperienceType> = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  description: '',
  technologies: ['React', 'Node.js', 'TypeScript'],
  order: 0,
};

export const Experience: React.FC<ExperienceProps> = ({ editMode = false }) => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<ExperienceType>>(emptyExp);
  const [techInput, setTechInput] = useState('React, Node.js, TypeScript');
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await experienceService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setForm(emptyExp);
    setTechInput('React, Node.js, TypeScript');
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (exp: ExperienceType) => {
    setForm(exp);
    setTechInput(exp.technologies?.join(', ') || '');
    setEditId(exp._id || null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const technologies = techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        technologies,
      };

      if (editId) {
        await experienceService.update(editId, payload);
        showToast('✅ Experience updated in MongoDB!');
      } else {
        await experienceService.create(payload);
        showToast('✅ New experience added to MongoDB!');
      }

      setModalOpen(false);
      setForm(emptyExp);
      setEditId(null);
      await fetchExperiences();
    } catch (err: any) {
      alert(err.message || 'Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Delete this experience entry from MongoDB?')) return;
    try {
      await experienceService.delete(id);
      showToast('🗑️ Experience deleted from MongoDB.');
      await fetchExperiences();
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience.');
    }
  };

  if (!loading && experiences.length === 0 && !editMode) {
    return null;
  }

  return (
    <section id="experience" className="py-5 bg-white position-relative">
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
          <span className="section-tag">Career Milestones</span>
          <h2 className="section-title">Work & Internship Experience</h2>
          <p className="section-lead">
            Hands-on development experience, practical engineering internships, and organizational projects.
          </p>

          {editMode && (
            <div className="mt-3">
              <button
                onClick={handleOpenAdd}
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Add Experience
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-primary"></span>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-briefcase fs-1 d-block mb-2 text-secondary opacity-50"></i>
            <h6>No experience entries added yet</h6>
            {editMode && (
              <button onClick={handleOpenAdd} className="btn btn-outline-primary btn-sm rounded-pill mt-2">
                + Add Experience
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {experiences.map((exp) => (
              <div key={exp._id} className="col-lg-6">
                <div className="custom-card p-4 h-100 border-start border-success border-4 position-relative">
                  {editMode && (
                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-1 z-2">
                      <button
                        onClick={() => handleOpenEdit(exp)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Edit Experience"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-pencil-fill text-primary"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Delete Experience"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold">
                      <i className="bi bi-calendar-event me-1"></i>
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate || 'Present'}
                    </span>
                    {exp.currentlyWorking && (
                      <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">Current</span>
                    )}
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{exp.title}</h4>
                  <h6 className="text-primary fw-medium mb-1">
                    <i className="bi bi-building me-1"></i> {exp.company}
                  </h6>
                  {exp.location && (
                    <p className="text-muted small mb-3">
                      <i className="bi bi-geo-alt me-1"></i> {exp.location}
                    </p>
                  )}

                  <p className="text-secondary small mb-3">{exp.description}</p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-auto pt-2 border-top">
                      {exp.technologies.map((t, idx) => (
                        <span key={idx} className="badge bg-light text-secondary border small">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  {editId ? '✏️ Edit Experience' : '➕ Add Experience to MongoDB'}
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
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Job Title / Role</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.title || ''}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Full-Stack Developer Intern"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Company / Organization</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.company || ''}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Tech Solutions Inc."
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Location</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.location || ''}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Remote / Chennai, India"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Start Date</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.startDate || ''}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        placeholder="e.g. Jan 2024"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">End Date</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.endDate || ''}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        placeholder="e.g. Jun 2024"
                        disabled={form.currentlyWorking}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="currentlyWorking"
                          checked={form.currentlyWorking || false}
                          onChange={(e) => setForm({ ...form, currentlyWorking: e.target.checked })}
                        />
                        <label className="form-check-label small" htmlFor="currentlyWorking">
                          I currently work here
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description / Key Achievements</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Key responsibilities, features developed, impact..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Technologies Used (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="React, Node.js, MongoDB, Express"
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
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving to MongoDB...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> Save Experience
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

export default Experience;
