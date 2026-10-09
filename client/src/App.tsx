import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Profile } from './types';
import portfolioService from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';

// Portfolio Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Experience from './components/Experience';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin CMS Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// Protected Route Guard for /admin
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <span className="spinner-border text-primary" role="status"></span>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// ─── Live Dynamic Portfolio View ──────────────────────────────────────────
const PortfolioHome: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Quick Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@portfolio.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await portfolioService.getProfile();
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggleEditMode = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    } else {
      setEditMode((prev) => !prev);
    }
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      await login(loginEmail, loginPassword);
      setLoginModalOpen(false);
      setEditMode(true);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="portfolio-app min-vh-100 d-flex flex-column">
      {/* Sticky Live Edit Indicator Bar */}
      {editMode && (
        <div
          className="position-sticky top-0 start-0 end-0 z-3 py-2 px-3 bg-warning text-dark border-bottom border-dark border-opacity-10 shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-2"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="spinner-grow spinner-grow-sm text-dark" role="status"></span>
            <strong>⚡ Live On-Page Edit Mode Active:</strong>
            <span className="small text-dark text-opacity-75 d-none d-md-inline">
              Every section has active edit buttons. All updates are saved directly into MongoDB in real time.
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/admin" className="btn btn-dark btn-sm rounded-pill px-3 py-1 fw-semibold">
              <i className="bi bi-grid-fill me-1"></i> Open CMS Dashboard
            </Link>
            <button
              onClick={() => setEditMode(false)}
              className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 fw-semibold"
            >
              <i className="bi bi-check-lg me-1"></i> Exit Edit Mode
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        editMode={editMode}
        onToggleEditMode={handleToggleEditMode}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow-1">
        <Hero
          profile={profile}
          editMode={editMode}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
        <About
          profile={profile}
          editMode={editMode}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
        <Education editMode={editMode} />
        <Skills editMode={editMode} />
        <Projects editMode={editMode} />
        <Certificates editMode={editMode} />
        <Experience editMode={editMode} />
        <Resume
          profile={profile}
          editMode={editMode}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
        <Contact profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} editMode={editMode} />

      {/* Floating Buttons: Edit Mode Quick Switch & Swagger Docs */}
      <div className="position-fixed bottom-0 end-0 m-4 z-3 d-flex flex-column gap-2 align-items-end">
        {/* Toggle Live Edit Floating Button */}
        <button
          onClick={handleToggleEditMode}
          className={`btn rounded-pill shadow-lg py-2 px-3 d-inline-flex align-items-center gap-2 border border-white fw-bold ${
            editMode ? 'btn-warning text-dark' : 'btn-dark text-white'
          }`}
          style={{ fontSize: '0.85rem' }}
          title="Toggle On-Page Dynamic Editing"
        >
          <i className={`bi ${editMode ? 'bi-pencil-fill' : 'bi-pencil-square'}`}></i>
          <span>{editMode ? 'Edit Mode ON' : 'Edit On Webpage'}</span>
        </button>

        {/* Swagger OpenAPI Docs */}
        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary rounded-pill shadow-lg py-2 px-3 d-inline-flex align-items-center gap-2 border border-white"
          style={{ fontSize: '0.85rem' }}
          title="Open Swagger OpenAPI Documentation"
        >
          <span className="badge bg-white text-primary rounded-pill px-2 py-1 fw-bold">API</span>
          <span>Swagger Docs</span>
          <i className="bi bi-box-arrow-up-right"></i>
        </a>
      </div>

      {/* Quick Admin Login Modal */}
      {loginModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div
                style={{
                  height: 4,
                  background: 'linear-gradient(90deg, #0d6efd, #6f42c1, #0dcaf0)',
                }}
              />
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-pencil-square fs-5"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Unlock Live Edit Mode</h5>
                    <p className="text-muted small mb-0">Sign in to change portfolio data directly on the page</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setLoginModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleQuickLogin}>
                <div className="modal-body p-4">
                  {loginError && (
                    <div className="alert alert-danger py-2 small rounded-3 mb-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {loginError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Admin Email</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Admin Password</label>
                    <input
                      type="password"
                      className="form-control rounded-3"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* 1-Click Fill Demo Credentials Button */}
                  <div className="p-3 bg-light rounded-3 mb-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <div className="small fw-semibold text-dark">Default Admin Account</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>
                        admin@portfolio.com / admin123
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => {
                        setLoginEmail('admin@portfolio.com');
                        setLoginPassword('admin123');
                      }}
                    >
                      Auto-Fill
                    </button>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setLoginModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={loggingIn}
                  >
                    {loggingIn ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Unlocking...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-unlock-fill me-1"></i> Unlock & Edit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main App with Routing ────────────────────────────────────────────────
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Full Admin CMS Dashboard Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Live Dynamic Portfolio View */}
        <Route path="/*" element={<PortfolioHome />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
