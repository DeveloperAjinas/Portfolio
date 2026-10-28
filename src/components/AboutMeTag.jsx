import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, Code2 } from 'lucide-react';

/**
 * Calculates forehead position based on 1920x1080 16:9 cover canvas geometry
 */
function calculateForeheadPosition() {
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

  // Forehead anchor coordinates on ezgif-frame-001.jpg (1920 x 1080)
  // Horizontal center: 50.0% (960 / 1920)
  // Forehead vertical center: 25.5% (275 / 1080)
  const left = drawX + drawW * 0.50;
  const top = drawY + drawH * 0.255;

  return { top, left };
}

/**
 * AboutMeTag Component
 * 
 * - Accurately pinned to the forehead of the central portrait in the 360 turntable
 * - Small, sleek interactive tag labeled "About me"
 * - Displays an elegant luxury glassmorphic popup box on hover or click
 * - Shows the complete professional summary and key tech stack
 * - Fully stops event propagation to prevent interfering with 360 viewer rotation
 */
export default function AboutMeTag({ currentDegree = 0, isReady = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState(calculateForeheadPosition);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Forehead is facing forward around 0° (within ±22°)
  const isFacingFront = currentDegree <= 22 || currentDegree >= 338;

  const updatePosition = useCallback(() => {
    setPos(calculateForeheadPosition());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
    };
  }, [updatePosition]);

  // When turntable rotates away from the front, smoothly dismiss popup
  useEffect(() => {
    if (!isFacingFront) {
      setIsOpen(false);
      setIsPinned(false);
    }
  }, [isFacingFront]);

  // Close when clicking outside
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

  // Hover Handlers with safety debounce timer
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
      }, 300);
    }
  };

  const handlePopupMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePopupMouseLeave = () => {
    if (!isPinned) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 250);
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
          FOREHEAD TAG: "About me"
          =================================================================== */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="About me - Click or hover to open profile summary"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          background: isHovered || isOpen
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.96) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.82) 0%, rgba(30, 41, 59, 0.85) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered || isOpen
            ? '1.5px solid rgba(56, 189, 248, 0.8)'
            : '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '9999px',
          padding: '0.35rem 0.95rem 0.38rem 0.85rem',
          boxShadow: isHovered || isOpen
            ? '0 12px 28px rgba(0, 0, 0, 0.55), 0 0 20px rgba(56, 189, 248, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
            : '0 8px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(56, 189, 248, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
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
        {/* Pulsing cyan indicator beacon */}
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
              backgroundColor: '#38bdf8',
              opacity: 0.75,
              animation: 'aboutTagPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}
          />
          <span
            style={{
              position: 'relative',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8'
            }}
          />
        </span>

        {/* Small Tag Text: About me */}
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
          About me
        </span>

        {/* Subtle sparkle icon */}
        <Sparkles
          size={12}
          style={{
            color: '#38bdf8',
            opacity: isHovered || isOpen ? 1 : 0.75,
            transition: 'opacity 0.2s ease'
          }}
        />
      </button>

      {/* ===================================================================
          POP-UP BOX: Triggered on Hover or Click
          =================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="About me details"
          data-scrollable="true"
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 14px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(320px, 88vw, 560px)',
            maxHeight: 'min(70vh, 520px)',
            backgroundColor: 'rgba(11, 15, 25, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderRadius: '20px',
            padding: 'clamp(1.2rem, 2.5vw, 1.75rem)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            zIndex: 110,
            overflowY: 'auto',
            animation: 'aboutPopupEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default',
            textAlign: 'left'
          }}
        >
          {/* Top Arrow pointing directly up to the tag */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '14px',
              height: '14px',
              backgroundColor: 'rgba(11, 15, 25, 0.96)',
              borderLeft: '1px solid rgba(56, 189, 248, 0.28)',
              borderTop: '1px solid rgba(56, 189, 248, 0.28)'
            }}
          />

          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.8rem'
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
                  background: 'rgba(56, 189, 248, 0.14)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                <Code2 size={16} />
              </span>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  PROFILE SUMMARY
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  About me
                </h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close popup"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Exact Requested About Me Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body, 'Inter', sans-serif)",
                fontSize: 'clamp(0.85rem, 1vw, 0.9375rem)',
                lineHeight: 1.72,
                color: '#e2e8f0',
                letterSpacing: '0.01em'
              }}
            >
              Software Engineer with 3+ years of professional experience developing and maintaining web
              applications using C#, ASP.NET Core, ASP.NET Web API, Angular, and SQL Server. Experienced
              in RESTful API development, database-backed business functionality, third-party API integration,
              and full-stack application delivery. Contributes across the software development lifecycle, including
              requirements collaboration, implementation, debugging, testing, deployment, and production
              support
            </p>
          </div>

          {/* Core Technologies Tag Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.45rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {[
              'C#',
              'ASP.NET Core',
              'ASP.NET Web API',
              'Angular',
              'SQL Server',
              'RESTful APIs',
              'Full-Stack Delivery'
            ].map((skill, index) => (
              <span
                key={index}
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.04em',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#bae6fd',
                  fontWeight: 500
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Footer note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
              paddingTop: '0.2rem'
            }}
          >
            <span>3+ Years Experience</span>
            <span>{isPinned ? 'Pinned (Click × or outside to close)' : 'Hover or click to keep open'}</span>
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes aboutTagPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes aboutPopupEntrance {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-8px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
