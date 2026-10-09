import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  admin: { name: string; email: string; role: string } | null;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, admin }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav
      className="navbar position-fixed top-0 end-0 px-4"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        height: 65,
        zIndex: 1039,
        left: 0,
        right: 0,
      }}
    >
      <div className="d-flex align-items-center gap-3 w-100">
        <button
          className="btn btn-light btn-sm rounded-2 border-0"
          onClick={onToggleSidebar}
          style={{ background: 'rgba(0,0,0,0.05)' }}
          id="sidebar-toggle"
        >
          <i className="bi bi-list fs-5" />
        </button>

        <span className="text-muted small d-none d-md-inline">
          <i className="bi bi-shield-check text-success me-1" />
          Portfolio CMS Admin
        </span>

        <div className="ms-auto d-flex align-items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary rounded-pill px-3 d-none d-md-inline-flex align-items-center gap-1"
          >
            <i className="bi bi-eye me-1" />
            Preview
          </a>

          <div className="dropdown">
            <button
              className="btn btn-sm border-0 d-flex align-items-center gap-2 rounded-3"
              data-bs-toggle="dropdown"
              id="admin-user-dropdown"
              style={{ background: 'rgba(13,110,253,0.08)' }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg,#0d6efd,#6f42c1)',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {admin?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-start d-none d-md-block">
                <div className="fw-semibold text-dark" style={{ fontSize: 13 }}>
                  {admin?.name || 'Admin'}
                </div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {admin?.role || 'admin'}
                </div>
              </div>
              <i className="bi bi-chevron-down text-muted" style={{ fontSize: 11 }} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-1">
              <li>
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-semibold small text-dark">{admin?.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{admin?.email}</div>
                </div>
              </li>
              <li>
                <a className="dropdown-item small py-2" href="/" target="_blank" rel="noreferrer">
                  <i className="bi bi-box-arrow-up-right me-2 text-primary" />View Portfolio
                </a>
              </li>
              <li>
                <a className="dropdown-item small py-2" href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer">
                  <i className="bi bi-journal-code me-2 text-info" />Swagger API Docs
                </a>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item small py-2 text-danger" onClick={handleLogout} id="logout-btn">
                  <i className="bi bi-box-arrow-right me-2" />Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
