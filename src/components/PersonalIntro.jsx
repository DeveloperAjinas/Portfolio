import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Briefcase, Sparkles, Terminal } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION TWO: PERSONAL INTRODUCTION
 * 
 * Non-conventional editorial layout.
 * Displays: Name, Professional Title, Location, Experience, Introduction statement.
 */
export default function PersonalIntro() {
  const { personal } = portfolioData;
  const [localTime, setLocalTime] = useState('');

  // Live Kerala, India (IST) clock display
  useEffect(() => {
    const updateTime = () => {
      try {
        const istString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        setLocalTime(istString + ' IST');
      } catch {
        setLocalTime('IST (UTC+5:30)');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="personal-intro" 
      className="section-wrapper"
      style={{
        backgroundColor: 'var(--bg-primary)',
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)'
      }}
    >
      <div className="container-inner">
        {/* Editorial Section Metadata */}
        <div className="section-header-meta">
          <span className="section-index">// 01</span>
          <div className="section-line" />
          <span className="section-tag">Identity & Focus</span>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
            gap: 'clamp(2.5rem, 6vw, 6rem)',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Oversized Name & Professional Details */}
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <div className="badge-pill">
                <span className="badge-dot" />
                <span>{personal.statusBadge}</span>
              </div>
              <div className="badge-pill" style={{ color: 'var(--text-muted)' }}>
                <Clock size={12} />
                <span>{localTime || 'Kerala, India'}</span>
              </div>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.75rem, 7vw, 6rem)',
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: '-0.04em',
                marginBottom: '1.5rem',
                textTransform: 'none',
              }}
            >
              {personal.name}
            </h1>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
                color: 'var(--accent-cyan)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem'
              }}
            >
              <Terminal size={18} style={{ opacity: 0.8 }} />
              <span>{personal.displayTitle}</span>
            </div>

            {/* Quick Metadata Block */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Location</span>
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>
                  {personal.location}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  <Briefcase size={13} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Experience</span>
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9375rem' }}>
                  {personal.experienceYears}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Statement & Editorial Narrative */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* The Specific Introduction Statement from Requirements */}
            <div
              style={{
                position: 'relative',
                paddingLeft: '1.75rem',
                borderLeft: '2px solid rgba(56, 189, 248, 0.4)'
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.3vw, 1.85rem)',
                  lineHeight: 1.42,
                  color: 'var(--text-primary)',
                  fontWeight: 450,
                  letterSpacing: '-0.015em'
                }}
              >
                "{personal.introduction}"
              </p>
            </div>

            {/* Architectural Abstract Visual Element / Monogram Canvas */}
            <div
              className="interactive-card"
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(20, 22, 30, 0.6) 0%, rgba(10, 11, 15, 0.9) 100%)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle background circuit/grid accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Architectural Focus
                </span>
              </div>

              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Specialized in the full lifecycle of enterprise application development — architecting scalable REST APIs, relational database tuning, and building high-performance .NET solutions that solve real business problems.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['C# / .NET', 'ASP.NET Core', 'SQL Server', 'Angular', 'Clean Architecture', 'API Integrations'].map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
