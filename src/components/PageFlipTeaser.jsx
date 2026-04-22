import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';

import coverImg from '../assets/imgs/shared/Bookcover.png';

const rightModules = import.meta.glob('../assets/imgs/pageFlipTeaser/right-img*.{jpg,jpeg,png,webp}', { eager: true });
const rightImgs = Object.keys(rightModules).sort().map((k) => rightModules[k].default);

// Cover leads the right side; character solos fill the left; Coming Soon closes it
const RIGHT_PAGES = [coverImg, ...rightImgs];
//left pages filled by pageFlip*.json files where the content is used to fill in the html
const LEFT_PAGES = [];

const FLIP_THRESHOLD = 60; // degrees — past this on release, complete the flip

function PageFlipTeaser() {
  const { t } = useTranslation();
  const totalPages = RIGHT_PAGES.length;

  const [currentPage, setCurrentPage] = useState(0);
  const pageRefs = useRef([]);
  const animating = useRef(false);
  const drag = useRef(null);

  const getRotY = (el) => gsap.getProperty(el, 'rotateY') || 0;

  const animateTo = useCallback((el, rotY, onComplete) => {
    animating.current = true;
    gsap.to(el, {
      rotateY: rotY,
      duration: 0.55,
      ease: 'power2.out',
      onComplete: () => {
        onComplete?.();
        animating.current = false;
      },
    });
  }, []);

  const flipForward = useCallback((pageIdx) => {
    const el = pageRefs.current[pageIdx];
    if (!el) return;
    animateTo(el, -180, () => setCurrentPage(pageIdx + 1));
  }, [animateTo]);

  const flipBack = useCallback((pageIdx) => {
    const el = pageRefs.current[pageIdx];
    if (!el) return;
    animateTo(el, 0, () => setCurrentPage(pageIdx));
  }, [animateTo]);

  const onPointerDown = useCallback((e, direction) => {
    if (animating.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pageIdx = direction === 'forward' ? currentPage : currentPage - 1;
    const el = pageRefs.current[pageIdx];
    if (!el) return;
    drag.current = { startX: e.clientX, direction, pageIdx, bookW: el.offsetWidth || 400 };
  }, [currentPage]);

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d) return;
    const delta = e.clientX - d.startX;
    const el = pageRefs.current[d.pageIdx];
    if (!el) return;
    const rotY = d.direction === 'forward'
      ? Math.max(-180, Math.min(0, (delta / d.bookW) * 180))
      : Math.max(-180, Math.min(0, -180 + (delta / d.bookW) * 180));
    gsap.set(el, { rotateY: rotY });
  }, []);

  const onPointerUp = useCallback((e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const el = pageRefs.current[d.pageIdx];
    if (!el) return;
    const delta = Math.abs(e.clientX - d.startX);
    // Treat tiny movement as a tap — flip immediately without threshold
    if (delta < 5) {
      d.direction === 'forward' ? flipForward(d.pageIdx) : flipBack(d.pageIdx);
      return;
    }
    const rotY = getRotY(el);
    if (d.direction === 'forward') {
      Math.abs(rotY) > FLIP_THRESHOLD ? flipForward(d.pageIdx) : animateTo(el, 0);
    } else {
      Math.abs(rotY) < 180 - FLIP_THRESHOLD ? flipBack(d.pageIdx) : animateTo(el, -180);
    }
  }, [flipForward, flipBack, animateTo]);

  if (totalPages === 0 || RIGHT_PAGES.length === 0) return null;

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const cornerBase = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: totalPages + 2,
    cursor: 'grab',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0.75rem',
    userSelect: 'none',
    touchAction: 'none',
  };

  const dogEarBase = {
    width: 0,
    height: 0,
    opacity: 0.55,
    transition: 'opacity 0.2s',
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #0d0500 0%, #2a1000 50%, #0d0500 100%)',
        padding: '3rem 2rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: '#f5c87a',
            margin: 0,
            textShadow: '3px 3px 0 #6b2a0a',
            letterSpacing: '2px',
          }}
        >
          {t('teaser.heading')}
        </h2>
        <p
          style={{
            fontFamily: '"Patrick Hand", cursive',
            color: '#d4a055',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            margin: '0.5rem 0 0',
          }}
        >
          {t('teaser.subheading')}
        </p>
      </div>

      {/* 3D book */}
      <div style={{ perspective: '1800px', perspectiveOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'relative',
            width: 'clamp(400px, 82vw, 880px)',
            aspectRatio: '352 / 250',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Left page background — visible before any flip and as base behind flipped pages */}
          <div
            style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0, width: '50%',
              background: '#f5ede3',
              borderRadius: '12px 0 0 12px',
              boxShadow: 'inset -6px 0 12px rgba(0,0,0,0.08)',
            }}
          />

          {RIGHT_PAGES.map((rightSrc, i) => (
            <div
              key={i}
              ref={(el) => (pageRefs.current[i] = el)}
              style={{
                position: 'absolute',
                left: '50%', top: 0, right: 0, bottom: 0,
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                willChange: 'transform',
                zIndex: i < currentPage ? i + 1 : (totalPages * 2) - i,
              }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '4px 12px 12px 4px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  boxShadow: '4px 0 20px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={rightSrc}
                  alt={`Page ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.12) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: '#ffffff',
                  borderRadius: '12px 4px 4px 12px',
                  overflow: 'hidden',
                  boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                }}
              >
                {LEFT_PAGES[i] ? (
                  <img
                    src={LEFT_PAGES[i]}
                    alt={`Character ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Rye", cursive',
                        fontSize: '1.8rem',
                        color: '#a95c14',
                        textAlign: 'center',
                        padding: '2rem',
                      }}
                    >
                      Coming Soon...
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Spine — sits at center (the fold) */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% - 3px)',
              top: 0,
              bottom: 0,
              width: '6px',
              background: 'linear-gradient(to right, #5a2800, #a95c14)',
              zIndex: totalPages + 1,
              boxShadow: '0 0 8px rgba(0,0,0,0.4)',
            }}
          />

          {/* Right drag zone — flip forward */}
          {canGoNext && (
            <div
              onPointerDown={(e) => onPointerDown(e, 'forward')}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ ...cornerBase, right: 0, left: '50%', justifyContent: 'flex-end' }}
            >
              <div style={{ ...dogEarBase, borderLeft: '28px solid transparent', borderBottom: '28px solid #c87828' }} />
            </div>
          )}

          {/* Left drag zone — flip back */}
          {canGoPrev && (
            <div
              onPointerDown={(e) => onPointerDown(e, 'back')}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ ...cornerBase, left: 0, right: '50%', justifyContent: 'flex-start' }}
            >
              <div style={{ ...dogEarBase, borderRight: '28px solid transparent', borderBottom: '28px solid #c87828' }} />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button
          onClick={() => canGoPrev && flipBack(currentPage - 1)}
          disabled={!canGoPrev}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '2rem', lineHeight: 1,
            color: canGoPrev ? '#a07040' : 'rgba(160,112,64,0.25)',
            cursor: canGoPrev ? 'pointer' : 'default',
          }}
        >
          ‹
        </button>
        <p style={{ fontFamily: '"Patrick Hand", cursive', color: '#a07040', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
          {currentPage + 1} / {totalPages}
        </p>
        <button
          onClick={() => canGoNext && flipForward(currentPage)}
          disabled={!canGoNext}
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '2rem', lineHeight: 1,
            color: canGoNext ? '#a07040' : 'rgba(160,112,64,0.25)',
            cursor: canGoNext ? 'pointer' : 'default',
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default PageFlipTeaser;
