import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const THEMES = [1, 2, 3, 4];

function ParentsGuide() {
  const { t, i18n } = useTranslation();

  const langMap = { en: 'en-US', 'es-MX': 'es-MX', 'pt-BR': 'pt-BR' };
  const prefLang = langMap[i18n.language] ?? 'en-US';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const btnRef = useRef();

  useEffect(() => {
    if (!btnRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(btnRef.current, {
        scale: 1.04,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await addDoc(collection(db, 'subscribers'), {
        name: name.trim() || null,
        email: email.trim().toLowerCase(),
        prefLang,
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
    <div>
      <Box maw={800} mx="auto" py="xl" px="md">
        <Stack gap="xl">

          {/* Hero */}
          <Paper
            className="page-card"
            shadow="xl"
            radius="xl"
            p="xl"
            style={{
              backgroundColor: 'rgba(253, 244, 235, 0.95)',
              border: '3px solid var(--mantine-color-brown-3)',
            }}
          >
            <Stack gap="sm">
              <Title
                order={1}
                ta="center"
                style={{ color: 'var(--mantine-color-brown-8)', fontFamily: '"Rye", cursive' }}
              >
                {t('parents.title')}
              </Title>
              <Text
                ta="center"
                style={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: '1.15rem',
                  letterSpacing: '1.5px',
                  color: '#c45a1a',
                }}
              >
                {t('parents.ageRange')}
              </Text>
              <Text
                size="lg"
                ta="center"
                style={{ fontFamily: '"Baloo 2", sans-serif', lineHeight: 1.65, color: 'var(--mantine-color-brown-8)' }}
              >
                {t('parents.pitch')}
              </Text>
            </Stack>
          </Paper>

          {/* Why parents love it */}
          <Paper
            className="page-card"
            shadow="xl"
            radius="xl"
            p="xl"
            style={{
              backgroundColor: 'rgba(253, 244, 235, 0.95)',
              border: '3px solid var(--mantine-color-brown-3)',
            }}
          >
            <Stack gap="lg">
              <Title
                order={2}
                ta="center"
                style={{ color: 'var(--mantine-color-brown-8)', fontFamily: '"Rye", cursive' }}
              >
                {t('parents.whyTitle')}
              </Title>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                  gap: '1rem',
                }}
              >
                {THEMES.map(n => (
                  <Paper
                    key={n}
                    p="md"
                    radius="lg"
                    style={{
                      background: 'rgba(196, 90, 26, 0.07)',
                      border: '2px solid var(--mantine-color-brown-2)',
                    }}
                  >
                    <Text
                      fw={700}
                      mb={6}
                      style={{ fontFamily: '"Rye", cursive', color: '#c45a1a', fontSize: '0.95rem' }}
                    >
                      {t(`parents.theme${n}Title`)}
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        fontFamily: '"Baloo 2", sans-serif',
                        color: 'var(--mantine-color-brown-7)',
                        lineHeight: 1.6,
                      }}
                    >
                      {t(`parents.theme${n}Body`)}
                    </Text>
                  </Paper>
                ))}
              </div>
            </Stack>
          </Paper>

          {/* Frontier Post reading companion */}
          <Paper
            className="page-card"
            shadow="xl"
            radius="xl"
            p="xl"
            style={{
              backgroundColor: 'rgba(42, 21, 0, 0.92)',
              border: '3px solid var(--mantine-color-brown-5)',
              textAlign: 'center',
            }}
          >
            <Stack gap="md" align="center">
              <Title
                order={2}
                style={{
                  color: '#fdf4eb',
                  fontFamily: '"Rye", cursive',
                  fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)',
                  textShadow: '2px 2px 0 #6b2a0a',
                }}
              >
                {t('parents.frontierTitle')}
              </Title>
              <Text
                style={{
                  fontFamily: '"Baloo 2", sans-serif',
                  color: '#f3e4d2',
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                }}
              >
                {t('parents.frontierBody')}
              </Text>
              <Link
                to="/frontier-post"
                style={{
                  background: '#c45a1a',
                  color: '#fdf4eb',
                  padding: '0.75rem 2rem',
                  borderRadius: '30px',
                  fontFamily: '"Bangers", cursive',
                  fontSize: '1.2rem',
                  letterSpacing: '1.5px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  display: 'inline-block',
                  marginTop: '0.25rem',
                }}
              >
                {t('parents.frontierCta')} →
              </Link>
            </Stack>
          </Paper>

          {/* Nilora's note */}
          <Paper
            className="page-card"
            shadow="md"
            radius="xl"
            p="xl"
            style={{
              backgroundColor: 'rgba(253, 244, 235, 0.88)',
              border: '2px dashed var(--mantine-color-brown-3)',
            }}
          >
            <Text
              fs="italic"
              style={{
                fontFamily: '"Patrick Hand", cursive',
                color: 'var(--mantine-color-brown-7)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                textAlign: 'center',
              }}
            >
              {t('parents.niloraNote')}
            </Text>
          </Paper>

          {/* Newsletter signup — adult audience, COPPA-safe */}
          <Paper
            className="page-card"
            shadow="xl"
            radius="xl"
            p="xl"
            style={{
              backgroundColor: 'rgba(42, 21, 0, 0.92)',
              border: '3px solid var(--mantine-color-brown-5)',
              textAlign: 'center',
            }}
          >
            <Stack gap="md" align="center">
              <Title
                order={2}
                style={{
                  color: '#fdf4eb',
                  fontFamily: '"Rye", cursive',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  textShadow: '2px 2px 0 #6b2a0a',
                  margin: 0,
                }}
              >
                {t('parentscta.heading')}
              </Title>

              <Text
                style={{
                  fontFamily: '"Baloo 2", sans-serif',
                  color: '#f3e4d2',
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  margin: 0,
                }}
              >
                {t('parentscta.subheading')}
              </Text>

              {status === 'success' ? (
                <Text
                  style={{
                    fontFamily: '"Rye", cursive',
                    fontSize: '1.4rem',
                    color: '#f5c87a',
                    marginTop: '0.5rem',
                  }}
                >
                  {t('cta.successMessage')}
                </Text>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    marginTop: '0.25rem',
                  }}
                >
                  <input
                    type="text"
                    aria-label="Your name (optional)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    aria-label={t('cta.emailPlaceholder')}
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('cta.emailPlaceholder')}
                    style={inputStyle}
                  />
                  <button
                    ref={btnRef}
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      padding: '0.85rem 2rem',
                      borderRadius: '30px',
                      border: 'none',
                      background: '#c45a1a',
                      color: '#fdf4eb',
                      fontFamily: '"Bangers", cursive',
                      fontSize: '1.3rem',
                      letterSpacing: '1.5px',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                      transformOrigin: 'center',
                      opacity: status === 'loading' ? 0.7 : 1,
                    }}
                  >
                    {status === 'loading' ? '...' : t('cta.submitButton')}
                  </button>

                  {status === 'error' && (
                    <p style={{ color: '#f5c87a', fontFamily: '"Baloo 2", sans-serif', fontSize: '0.9rem', margin: 0 }}>
                      {errorMsg}
                    </p>
                  )}
                </form>
              )}
            </Stack>
          </Paper>

        </Stack>
      </Box>
      <div
        style={{
          background: '#2a1500',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1.5rem 2rem',
        }}
      >
        <Link
          to="/characters"
          style={{
            background: '#c45a1a',
            color: '#fdf4eb',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          Meet the Characters →
        </Link>
        <Link
          to="/frontier-post"
          style={{
            background: 'transparent',
            color: '#f5c87a',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            border: '2px solid #f5c87a',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
          }}
        >
          Nilora's Notes →
        </Link>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1.25rem',
  borderRadius: '30px',
  border: '3px solid #c06e1e',
  fontSize: '1rem',
  fontFamily: '"Baloo 2", sans-serif',
  outline: 'none',
  background: 'rgba(253, 244, 235, 0.97)',
  color: '#5a3a1a',
  boxSizing: 'border-box',
};

export default ParentsGuide;
