import React from 'react';
import { GraduationCap, Award, BookOpen, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION SEVEN: EDUCATION AND CERTIFICATIONS
 * 
 * Strict Requirement:
 * Hide empty fields until the developer provides the actual information.
 * Do not invent educational institutions, dates, or certifications.
 */
export default function Education() {
  const { education } = portfolioData;

  const hasDegree = Boolean(education.degree && education.degree.trim() !== "");
  const hasInstitution = Boolean(education.institution && education.institution.trim() !== "");
  const hasYear = Boolean(education.graduationYear && education.graduationYear.trim() !== "");
  const hasCoursework = Boolean(education.relevantCoursework && education.relevantCoursework.length > 0);
  const hasCertifications = Boolean(education.certifications && education.certifications.length > 0);
  const hasTraining = Boolean(education.trainingPrograms && education.trainingPrograms.length > 0);

  const hasAnyEducationData = hasDegree || hasInstitution || hasCertifications || hasTraining;

  return (
    <section id="education" className="section-wrapper" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 06</span>
          <div className="section-line" />
          <span className="section-tag">Credentials & Academics</span>
        </div>

        <h2 className="section-headline">
          Education & <span className="accent">Professional Certifications.</span>
        </h2>

        {/* If user hasn't filled details yet, show clean editable placeholder block */}
        {!hasAnyEducationData ? (
          <div
            style={{
              padding: '2.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--border-medium)',
              borderRadius: '12px',
              maxWidth: '720px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)' }}>
              <GraduationCap size={20} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Academic & Certification Profile
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Educational credentials and professional certifications are configured in <code style={{ color: 'var(--accent-cyan)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>src/data/portfolio.js</code>. Empty fields remain hidden until provided.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supported fields: Degree • Institution • Graduation Year • Coursework • Certifications • Training Programs
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {/* Degree Card (shown only if provided) */}
            {(hasDegree || hasInstitution) && (
              <div
                className="interactive-card"
                style={{
                  padding: '2rem',
                  background: 'rgba(10, 12, 16, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <GraduationCap size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Academic Degree
                  </span>
                </div>

                {hasDegree && (
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {education.degree}
                  </h3>
                )}

                {hasInstitution && (
                  <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {education.institution}
                  </div>
                )}

                {hasYear && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-cyan)', marginBottom: '1.25rem' }}>
                    Class of {education.graduationYear}
                  </div>
                )}

                {hasCoursework && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Relevant Coursework
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {education.relevantCoursework.map((course, idx) => (
                        <span key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Certifications (shown only if provided) */}
            {hasCertifications && (
              <div
                className="interactive-card"
                style={{
                  padding: '2rem',
                  background: 'rgba(10, 12, 16, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <Award size={20} style={{ color: 'var(--accent-amber)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Certifications
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {education.certifications.map((cert, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9375rem' }}>{cert.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {cert.issuer} {cert.year ? `• ${cert.year}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Programs (shown only if provided) */}
            {hasTraining && (
              <div
                className="interactive-card"
                style={{
                  padding: '2rem',
                  background: 'rgba(10, 12, 16, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <BookOpen size={20} style={{ color: 'var(--accent-emerald)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Training Programs
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {education.trainingPrograms.map((prog, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9375rem' }}>{prog.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {prog.provider} {prog.year ? `• ${prog.year}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
