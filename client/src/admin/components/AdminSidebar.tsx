import React from 'react';
import { AdminSection } from '../pages/AdminDashboard';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  isOpen: boolean;
  onToggle: () => void;
  unreadMessages: number;
}

const navItems: { section: AdminSection; label: string; icon: string }[] = [
  { section: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { section: 'profile', label: 'Profile', icon: 'bi-person-circle' },
  { section: 'about', label: 'About', icon: 'bi-info-circle' },
  { section: 'education', label: 'Education', icon: 'bi-mortarboard' },
  { section: 'skills', label: 'Skills', icon: 'bi-code-slash' },
  { section: 'projects', label: 'Projects', icon: 'bi-folder2-open' },
  { section: 'certificates', label: 'Certificates', icon: 'bi-patch-check' },
  { section: 'experience', label: 'Experience', icon: 'bi-briefcase' },
  { section: 'services', label: 'Services', icon: 'bi-gear' },
  { section: 'resume', label: 'Resume', icon: 'bi-file-earmark-person' },
  { section: 'contact', label: 'Messages', icon: 'bi-envelope' },
  { section: 'social-links', label: 'Social Links', icon: 'bi-share' },
  { section: 'settings', label: 'Settings', icon: 'bi-sliders' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onNavigate,
  isOpen,
  unreadMessages,
}) => {
  return (
    <div
      className="d-flex flex-column position-fixed top-0 start-0 h-100"
      style={{
        width: isOpen ? 260 : 70,
        background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
        transition: 'width 0.3s ease',
        zIndex: 1040,
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div
        className="d-flex align-items-center px-3 py-4 border-bottom"
        style={{ borderColor: 'rgba(255,255,255,0.06) !important', minHeight: 70 }}
      >
        <div
          className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
          }}
        >
          <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: 16 }} />
        </div>
        {isOpen && (
          <div className="ms-3 overflow-hidden">
            <div className="text-white fw-bold" style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
              Portfolio CMS
            </div>
            <div className="text-secondary" style={{ fontSize: 11 }}>
              Admin Dashboard
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-grow-1 py-2 overflow-y-auto" style={{ overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.section;
          const isContact = item.section === 'contact';
          return (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className="d-flex align-items-center w-100 border-0 position-relative"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, rgba(13,110,253,0.2), rgba(111,66,193,0.1))'
                  : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                padding: '10px 16px',
                borderLeft: isActive ? '3px solid #0d6efd' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                gap: 12,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              <i
                className={`bi ${item.icon} flex-shrink-0`}
                style={{ fontSize: 18, width: 22, textAlign: 'center' }}
              />
              {isOpen && (
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
              {isContact && unreadMessages > 0 && isOpen && (
                <span
                  className="badge rounded-pill ms-auto"
                  style={{ background: '#dc3545', fontSize: 10 }}
                >
                  {unreadMessages}
                </span>
              )}
              {isContact && unreadMessages > 0 && !isOpen && (
                <span
                  className="badge rounded-circle position-absolute"
                  style={{
                    background: '#dc3545',
                    fontSize: 9,
                    top: 6,
                    right: 6,
                    width: 16,
                    height: 16,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom link */}
      <div className="border-top p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="d-flex align-items-center gap-2 text-decoration-none"
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}
        >
          <i className="bi bi-box-arrow-up-right" style={{ fontSize: 15 }} />
          {isOpen && <span>View Portfolio</span>}
        </a>
      </div>
    </div>
  );
};

export default AdminSidebar;
