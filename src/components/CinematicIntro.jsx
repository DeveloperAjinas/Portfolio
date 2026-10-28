import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * SECTION ONE: FULL-SCREEN CINEMATIC VIDEO EXPERIENCE
 * 
 * Strict Requirements:
 * - 100vw x 100vh full-screen immersion
 * - Pure cinematic visual (no hero headlines, no profile overlay, no CTA buttons)
 * - Auto-plays muted & looped
 * - Graceful fallback to cinematic atmospheric poster if video asset is not yet added
 * - Clear indication for developer where to drop their video: /public/videos/portfolio-intro.mp4
 */
export default function CinematicIntro() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);
  const videoRef = useRef(null);

  // Monitor scroll to smoothly fade out any subtle screen cues
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolledPast(true);
      } else {
        setScrolledPast(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Try to play video automatically on mount
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch(() => {
            // Browser autoplay policy might restrict or file not yet loaded
          });
      }
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section 
      id="cinematic-intro" 
      aria-label="Cinematic Video Introduction"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#040507',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Primary Video Element */}
      <video
        ref={videoRef}
        src="/videos/portfolio-intro.mp4"
        poster="/videos/portfolio-intro-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        onError={() => setVideoFailed(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: videoFailed ? 0 : 1,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Atmospheric Cinematic Fallback (active if video is missing or loading) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/videos/portfolio-intro-poster.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          filter: 'brightness(0.92) contrast(1.05)'
        }}
        className={videoFailed || !videoLoaded ? 'cinematic-drift' : ''}
      />

      {/* Cinematic Vignette & Lighting Gradients (Enhances depth without obscuring) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 7, 9, 0.1) 0%, rgba(6, 7, 9, 0.45) 80%, rgba(6, 7, 9, 0.85) 100%)',
        }}
      />

      {/* Subtle bottom fade to create seamless transition into portfolio */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          zIndex: 3,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, rgba(6, 7, 9, 0.95) 85%, var(--bg-primary) 100%)'
        }}
      />

      {/* Developer Asset Notice (Minimal, elegant, appears only if video is missing) */}
      {videoFailed && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 'clamp(1.5rem, 5vw, 4rem)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(10, 12, 16, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: scrolledPast ? 0 : 0.85,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
          <span>Cinematic Reel Preview // Custom Video Path: /public/videos/portfolio-intro.mp4</span>
        </div>
      )}

      {/* Minimalist Audio Control (Visible only when real video is active, unobtrusive) */}
      {!videoFailed && videoLoaded && (
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute cinematic audio" : "Mute audio"}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: 'clamp(1.5rem, 5vw, 4rem)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(10, 12, 16, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: scrolledPast ? 0 : 0.75,
            transition: 'opacity 0.4s ease, transform 0.2s ease, border-color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = scrolledPast ? '0' : '0.75'; }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Pure Cinematic Scroll Cue (Ultra-subtle 1px hairline, fades upon scroll) */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.625rem',
          opacity: scrolledPast ? 0 : 0.7,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none'
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            fontWeight: 400
          }}
        >
          Scroll to enter portfolio
        </span>
        <div 
          className="scroll-indicator-pulse"
          style={{
            width: '1px',
            height: '32px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent)'
          }}
        />
      </div>
    </section>
  );
}
