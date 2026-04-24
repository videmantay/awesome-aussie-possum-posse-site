import { useState, useRef, useEffect } from 'react';
import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';

// Replace with your actual endpoint when ready (Firestore function, MailerLite, etc.)
const SUBMIT_ENDPOINT = '';

function ParentsGuide() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
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

    if (!SUBMIT_ENDPOINT) {
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
    <Box maw={800} mx="auto" py="xl" px="md">
      <Stack gap="xl">
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
          <Stack gap="md">
            <Title
              order={1}
              ta="center"
              style={{
                color: 'var(--mantine-color-brown-8)',
                fontFamily: '"Rye", cursive',
              }}
            >
              {t('parents.title')}
            </Title>
            <Text
              size="lg"
              ta="center"
              style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}
            >
              {t('parents.comingSoon')}
            </Text>
          </Stack>
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
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '0.25rem',
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('cta.emailPlaceholder')}
                  style={{
                    flex: '1 1 220px',
                    maxWidth: '340px',
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
                    background: '#c45a1a',
                    color: '#fdf4eb',
                    fontFamily: '"Bangers", cursive',
                    fontSize: '1.3rem',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                    transformOrigin: 'center',
                  }}
                >
                  {status === 'loading' ? '...' : t('cta.submitButton')}
                </button>

                {status === 'error' && (
                  <p
                    style={{
                      color: '#f5c87a',
                      fontFamily: '"Baloo 2", sans-serif',
                      fontSize: '0.9rem',
                      margin: '0.25rem 0 0',
                      width: '100%',
                    }}
                  >
                    {t('cta.errorMessage')}
                  </p>
                )}
              </form>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default ParentsGuide;
