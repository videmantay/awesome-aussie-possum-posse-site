import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brennenSolo from '../assets/imgs/brennenSolo.png';
import gretelSolo from '../assets/imgs/gretelSolo.png';
import hanaSolo from '../assets/imgs/hanaSolo.png';
import plaidSolo from '../assets/imgs/plaidSolo.png';
import pygmySolo from '../assets/imgs/pygmySolo.png';
import remmySolo from '../assets/imgs/remmySolo.png';
import willowSolo from '../assets/imgs/willowSolo.png';

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

function CharacterCard({ id, image, accent }) {
  const { t } = useTranslation();
  return (
    <div
      className="char-card"
      style={{
        flexShrink: 0,
        width: 'clamp(260px, 28vw, 340px)',
        marginRight: '2rem',
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
          minHeight: '260px',
          alignItems: 'flex-end',
        }}
      >
        <img
          src={image}
          alt={t(`character.${id}.name`)}
          style={{ maxHeight: '250px', width: 'auto', objectFit: 'contain', display: 'block' }}
          loading="lazy"
        />
      </div>

      <div style={{ padding: '1rem 1.25rem 1.5rem', flex: 1 }}>
        <h3
          style={{
            margin: '0 0 0.2rem',
            fontFamily: '"Rio Grande", "Bangers", cursive',
            fontSize: '1.9rem',
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
  const containerRef = useRef();
  const trackRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Stagger card entrance when section enters viewport
      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.from('.char-card', {
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.5)',
          });
        },
      });

      // Horizontal scroll pin
      const scrollDistance = () => track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: () => -scrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    mm.add('(max-width: 767px)', () => {
      // Mobile: just fade in stacked cards
      gsap.from('.char-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        background: 'linear-gradient(160deg, #2a1500 0%, #5a2800 40%, #8b4400 70%, #c87828 100%)',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 0',
      }}
    >
      {/* Section heading */}
      <div style={{ padding: '0 3rem 2.5rem', flexShrink: 0 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: '"Rio Grande", "Bangers", cursive',
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

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingLeft: '3rem',
          paddingRight: '3rem',
          paddingBottom: '1.5rem',
          flexWrap: 'nowrap',
        }}
      >
        {CHARACTER_IDS.map((id) => (
          <CharacterCard
            key={id}
            id={id}
            image={CHARACTER_IMAGES[id]}
            accent={CARD_ACCENTS[id]}
          />
        ))}

        {/* End card — link to full characters page */}
        <div
          style={{
            flexShrink: 0,
            width: 'clamp(220px, 22vw, 280px)',
            marginRight: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            opacity: 0.9,
          }}
        >
          <p
            style={{
              fontFamily: '"Rio Grande", "Bangers", cursive',
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
            to="/characters"
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
              transition: 'transform 0.2s',
            }}
          >
            Full Character Profiles →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CharacterParade;
