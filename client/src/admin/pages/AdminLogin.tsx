import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d6efd22 100%)',
      }}
    >
      <div className="container" style={{ maxWidth: 420 }}>
        {/* Card */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{ background: 'rgba(22,27,34,0.98)', backdropFilter: 'blur(20px)' }}
        >
          {/* Top accent */}
          <div
            style={{
              height: 4,
              background: 'linear-gradient(90deg, #0d6efd, #6f42c1, #0dcaf0)',
            }}
          />
          <div className="card-body p-5">
            {/* Logo */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                style={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
                }}
              >
                <i className="bi bi-shield-lock-fill text-white fs-4" />
              </div>
              <h4 className="text-white fw-bold mb-1">Portfolio CMS</h4>
              <p className="text-secondary small mb-0">Admin Dashboard Login</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small border-0 rounded-3">
                <i className="bi bi-exclamation-triangle-fill" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-medium mb-1">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope-fill" />
                  </span>
                  <input
                    type="email"
                    id="admin-email"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="admin@portfolio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderLeft: 'none' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-medium mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock-fill" />
                  </span>
                  <input
                    type="password"
                    id="admin-password"
                    className="form-control bg-dark border-secondary text-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderLeft: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="admin-login-btn"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3"
                style={{
                  background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
                  border: 'none',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-top border-secondary">
              <p className="text-secondary small text-center mb-2">Default credentials:</p>
              <div className="bg-dark rounded-3 p-2 text-center">
                <code className="text-info small">admin@portfolio.com</code>
                <span className="text-secondary mx-2">/</span>
                <code className="text-warning small">admin123</code>
              </div>
            </div>

            <div className="mt-3 text-center">
              <a href="/" className="text-secondary small text-decoration-none">
                <i className="bi bi-arrow-left me-1" />
                Back to Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
