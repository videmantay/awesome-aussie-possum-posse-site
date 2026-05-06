import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import brennenSolo from '../assets/imgs/characterParade/brennenSolo.png';
import gretelSolo from '../assets/imgs/characterParade/gretelSolo.png';
import hanaSolo from '../assets/imgs/characterParade/hanaSolo.png';
import plaidSolo from '../assets/imgs/characterParade/plaidSolo.png';
import pygmySolo from '../assets/imgs/characterParade/pygmySolo.png';
import remmySolo from '../assets/imgs/characterParade/remmySolo.png';
import willowSolo from '../assets/imgs/characterParade/willowSolo.png';

const CHARACTER_IDS = ['brennen', 'gretel', 'hana', 'plaid', 'pygmy', 'remmy', 'willow'];
const CHARACTER_IMAGES = {
  brennen: brennenSolo,
  gretel: gretelSolo,
  hana: hanaSolo,
  plaid: plaidSolo,
  pygmy: pygmySolo,
  remmy: remmySolo,
  willow: willowSolo,
};

const CARD_ACCENTS = {
  brennen: '#c45a1a',
  gretel: '#4a8a5a',
  hana: '#8a4a9a',
  plaid: '#c8a010',
  pygmy: '#3a8a50',
  remmy: '#6a6a9a',
  willow: '#4a7a6a',
};

const TOTAL = CHARACTER_IDS.length + 1;
const MAX_CARD_W = 420;
const SIDE_SCALE = 0.74;
const SIDE_OPACITY = 0.38;

// Returns GSAP props for a card based on its distance from the target index
function targetProps(cardIdx, targetIdx, sideOffset) {
  const dist = cardIdx - targetIdx;
  if (dist === 0) {
    return { x: 0, scale: 1, opacity: 1, zIndex: 10 };
  }
  if (dist === -1 && targetIdx > 0) {
    return { x: -sideOffset, scale: SIDE_SCALE, opacity: SIDE_OPACITY, zIndex: 5 };
  }
  if (dist === 1 && targetIdx < TOTAL - 1) {
    return { x: sideOffset, scale: SIDE_SCALE, opacity: SIDE_OPACITY, zIndex: 5 };
  }
  // Off-screen: park further in the direction the card is coming from
  return {
    x: dist < 0 ? -(sideOffset * 2) : sideOffset * 2,
    scale: SIDE_SCALE * 0.7,
    opacity: 0,
    zIndex: 1,
  };
}

function CharacterCard({ id, image, accent }) {
  const { t } = useTranslation();
  return (
    <div
      className="char-card"
      style={{
        width: '100%',
        background: 'rgba(253, 244, 235, 0.96)',
        borderRadius: '20px',
        border: `3px solid ${accent}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${accent}40`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          background: `linear-gradient(160deg, ${accent}22 0%, ${accent}44 100%)`,
          padding: '1.5rem 1rem 0',
          display: 'flex',
          justifyContent: 'center',
          minHeight: 'clamp(160px, 40vw, 260px)',
          alignItems: 'flex-end',
        }}
      >
        <img
          src={image}
          alt={t(`character.${id}.name`)}
          style={{ maxHeight: 'clamp(150px, 38vw, 250px)', width: 'auto', objectFit: 'contain', display: 'block' }}
          loading="lazy"
        />
      </div>

      <div style={{ padding: '1rem 1.25rem 1.5rem', flex: 1 }}>
        <h3
          style={{
            margin: '0 0 0.2rem',
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)',
            color: accent,
            letterSpacing: '1px',
          }}
        >
          {t(`character.${id}.name`)}
        </h3>

        <p
          style={{
            margin: '0 0 0.75rem',
            fontSize: '0.8rem',
            fontFamily: '"Patrick Hand", cursive',
            color: '#96510f',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {t(`character.${id}.species`)}
        </p>

        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '0.9rem',
            fontFamily: '"Baloo 2", sans-serif',
            color: '#5a3a1a',
            lineHeight: 1.5,
          }}
        >
          {t(`character.${id}.blurb`)}
        </p>

        <div
          style={{
            display: 'inline-block',
            background: accent,
            color: '#fff',
            borderRadius: '20px',
            padding: '0.3rem 0.85rem',
            fontSize: '0.78rem',
            fontFamily: '"Bangers", cursive',
            letterSpacing: '1px',
          }}
        >
          ⭐ {t(`character.${id}.skill`)}
        </div>
      </div>
    </div>
  );
}

function CharacterParade() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const cardRefs = useRef([]);
  const wrapperRef = useRef();
  const stageRef = useRef();
  const sideOffsetRef = useRef(270);
  const cardWRef = useRef(320);
  const currentRef = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const applyLayout = () => {
      const w = wrapper.offsetWidth;
      // Fit card inside the arrow buttons (52px padding each side), cap at MAX_CARD_W
      const cardW = Math.min(MAX_CARD_W, Math.max(200, w - 112));
      cardWRef.current = cardW;
      // Side card center: allow overlap on narrow screens
      sideOffsetRef.current = Math.max(cardW * 0.55, (w - cardW) / 2 - 4);

      const stage = stageRef.current;
      if (stage) stage.style.width = cardW + 'px';

      cardRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, targetProps(i, currentRef.current, sideOffsetRef.current));
      });

      // Lock stage to tallest card so height never changes during navigation
      if (stage) {
        const maxH = Math.max(0, ...cardRefs.current.filter(Boolean).map(el => el.offsetHeight));
        if (maxH > 0) stage.style.height = maxH + 'px';
      }
    };

    applyLayout();

    const ro = new ResizeObserver(() => {
      if (!animating.current) applyLayout();
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((next) => {
    if (animating.current || next === currentRef.current) return;
    animating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        currentRef.current = next;
        setCurrent(next);
        animating.current = false;
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (el) {
        tl.to(
          el,
          { ...targetProps(i, next, sideOffsetRef.current), duration: 0.45, ease: 'power2.inOut' },
          0,
        );
      }
    });
  }, []);

  const goPrev = () => { if (currentRef.current > 0) goTo(currentRef.current - 1); };
  const goNext = () => { if (currentRef.current < TOTAL - 1) goTo(currentRef.current + 1); };

  const arrowBase = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(253,244,235,0.15)',
    border: '2px solid rgba(253,244,235,0.5)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fdf4eb',
    fontSize: '1.5rem',
    zIndex: 20,
    transition: 'opacity 0.2s, background 0.2s',
  };

  return (
    <section
      style={{
        background: 'linear-gradient(160deg, #2a1500 0%, #5a2800 40%, #8b4400 70%, #c87828 100%)',
        overflow: 'hidden',
        minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 0',
      }}
    >
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 2rem' }}>
        <h2
          style={{
            margin: 0,
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            color: '#fdf4eb',
            textShadow: '3px 3px 0 #5a2800',
            letterSpacing: '2px',
          }}
        >
          {t('character.sectionTitle')}
        </h2>
        <p
          style={{
            margin: '0.5rem 0 0',
            fontFamily: '"Patrick Hand", cursive',
            fontSize: '1.1rem',
            color: '#f3e4d2',
            fontStyle: 'italic',
          }}
        >
          {t('character.sectionSubtitle')}
        </p>
      </div>

      {/* Carousel wrapper — overflowX:hidden clips side cards at edges */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 52px',
          boxSizing: 'border-box',
        }}
      >
        {/* Prev arrow */}
        <button
          onClick={goPrev}
          aria-label="Previous character"
          style={{
            ...arrowBase,
            left: '4px',
            cursor: current > 0 ? 'pointer' : 'default',
            opacity: current > 0 ? 1 : 0,
            pointerEvents: current > 0 ? 'auto' : 'none',
          }}
        >
          ‹
        </button>

        {/* Card stage — CARD_W wide, centered; cards absolutely layered inside */}
        <div
          ref={stageRef}
          style={{
            position: 'relative',
            width: cardWRef.current,
            margin: '0 auto',
          }}
        >
          {CHARACTER_IDS.map((id, i) => (
            <div
              key={id}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transformOrigin: 'center top',
                willChange: 'transform, opacity',
              }}
            >
              <CharacterCard id={id} image={CHARACTER_IMAGES[id]} accent={CARD_ACCENTS[id]} />
            </div>
          ))}

          {/* End card */}
          <div
            ref={(el) => (cardRefs.current[CHARACTER_IDS.length] = el)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transformOrigin: 'center top',
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                background: 'rgba(253,244,235,0.10)',
                border: '3px solid rgba(253,244,235,0.3)',
                borderRadius: '20px',
                minHeight: '460px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                padding: '2rem',
              }}
            >
              <p id="text-link-to-frontier"
                style={{
                  fontFamily: '"Rye", cursive',
                  fontSize: '2rem',
                  color: '#fdf4eb',
                  textAlign: 'center',
                  margin: 0,
                  textShadow: '2px 2px 0 #5a2800',
                }}
              >
                Want to know more?
              </p>
              <Link
                to="/niloras-notes"
                style={{
                  background: '#fdf4eb',
                  color: '#a95c14',
                  borderRadius: '30px',
                  padding: '0.75rem 2rem',
                  fontFamily: '"Bangers", cursive',
                  fontSize: '1.2rem',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                Nilora's Notes →
              </Link>
            </div>
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={goNext}
          aria-label="Next character"
          style={{
            ...arrowBase,
            right: '4px',
            cursor: current < TOTAL - 1 ? 'pointer' : 'default',
            opacity: current < TOTAL - 1 ? 1 : 0,
            pointerEvents: current < TOTAL - 1 ? 'auto' : 'none',
          }}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.75rem',
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '20px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: i === current ? '#fdf4eb' : 'rgba(253,244,235,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.25s, background 0.25s',
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default CharacterParade;
