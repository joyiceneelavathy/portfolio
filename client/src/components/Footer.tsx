import React, { useState, useEffect } from 'react';
import { Profile, SocialLink } from '../types';
import { socialLinkService } from '../services/api';

interface FooterProps {
  profile: Profile | null;
  editMode?: boolean;
}

const emptyLink: Partial<SocialLink> = {
  platform: 'GitHub',
  url: '',
  icon: 'bi-github',
  order: 0,
};

export const Footer: React.FC<FooterProps> = ({ profile, editMode = false }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<SocialLink>>(emptyLink);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchLinks = async () => {
    try {
      const res = await socialLinkService.getAll();
      if (res.success && Array.isArray(res.data)) {
        setSocialLinks(res.data);
      }
    } catch (err) {
      console.warn('Could not load social links:', err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenAdd = () => {
    setForm(emptyLink);
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setForm(link);
    setEditId(link._id || null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await socialLinkService.update(editId, form);
      } else {
        await socialLinkService.create(form);
      }
      setModalOpen(false);
      setForm(emptyLink);
      setEditId(null);
      await fetchLinks();
    } catch (err: any) {
      alert(err.message || 'Failed to save social link.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Delete this social link?')) return;
    try {
      await socialLinkService.delete(id);
      await fetchLinks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete link.');
    }
  };

  const currentYear = new Date().getFullYear();
  const name = profile?.name || 'Joyice Neelavathy';
  const email = profile?.email || 'joyiceneelavathy@gmail.com';

  return (
    <footer className="footer-styled position-relative">
      <div className="container">
        <div className="row g-4 justify-content-between align-items-center pb-4 border-bottom border-secondary border-opacity-25">
          <div className="col-md-6 text-center text-md-start">
            <h4 className="fw-bold text-white mb-1">
              {name}<span className="text-primary">.</span>
            </h4>
            <p className="text-secondary small mb-0">
              {profile?.subtitle || 'B.Tech Information Technology Student • Aspiring Full-Stack Developer'}
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-2 flex-wrap">
              {socialLinks.map((link) => (
                <div key={link._id || link.platform} className="d-inline-flex align-items-center">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-circle-btn"
                    title={link.platform}
                  >
                    <i className={`bi ${link.icon || 'bi-link'}`}></i>
                  </a>
                  {editMode && (
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="btn btn-sm btn-danger rounded-circle p-0 ms-1"
                      style={{ width: 18, height: 18, fontSize: 10, lineHeight: 1 }}
                      title="Delete this link"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {/* Default fallbacks if no links loaded yet */}
              {socialLinks.length === 0 && (
                <>
                  <a
                    href={profile?.githubUrl || 'https://github.com/joyiceneelavathy'}
                    target="_blank"
                    rel="noreferrer"
                    className="social-circle-btn"
                    title="GitHub"
                  >
                    <i className="bi bi-github"></i>
                  </a>
                  <a
                    href={profile?.linkedinUrl || 'https://linkedin.com/in/joyice-neelavathy'}
                    target="_blank"
                    rel="noreferrer"
                    className="social-circle-btn"
                    title="LinkedIn"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href={`mailto:${email}`} className="social-circle-btn" title="Email">
                    <i className="bi bi-envelope-fill"></i>
                  </a>
                </>
              )}

              <a
                href="http://localhost:5000/api-docs"
                target="_blank"
                rel="noreferrer"
                className="social-circle-btn"
                title="Swagger OpenAPI Documentation"
              >
                <i className="bi bi-file-earmark-code"></i>
              </a>

              {editMode && (
                <button
                  onClick={handleOpenAdd}
                  className="btn btn-sm btn-outline-light rounded-pill px-2 py-1 ms-2"
                  style={{ fontSize: '11px' }}
                >
                  <i className="bi bi-plus"></i> Add Link
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="row pt-4 align-items-center text-center text-md-start">
          <div className="col-md-6 text-secondary small mb-2 mb-md-0">
            © {currentYear} {name}. All rights reserved. Dynamic full-stack portfolio connected to MongoDB.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0 small">
              <li className="list-inline-item">
                <a href="#home" className="footer-link">Home</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#about" className="footer-link">About</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#education" className="footer-link">Education</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#projects" className="footer-link">Projects</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#contact" className="footer-link">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Social Link Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg text-dark">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editId ? '✏️ Edit Social Link' : '➕ Add Social Link to MongoDB'}
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
                      <label className="form-label small fw-semibold">Platform Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={form.platform || ''}
                        onChange={(e) => setForm({ ...form, platform: e.target.value })}
                        placeholder="e.g. GitHub, LinkedIn, Twitter"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Profile URL</label>
                      <input
                        type="url"
                        className="form-control rounded-3"
                        value={form.url || ''}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Bootstrap Icon Class</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className={`bi ${form.icon || 'bi-link'}`}></i>
                        </span>
                        <input
                          type="text"
                          className="form-control rounded-end-3"
                          value={form.icon || ''}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                          placeholder="bi-github, bi-linkedin, bi-twitter-x"
                          required
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
                    {saving ? 'Saving...' : 'Save Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
