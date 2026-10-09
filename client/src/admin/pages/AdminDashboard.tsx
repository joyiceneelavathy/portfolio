import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  profileService,
  aboutService,
  educationService,
  skillService,
  projectService,
  certificateService,
  experienceService,
  serviceService,
  resumeService,
  contactService,
  socialLinkService,
  settingsService,
} from '../../services/api';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import ProfileManager from '../sections/ProfileManager';
import AboutManager from '../sections/AboutManager';
import EducationManager from '../sections/EducationManager';
import SkillManager from '../sections/SkillManager';
import ProjectManager from '../sections/ProjectManager';
import CertificateManager from '../sections/CertificateManager';
import ExperienceManager from '../sections/ExperienceManager';
import ServiceManager from '../sections/ServiceManager';
import ResumeManager from '../sections/ResumeManager';
import ContactMessages from '../sections/ContactMessages';
import SocialLinkManager from '../sections/SocialLinkManager';
import SettingsManager from '../sections/SettingsManager';

export type AdminSection =
  | 'dashboard'
  | 'profile'
  | 'about'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'experience'
  | 'services'
  | 'resume'
  | 'contact'
  | 'social-links'
  | 'settings';

interface DashboardStats {
  projects: number;
  certificates: number;
  skills: number;
  education: number;
  experience: number;
  services: number;
  unreadMessages: number;
}

const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0, certificates: 0, skills: 0,
    education: 0, experience: 0, services: 0, unreadMessages: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, cert, skill, edu, exp, svc, msgs] = await Promise.allSettled([
          projectService.getAll(),
          certificateService.getAll(),
          skillService.getAll(),
          educationService.getAll(),
          experienceService.getAll(),
          serviceService.getAll(),
          contactService.getAll(),
        ]);

        setStats({
          projects: proj.status === 'fulfilled' ? (proj.value.count || proj.value.data?.length || 0) : 0,
          certificates: cert.status === 'fulfilled' ? (cert.value.count || cert.value.data?.length || 0) : 0,
          skills: skill.status === 'fulfilled' ? (skill.value.count || skill.value.data?.length || 0) : 0,
          education: edu.status === 'fulfilled' ? (edu.value.count || edu.value.data?.length || 0) : 0,
          experience: exp.status === 'fulfilled' ? (exp.value.count || exp.value.data?.length || 0) : 0,
          services: svc.status === 'fulfilled' ? (svc.value.count || svc.value.data?.length || 0) : 0,
          unreadMessages: msgs.status === 'fulfilled' ? (msgs.value.unreadCount || 0) : 0,
        });
      } catch (err) {
        console.warn('Could not load stats', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview stats={stats} loading={statsLoading} onNavigate={setActiveSection} />;
      case 'profile': return <ProfileManager />;
      case 'about': return <AboutManager />;
      case 'education': return <EducationManager />;
      case 'skills': return <SkillManager />;
      case 'projects': return <ProjectManager />;
      case 'certificates': return <CertificateManager />;
      case 'experience': return <ExperienceManager />;
      case 'services': return <ServiceManager />;
      case 'resume': return <ResumeManager />;
      case 'contact': return <ContactMessages />;
      case 'social-links': return <SocialLinkManager />;
      case 'settings': return <SettingsManager />;
      default: return null;
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ background: '#f0f2f5' }}>
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        unreadMessages={stats.unreadMessages}
      />
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen ? 260 : 70,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} admin={admin} />
        <main className="flex-grow-1 p-4" style={{ paddingTop: '80px' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

// ─── Dashboard Overview ────────────────────────────────────────────────
const DashboardOverview: React.FC<{
  stats: DashboardStats;
  loading: boolean;
  onNavigate: (section: AdminSection) => void;
}> = ({ stats, loading, onNavigate }) => {
  const statCards = [
    { label: 'Projects', value: stats.projects, icon: 'bi-folder2-open', color: '#0d6efd', section: 'projects' as AdminSection },
    { label: 'Certificates', value: stats.certificates, icon: 'bi-patch-check-fill', color: '#198754', section: 'certificates' as AdminSection },
    { label: 'Skills', value: stats.skills, icon: 'bi-code-slash', color: '#6f42c1', section: 'skills' as AdminSection },
    { label: 'Education', value: stats.education, icon: 'bi-mortarboard-fill', color: '#0dcaf0', section: 'education' as AdminSection },
    { label: 'Experience', value: stats.experience, icon: 'bi-briefcase-fill', color: '#fd7e14', section: 'experience' as AdminSection },
    { label: 'Services', value: stats.services, icon: 'bi-gear-fill', color: '#dc3545', section: 'services' as AdminSection },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: 'bi-envelope-fill',
      color: '#ffc107',
      section: 'contact' as AdminSection,
    },
  ];

  const quickLinks = [
    { label: 'Edit Profile', icon: 'bi-person-fill', section: 'profile' as AdminSection, color: '#0d6efd' },
    { label: 'Add Project', icon: 'bi-plus-circle-fill', section: 'projects' as AdminSection, color: '#198754' },
    { label: 'Add Certificate', icon: 'bi-award-fill', section: 'certificates' as AdminSection, color: '#6f42c1' },
    { label: 'View Messages', icon: 'bi-chat-dots-fill', section: 'contact' as AdminSection, color: '#fd7e14' },
    { label: 'Manage Skills', icon: 'bi-code-slash', section: 'skills' as AdminSection, color: '#0dcaf0' },
    { label: 'Site Settings', icon: 'bi-sliders', section: 'settings' as AdminSection, color: '#dc3545' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="rounded-4 p-4 mb-4 text-white position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%)' }}
      >
        <div className="row align-items-center">
          <div className="col">
            <h4 className="fw-bold mb-1">
              Welcome back, {localStorage.getItem('admin_name') || 'Admin'} 👋
            </h4>
            <p className="mb-0 opacity-75">
              Manage your full-stack portfolio CMS. All changes are saved to MongoDB and reflect instantly on your public portfolio.
            </p>
          </div>
          <div className="col-auto">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-light btn-sm fw-medium"
            >
              <i className="bi bi-box-arrow-up-right me-1" />
              View Portfolio
            </a>
          </div>
        </div>
        <div
          className="position-absolute top-0 end-0"
          style={{ opacity: 0.08, fontSize: 160, lineHeight: 1, transform: 'translate(20px,-20px)' }}
        >
          <i className="bi bi-grid-3x3-gap-fill" />
        </div>
      </div>

      {/* Stats Cards */}
      <h6 className="text-muted fw-semibold text-uppercase mb-3" style={{ letterSpacing: 1, fontSize: 11 }}>
        Portfolio Statistics
      </h6>
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="col-6 col-md-4 col-lg-3">
            <div
              className="card border-0 rounded-4 shadow-sm h-100 cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate(card.section)}
            >
              <div className="card-body d-flex align-items-center gap-3 p-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 48, height: 48, background: card.color + '20' }}
                >
                  <i className={`bi ${card.icon}`} style={{ color: card.color, fontSize: 20 }} />
                </div>
                <div>
                  {loading ? (
                    <div className="placeholder-glow">
                      <span className="placeholder col-4 rounded" />
                    </div>
                  ) : (
                    <div className="fw-bold fs-4 lh-1" style={{ color: card.color }}>
                      {card.value}
                    </div>
                  )}
                  <div className="text-muted small">{card.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h6 className="text-muted fw-semibold text-uppercase mb-3" style={{ letterSpacing: 1, fontSize: 11 }}>
        Quick Actions
      </h6>
      <div className="row g-3">
        {quickLinks.map((link) => (
          <div key={link.label} className="col-6 col-md-4 col-lg-2">
            <div
              className="card border-0 rounded-4 shadow-sm text-center p-3 h-100"
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onClick={() => onNavigate(link.section)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                className="rounded-3 d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: 44, height: 44, background: link.color + '15' }}
              >
                <i className={`bi ${link.icon}`} style={{ color: link.color, fontSize: 18 }} />
              </div>
              <div className="small fw-semibold text-dark">{link.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* API Docs Link */}
      <div className="mt-4 p-3 rounded-4 border border-dashed" style={{ borderColor: '#dee2e6' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-2 p-2" style={{ background: '#e3f2fd' }}>
              <i className="bi bi-journal-code text-primary fs-5" />
            </div>
            <div>
              <div className="fw-semibold text-dark small">Swagger API Documentation</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Explore and test all REST API endpoints interactively</div>
            </div>
          </div>
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm rounded-pill"
          >
            <i className="bi bi-box-arrow-up-right me-1" />
            Open Swagger
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
