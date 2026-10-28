import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, Eye, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';
import { portfolioData } from '../data/portfolio';
import ProjectModal from './ProjectModal';

/**
 * SECTION SIX: FEATURED PROJECTS
 * 
 * Visually rich, editorial project presentations with subtle image zoom on hover
 * and full project details modal.
 */
export default function Projects() {
  const { projects } = portfolioData;
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="section-wrapper" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-inner">
        {/* Section Header */}
        <div className="section-header-meta">
          <span className="section-index">// 05</span>
          <div className="section-line" />
          <span className="section-tag">Engineering Portfolio</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          <h2 className="section-headline" style={{ marginBottom: 0 }}>
            Selected works across <span className="accent">fintech, publishing, travel, & interactive media.</span>
          </h2>
          <p style={{ maxWidth: '680px', color: 'var(--text-secondary)' }}>
            Each project represents an intentional architectural solution — balancing backend reliability, data structures, and intuitive interfaces.
          </p>
        </div>

        {/* Projects List / Editorial Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
          {projects.map((project, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={project.id}
                className="interactive-card"
                style={{
                  background: 'rgba(12, 13, 19, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                  alignItems: 'stretch'
                }}
              >
                {/* Media Column with Smooth Image Zoom on Hover */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '340px',
                    order: isEven ? 2 : 1,
                    backgroundColor: '#07080c'
                  }}
                  className="project-image-container"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
                      filter: 'brightness(0.92) contrast(1.05)'
                    }}
                    className="project-thumb"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(12, 13, 19, 0.9) 0%, transparent 40%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.25rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--accent-cyan)',
                      background: 'rgba(6, 7, 10, 0.8)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Content Column */}
                <div
                  style={{
                    padding: 'clamp(2rem, 5vw, 3.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    order: isEven ? 1 : 2,
                    gap: '2rem'
                  }}
                >
                  <div>
                    {/* Index & Category */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.875rem',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em'
                        }}
                      >
                        PROJECT {project.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                        lineHeight: 1.15
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        color: 'var(--accent-cyan)',
                        marginBottom: '1.25rem',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {project.tagline}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                        marginBottom: '1.5rem'
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.85rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <button
                      onClick={() => setSelectedProject(project)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.25rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#060709';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                    >
                      <Eye size={14} />
                      <span>View Project Details</span>
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Live demo of ${project.title}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem'
                        }}
                      >
                        <span>Demo</span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`GitHub repository of ${project.title}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.6rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem'
                        }}
                      >
                        <GithubIcon size={13} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Global Project Hover Zoom Style */}
        <style>{`
          .project-image-container:hover .project-thumb {
            transform: scale(1.05);
            filter: brightness(1) contrast(1.08);
          }
        `}</style>
      </div>

      {/* Detail Modal Window */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
