import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Download, ExternalLink, X, CheckCircle2, ArrowDown } from 'lucide-react';

/**
 * Calculates suit/shirt chest pocket position based on 1920x1080 16:9 cover canvas geometry
 */
function calculatePocketPosition() {
  if (typeof window === 'undefined') return { top: 0, left: 0 };
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;
  const imgRatio = 1920 / 1080;
  const canvasRatio = displayWidth / displayHeight;

  let drawW, drawH, drawX, drawY;

  if (canvasRatio > imgRatio) {
    drawW = displayWidth;
    drawH = displayWidth / imgRatio;
  } else {
    drawH = displayHeight;
    drawW = displayHeight * imgRatio;
  }

  drawX = (displayWidth - drawW) / 2;
  drawY = (displayHeight - drawH) / 2;

  // Chest pocket anchor coordinates on ezgif-frame-001.jpg (1920 x 1080)
  // Horizontal center of pocket: 61.2% (1175 / 1920)
  // Vertical center of pocket: 76.8% (830 / 1080)
  const targetLeft = drawX + drawW * 0.612;
  const targetTop = drawY + drawH * 0.768;

  // Clamp within viewport for mobile responsiveness
  const left = Math.min(Math.max(55, targetLeft), displayWidth - 55);
  const top = Math.min(Math.max(55, targetTop), displayHeight - 55);

  return { top, left };
}

/**
 * ResumeTag Component
 * 
 * - Pinned to the suit breast pocket of the portrait
 * - On hover or click, opens the continuous scrollable preview of the exact CV
 * - When scrolling inside the CV popup, only the CV scrolls (360 background does not rotate)
 * - Offers direct PDF download of the original Ajinas_P_Resume.pdf
 */
export default function ResumeTag({ currentDegree = 0, isReady = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [pos, setPos] = useState(calculatePocketPosition);

  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Chest pocket is facing forward around 0° (within ±22°)
  const isFacingFront = currentDegree <= 22 || currentDegree >= 338;

  const updatePosition = useCallback(() => {
    setPos(calculatePocketPosition());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
    };
  }, [updatePosition]);

  // When turntable rotates away, close preview
  useEffect(() => {
    if (!isFacingFront) {
      setIsOpen(false);
      setIsPinned(false);
    }
  }, [isFacingFront]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Track scroll position to dismiss scroll hint
  const handleScroll = (e) => {
    if (e.target.scrollTop > 50 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  // Hover Handlers with safety debounce
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(true);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isPinned) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 350);
    }
  };

  const handlePopupMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePopupMouseLeave = () => {
    if (!isPinned) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }
  };

  // Click Handler (Pins / Toggles Pop-up)
  const handleClick = (e) => {
    e.stopPropagation();
    if (isOpen && isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsPinned(false);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = '/Ajinas_P_Resume.pdf';
    link.download = 'Ajinas_P_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  if (!isReady) return null;

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: isFacingFront ? 'auto' : 'none',
        opacity: isFacingFront ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
      }}
    >
      {/* ===================================================================
          SHIRT/POCKET TAG: "Resume/CV"
          =================================================================== */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Resume/CV - Click or hover to preview and download"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          background: isHovered || isOpen
            ? 'linear-gradient(135deg, rgba(16, 24, 39, 0.95) 0%, rgba(6, 78, 59, 0.92) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(6, 78, 59, 0.78) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered || isOpen
            ? '1.5px solid rgba(52, 211, 153, 0.85)'
            : '1.5px solid rgba(52, 211, 153, 0.45)',
          borderRadius: '9999px',
          padding: '0.35rem 0.95rem 0.38rem 0.85rem',
          boxShadow: isHovered || isOpen
            ? '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(52, 211, 153, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
            : '0 8px 20px rgba(0, 0, 0, 0.45), 0 0 12px rgba(52, 211, 153, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          transform: isHovered || isOpen ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none'
        }}
      >
        {/* Pulsing emerald beacon */}
        <span
          style={{
            position: 'relative',
            display: 'flex',
            width: '8px',
            height: '8px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: '#34d399',
              opacity: 0.75,
              animation: 'resumeTagPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}
          />
          <span
            style={{
              position: 'relative',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 8px #34d399'
            }}
          />
        </span>

        {/* Small Tag Text: Resume/CV */}
        <span
          style={{
            fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            fontSize: 'clamp(0.75rem, 0.95vw, 0.85rem)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
          }}
        >
          Resume/CV
        </span>

        {/* Document Icon */}
        <FileText
          size={13}
          style={{
            color: '#34d399',
            opacity: isHovered || isOpen ? 1 : 0.8,
            transition: 'opacity 0.2s ease'
          }}
        />
      </button>

      {/* ===================================================================
          PREVIEW BOX: Opens upwards above the pocket
          Marked data-scrollable="true" so mouse wheel scrolls inside without rotating 360 image
          =================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Resume/CV Preview"
          data-scrollable="true"
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 14px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(340px, 92vw, 680px)',
            maxHeight: 'min(76vh, 660px)',
            backgroundColor: 'rgba(11, 15, 25, 0.98)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 40px rgba(52, 211, 153, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 110,
            animation: 'resumePreviewEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Arrow pointing down towards the pocket tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '14px',
              height: '14px',
              backgroundColor: 'rgba(11, 15, 25, 0.98)',
              borderRight: '1px solid rgba(52, 211, 153, 0.35)',
              borderBottom: '1px solid rgba(52, 211, 153, 0.35)'
            }}
          />

          {/* Top Control Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              zIndex: 2
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}
              >
                <FileText size={16} />
              </span>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#34d399',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  CURRICULUM VITAE
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  Ajinas P — Resume
                </h3>
              </div>
            </div>

            {/* Actions: Download Option, Open PDF, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {/* Download Option Button */}
              <button
                type="button"
                onClick={handleDownload}
                title="Download original Resume in PDF format"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '9999px',
                  backgroundColor: downloadSuccess ? '#059669' : '#34d399',
                  color: downloadSuccess ? '#ffffff' : '#064e3b',
                  border: 'none',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              {/* View Original PDF Link */}
              <a
                href="/Ajinas_P_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title="Open PDF in new tab"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <ExternalLink size={14} />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close resume preview"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ===================================================================
              SCROLLABLE CV BODY:
              Scrolling inside this area ONLY scrolls the CV and does NOT rotate 360 viewer!
              =================================================================== */}
          <div
            ref={scrollContainerRef}
            data-scrollable="true"
            onScroll={handleScroll}
            onWheel={(e) => e.stopPropagation()}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              maxHeight: 'min(64vh, 520px)',
              padding: 'clamp(1rem, 2.5vw, 1.75rem)',
              backgroundColor: '#0a0d14',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              scrollBehavior: 'smooth',
              cursor: 'default',
              userSelect: 'text'
            }}
          >
            {/* The Exact CV Document matching the user's uploaded PDF */}
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                backgroundColor: '#ffffff',
                color: '#000000',
                borderRadius: '6px',
                padding: 'clamp(1.75rem, 4vw, 2.75rem)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: '0.85rem',
                lineHeight: 1.45,
                textAlign: 'left'
              }}
            >
              {/* ==============================================================
                  EXACT PAGE 1
                  ============================================================== */}
              <div>
                {/* Header: Centered Name & Contact */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <h1
                    style={{
                      margin: '0 0 0.45rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '1.65rem',
                      fontWeight: 700,
                      color: '#000000',
                      letterSpacing: '0.01em'
                    }}
                  >
                    Ajinas P
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.85rem',
                      color: '#000000'
                    }}
                  >
                    parachikottilajinas@gmail.com | +919074018646 | Kerala, India
                  </p>
                </div>

                {/* PROFILE Section (No line under title) */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.65rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#000000'
                    }}
                  >
                    PROFILE
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.825rem',
                      lineHeight: 1.5,
                      color: '#000000'
                    }}
                  >
                    Software Engineer with 3+ years of professional experience developing and maintaining web
                    applications using C#, ASP.NET Core, ASP.NET Web API, Angular, and SQL Server. Experienced
                    in RESTful API development, database-backed business functionality, third-party API integration,
                    and full-stack application delivery. Contributes across the software development lifecycle, including
                    requirements collaboration, implementation, debugging, testing, deployment, and production
                    support.
                  </p>
                </div>

                {/* EDUCATION Section (No line under title) */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.65rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#000000'
                    }}
                  >
                    EDUCATION
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: '#000000'
                      }}
                    >
                      Bachelor of Technology (B.Tech), Computer Science and Engineering,
                    </strong>
                    <span
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.8rem',
                        color: '#000000',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Feb 2019 - Mar 2023
                    </span>
                  </div>

                  <div style={{ fontSize: '0.825rem', color: '#000000', marginTop: '0.15rem' }}>
                    MEA Engineering College, Perinthalmanna
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#000000' }}>Cumulative GPA: 7/10</div>
                  <div style={{ fontSize: '0.825rem', color: '#000000' }}>
                    APJ Abdul Kalam Technological University
                  </div>
                </div>

                {/* WORK EXPERIENCE Section (No line under title) */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.65rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#000000'
                    }}
                  >
                    WORK EXPERIENCE
                  </h2>

                  {/* Company & Location line */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#000000'
                      }}
                    >
                      Benzy Infotech Pvt. Ltd.
                    </strong>
                    <span
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.8rem',
                        color: '#000000',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Ajman - United Arab Emirates
                    </span>
                  </div>

                  {/* Role & Duration line */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '0.5rem',
                      gap: '0.5rem'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.825rem',
                        fontStyle: 'italic',
                        color: '#000000'
                      }}
                    >
                      Software Engineer
                    </span>
                    <span
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.8rem',
                        color: '#000000',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      May 2023 - Present
                    </span>
                  </div>

                  {/* Experience bullet points */}
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      fontSize: '0.825rem',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      lineHeight: 1.45
                    }}
                  >
                    <li>
                      Developed and maintained full-stack web applications using C#, ASP.NET Core, Angular, and
                      SQL Server.
                    </li>
                    <li>
                      Designed and implemented RESTful Web APIs to support application features and communication
                      between frontend and backend components.
                    </li>
                    <li>
                      Implemented backend business logic and data-access functionality using relational databases and
                      Entity Framework Core.
                    </li>
                    <li>Built frontend features using Angular, TypeScript, HTML5, CSS3, and Bootstrap.</li>
                    <li>Integrated external APIs and handled application data processing and error scenarios.</li>
                    <li>
                      Collaborated with cross-functional team members to clarify requirements, deliver features, debug
                      issues, and support releases.
                    </li>
                    <li>
                      Participated in testing, deployment, and production support, with attention to maintainability and
                      application performance.
                    </li>
                  </ul>

                  {/* Project - Tickut */}
                  <div style={{ marginTop: '0.9rem' }}>
                    <div
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: '#000000'
                      }}
                    >
                      Project - Tickut
                    </div>
                    <div
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.8rem',
                        fontStyle: 'italic',
                        color: '#000000',
                        marginBottom: '0.35rem'
                      }}
                    >
                      Travel Platform
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '1.2rem',
                        fontSize: '0.825rem',
                        color: '#000000',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        lineHeight: 1.45
                      }}
                    >
                      <li>
                        Contributed to create a travel platform focused on trip planning and booking-management
                        functionality.
                      </li>
                      <li>Worked on application features as part of the development team.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ==============================================================
                  REALISTIC PAGE BREAK (Divider line between Page 1 and Page 2)
                  ============================================================== */}
              <div
                style={{
                  margin: '2rem -1rem 2rem -1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  color: '#94a3b8',
                  fontFamily: 'sans-serif',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  userSelect: 'none'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                <span>Page 2</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              </div>

              {/* ==============================================================
                  EXACT PAGE 2
                  ============================================================== */}
              <div>
                {/* Technical skills (Sentence case with horizontal line below) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.35rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#000000'
                    }}
                  >
                    Technical skills
                  </h2>
                  <div style={{ height: '1px', backgroundColor: '#000000', marginBottom: '0.75rem' }} />

                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      fontSize: '0.825rem',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      lineHeight: 1.5
                    }}
                  >
                    <li>
                      <strong>Programming :</strong> C#, Python, JavaScript, TypeScript, SQL
                    </li>
                    <li>
                      <strong>Frontend :</strong> Angular, HTML5, CSS3, Bootstrap
                    </li>
                    <li>
                      <strong>Backend & APIs :</strong> ASP.NET Core, ASP.NET Web API, .NET 8, .NET Framework,
                      RESTful APIs, Entity Framework Core
                    </li>
                    <li>
                      <strong>Databases :</strong> Microsoft SQL Server, MySQL
                    </li>
                  </ul>
                </div>

                {/* Certifications (With horizontal line below) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.35rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#000000'
                    }}
                  >
                    Certifications
                  </h2>
                  <div style={{ height: '1px', backgroundColor: '#000000', marginBottom: '0.75rem' }} />

                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      fontSize: '0.825rem',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      lineHeight: 1.45
                    }}
                  >
                    <li>Certified Engineer in Computer Science and Engineering with First Class.</li>
                    <li>Certificate of Completion in ASP.NET Core and C# Fundamentals.</li>
                    <li>Certificate of Completion in Microsoft Azure Fundamentals (AZ-900).</li>
                    <li>Certificate of Completion in Angular Basics.</li>
                  </ul>
                </div>

                {/* Languages (With horizontal line below) */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <h2
                    style={{
                      margin: '0 0 0.35rem 0',
                      fontFamily: "'Times New Roman', Times, serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#000000'
                    }}
                  >
                    Languages
                  </h2>
                  <div style={{ height: '1px', backgroundColor: '#000000', marginBottom: '0.75rem' }} />

                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      fontSize: '0.825rem',
                      color: '#000000',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      lineHeight: 1.45
                    }}
                  >
                    <li>
                      <strong>English</strong> — Professional Working Proficiency
                    </li>
                    <li>
                      <strong>Malayalam</strong> — Native Proficiency
                    </li>
                    <li>
                      <strong>Hindi</strong> — Basic Proficiency
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar with Scroll Hint & Direct Download */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              zIndex: 2
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.6875rem',
                color: 'rgba(255, 255, 255, 0.55)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              {!hasScrolled ? (
                <>
                  <ArrowDown size={13} style={{ color: '#34d399', animation: 'bounceDown 1.5s infinite' }} />
                  <span>Scroll down inside box to view Page 2</span>
                </>
              ) : (
                <span>Complete 2-Page CV • Ajinas_P_Resume.pdf</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                backgroundColor: downloadSuccess ? '#059669' : '#34d399',
                color: downloadSuccess ? '#ffffff' : '#064e3b',
                border: 'none',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes resumeTagPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes resumePreviewEntrance {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(8px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes bounceDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }
      `}</style>
    </div>
  );
}
