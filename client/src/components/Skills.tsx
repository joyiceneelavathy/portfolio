import React, { useState, useEffect } from 'react';
import { skillService } from '../services/api';
import { Skill } from '../types';

interface SkillsProps {
  editMode?: boolean;
}

const emptySkill: Partial<Skill> = {
  name: '',
  category: 'Frontend',
  level: 'Advanced',
  percentage: 85,
  icon: 'bi-code-slash',
  order: 0,
};

const skillCategories = ['Frontend', 'Backend', 'Database', 'Programming Languages', 'Tools & Platforms', 'Other'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const Skills: React.FC<SkillsProps> = ({ editMode = false }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Skill>>(emptySkill);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setSkills(res.data);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setForm(emptySkill);
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setForm(skill);
    setEditId(skill._id || null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await skillService.update(editId, form);
        showToast('✅ Skill updated in MongoDB!');
      } else {
        await skillService.create(form);
        showToast('✅ New skill saved in MongoDB!');
      }
      setModalOpen(false);
      setForm(emptySkill);
      setEditId(null);
      await fetchSkills();
    } catch (err: any) {
      alert(err.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Delete this skill from MongoDB?')) return;
    try {
      await skillService.delete(id);
      showToast('🗑️ Skill deleted from MongoDB.');
      await fetchSkills();
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill.');
    }
  };

  // Derive categories dynamically from skills
  const availableCategories = ['All', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="skills" className="py-5 bg-light position-relative">
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
          <span className="section-tag">Technical Competencies</span>
          <h2 className="section-title">My Skills & Toolset</h2>
          <p className="section-lead">
            Dynamic skillset managed directly through MongoDB. Proficiencies, libraries, and tools.
          </p>

          {editMode && (
            <div className="mt-3">
              <button
                onClick={handleOpenAdd}
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Add New Skill
              </button>
            </div>
          )}

          {/* Filter Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm rounded-pill px-3 py-2 fw-medium transition ${
                  activeCategory === cat
                    ? 'btn-primary shadow-sm'
                    : 'btn-outline-secondary bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-primary"></span>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-code-slash fs-1 d-block mb-2 text-secondary opacity-50"></i>
            <h6>No skills found in this category</h6>
            {editMode && (
              <button onClick={handleOpenAdd} className="btn btn-outline-primary btn-sm rounded-pill mt-2">
                + Add One Now
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filteredSkills.map((skill) => (
              <div key={skill._id || skill.name} className="col-md-6 col-lg-4 col-xl-3">
                <div className="skill-card p-4 h-100 d-flex flex-column justify-content-between position-relative">
                  {editMode && (
                    <div className="position-absolute top-0 end-0 m-2 d-flex gap-1 z-2">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="btn btn-sm btn-light border rounded-circle"
                        title="Edit Skill"
                        style={{ width: 30, height: 30, padding: 0 }}
                      >
                        <i className="bi bi-pencil-fill text-primary" style={{ fontSize: 12 }}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="btn btn-sm btn-light border rounded-circle"
                        title="Delete Skill"
                        style={{ width: 30, height: 30, padding: 0 }}
                      >
                        <i className="bi bi-trash-fill text-danger" style={{ fontSize: 12 }}></i>
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="skill-icon-wrapper">
                        <i className={`bi ${skill.icon || 'bi-code-slash'} skill-icon`}></i>
                      </div>
                      <span className="badge bg-light text-primary border rounded-pill small fw-semibold">
                        {skill.level}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-1">{skill.name}</h5>
                    <span className="text-muted small d-block mb-3">{skill.category}</span>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Proficiency</span>
                      <span className="fw-semibold text-primary">{skill.percentage}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${skill.percentage}%` }}
                        aria-valuenow={skill.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editId ? '✏️ Edit Skill' : '➕ Add Skill to MongoDB'}
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
                      <label className="form-label small fw-semibold">Skill Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. React.js, Python, MongoDB"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select rounded-3"
                        value={form.category || 'Frontend'}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {skillCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Proficiency Level</label>
                      <select
                        className="form-select rounded-3"
                        value={form.level || 'Advanced'}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                      >
                        {skillLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Percentage (0 - 100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control rounded-3"
                        value={form.percentage || 80}
                        onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Bootstrap Icon</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className={`bi ${form.icon || 'bi-code-slash'}`}></i>
                        </span>
                        <input
                          type="text"
                          className="form-control rounded-end-3"
                          value={form.icon || 'bi-code-slash'}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                          placeholder="bi-code-slash"
                        />
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
                        <span className="spinner-border spinner-border-sm me-2"></span> Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> Save Skill
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

export default Skills;
