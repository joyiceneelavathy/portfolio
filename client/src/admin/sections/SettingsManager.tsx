import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/api';
import { WebsiteSettings, SectionsVisibility } from '../../types';

const defaultSettings: WebsiteSettings = {
  websiteTitle: 'Joyice Neelavathy | Personal Portfolio',
  logoText: 'Joyice.dev',
  heroTitle: "Hi, I'm Joyice Neelavathy",
  heroSubtitle: 'B.Tech IT Student | Full-Stack Developer',
  footerText: '© 2026 Joyice Neelavathy. All rights reserved.',
  contactEmail: 'joyiceneelavathy@gmail.com',
  theme: 'dark',
  sectionsVisibility: {
    about: true,
    education: true,
    skills: true,
    projects: true,
    certificates: true,
    experience: true,
    services: true,
    resume: true,
    contact: true,
  },
};

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const loadSettings = async () => {
    try {
      const res = await settingsService.get();
      if (res.success && res.data) {
        setSettings({
          ...defaultSettings,
          ...res.data,
          sectionsVisibility: {
            ...defaultSettings.sectionsVisibility,
            ...(res.data.sectionsVisibility || {}),
          },
        });
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showAlert = (type: 'success' | 'danger', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = (field: keyof WebsiteSettings, val: any) => {
    setSettings((s) => ({ ...s, [field]: val }));
  };

  const handleToggleSection = (section: keyof SectionsVisibility) => {
    setSettings((s) => ({
      ...s,
      sectionsVisibility: {
        ...s.sectionsVisibility,
        [section]: !s.sectionsVisibility[section],
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.update(settings);
      if (res.success) {
        setSettings({
          ...defaultSettings,
          ...res.data,
          sectionsVisibility: {
            ...defaultSettings.sectionsVisibility,
            ...(res.data.sectionsVisibility || {}),
          },
        });
        showAlert('success', 'Website settings updated successfully!');
      }
    } catch (err: any) {
      showAlert('danger', err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  const sectionsList: { key: keyof SectionsVisibility; label: string; icon: string }[] = [
    { key: 'about', label: 'About Section', icon: 'bi-person-circle' },
    { key: 'education', label: 'Education Section', icon: 'bi-mortarboard' },
    { key: 'skills', label: 'Skills Section', icon: 'bi-code-slash' },
    { key: 'projects', label: 'Projects Section', icon: 'bi-folder2-open' },
    { key: 'certificates', label: 'Certificates Section', icon: 'bi-patch-check' },
    { key: 'experience', label: 'Experience Section', icon: 'bi-briefcase' },
    { key: 'services', label: 'Services Section', icon: 'bi-gear' },
    { key: 'resume', label: 'Resume Section', icon: 'bi-file-earmark-person' },
    { key: 'contact', label: 'Contact Section', icon: 'bi-envelope' },
  ];

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 p-2" style={{ background: '#f1f5f9' }}>
          <i className="bi bi-gear-wide-connected text-secondary fs-4" />
        </div>
        <div>
          <h5 className="mb-0 fw-bold">Website Settings</h5>
          <p className="text-muted small mb-0">Control site titles, branding, and section visibility toggles</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} border-0 rounded-3 d-flex align-items-center gap-2 mb-4`}>
          <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
          {alert.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* General Branding */}
        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-palette text-primary" /> General Branding & Meta
          </h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Website Title (Browser Tab)</label>
              <input
                type="text"
                className="form-control"
                value={settings.websiteTitle || ''}
                onChange={(e) => handleChange('websiteTitle', e.target.value)}
                placeholder="Joyice Neelavathy | Personal Portfolio"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Brand Logo Text</label>
              <input
                type="text"
                className="form-control"
                value={settings.logoText || ''}
                onChange={(e) => handleChange('logoText', e.target.value)}
                placeholder="Joyice.dev"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Hero Section Title</label>
              <input
                type="text"
                className="form-control"
                value={settings.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Hero Subtitle</label>
              <input
                type="text"
                className="form-control"
                value={settings.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Contact Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Footer Copyright Text</label>
              <input
                type="text"
                className="form-control"
                value={settings.footerText || ''}
                onChange={(e) => handleChange('footerText', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="card border-0 rounded-4 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-eye text-primary" /> Section Visibility Controls
          </h6>
          <p className="text-muted small mb-4">
            Toggle which sections appear on the live portfolio website. Disabling a section hides it without deleting any data.
          </p>

          <div className="row g-3">
            {sectionsList.map((sec) => {
              const isVisible = settings.sectionsVisibility?.[sec.key] ?? true;
              return (
                <div key={sec.key} className="col-md-4 col-sm-6">
                  <div
                    className={`d-flex align-items-center justify-content-between p-3 rounded-3 border transition-all ${
                      isVisible ? 'bg-white border-primary border-opacity-25' : 'bg-light border-light-subtle opacity-75'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${sec.icon} ${isVisible ? 'text-primary' : 'text-muted'} fs-5`} />
                      <span className="small fw-semibold text-dark">{sec.label}</span>
                    </div>

                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        checked={isVisible}
                        onChange={() => handleToggleSection(sec.key)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary px-4 rounded-3" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving Settings...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2" />
                Save Website Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
