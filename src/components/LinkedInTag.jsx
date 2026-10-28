import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, Copy, Check, X, Sparkles } from 'lucide-react';
import { LinkedinIcon } from './Icons';

/**
 * Calculates suit right pocket (wearer's right / viewer's left) position
 * based on 1920x1080 16:9 cover canvas geometry
 */
function calculateRightPocketPosition() {
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

  // Right pocket anchor coordinates on ezgif-frame-001.jpg (1920 x 1080)
  // Horizontal center of right pocket: 38.8% (745 / 1920)
  // Vertical center of pocket: 76.8% (830 / 1080)
  const targetLeft = drawX + drawW * 0.388;
  const targetTop = drawY + drawH * 0.768;

  // Clamp within viewport for mobile responsiveness
  const left = Math.min(Math.max(55, targetLeft), displayWidth - 55);
  const top = Math.min(Math.max(55, targetTop), displayHeight - 55);

  return { top, left };
}

/**
 * LinkedInTag Component
 * 
 * - Pinned to the right pocket of the suit jacket
 * - Displays a sleek "LinkedIn" tag
 * - On hover or click, reveals the direct profile link (www.linkedin.com/in/ajinas-mkd-751893285)
 * - Offers direct "Connect on LinkedIn" link and one-click copy button
 * - Fades away smoothly when turntable rotates away from front view
 */
export default function LinkedInTag({ currentDegree = 0, isReady = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState(calculateRightPocketPosition);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const LINKEDIN_URL = 'https://www.linkedin.com/in/ajinas-mkd-751893285';
  const DISPLAY_URL = 'linkedin.com/in/ajinas-mkd-751893285';

  // Pocket is facing forward around 0° (within ±22°)
  const isFacingFront = currentDegree <= 22 || currentDegree >= 338;

  const updatePosition = useCallback(() => {
    setPos(calculateRightPocketPosition());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
    };
  }, [updatePosition]);

  // When turntable rotates away, close popup
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

  const copyToClipboard = (e) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(LINKEDIN_URL).catch(() => fallbackCopy(LINKEDIN_URL));
    } else {
      fallbackCopy(LINKEDIN_URL);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
    } catch {}
    document.body.removeChild(el);
  };

  if (!isReady) return null;

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
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
          RIGHT POCKET TAG: "LinkedIn"
          =================================================================== */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="LinkedIn Profile - Click or hover to open link"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          background: isHovered || isOpen
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 102, 194, 0.92) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 102, 194, 0.78) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered || isOpen
            ? '1.5px solid rgba(56, 189, 248, 0.85)'
            : '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '9999px',
          padding: '0.35rem 0.95rem 0.38rem 0.85rem',
          boxShadow: isHovered || isOpen
            ? '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(10, 102, 194, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
            : '0 8px 20px rgba(0, 0, 0, 0.45), 0 0 12px rgba(10, 102, 194, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
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
        {/* Pulsing blue beacon */}
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
              animation: 'linkedinTagPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
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

        {/* Small Tag Text: LinkedIn */}
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
          LinkedIn
        </span>

        {/* LinkedIn Icon */}
        <LinkedinIcon
          size={14}
          style={{
            color: '#38bdf8',
            opacity: isHovered || isOpen ? 1 : 0.85,
            transition: 'opacity 0.2s ease'
          }}
        />
      </button>

      {/* ===================================================================
          POP-UP CARD: Displays LinkedIn Profile link & quick actions
          Opens upwards above the right pocket
          =================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="LinkedIn Profile details"
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
            width: 'clamp(310px, 88vw, 380px)',
            backgroundColor: 'rgba(11, 15, 25, 0.98)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(10, 102, 194, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.25rem',
            zIndex: 110,
            animation: 'linkedinPopupEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default'
          }}
        >
          {/* Arrow pointing down to the pocket tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '14px',
              height: '14px',
              backgroundColor: 'rgba(11, 15, 25, 0.98)',
              borderRight: '1px solid rgba(14, 165, 233, 0.35)',
              borderBottom: '1px solid rgba(14, 165, 233, 0.35)'
            }}
          />

          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.75rem'
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
                  background: 'rgba(10, 102, 194, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <LinkedinIcon size={16} />
              </span>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  PROFESSIONAL NETWORK
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  LinkedIn Profile
                </h4>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close LinkedIn popup"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
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
              <X size={14} />
            </button>
          </div>

          {/* Profile Details Snippet */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.85rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}
                >
                  Ajinas P
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  Software Engineer
                </div>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 600
                }}
              >
                <Sparkles size={11} />
                <span>Verified</span>
              </span>
            </div>

            {/* Profile URL container with Copy option */}
            <div
              style={{
                marginTop: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.65rem',
                gap: '0.5rem'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  color: '#38bdf8',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {DISPLAY_URL}
              </span>

              <button
                type="button"
                onClick={copyToClipboard}
                title="Copy LinkedIn URL"
                style={{
                  background: copied ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: copied
                    ? '1px solid rgba(52, 211, 153, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  color: copied ? '#34d399' : 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? (
                  <>
                    <Check size={11} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Link Action Button */}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: '#0a66c2',
              color: '#ffffff',
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
              fontSize: '0.825rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(10, 102, 194, 0.45)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0077b5';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 102, 194, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0a66c2';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(10, 102, 194, 0.45)';
            }}
          >
            <span>Connect on LinkedIn</span>
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes linkedinTagPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes linkedinPopupEntrance {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(8px) scale(0.97);
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
