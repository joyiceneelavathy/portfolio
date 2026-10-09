import React, { useState } from 'react';
import { ContactFormData, Profile } from '../types';
import portfolioService from '../services/api';

interface ContactProps {
  profile: Profile | null;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errors.subject = 'Please provide a subject (at least 3 characters).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please write a message of at least 10 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await portfolioService.submitContact(formData);
      setStatus({
        type: 'success',
        message: response.message || 'Thank you! Your message has been sent successfully.',
      });
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message:
          err.message ||
          'Failed to submit message. Please verify the backend is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-5 bg-light">
      <div className="container py-4">
        <div className="text-center">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-lead">
            Have a project idea, question, or internship opportunity? Feel free to drop a message and I'll get back to you promptly.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Contact Info Card */}
          <div className="col-lg-4">
            <div className="custom-card p-4 p-md-5 h-100 bg-white">
              <h4 className="fw-bold text-dark mb-4">Let's Connect</h4>
              <p className="text-secondary small mb-4">
                I am actively seeking software engineering internships, collaborative open-source projects, and full-stack opportunities.
              </p>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 bg-primary-subtle text-primary p-3 fs-5">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Email</h6>
                    <a
                      href={`mailto:${profile?.email || 'joyiceneelavathy@gmail.com'}`}
                      className="text-muted small text-decoration-none"
                    >
                      {profile?.email || 'joyiceneelavathy@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 bg-info-subtle text-info p-3 fs-5">
                    <i className="bi bi-linkedin"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">LinkedIn</h6>
                    <a
                      href={profile?.linkedinUrl || 'https://linkedin.com/in/joyice-neelavathy'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted small text-decoration-none"
                    >
                      Joyice Neelavathy
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 bg-dark-subtle text-dark p-3 fs-5">
                    <i className="bi bi-github"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">GitHub</h6>
                    <a
                      href={profile?.githubUrl || 'https://github.com/joyiceneelavathy'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted small text-decoration-none"
                    >
                      github.com/joyiceneelavathy
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 bg-danger-subtle text-danger p-3 fs-5">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Location</h6>
                    <span className="text-muted small">{profile?.location || 'Tamil Nadu, India'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 text-success small">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>MongoDB API Storage Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="custom-card p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4">Send a Message</h4>

              {status.type === 'success' && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                  <div>{status.message}</div>
                </div>
              )}

              {status.type === 'error' && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  <div>{status.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label fw-semibold text-dark small">
                      Your Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-custom ${
                        validationErrors.name ? 'is-invalid' : ''
                      }`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      disabled={loading}
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">{validationErrors.name}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold text-dark small">
                      Your Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-custom ${
                        validationErrors.email ? 'is-invalid' : ''
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      disabled={loading}
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">{validationErrors.email}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="subject" className="form-label fw-semibold text-dark small">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-custom ${
                        validationErrors.subject ? 'is-invalid' : ''
                      }`}
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Internship Inquiry / Web Development Project"
                      disabled={loading}
                    />
                    {validationErrors.subject && (
                      <div className="invalid-feedback">{validationErrors.subject}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label fw-semibold text-dark small">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control form-control-custom ${
                        validationErrors.message ? 'is-invalid' : ''
                      }`}
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hello Joyice, I wanted to discuss..."
                      disabled={loading}
                    ></textarea>
                    {validationErrors.message && (
                      <div className="invalid-feedback">{validationErrors.message}</div>
                    )}
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
