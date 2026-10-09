import React, { useState, useEffect } from 'react';
import { educationService } from '../services/api';
import { Education as EducationType } from '../types';

interface EducationProps {
  editMode?: boolean;
}

const emptyEdu: Partial<EducationType> = {
  degree: '',
  department: '',
  institution: '',
  startYear: '',
  endYear: '',
  percentageOrCgpa: '',
  description: '',
  order: 0,
};

export const Education: React.FC<EducationProps> = ({ editMode = false }) => {
  const [educationList, setEducationList] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<EducationType>>(emptyEdu);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await educationService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setEducationList(res.data);
      }
    } catch (err) {
      console.error('Failed to load education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setForm(emptyEdu);
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: EducationType) => {
    setForm(item);
    setEditId(item._id || null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await educationService.update(editId, form);
        showToast('✅ Education updated in MongoDB!');
      } else {
        await educationService.create(form);
        showToast('✅ New education added to MongoDB!');
      }
      setModalOpen(false);
      setForm(emptyEdu);
      setEditId(null);
      await fetchEducation();
    } catch (err: any) {
      alert(err.message || 'Failed to save education to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await educationService.delete(id);
      showToast('🗑️ Education deleted from MongoDB.');
      await fetchEducation();
    } catch (err: any) {
      alert(err.message || 'Failed to delete education.');
    }
  };

  return (
    <section id="education" className="py-5 bg-white position-relative">
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
          <span className="section-tag">Academic Background</span>
          <h2 className="section-title">Education & Qualifications</h2>
          <p className="section-lead">
            Formal education, academic performance, and foundational training in technology.
          </p>

          {editMode && (
            <div className="mt-3">
              <button
                onClick={handleOpenAdd}
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Add Education Entry
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-primary"></span>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {educationList.map((item) => (
              <div key={item._id} className="col-lg-6">
                <div className="custom-card p-4 h-100 border-start border-primary border-4 position-relative">
                  {editMode && (
                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="btn btn-sm btn-outline-primary rounded-circle"
                        title="Edit Education"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        title="Delete Education"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.startYear} - {item.endYear || 'Present'}
                    </span>
                    {item.percentageOrCgpa && (
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold">
                        CGPA / %: {item.percentageOrCgpa}
                      </span>
                    )}
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{item.degree}</h4>
                  <h6 className="text-primary fw-medium mb-2">{item.department}</h6>
                  <p className="text-muted fw-semibold mb-3">
                    <i className="bi bi-building me-1"></i> {item.institution}
                  </p>

                  {item.description && (
                    <p className="text-secondary small mb-0">{item.description}</p>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editId ? '✏️ Edit Education' : '➕ Add Education'}
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
                      <label className="form-label small fw-semibold">Degree / Program</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.degree || ''}
                        onChange={(e) => setForm({ ...form, degree: e.target.value })}
                        placeholder="e.g. B.Tech in Information Technology"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department / Major</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.department || ''}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        placeholder="e.g. Information Technology"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">College / University / School</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.institution || ''}
                        onChange={(e) => setForm({ ...form, institution: e.target.value })}
                        placeholder="e.g. Chennai Institute of Technology"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Start Year</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.startYear || ''}
                        onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                        placeholder="2022"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">End Year</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.endYear || ''}
                        onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                        placeholder="2026 or Present"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">CGPA or Percentage</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.percentageOrCgpa || ''}
                        onChange={(e) => setForm({ ...form, percentageOrCgpa: e.target.value })}
                        placeholder="e.g. 8.7 CGPA / 87%"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description / Key Coursework</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={form.description || ''}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Specialization, academic focus, relevant achievements..."
                      ></textarea>
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
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> Save to Database
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

export default Education;
