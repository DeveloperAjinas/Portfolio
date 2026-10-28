import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, Copy, Check, X, PhoneCall, Send, Sparkles } from 'lucide-react';

/**
 * Calculates exact watermark position on the 1920x1080 canvas
 * Clamps coordinates on mobile portrait screens so the contact button is NEVER pushed off-screen
 */
function calculateWatermarkPosition() {
  if (typeof window === 'undefined') {
    return { top: 0, left: 0, size: 72, isMobile: false, displayWidth: 1920 };
  }
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

  // Watermark exact center in 16:9 frame: x = 1740 / 1920 = 0.90625, y = 900 / 1080 = 0.83333
  const targetX = drawX + drawW * 0.90625;
  const targetY = drawY + drawH * 0.83333;

  const isMobile = displayWidth < 768;
  const size = isMobile ? 64 : Math.max(Math.round(drawW * (86 / 1920)), 74);

  // Safe padding from viewport edges (mobile friendly)
  const marginX = isMobile ? 18 : 24;
  const marginY = isMobile ? 20 : 24;

  // Clamping ensures the contact button is GUARANTEED 100% visible on every mobile & desktop screen
  // Desktop: sits exactly over the watermark covering it completely
  // Mobile portrait: docks in the bottom-right viewport so it is never pushed off-screen
  const left = Math.min(Math.max(size / 2 + marginX, targetX), displayWidth - size / 2 - marginX);
  const top = Math.min(Math.max(size / 2 + marginY, targetY), displayHeight - size / 2 - marginY);

  return { top, left, size, isMobile, displayWidth, displayHeight };
}

/**
 * ContactWatermarkTag Component
 * 
 * - Positioned over the watermark and clamped so it is ALWAYS visible on both Mobile and Desktop
 * - Fully covers and hides the watermark on every rotation
 * - Interactive hover & tap reveals options for Call (+919074018646) and Gmail (parachikottilajinas@gmail.com)
 * - Built-in copy clipboard with fallback for mobile devices
 */
export default function ContactWatermarkTag({ isReady = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [pos, setPos] = useState(calculateWatermarkPosition);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const PHONE_NUMBER = '+919074018646';
  const EMAIL_ADDRESS = 'parachikottilajinas@gmail.com';

  const updatePosition = useCallback(() => {
    setPos(calculateWatermarkPosition());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
    };
  }, [updatePosition]);

  // Close when clicking/tapping outside or pressing Escape
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

  // Toggle on click/tap
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

  // Clipboard copy with mobile compatibility fallback
  const copyToClipboard = (text, type, e) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
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
        userSelect: 'none'
      }}
    >
      {/* ===================================================================
          CONTACT MARK BUTTON:
          Visible on EVERY rotation, covers watermark on desktop, docks on mobile
          =================================================================== */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Contact Ajinas P - Tap or hover for Call and Gmail options"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          width: `${pos.size}px`,
          height: `${pos.size}px`,
          borderRadius: '50%',
          backgroundColor: '#0c101a',
          background: isHovered || isOpen
            ? 'radial-gradient(circle at 35% 35%, #1e293b 0%, #0b0f19 80%)'
            : 'radial-gradient(circle at 35% 35%, #172033 0%, #0a0d16 85%)',
          border: isHovered || isOpen
            ? '2px solid rgba(56, 189, 248, 0.95)'
            : '2px solid rgba(56, 189, 248, 0.65)',
          boxShadow: isHovered || isOpen
            ? '0 12px 32px rgba(0, 0, 0, 0.95), 0 0 28px rgba(56, 189, 248, 0.55), inset 0 0 16px rgba(56, 189, 248, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.85), 0 0 16px rgba(56, 189, 248, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          transform: isHovered || isOpen ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
          padding: 0,
          touchAction: 'manipulation'
        }}
      >
        {/* Subtle glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />

        {/* Live indicator beacon */}
        <span
          style={{
            position: 'absolute',
            top: pos.isMobile ? '6px' : '8px',
            right: pos.isMobile ? '6px' : '8px',
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
              animation: 'contactMobilePing 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }}
          />
          <span
            style={{
              position: 'relative',
              display: 'block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8'
            }}
          />
        </span>

        {/* Contact Icon */}
        <div
          style={{
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 2px 6px rgba(56, 189, 248, 0.5))'
          }}
        >
          <PhoneCall size={Math.round(pos.size * 0.34)} />
        </div>

        {/* "Contact" Text Badge */}
        <span
          style={{
            fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            fontSize: pos.isMobile ? '0.625rem' : 'clamp(0.65rem, 0.75vw, 0.72rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#ffffff',
            lineHeight: 1,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          Contact
        </span>
      </button>

      {/* ===================================================================
          POP-UP OPTIONS: Shows Call & Gmail
          Responsive positioning: opens comfortably above and aligned to stay within viewport
          =================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Contact options"
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
            right: `${Math.round(pos.size / 2) - 30}px`,
            width: 'clamp(280px, 86vw, 350px)',
            backgroundColor: 'rgba(11, 15, 25, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            padding: '1.15rem',
            zIndex: 110,
            animation: 'contactPopupEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default',
            maxWidth: 'calc(100vw - 32px)'
          }}
        >
          {/* Arrow pointing down to the Contact mark */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '22px',
              width: '14px',
              height: '14px',
              backgroundColor: 'rgba(11, 15, 25, 0.98)',
              borderRight: '1px solid rgba(56, 189, 248, 0.35)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.35)',
              transform: 'rotate(45deg)'
            }}
          />

          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8'
                }}
              >
                <Sparkles size={13} />
              </span>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  GET IN TOUCH
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  Contact Ajinas P
                </h4>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close contact options"
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
            >
              <X size={14} />
            </button>
          </div>

          {/* Option 1: CALL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              gap: '0.5rem'
            }}
          >
            <a
              href={`tel:${PHONE_NUMBER}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                flex: 1,
                minWidth: 0
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  flexShrink: 0
                }}
              >
                <Phone size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  Call
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {PHONE_NUMBER}
                </span>
              </div>
            </a>

            {/* Quick Copy Button */}
            <button
              type="button"
              onClick={(e) => copyToClipboard(PHONE_NUMBER, 'call', e)}
              title="Copy phone number"
              style={{
                background: copiedType === 'call' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: copiedType === 'call'
                  ? '1px solid rgba(52, 211, 153, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: copiedType === 'call' ? '#34d399' : 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono, monospace)',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {copiedType === 'call' ? (
                <>
                  <Check size={12} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Option 2: GMAIL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              gap: '0.5rem'
            }}
          >
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                flex: 1,
                minWidth: 0
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171',
                  flexShrink: 0
                }}
              >
                <Mail size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#f87171',
                    fontWeight: 600,
                    display: 'block'
                  }}
                >
                  Gmail
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: '#ffffff',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {EMAIL_ADDRESS}
                </span>
              </div>
            </a>

            {/* Quick Copy Button */}
            <button
              type="button"
              onClick={(e) => copyToClipboard(EMAIL_ADDRESS, 'gmail', e)}
              title="Copy Gmail address"
              style={{
                background: copiedType === 'gmail' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: copiedType === 'gmail'
                  ? '1px solid rgba(52, 211, 153, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                color: copiedType === 'gmail' ? '#34d399' : 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono, monospace)',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {copiedType === 'gmail' ? (
                <>
                  <Check size={12} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Direct Compose Button */}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.72rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={12} style={{ color: '#38bdf8' }} />
            <span>Open in Gmail Web</span>
          </a>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes contactMobilePing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes contactPopupEntrance {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
