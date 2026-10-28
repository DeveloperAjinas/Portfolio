import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Copy, Check, X, Sparkles, Share2 } from 'lucide-react';
import { GithubIcon, InstagramIcon, WhatsAppIcon, XIcon } from './Icons';

/**
 * SocialDock Component
 * 
 * - Positioned at middle-bottom of the screen
 * - Tag labeled "Social Media"
 * - When cursor hovers over (or clicks/taps) the tag, it reveals the popup box
 *   with Instagram, WhatsApp, and X profiles
 * - Isolated event handling so interacting never drags or rotates the 360 turntable
 */
export default function SocialDock({ currentDegree = 0, isReady = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Facing forward around 0° (within ±22°) - exactly like LinkedIn, Resume, and About Me
  const isFacingFront = currentDegree <= 22 || currentDegree >= 338;

  // When turntable rotates away from front, smoothly close popup
  useEffect(() => {
    if (!isFacingFront) {
      setIsOpen(false);
      setIsPinned(false);
    }
  }, [isFacingFront]);

  const socials = [
    {
      id: 'github',
      name: 'GitHub',
      handle: 'DeveloperAjinas',
      url: 'https://github.com/DeveloperAjinas',
      copyValue: 'https://github.com/DeveloperAjinas',
      icon: <GithubIcon size={18} />,
      accentColor: '#ffffff',
      bgGradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.12) 0%, rgba(100, 116, 139, 0.15) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.28)',
      btnBg: 'linear-gradient(135deg, #24292e 0%, #161b22 100%)',
      btnTextColor: '#ffffff',
      btnBorder: '1px solid rgba(255, 255, 255, 0.25)',
      btnText: 'Explore'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@ajinas___pk',
      url: 'https://www.instagram.com/ajinas___pk?exln=MXRpZ2Zsa2QzdTR0bQ%3D%3D&utm_source=qr',
      copyValue: 'https://www.instagram.com/ajinas___pk',
      icon: <InstagramIcon size={18} />,
      accentColor: '#e1306c',
      bgGradient: 'linear-gradient(45deg, rgba(240, 148, 51, 0.15) 0%, rgba(220, 39, 67, 0.15) 100%)',
      borderColor: 'rgba(225, 48, 108, 0.35)',
      btnBg: 'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
      btnText: 'Follow'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: '+919074018646',
      url: 'https://wa.me/919074018646',
      copyValue: '+919074018646',
      icon: <WhatsAppIcon size={18} />,
      accentColor: '#25D366',
      bgGradient: 'linear-gradient(45deg, rgba(37, 211, 102, 0.15) 0%, rgba(18, 140, 126, 0.15) 100%)',
      borderColor: 'rgba(37, 211, 102, 0.35)',
      btnBg: '#25D366',
      btnText: 'Chat'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@ajinas56596336',
      url: 'https://x.com/ajinas56596336?s=11',
      copyValue: 'https://x.com/ajinas56596336',
      icon: <XIcon size={16} />,
      accentColor: '#ffffff',
      bgGradient: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(150, 150, 150, 0.1) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      btnBg: '#ffffff',
      btnTextColor: '#000000',
      btnText: 'Follow'
    }
  ];

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

  const copyToClipboard = (text, type, e) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
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
      data-scrollable="true"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        bottom: 'clamp(1.25rem, 3.2vh, 2.25rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        userSelect: 'none',
        pointerEvents: isFacingFront ? 'auto' : 'none',
        opacity: isFacingFront ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* ===================================================================
          MIDDLE BOTTOM TAG: "Social Media"
          =================================================================== */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Social Media - Hover or click to open links"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          background: isHovered || isOpen
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.96) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.88) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered || isOpen
            ? '1.5px solid rgba(56, 189, 248, 0.85)'
            : '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '9999px',
          padding: '0.4rem 1.1rem 0.42rem 0.95rem',
          boxShadow: isHovered || isOpen
            ? '0 12px 30px rgba(0, 0, 0, 0.65), 0 0 22px rgba(56, 189, 248, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
            : '0 8px 20px rgba(0, 0, 0, 0.45), 0 0 14px rgba(56, 189, 248, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transform: isHovered || isOpen ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none'
        }}
      >
        {/* Pulsing indicator beacon */}
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
              animation: 'socialTagPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
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

        {/* Small Tag Text: Social Media */}
        <span
          style={{
            fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            fontSize: 'clamp(0.78rem, 0.95vw, 0.875rem)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
          }}
        >
          Social Media
        </span>

        {/* Share Icon */}
        <Share2
          size={14}
          style={{
            color: '#38bdf8',
            opacity: isHovered || isOpen ? 1 : 0.85,
            transition: 'opacity 0.2s ease'
          }}
        />
      </button>

      {/* ===================================================================
          POP-UP BOX: Triggered while cursor is on the Social Media tag (or clicked)
          Shows Instagram, WhatsApp, X
          =================================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Social media links"
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
            width: 'clamp(310px, 90vw, 380px)',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            backgroundColor: 'rgba(11, 15, 25, 0.98)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            padding: '1.15rem',
            zIndex: 110,
            animation: 'socialPopupEntrance 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default'
          }}
        >
          {/* Arrow pointing down to the Social Media button */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '14px',
              height: '14px',
              backgroundColor: 'rgba(11, 15, 25, 0.98)',
              borderRight: '1px solid rgba(56, 189, 248, 0.35)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.35)'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <Sparkles size={14} />
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
                  CONNECT & FOLLOW
                </span>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  Social Media
                </h4>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close social popup"
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

          {/* Social Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {socials.map((social) => {
              const isCopied = copiedType === social.id;

              return (
                <div
                  key={social.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    border: `1px solid ${social.borderColor}`,
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Left: Icon & Name/Handle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: social.bgGradient,
                        border: `1px solid ${social.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: social.accentColor,
                        flexShrink: 0
                      }}
                    >
                      {social.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-heading, 'Inter', sans-serif)",
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          display: 'block',
                          lineHeight: 1.2
                        }}
                      >
                        {social.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.7rem',
                          color: 'rgba(255, 255, 255, 0.65)',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {social.handle}
                      </span>
                    </div>
                  </div>

                  {/* Right: Copy & Open Link Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard(social.copyValue, social.id, e)}
                      title={`Copy ${social.name}`}
                      style={{
                        background: isCopied ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        border: isCopied
                          ? '1px solid rgba(52, 211, 153, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '7px',
                        padding: '0.35rem 0.55rem',
                        color: isCopied ? '#34d399' : 'rgba(255, 255, 255, 0.75)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono, monospace)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isCopied ? <Check size={11} /> : <Copy size={11} />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${social.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '9999px',
                        background: social.btnBg,
                        border: social.btnBorder || 'none',
                        color: social.btnTextColor || '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono, monospace)',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{social.btnText}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes socialTagPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes socialPopupEntrance {
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
