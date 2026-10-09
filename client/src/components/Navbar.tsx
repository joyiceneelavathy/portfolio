import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  editMode: boolean;
  onToggleEditMode: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  editMode,
  onToggleEditMode,
  onOpenLoginModal,
}) => {
  const { isAuthenticated, logout, admin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'education', 'skills', 'projects', 'certificates', 'experience', 'resume', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'experience', label: 'Experience' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleEditClick = () => {
    if (!isAuthenticated) {
      onOpenLoginModal();
    } else {
      onToggleEditMode();
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-xl fixed-top navbar-custom ${
        scrolled ? 'shadow-sm py-2' : 'py-3'
      }`}
    >
      <div className="container-fluid px-lg-5">
        <a className="navbar-brand navbar-brand-styled d-flex align-items-center" href="#home">
          <span className="me-2 text-primary">
            <i className="bi bi-code-slash"></i>
          </span>
          Joyice<span className="dot">.</span>
        </a>

        {/* Live Edit Mode Switch in Navbar */}
        <div className="d-flex align-items-center gap-2 ms-auto me-3 d-xl-none">
          <button
            onClick={handleEditClick}
            className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${
              editMode ? 'btn-warning fw-bold text-dark' : 'btn-outline-primary'
            }`}
            title="Toggle Live On-Page Edit Mode"
          >
            <i className={`bi ${editMode ? 'bi-pencil-fill' : 'bi-pencil'}`}></i>
            <span style={{ fontSize: '12px' }}>{editMode ? 'Edit ON' : 'Edit Mode'}</span>
          </button>
        </div>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-controls="navbarNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-xl-center">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.id}>
                <a
                  className={`nav-link nav-link-custom ${
                    activeNav === link.id ? 'active' : ''
                  }`}
                  href={`#${link.id}`}
                  onClick={() => setNavOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {/* Desktop Live Edit Mode Button */}
            <li className="nav-item ms-xl-3 my-2 my-xl-0">
              <button
                onClick={handleEditClick}
                className={`btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 transition ${
                  editMode
                    ? 'btn-warning text-dark fw-bold shadow'
                    : 'btn-outline-primary'
                }`}
                title="Toggle On-Page Dynamic Editing"
              >
                <i className={`bi ${editMode ? 'bi-pencil-fill' : 'bi-pencil-square'}`}></i>
                <span>{editMode ? '✏️ Edit Mode: Active' : '✏️ Edit On Webpage'}</span>
              </button>
            </li>

            {/* Admin Panel Link */}
            <li className="nav-item ms-xl-2 my-2 my-xl-0">
              <Link
                to="/admin"
                className="btn btn-sm btn-light border rounded-pill px-3 py-2 text-dark d-flex align-items-center gap-1"
                title="Go to Admin Dashboard"
              >
                <i className="bi bi-grid-1x2 text-primary"></i>
                <span>CMS Admin</span>
              </Link>
            </li>

            {/* Auth / Login status */}
            {isAuthenticated ? (
              <li className="nav-item ms-xl-2 my-2 my-xl-0 dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                  onClick={logout}
                  title={`Logged in as ${admin?.email}. Click to log out.`}
                >
                  <i className="bi bi-box-arrow-right text-danger"></i>
                  <span>Logout</span>
                </button>
              </li>
            ) : (
              <li className="nav-item ms-xl-2 my-2 my-xl-0">
                <button
                  onClick={onOpenLoginModal}
                  className="btn btn-sm btn-outline-dark rounded-pill px-3 py-2"
                >
                  <i className="bi bi-lock me-1"></i> Admin Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
