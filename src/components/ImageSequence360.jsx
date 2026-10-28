import React, { useEffect, useRef, useState, useCallback } from 'react';
import AboutMeTag from './AboutMeTag';
import ResumeTag from './ResumeTag';
import LinkedInTag from './LinkedInTag';
import ContactWatermarkTag from './ContactWatermarkTag';
import SocialDock from './SocialDock';
import PersonalBio from './PersonalBio';

/**
 * 360-Degree Interactive Image Sequence Turntable
 * 
 * Features:
 * - Fixed 100vw x 100vh viewport (page does NOT scroll down)
 * - Wheel scrolling scrubs smoothly through 300 frames (001 - 300) in 360° rotation
 * - Also supports mouse drag and mobile touch swipe for seamless 360° interaction
 * - Outstanding, luxury editorial typography for "Ajinas P"
 * - High-performance HTML5 Canvas rendering with automatic devicePixelRatio scaling
 */
export default function ImageSequence360() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const TOTAL_FRAMES = 300;
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);
  const animationFrameIdRef = useRef(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [currentDegree, setCurrentDegree] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Helper to format frame path: /Images/ezgif-frame-001.jpg with 2160p cache buster
  const getFramePath = (index) => {
    const frameNum = String(index + 1).padStart(3, '0');
    return `/Images/ezgif-frame-${frameNum}.jpg?v=2160p`;
  };

  // Draw current frame onto the canvas in full-screen 4K cover mode
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    // 4K Ultra-crisp high-density resolution buffer
    const bufferWidth = Math.round(displayWidth * dpr);
    const bufferHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    ctx.save();
    // Clear buffer
    ctx.clearRect(0, 0, bufferWidth, bufferHeight);

    // Enable maximum 4K rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Apply micro-contrast and edge clarity filter for crisp 4K visual finish
    ctx.filter = 'contrast(1.08) brightness(1.02) saturate(1.04)';

    // Scale to display coordinates
    ctx.scale(bufferWidth / displayWidth, bufferHeight / displayHeight);

    // FILL SCREEN FULL (object-fit: cover, edge-to-edge, no letterboxing)
    const imgRatio = img.naturalWidth / img.naturalHeight;
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

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }, []);

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    const update = () => {
      // Smooth interpolation towards target frame
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.25;
        
        // Normalize frame index to [0, TOTAL_FRAMES - 1]
        let normalized = Math.round(currentFrameRef.current) % TOTAL_FRAMES;
        if (normalized < 0) normalized += TOTAL_FRAMES;

        drawFrame(normalized);
        const deg = Math.round((normalized / TOTAL_FRAMES) * 360);
        setCurrentDegree(deg);
      }

      animationFrameIdRef.current = requestAnimationFrame(update);
    };

    animationFrameIdRef.current = requestAnimationFrame(update);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawFrame]);

  // Preload all 300 image frames
  useEffect(() => {
    let mounted = true;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        if (!mounted) return;
        setLoadedCount((prev) => {
          const next = prev + 1;
          if (next === 1) {
            drawFrame(0);
            setIsReady(true);
          }
          return next;
        });
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      mounted = false;
    };
  }, [drawFrame]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      let normalized = Math.round(currentFrameRef.current) % TOTAL_FRAMES;
      if (normalized < 0) normalized += TOTAL_FRAMES;
      drawFrame(normalized);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Wheel listener: DOES NOT SCROLL DOWN, rotates in 360 degrees
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // If scrolling inside any element marked with data-scrollable="true", let the element scroll and DO NOT rotate the 360 image
      if (e.target && e.target.closest && e.target.closest('[data-scrollable="true"]')) {
        return;
      }

      e.preventDefault(); // Prevent standard page scroll down

      // Sensitivity factor
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const sensitivity = 0.45;
      targetFrameRef.current += delta * sensitivity;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Mouse drag & Touch swipe support
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartFrameRef.current = targetFrameRef.current;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = clientX - dragStartXRef.current;
    const sensitivity = 0.65;
    targetFrameRef.current = dragStartFrameRef.current - diff * sensitivity;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#0a0c10',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}
    >
      {/* 4K Full-Screen Canvas covering 100% of viewport edge-to-edge */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block',
          zIndex: 1,
          pointerEvents: 'none',
          imageRendering: '-webkit-optimize-contrast'
        }}
      />

      {/* FOREHEAD INTERACTIVE TAG: About me with profile popup */}
      <AboutMeTag currentDegree={currentDegree} isReady={isReady} />

      {/* SHIRT POCKET INTERACTIVE TAG: Resume/CV with preview & PDF download */}
      <ResumeTag currentDegree={currentDegree} isReady={isReady} />

      {/* RIGHT POCKET INTERACTIVE TAG: LinkedIn Profile */}
      <LinkedInTag currentDegree={currentDegree} isReady={isReady} />

      {/* WATERMARK CONTACT MARK: Covers star watermark on every rotation with Call & Gmail */}
      <ContactWatermarkTag isReady={isReady} />

      {/* MIDDLE BOTTOM SOCIAL MEDIA DOCK: Instagram, WhatsApp, X */}
      <SocialDock currentDegree={currentDegree} isReady={isReady} />

      {/* TOP PERIMETER: AJINAS P (Positioned in corner so it NEVER blocks the center image) */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: 'clamp(1.5rem, 3.5vw, 2.75rem) clamp(1.5rem, 4vw, 3.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {/* Name in Top-Left Corner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Cinzel', 'Syne', serif",
              fontWeight: 800,
              fontSize: 'clamp(1.85rem, 3.8vw, 3rem)',
              letterSpacing: 'clamp(0.08em, 1.2vw, 0.16em)',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1.05,
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.9)',
              background: 'linear-gradient(180deg, #ffffff 30%, #e2e8f0 70%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ajinas P
          </h1>

          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 'clamp(0.7rem, 1vw, 0.8125rem)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.65)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
            }}
          >
            SOFTWARE ENGINEER
          </div>

          {/* Personal Bio (Desktop dock card + Mobile slide-up drawer) */}
          <PersonalBio />
        </div>
      </header>

      {/* Loading Progress Bar (visible only while caching all 300 frames) */}
      {loadedCount < TOTAL_FRAMES && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: `${(loadedCount / TOTAL_FRAMES) * 100}%`,
              height: '100%',
              backgroundColor: '#38bdf8',
              transition: 'width 0.15s ease'
            }}
          />
        </div>
      )}
    </div>
  );
}
