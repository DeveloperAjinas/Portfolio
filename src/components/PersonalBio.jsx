import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

/**
 * PersonalBio Component ("Who Am I?")
 * 
 * - Placed right after the headings ("Ajinas P" & "SOFTWARE ENGINEER")
 * - Matches the heading font style ('Cinzel', 'Syne', serif / 'Syne') with normal white text
 * - Desktop: Elegantly docked on the left perimeter below headings with smooth scrolling & collapse option
 * - Mobile: Renders a tap-friendly "👨‍💻 Who Am I?" badge that slides open a readable sheet/modal
 * - Fully isolated wheel and pointer events so scrolling never rotates the 360 image
 */
export default function PersonalBio() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bioItems = [
    {
      label: 'Experience',
      text: '3+ years of turning coffee ☕ and requirements into working software.'
    },
    {
      label: 'Specialization',
      text: 'Full-stack developer. I handle both frontend drama and backend problems.'
    },
    {
      label: 'Backend',
      text: 'I make APIs talk to each other. Sometimes they listen. Sometimes debugging begins. 😂'
    },
    {
      label: 'Frontend',
      text: "Making Angular components look beautiful enough to hide what's happening behind the scenes."
    },
    {
      label: 'Database',
      text: 'SQL Server is where I keep things organized. Unlike my browser tabs.'
    },
    {
      label: 'Education',
      text: 'B.Tech in Computer Science Engineering. Officially qualified to Google error messages professionally.'
    },
    {
      label: 'Current Role',
      text: 'Software Engineer at Benzy Infotech Pvt. Ltd. — fixing bugs that occasionally introduce new bugs.'
    },
    {
      label: 'Interests',
      text: 'Building cool applications, solving problems, and wondering why the code worked yesterday but not today. 🚀'
    }
  ];

  return (
    <div
      style={{
        marginTop: '0.85rem',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ===================================================================
          MOBILE VIEW (< 768px):
          A sleek tap-friendly badge that slides open a full readable drawer
          =================================================================== */}
      {isMobile ? (
        <div>
          {/* Mobile Trigger Badge */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Who Am I? - Tap to read bio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(10, 14, 23, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 255, 255, 0.08)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>👨‍💻</span>
            <span
              style={{
                fontFamily: "'Cinzel', 'Syne', serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.04em'
              }}
            >
              Who Am I?
            </span>
            <ChevronDown size={14} style={{ color: '#ffffff', opacity: 0.85 }} />
          </button>

          {/* Mobile Bottom Sheet Drawer */}
          {isMobileOpen && (
            <div
              role="dialog"
              aria-label="Who Am I?"
              onClick={() => setIsMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.78)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                animation: 'fadeOverlay 0.2s ease-out'
              }}
            >
              <div
                data-scrollable="true"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'rgba(10, 14, 23, 0.98)',
                  backdropFilter: 'blur(26px)',
                  WebkitBackdropFilter: 'blur(26px)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  padding: '1.25rem 1.25rem 2rem 1.25rem',
                  maxHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.95)',
                  animation: 'slideUpMobile 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Mobile Drawer Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.15rem' }}>👨‍💻</span>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "'Cinzel', 'Syne', serif",
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.04em',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      Who Am I?
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="Close bio"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Mobile Scrollable Items */}
                <div
                  data-scrollable="true"
                  style={{
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    paddingRight: '0.25rem',
                    maxHeight: '62vh'
                  }}
                >
                  {bioItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '0.75rem 0.9rem',
                        lineHeight: 1.55
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "'Syne', 'Cinzel', sans-serif",
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          lineHeight: 1.55,
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: "'Cinzel', 'Syne', serif",
                            fontWeight: 700,
                            color: '#ffffff',
                            letterSpacing: '0.04em',
                            marginRight: '0.35rem'
                          }}
                        >
                          {item.label}:
                        </strong>
                        <span style={{ color: '#ffffff', opacity: 0.95 }}>
                          {item.text}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================================
            DESKTOP VIEW (>= 768px):
            Elegantly docked on left perimeter below headings
            Constrained width so it never touches or obstructs the portrait
            =================================================================== */
        <div
          style={{
            width: 'clamp(280px, 22vw, 360px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Desktop Collapsed Pill */}
          {isDesktopCollapsed ? (
            <button
              type="button"
              onClick={() => setIsDesktopCollapsed(false)}
              aria-label="Expand Who Am I bio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(10, 14, 23, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 255, 255, 0.08)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>👨‍💻</span>
              <span
                style={{
                  fontFamily: "'Cinzel', 'Syne', serif",
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em'
                }}
              >
                Who Am I?
              </span>
              <ChevronDown size={14} style={{ color: '#ffffff', opacity: 0.85 }} />
            </button>
          ) : (
            /* Desktop Expanded Card */
            <div
              data-scrollable="true"
              onWheel={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'rgba(10, 14, 23, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '16px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'bioEntrance 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.95rem' }}>👨‍💻</span>
                  <span
                    style={{
                      fontFamily: "'Cinzel', 'Syne', serif",
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.04em',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    Who Am I?
                  </span>
                </div>

                {/* Minimize Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsDesktopCollapsed(true)}
                  title="Collapse Who Am I bio"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <ChevronUp size={14} style={{ color: '#ffffff' }} />
                </button>
              </div>

              {/* Scrollable Bio List */}
              <div
                data-scrollable="true"
                style={{
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 220px)',
                  padding: '0.85rem 0.95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                {bioItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.6rem 0.8rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'Syne', 'Cinzel', sans-serif",
                        fontSize: '0.8rem',
                        lineHeight: 1.55,
                        color: '#ffffff',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      <strong
                        style={{
                          fontFamily: "'Cinzel', 'Syne', serif",
                          fontWeight: 700,
                          color: '#ffffff',
                          letterSpacing: '0.04em',
                          marginRight: '0.35rem'
                        }}
                      >
                        {item.label}:
                      </strong>
                      <span style={{ color: '#ffffff', opacity: 0.95 }}>
                        {item.text}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes bioEntrance {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideUpMobile {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes fadeOverlay {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
