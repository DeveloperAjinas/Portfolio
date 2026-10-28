import React, { useState } from 'react';
import { Server, Layout, Database, Wrench, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

/**
 * SECTION FOUR: TECHNICAL SKILLS
 * 
 * Refined typographic layout with category cards.
 * Strictly adheres to verified technologies with no fake percentages/progress bars.
 */
export default function Skills() {
  const { skills } = portfolioData;
  const [selectedFilter, setSelectedFilter] = useState('all');

  const categoryIcons = {
    backend: <Server size={18} style={{ color: 'var(--accent-cyan)' }} />,
    frontend: <Layout size={18} style={{ color: 'var(--accent-amber)' }} />,
    database: <Database size={18} style={{ color: 'var(--accent-emerald)' }} />,
    tools: <Wrench size={18} style={{ color: 'var(--text-secondary)' }} />,
  };

  const filteredCategories = selectedFilter === 'all'
    ? skills.categories
    : skills.categories.filter((cat) => cat.id === selectedFilter);

  return (
    <section id="skills" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 03</span>
          <div className="section-line" />
          <span className="section-tag">Engineering Stack</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          <h2 className="section-headline" style={{ marginBottom: 0 }}>
            Specialized in <span className="accent">enterprise .NET backend architecture</span> and responsive front-end applications.
          </h2>
          <p style={{ maxWidth: '720px', color: 'var(--text-secondary)' }}>
            Carefully curated technical competencies built over 3+ years of commercial development. No arbitrary percentage bars — only battle-tested production technologies.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setSelectedFilter('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              border: selectedFilter === 'all' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: selectedFilter === 'all' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              color: selectedFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={13} />
            <span>All Categories ({skills.categories.reduce((acc, cat) => acc + cat.items.length, 0)})</span>
          </button>

          {skills.categories.map((cat) => {
            const isSelected = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name} ({cat.items.length})
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="interactive-card"
              style={{
                background: 'rgba(12, 13, 18, 0.75)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {categoryIcons[cat.id]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {cat.subtitle}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-dim)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {cat.items.length} SKILLS
                </span>
              </div>

              {/* Typographic Skills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {cat.items.map((skill) => (
                  <div
                    key={skill.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '6px',
                      transition: 'border-color 0.2s ease, background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9375rem', color: '#fff' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {skill.level}
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--accent-cyan)',
                        background: 'rgba(56, 189, 248, 0.08)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {skill.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
