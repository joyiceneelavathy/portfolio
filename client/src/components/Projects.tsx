import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import portfolioService, { projectService, uploadService } from '../services/api';

interface ProjectsProps {
  editMode?: boolean;
  onSelectProject?: (project: Project) => void;
}

const emptyProject: Partial<Project> = {
  title: '',
  description: '',
  fullDescription: '',
  technologies: ['React', 'TypeScript', 'Node.js'],
  imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  githubUrl: 'https://github.com',
  liveDemoUrl: 'https://example.com',
  category: 'Full-Stack',
  featured: false,
  order: 0,
};

export const Projects: React.FC<ProjectsProps> = ({ editMode = false }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Edit / Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>(emptyProject);
  const [techInput, setTechInput] = useState('React, TypeScript, Node.js');
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await portfolioService.getProjects();
      setProjects(res.data || []);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to connect to backend API for projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenAdd = () => {
    setFormData(emptyProject);
    setTechInput('React, TypeScript, Node.js');
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setFormData(project);
    setTechInput(project.technologies?.join(', ') || '');
    setEditId(project._id);
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
        showToast('🖼️ Project image uploaded!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload project thumbnail.');
    } finally {
      setUploading(false);
    }
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
        ...formData,
        technologies,
      };

      if (editId) {
        await projectService.update(editId, payload);
        showToast('✅ Project updated in MongoDB!');
      } else {
        await projectService.create(payload);
        showToast('✅ New project added to MongoDB!');
      }

      setModalOpen(false);
      setFormData(emptyProject);
      setEditId(null);
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project from MongoDB?')) return;
    try {
      await projectService.delete(id);
      showToast('🗑️ Project removed from MongoDB.');
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category || 'Other')))];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-5 bg-white position-relative">
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
          <span className="section-tag">Featured Works</span>
          <h2 className="section-title">My Projects</h2>
          <p className="section-lead">
            Real-world applications and academic projects created to solve tangible problems. Data loaded dynamically from Express REST API & MongoDB.
          </p>

          {editMode && (
            <div className="mt-3">
              <button
                onClick={handleOpenAdd}
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Add New Project
              </button>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 1 && !loading && !error && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-medium ${
                    activeFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row g-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="col-md-6 col-lg-4">
                <div className="custom-card p-0 overflow-hidden placeholder-glow">
                  <div className="bg-secondary bg-opacity-25" style={{ height: '220px' }}></div>
                  <div className="p-4">
                    <span className="placeholder col-4 mb-2"></span>
                    <h5 className="placeholder col-8 mb-3"></h5>
                    <p className="placeholder col-12"></p>
                    <p className="placeholder col-9 mb-4"></p>
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
              <h5 className="mb-0 fw-bold">Backend Connection Notice</h5>
            </div>
            <p className="mb-3 text-muted">{error}</p>
            <div className="d-flex justify-content-center gap-2">
              <button onClick={fetchProjects} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                <i className="bi bi-arrow-clockwise me-1"></i> Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="row g-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="col-md-6 col-lg-4">
                <div className="custom-card h-100 d-flex flex-column position-relative">
                  {editMode && (
                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-1 z-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Edit Project"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-pencil-fill text-primary"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="btn btn-sm btn-light border rounded-circle shadow-sm"
                        title="Delete Project"
                        style={{ width: 34, height: 34, padding: 0 }}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </button>
                    </div>
                  )}

                  <div className="project-card-img-wrap">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {project.category && (
                      <span className="project-category-badge">{project.category}</span>
                    )}
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold text-dark mb-2">{project.title}</h5>
                    <p className="text-secondary small mb-3 flex-grow-1" style={{ minHeight: '65px' }}>
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="d-flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="badge bg-light text-primary border border-primary-subtle fw-medium"
                            style={{ fontSize: '0.75rem' }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-top mt-auto d-flex align-items-center justify-content-between gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-dark btn-sm rounded-pill px-3 py-2 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1 fw-medium"
                      >
                        <i className="bi bi-github"></i> GitHub
                      </a>

                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm rounded-pill px-3 py-2 flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1 fw-medium"
                      >
                        <i className="bi bi-box-arrow-up-right"></i> Live Demo
                      </a>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="btn btn-light btn-sm rounded-circle p-2"
                        title="View Full Details"
                      >
                        <i className="bi bi-info-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">{selectedProject.title}</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setSelectedProject(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="rounded-3 overflow-hidden border shadow-sm mb-4">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="img-fluid w-100"
                    style={{ maxHeight: '350px', objectFit: 'cover' }}
                  />
                </div>
                <h6 className="fw-bold mb-2">Project Overview</h6>
                <p className="text-secondary mb-4">{selectedProject.fullDescription || selectedProject.description}</p>
                <h6 className="fw-bold mb-2">Stack & Technologies</h6>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {selectedProject.technologies.map((t, idx) => (
                    <span key={idx} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="d-flex gap-3">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-dark rounded-pill px-4"
                  >
                    <i className="bi bi-github me-1"></i> Repository
                  </a>
                  <a
                    href={selectedProject.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary rounded-pill px-4"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i> Open Live App
                  </a>
                </div>
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
                  {editId ? '✏️ Edit Project' : '➕ Add New Project to MongoDB'}
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
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Project Title</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. UsedMart E-Commerce Platform"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Full-Stack, Frontend, MERN"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Short Summary</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={2}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief overview shown on the card..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Full Detailed Description</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={formData.fullDescription || ''}
                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        placeholder="Detailed architecture, key features, solved problems..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="React, TypeScript, Express, MongoDB, Bootstrap"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">GitHub Repo URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.githubUrl || ''}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Live Demo / App URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={formData.liveDemoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                        placeholder="https://my-app.vercel.app"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Project Thumbnail Image URL</label>
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
                          <i className="bi bi-upload me-1"></i> {uploading ? 'Uploading...' : 'Or Upload Screenshot'}
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
                        <i className="bi bi-save me-1"></i> Save Project
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

export default Projects;
