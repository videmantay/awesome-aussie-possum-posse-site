import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import possumIcon from '../assets/icons/possumSilohette.svg';

function NewsletterSignup() {
  const { t } = useTranslation();
  const sectionRef = useRef();
  const iconRef = useRef();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(iconRef.current, {
        y: -12,
        rotation: 6,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

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
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await addDoc(collection(db, 'subscribers'), {
        name: name.trim() || null,
        email: email.trim().toLowerCase(),
        notes: null,
        active: true,
        subscribedAt: serverTimestamp(),
      });
      setStatus('success');
    } catch {
      setErrorMsg(t('cta.errorMessage'));
      setStatus('error');
    }
  }

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #6b2a0a 0%, #c45a1a 40%, #e8901a 70%, #f5c87a 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <div className="cta-content" style={{ maxWidth: '520px', width: '100%' }}>
        <img
          ref={iconRef}
          src={possumIcon}
          alt=""
          style={{ height: '90px', marginBottom: '1.5rem', filter: 'invert(1) brightness(10)' }}
        />

        <h2
          style={{
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            color: '#fdf4eb',
            margin: '0 0 1rem',
            textShadow: '3px 3px 0 #6b2a0a',
            letterSpacing: '2px',
          }}
        >
          {t('kidscta.heading')}
        </h2>

        <p
          style={{
            fontFamily: '"Baloo 2", sans-serif',
            fontSize: '1.1rem',
            color: '#fdf4eb',
            margin: '0 0 2rem',
            lineHeight: 1.7,
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {t('kidscta.message')}
        </p>

        {status === 'success' ? (
          <div
            style={{
              background: 'rgba(253,244,235,0.15)',
              border: '2px solid #fdf4eb',
              borderRadius: 20,
              padding: '1.5rem',
            }}
          >
            <p style={{ fontFamily: '"Bangers", cursive', fontSize: '1.8rem', color: '#fdf4eb', margin: 0, letterSpacing: '1px' }}>
              {t('cta.successTitle')}
            </p>
            <p style={{ fontFamily: '"Patrick Hand", cursive', color: '#fdf4eb', marginTop: '0.5rem' }}>
              {t('cta.successSubtitle')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              aria-label="Your name (optional)"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              aria-label="Your email address"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            {errorMsg && (
              <p style={{ color: '#ffe0c0', fontFamily: '"Patrick Hand", cursive', margin: 0 }}>
                {errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                display: 'inline-block',
                background: '#2a1500',
                color: '#f5c87a',
                padding: '1rem 2.5rem',
                borderRadius: '30px',
                fontFamily: '"Bangers", cursive',
                fontSize: '1.4rem',
                letterSpacing: '1.5px',
                border: 'none',
                cursor: status === 'loading' ? 'wait' : 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {status === 'loading' ? t('cta.loadingButton') : t('kidscta.button')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1.2rem',
  borderRadius: 30,
  border: '2px solid rgba(253,244,235,0.4)',
  background: 'rgba(253,244,235,0.15)',
  color: '#fdf4eb',
  fontFamily: '"Baloo 2", sans-serif',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default NewsletterSignup;
