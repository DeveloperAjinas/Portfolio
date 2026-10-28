import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION FIVE: PROFESSIONAL EXPERIENCE
 * 
 * Clean editorial timeline for career milestones.
 * Accurately displays verified details for Benzy Infotech (.NET Developer).
 */
export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="section-wrapper" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 04</span>
          <div className="section-line" />
          <span className="section-tag">Career Milestones</span>
        </div>

        <h2 className="section-headline">
          Commercial <span className="accent">engineering experience</span> & industry track record.
        </h2>

        {/* Timeline Layout */}
        <div style={{ marginTop: '3.5rem', position: 'relative' }}>
          {/* Vertical Timeline Track */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              bottom: '1rem',
              left: '1.25rem',
              width: '1px',
              background: 'linear-gradient(to bottom, var(--accent-cyan), var(--border-subtle) 80%, transparent)',
              zIndex: 0
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {experience.map((job) => (
              <div
                key={job.id}
                style={{
                  position: 'relative',
                  paddingLeft: 'clamp(3rem, 6vw, 4.5rem)',
                }}
              >
                {/* Timeline Node Marker */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.35rem',
                    left: '0.85rem',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--accent-cyan)',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
                    zIndex: 1
                  }}
                />

                {/* Experience Card */}
                <div
                  className="interactive-card"
                  style={{
                    background: 'rgba(10, 12, 16, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: 'clamp(1.75rem, 4vw, 2.75rem)',
                  }}
                >
                  {/* Header: Position & Company */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1.5rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--accent-cyan)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                          }}
                        >
                          {job.type}
                        </span>
                        <span style={{ color: 'var(--text-dim)' }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                          <MapPin size={12} />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <h3
                        style={{
                          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                          fontWeight: 700,
                          color: '#ffffff',
                          letterSpacing: '-0.02em',
                          marginBottom: '0.25rem'
                        }}
                      >
                        {job.position}
                      </h3>

                      <div
                        style={{
                          fontSize: '1.125rem',
                          color: 'var(--text-secondary)',
                          fontWeight: 500
                        }}
                      >
                        {job.company}
                      </div>
                    </div>

                    {/* Period Badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        color: 'var(--accent-primary)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      <Calendar size={13} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{job.period}</span>
                    </div>
                  </div>

                  {/* Role Narrative */}
                  <p
                    style={{
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: '2rem'
                    }}
                  >
                    {job.description}
                  </p>

                  {/* Core Responsibilities */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '1rem'
                      }}
                    >
                      Key Responsibilities & Deliverables
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {job.responsibilities.map((resp, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <CheckCircle size={16} style={{ color: 'var(--accent-cyan)', marginTop: '0.25rem', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                            {resp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Used */}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                        marginBottom: '0.75rem'
                      }}
                    >
                      Stack & Tools Utilized
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {job.technologies.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
