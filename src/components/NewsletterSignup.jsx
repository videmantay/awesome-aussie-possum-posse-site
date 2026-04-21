import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import possumIcon from '../assets/icons/possumSilohette.svg';

// Replace this URL with your actual Mailchimp / ConvertKit / Buttondown endpoint
const SUBMIT_ENDPOINT = '';

function NewsletterSignup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const sectionRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pulse animation on the CTA button
      gsap.to(btnRef.current, {
        scale: 1.04,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Section entrance
      gsap.from('.cta-content', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    if (!SUBMIT_ENDPOINT) {
      // No endpoint configured — show success for demo purposes
      setStatus('success');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #6b2a0a 0%, #c45a1a 40%, #e8901a 70%, #f5c87a 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <div className="cta-content" style={{ maxWidth: '640px', width: '100%' }}>
        {/* Possum icon */}
        <img
          src={possumIcon}
          alt=""
          style={{ height: '80px', marginBottom: '1.5rem', filter: 'invert(1) brightness(10)' }}
        />

        <h2
          style={{
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            color: '#fdf4eb',
            margin: '0 0 0.5rem',
            textShadow: '3px 3px 0 #6b2a0a',
            letterSpacing: '2px',
          }}
        >
          {t('cta.heading')}
        </h2>

        <p
          style={{
            fontFamily: '"Baloo 2", sans-serif',
            fontSize: '1.1rem',
            color: '#fdf4eb',
            margin: '0 0 2.5rem',
            lineHeight: 1.6,
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {t('cta.subheading')}
        </p>

        {status === 'success' ? (
          <div
            style={{
              background: 'rgba(253, 244, 235, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              border: '3px solid #c06e1e',
            }}
          >
            <p
              style={{
                fontFamily: '"Rye", cursive',
                fontSize: '1.8rem',
                color: '#a95c14',
                margin: 0,
              }}
            >
              {t('cta.successMessage')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('cta.emailPlaceholder')}
                style={{
                  flex: '1 1 220px',
                  maxWidth: '360px',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '30px',
                  border: '3px solid #c06e1e',
                  fontSize: '1rem',
                  fontFamily: '"Baloo 2", sans-serif',
                  outline: 'none',
                  background: 'rgba(253, 244, 235, 0.97)',
                  color: '#5a3a1a',
                }}
              />
              <button
                ref={btnRef}
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '30px',
                  border: 'none',
                  background: '#2a1500',
                  color: '#f5c87a',
                  fontFamily: '"Bangers", cursive',
                  fontSize: '1.3rem',
                  letterSpacing: '1.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  transformOrigin: 'center',
                  display: 'inline-block',
                }}
              >
                {status === 'loading' ? '...' : t('cta.submitButton')}
              </button>
            </div>

            {status === 'error' && (
              <p style={{ color: '#fdf4eb', fontFamily: '"Baloo 2"', fontSize: '0.9rem', margin: 0 }}>
                {t('cta.errorMessage')}
              </p>
            )}
          </form>
        )}

        {/* Navigation links */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { to: '/characters', label: t('cta.browseCharacters') },
            { to: '/about', label: t('cta.readAbout') },
            { to: '/author', label: t('nav.theAuthor') },
            { to: '/parents', label: t('nav.forParents') },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                background: 'rgba(253, 244, 235, 0.2)',
                color: '#fdf4eb',
                borderRadius: '20px',
                padding: '0.5rem 1.25rem',
                border: '2px solid rgba(253, 244, 235, 0.5)',
                fontFamily: '"Bubblegum Sans", sans-serif',
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsletterSignup;
