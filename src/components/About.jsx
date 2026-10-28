import React from 'react';
import { Target, Compass, Code2, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION THREE: ABOUT ME
 * 
 * Two-column desktop / single-column mobile layout.
 * Includes: Professional introduction, technical interests, development philosophy, career goals, personal interests.
 */
export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="section-wrapper" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 02</span>
          <div className="section-line" />
          <span className="section-tag">Background & Approach</span>
        </div>

        <h2 className="section-headline">
          Dedicated to building <span className="accent">predictable, high-integrity</span> software systems.
        </h2>

        {/* Two Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            marginTop: '3rem',
            alignItems: 'start'
          }}
        >
          {/* Column 1: Editorial Narrative & Philosophy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {about.paragraphs.map((p, idx) => (
                <p 
                  key={idx} 
                  style={{ 
                    fontSize: idx === 0 ? '1.125rem' : '1rem', 
                    color: idx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 1.7 
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Development Philosophy Block */}
            <div
              className="interactive-card"
              style={{
                marginTop: '1rem',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid var(--accent-cyan)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                <Code2 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Development Philosophy
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  fontStyle: 'italic'
                }}
              >
                "{about.philosophy}"
              </p>
            </div>

            {/* Career Goals */}
            <div
              style={{
                padding: '1.75rem',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                <Target size={18} style={{ color: 'var(--accent-amber)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Career Trajectory
                </span>
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {about.careerGoals}
              </p>
            </div>
          </div>

          {/* Column 2: Technical Interests & Abstract Architectural Visual */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Abstract Architectural Visual Element */}
            <div
              className="interactive-card"
              style={{
                padding: '2.5rem',
                background: 'linear-gradient(145deg, #0f1118 0%, #07080b 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle architectural coordinates graphic */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'rgba(255, 255, 255, 0.25)',
                  letterSpacing: '0.15em',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>SYS // ARCHITECTURE</span>
                <span>.NET CORE / MSSQL</span>
              </div>

              {/* Core Pillars Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.25rem',
                  marginBottom: '2rem'
                }}
              >
                {[
                  { title: "Reliability", desc: "Predictable error handling and transaction safety" },
                  { title: "Maintainability", desc: "Clean architecture and modular domain boundaries" },
                  { title: "Performance", desc: "Optimized indexing, query execution and async I/O" },
                  { title: "Security", desc: "Airtight authentication, validation and data protection" },
                ].map((pillar) => (
                  <div
                    key={pillar.title}
                    style={{
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9375rem', color: '#fff', marginBottom: '0.25rem' }}>
                      {pillar.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {pillar.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem'
                }}
              >
                <Cpu size={14} />
                <span>Enterprise Stack: ASP.NET Core • EF Core • Dapper • Angular</span>
              </div>
            </div>

            {/* Technical Interests */}
            <div
              style={{
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Technical Interests
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {about.technicalInterests.map((interest, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-cyan)', marginTop: '0.25rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {interest}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Interests (if supplied) */}
            {about.personalInterests && about.personalInterests.length > 0 && (
              <div
                style={{
                  padding: '1.5rem 2rem',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                  <Compass size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Personal Explorations
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {about.personalInterests.map((interest, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
