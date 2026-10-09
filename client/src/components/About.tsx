import React, { useState, useEffect } from 'react';
import { Profile, About as AboutType } from '../types';
import { aboutService, profileService } from '../services/api';

interface AboutProps {
  profile: Profile | null;
  editMode?: boolean;
  onProfileUpdated?: (updated: Profile) => void;
}

export const About: React.FC<AboutProps> = ({ profile, editMode = false, onProfileUpdated }) => {
  const [aboutData, setAboutData] = useState<Partial<AboutType>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [formAbout, setFormAbout] = useState<Partial<AboutType>>({});
  const [formProfile, setFormProfile] = useState<{ degree?: string; location?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchAbout = async () => {
    try {
      const res = await aboutService.get();
      if (res.success && res.data) {
        setAboutData(res.data);
      }
    } catch (err) {
      console.warn('Could not load about data:', err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenEdit = () => {
    setFormAbout({
      title: aboutData.title || 'About Me',
      description: aboutData.description || profile?.aboutDescription || '',
      careerGoal: aboutData.careerGoal || '',
      professionalSummary: aboutData.professionalSummary || '',
      personalIntroduction: aboutData.personalIntroduction || '',
    });
    setFormProfile({
      degree: profile?.education || profile?.subtitle || 'B.Tech Information Technology',
      location: profile?.location || 'Tamil Nadu, India',
      email: profile?.email || 'joyiceneelavathy@gmail.com',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const aboutRes = await aboutService.update(formAbout);
      if (aboutRes.success) {
        setAboutData(aboutRes.data);
      }

      if (profile) {
        const profRes = await profileService.update({
          ...profile,
          education: formProfile.degree,
          subtitle: formProfile.degree,
          location: formProfile.location,
          email: formProfile.email,
        });
        if (profRes.success && profRes.data) {
          onProfileUpdated?.(profRes.data);
        }
      }

      showToast('✅ About information saved in MongoDB!');
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save about details.');
    } finally {
      setSaving(false);
    }
  };

  const careerInterests = profile?.careerInterests || [
    'Full-Stack Web Development',
    'Cloud Computing & DevOps',
    'API Architecture & Microservices',
    'Applied Machine Learning / AI',
  ];

  const title = aboutData.title || 'About Me';
  const desc =
    aboutData.description ||
    profile?.aboutDescription ||
    'I am a passionate software developer focused on modern web architectures, cloud applications, and responsive design.';
  const profSummary =
    aboutData.professionalSummary ||
    'Ambitious and disciplined Information Technology undergraduate with a solid conceptual foundation in computer science and modern full-stack web engineering.';
  const careerGoal =
    aboutData.careerGoal ||
    'To innovate and build reliable, user-focused digital systems while expanding expertise in high-performance cloud backends and responsive frontend interfaces.';
  const personalIntro =
    aboutData.personalIntroduction ||
    'Hello! I am Joyice Neelavathy, an undergraduate pursuing my B.Tech in Information Technology. I have developed a strong passion for designing and engineering clean, efficient, and user-centric web applications.';

  return (
    <section id="about" className="py-5 bg-white position-relative">
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
            <i className="bi bi-pencil-square"></i> Edit About Section
          </button>
        </div>
      )}

      <div className="container py-4">
        <div className="text-center">
          <span className="section-tag">Discover More</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-lead">
            Get to know my academic background, technical ambitions, and enthusiasm for building modern web solutions.
          </p>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="pe-lg-4">
              <h3 className="h4 text-dark fw-bold mb-3">
                Aspiring Full-Stack Developer & Tech Enthusiast
              </h3>
              <p className="text-secondary mb-3">{personalIntro}</p>
              <p className="text-secondary mb-4">{desc}</p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 rounded-3 bg-light border border-light-subtle">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-mortarboard-fill text-primary fs-5"></i>
                      <span className="fw-semibold text-dark">Degree</span>
                    </div>
                    <p className="small text-muted mb-0">
                      {profile?.education || profile?.subtitle || 'B.Tech Information Technology'}
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-3 bg-light border border-light-subtle">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                      <span className="fw-semibold text-dark">Location</span>
                    </div>
                    <p className="small text-muted mb-0">{profile?.location || 'Tamil Nadu, India'}</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-3 bg-light border border-light-subtle">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-envelope-check-fill text-success fs-5"></i>
                      <span className="fw-semibold text-dark">Email</span>
                    </div>
                    <p className="small text-muted mb-0 text-truncate">
                      {profile?.email || 'joyiceneelavathy@gmail.com'}
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-3 bg-light border border-light-subtle">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-briefcase-fill text-info fs-5"></i>
                      <span className="fw-semibold text-dark">Employment Status</span>
                    </div>
                    <p className="small text-muted mb-0">Open for Internships</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="ps-lg-3">
              {/* Professional Summary Card */}
              <div className="custom-card p-4 mb-4 border-start border-primary border-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-shield-check text-primary"></i> Professional Summary
                </h5>
                <p className="text-secondary small mb-0">{profSummary}</p>
              </div>

              {/* Career Objectives Card */}
              <div className="custom-card p-4 mb-4 border-start border-success border-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-bullseye text-success"></i> Career Objectives
                </h5>
                <p className="text-secondary small mb-0">{careerGoal}</p>
              </div>

              {/* Career Interests Badges */}
              <div className="custom-card p-4">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-stars text-warning"></i> Key Technical Focus Areas
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {careerInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-primary border border-primary-subtle px-3 py-2 rounded-pill small fw-semibold"
                    >
                      <i className="bi bi-check2 me-1"></i>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit About Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">✏️ Edit About & Career Details</h5>
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
                      <label className="form-label small fw-semibold">Section Heading Title</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formAbout.title || ''}
                        onChange={(e) => setFormAbout({ ...formAbout, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Personal Introduction</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={formAbout.personalIntroduction || ''}
                        onChange={(e) => setFormAbout({ ...formAbout, personalIntroduction: e.target.value })}
                        placeholder="Hello! I am..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">About / Technical Journey Description</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={formAbout.description || ''}
                        onChange={(e) => setFormAbout({ ...formAbout, description: e.target.value })}
                        placeholder="My journey in technology combines..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Professional Summary</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={formAbout.professionalSummary || ''}
                        onChange={(e) => setFormAbout({ ...formAbout, professionalSummary: e.target.value })}
                        placeholder="Ambitious and disciplined..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Career Goals</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={2}
                        value={formAbout.careerGoal || ''}
                        onChange={(e) => setFormAbout({ ...formAbout, careerGoal: e.target.value })}
                        placeholder="What are your career aspirations?"
                      ></textarea>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Degree</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formProfile.degree || ''}
                        onChange={(e) => setFormProfile({ ...formProfile, degree: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Location</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={formProfile.location || ''}
                        onChange={(e) => setFormProfile({ ...formProfile, location: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Contact Email</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        value={formProfile.email || ''}
                        onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
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

export default About;
