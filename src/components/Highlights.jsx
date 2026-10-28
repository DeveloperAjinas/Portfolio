import React from 'react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION EIGHT: PROFESSIONAL HIGHLIGHTS
 * 
 * Minimal editorial section highlighting verified engineering focus areas.
 * Avoids fake statistics, animated counters, or fabricated metrics.
 */
export default function Highlights() {
  const { highlights } = portfolioData;

  return (
    <section className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 07</span>
          <div className="section-line" />
          <span className="section-tag">Engineering Focus</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.75rem',
            marginTop: '2rem'
          }}
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="interactive-card"
              style={{
                padding: '2.25rem 1.75rem',
                background: 'rgba(12, 13, 19, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px'
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                    lineHeight: 1.15
                  }}
                >
                  {item.metric}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                  }}
                >
                  {item.label}
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
