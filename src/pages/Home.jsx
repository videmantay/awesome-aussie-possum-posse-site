import { useRef, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import CharacterParade from '../components/CharacterParade';
import PageFlipTeaser from '../components/PageFlipTeaser';
import NewsletterSignup from '../components/NewsletterSignup';

const ThreeBook = lazy(() => import('../components/ThreeBook'));

function ScrollArrow() {
  const ref = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { y: 10, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        color: 'rgba(253, 244, 235, 0.65)',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <span style={{ fontFamily: '"Patrick Hand", cursive', fontSize: '0.8rem', letterSpacing: '1px' }}>
        scroll
      </span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  );
}

function HeroTitle() {
  const { t } = useTranslation();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text-item', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        delay: 2.0,
        stagger: 0.18,
        ease: 'power2.out',
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 2rem 3.5rem', width: '100%' }}>
      <h1
        className="hero-text-item hero-heading"
        style={{
          fontFamily: '"Rye", cursive',
          fontSize: 'clamp(1.9rem, 5.5vw, 4rem)',
          color: '#fdf4eb',
          margin: '0 0 0.75rem',
          textShadow: '3px 3px 0 #6b2a0a, 0 0 40px rgba(200,110,30,0.55)',
          letterSpacing: '2px',
          lineHeight: 1.1,
        }}
      >
        {t('home.title')}
      </h1>

      <p
        className="hero-text-item hero-intro"
        style={{
          fontFamily: '"Baloo 2", sans-serif',
          fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
          color: '#f3e4d2',
          maxWidth: '560px',
          margin: '0 auto 2rem',
          lineHeight: 1.6,
          textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        }}
      >
        {t('home.intro')}
      </p>

      <div
        className="hero-text-item"
        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <Link
          to="/about"
          style={{
            background: '#fdf4eb',
            color: '#a95c14',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {t('home.readStory')}
        </Link>
        <Link
          to="/characters"
          style={{
            background: 'transparent',
            color: '#fdf4eb',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            border: '2px solid rgba(253,244,235,0.65)',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(253,244,235,0.12)';
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {t('home.meetCharacters')}
        </Link>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div style={{ width: '100%' }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background:
            'linear-gradient(to bottom, #0d0300 0%, #4a1200 15%, #9a3800 35%, #c45a1a 55%, #e8901a 72%, #f5c87a 87%, #fdf4eb 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle star specks */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(1px 1px at 15% 10%, rgba(255,245,210,0.95) 0%, transparent 100%),' +
              'radial-gradient(1.5px 1.5px at 42% 7%, rgba(255,245,210,0.85) 0%, transparent 100%),' +
              'radial-gradient(2px 2px at 70% 5%, rgba(255,245,210,0.75) 0%, transparent 100%),' +
              'radial-gradient(1px 1px at 88% 14%, rgba(255,245,210,0.9) 0%, transparent 100%),' +
              'radial-gradient(1px 1px at 27% 19%, rgba(255,245,210,0.65) 0%, transparent 100%),' +
              'radial-gradient(1px 1px at 55% 3%, rgba(255,245,210,0.8) 0%, transparent 100%),' +
              'radial-gradient(1px 1px at 8% 25%, rgba(255,245,210,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Three.js book canvas — fills entire section */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Suspense fallback={null}>
            <ThreeBook height="100%" />
          </Suspense>
        </div>

        {/* Title overlay at bottom */}
        <HeroTitle />
        <ScrollArrow />
      </section>

      {/* ── Character Parade ── */}
      <CharacterParade />

      {/* ── Page-Flip Book Teaser ── */}
      <PageFlipTeaser />

      {/* ── Join the Posse CTA ── */}
      <NewsletterSignup />
    </div>
  );
}

export default Home;
