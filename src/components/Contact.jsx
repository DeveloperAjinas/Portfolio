import React, { useState } from 'react';
import { Mail, MapPin, FileText, Send, Check, AlertCircle, Copy } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION NINE: CONTACT
 * 
 * Distinctive contact experience with input validation, mailto fallback,
 * and clear integration points for backend services.
 */
export default function Contact() {
  const { contact } = portfolioData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedStatus, setSubmittedStatus] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Please provide a subject';
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build functional mailto string
    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `Sender Name: ${formData.name}\nSender Email: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    // Trigger user mail client
    window.location.href = mailtoUrl;

    // Set transparent status notice
    setSubmittedStatus({
      success: true,
      message: 'Email client launched via mailto! For automated direct dispatch, plug in an API endpoint or email service in Contact.jsx.'
    });
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="section-wrapper" style={{ backgroundColor: 'var(--bg-secondary)', paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 08</span>
          <div className="section-line" />
          <span className="section-tag">Direct Communication</span>
        </div>

        {/* Editorial Headline */}
        <div style={{ maxWidth: '840px', marginBottom: '3.5rem' }}>
          <h2 className="section-headline">
            {contact.headline}
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {contact.subtext}
          </p>
        </div>

        {/* Contact Grid: Left Information / Right Interactive Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 'clamp(2.5rem, 6vw, 5rem)',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Contact Channels & Credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div
              style={{
                padding: '2.5rem',
                background: 'rgba(10, 12, 16, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-cyan)' }}>
                Direct Channels
              </div>

              {/* Email Block */}
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  PRIMARY INBOX
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Mail size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span>{contact.email}</span>
                  </a>
                  <button
                    onClick={copyEmailToClipboard}
                    aria-label="Copy email address"
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: copiedEmail ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  RESIDENTIAL LOCATION
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 500 }}>
                  <MapPin size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>{contact.location}</span>
                </div>
              </div>

              {/* Social Profiles */}
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  PROFESSIONAL NETWORKS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    >
                      <LinkedinIcon size={15} style={{ color: '#0a66c2' }} />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                  {contact.github && (
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.55rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    >
                      <GithubIcon size={15} />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Resume Download CTA */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={contact.resumeUrl}
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                >
                  <FileText size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Download Curriculum Vitae (CV)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            style={{
              padding: 'clamp(2rem, 5vw, 3rem)',
              background: 'rgba(10, 12, 16, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Transmit Message
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Name */}
              <div>
                <label 
                  htmlFor="contact-name"
                  style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Elena Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
                {errors.name && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={12} />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="contact-email"
                  style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="e.g. elena@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: errors.email ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
                {errors.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={12} />
                    <span>{errors.email}</span>
                  </span>
                )}
              </div>

              {/* Subject */}
              <div>
                <label 
                  htmlFor="contact-subject"
                  style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
                >
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="e.g. Architectural Collaboration / Technical Opportunity"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: errors.subject ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    outline: 'none'
                  }}
                />
                {errors.subject && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={12} />
                    <span>{errors.subject}</span>
                  </span>
                )}
              </div>

              {/* Message */}
              <div>
                <label 
                  htmlFor="contact-message"
                  style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
                >
                  Project Details / Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Provide an overview of your inquiry, project scope, or technical needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: errors.message ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                {errors.message && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={12} />
                    <span>{errors.message}</span>
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  padding: '0.85rem 1.5rem',
                  background: '#ffffff',
                  color: '#060709',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Dispatch Communication</span>
                <Send size={14} />
              </button>

              {/* Status Notice */}
              {submittedStatus && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <Check size={14} />
                    <span>Action Processed</span>
                  </div>
                  <div>{submittedStatus.message}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
