import { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import possumIcon from '../assets/icons/possumSilohette.svg';

function JoinThePosse() {
  const { t } = useTranslation();
  const sectionRef = useRef();
  const iconRef = useRef();

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
      <div className="cta-content" style={{ maxWidth: '600px', width: '100%' }}>
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
            fontSize: '1.2rem',
            color: '#fdf4eb',
            margin: '0 0 2.5rem',
            lineHeight: 1.7,
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {t('kidscta.message')}
        </p>

        <Link
          to="/parents"
          style={{
            display: 'inline-block',
            background: '#2a1500',
            color: '#f5c87a',
            padding: '1rem 2.5rem',
            borderRadius: '30px',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.4rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {t('kidscta.button')}
        </Link>
      </div>
    </section>
  );
}

function FrontierPost() {
  const { t } = useTranslation();

  return (
    <div>
      <Box maw={800} mx="auto" py="xl">
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
          <Stack gap="xl">
            <div>
              <Title
                order={1}
                ta="center"
                style={{
                  color: 'var(--mantine-color-brown-8)',
                  fontFamily: '"Rye", cursive',
                }}
              >
                {t('frontier.title')}
              </Title>
              <Text
                ta="center"
                size="lg"
                fs="italic"
                mt="xs"
                style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-6)' }}
              >
                {t('frontier.subtitle')}
              </Text>
            </div>

            <Paper
              shadow="sm"
              radius="lg"
              p="xl"
              style={{
                backgroundColor: 'var(--mantine-color-brown-0)',
                border: '2px dashed var(--mantine-color-brown-3)',
              }}
            >
              <Text
                size="lg"
                ta="center"
                style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}
              >
                {t('frontier.comingSoon')}
              </Text>
            </Paper>
          </Stack>
        </Paper>
      </Box>

      <JoinThePosse />
    </div>
  );
}

export default FrontierPost;
