import { useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamically load any spread images the user drops in
const spreadModules = import.meta.glob('../assets/imgs/spread*.{png,jpg,jpeg,webp}', { eager: true });
const SPREADS = Object.keys(spreadModules)
  .sort()
  .map((k) => spreadModules[k].default);

// Fallback: use riding images if no spreads exist yet
const ridingModules = import.meta.glob('../assets/imgs/*Riding.{png,jpg}', { eager: true });
const RIDING_FALLBACK = Object.keys(ridingModules)
  .sort()
  .slice(0, 6)
  .map((k) => ridingModules[k].default);

function PageFlipTeaser() {
  const { t } = useTranslation();
  const containerRef = useRef();
  const bookRef = useRef();

  const pages = SPREADS.length > 0 ? SPREADS : RIDING_FALLBACK;
  const totalPages = Math.min(pages.length, 6);

  useEffect(() => {
    const container = containerRef.current;
    const book = bookRef.current;
    if (!container || !book || totalPages === 0) return;

    const pageEls = book.querySelectorAll('.flip-page');

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from('.teaser-heading', {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          once: true,
        },
      });

      // Pin the section and scrub through page flips
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalPages * 180}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      pageEls.forEach((page, i) => {
        tl.to(
          page,
          {
            rotateY: -180,
            duration: 1,
            ease: 'power2.inOut',
          },
          i * 1
        );
      });
    }, container);

    return () => ctx.revert();
  }, [totalPages]);

  if (totalPages === 0) return null;

  return (
    <section
      ref={containerRef}
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
      <div className="teaser-heading" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontFamily: '"Rio Grande", "Bangers", cursive',
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

      {/* 3D book container */}
      <div
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          ref={bookRef}
          style={{
            position: 'relative',
            width: 'clamp(280px, 45vw, 520px)',
            height: 'clamp(350px, 55vw, 650px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {pages.slice(0, totalPages).map((src, i) => (
            <div
              key={i}
              className="flip-page"
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                // Stack pages so later ones are on top initially
                zIndex: totalPages - i,
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
                  boxShadow: '4px 0 20px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.15) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Back face (visible when flipped) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: '#f3e4d2',
                  borderRadius: '12px 4px 4px 12px',
                  overflow: 'hidden',
                  boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* Show next page or a decorative back */}
                {pages[i + 1] ? (
                  <img
                    src={pages[i + 1]}
                    alt={`Page ${i + 2}`}
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
                      background: 'linear-gradient(135deg, #f3e4d2 0%, #e8c6a1 100%)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Rio Grande", "Bangers", cursive',
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

          {/* Book spine / shadow */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '6px',
              background: 'linear-gradient(to right, #5a2800, #a95c14)',
              borderRadius: '3px 0 0 3px',
              zIndex: totalPages + 1,
            }}
          />
        </div>
      </div>

      {/* Page indicator */}
      <p
        style={{
          marginTop: '2rem',
          fontFamily: '"Patrick Hand", cursive',
          color: '#a07040',
          fontSize: '0.9rem',
          fontStyle: 'italic',
        }}
      >
        Scroll to turn the pages ↓
      </p>
    </section>
  );
}

export default PageFlipTeaser;
