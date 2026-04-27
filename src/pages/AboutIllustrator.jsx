import { Title, Text, Stack, Paper, Box, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

const BehanceIcon = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#1769FF" />
    <text x="5" y="29" fill="white" fontSize="21" fontWeight="900" fontFamily="Arial, sans-serif">Be</text>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="#1877F2" />
    <text x="13" y="29" fill="white" fontSize="24" fontWeight="900" fontFamily="Arial, sans-serif">f</text>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#0A66C2" />
    <text x="5" y="27" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">in</text>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#ig-grad)" />
    <rect x="9" y="9" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="6" fill="none" stroke="white" strokeWidth="2.5" />
    <circle cx="28" cy="12" r="2" fill="white" />
  </svg>
);

const socialLinks = [
  { platform: "Behance", Icon: BehanceIcon, handle: 'Tucco Nascimento', url:'https://www.behance.net/arthurmdnascimento'},
  { platform: 'Facebook', Icon: FacebookIcon, handle: 'arthurmdnascimentoilustrador', url: 'https://www.facebook.com/arthurmdnascimentoilustrador' },
  { platform: 'Instagram', Icon: InstagramIcon, handle: '@tucco_nascimento', url: 'https://www.instagram.com/tucco_nascimento' },
  { platform: 'LinkedIn', Icon: LinkedInIcon, handle: 'arthur-miranda-do-nascimento-620188294', url: 'https://www.linkedin.com/in/arthur-miranda-do-nascimento-620188294' }
];

const bodyStyle = { fontFamily: '"Baloo 2", sans-serif' };

function AboutIllustrator() {
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
          <Stack gap="md">
            <Title
              order={1}
              ta="center"
              style={{
                color: 'var(--mantine-color-brown-8)',
                fontFamily: '"Rye", cursive',
              }}
            >
              {t('illustrator.title')}
            </Title>

            <Text size="lg" style={bodyStyle}>{t('illustrator.para1')}</Text>
            <Text size="lg" style={bodyStyle}>{t('illustrator.para2')}</Text>
            <Text size="lg" style={bodyStyle}>{t('illustrator.para3')}</Text>
            <Text size="lg" style={bodyStyle}>{t('illustrator.para4')}</Text>

            <blockquote style={{
              margin: '0.5rem 0',
              padding: '1rem 1.5rem',
              borderLeft: '4px solid var(--mantine-color-brown-4)',
              background: 'rgba(169, 92, 20, 0.06)',
              borderRadius: '0 8px 8px 0',
            }}>
              <Text
                size="lg"
                fs="italic"
                style={{ ...bodyStyle, color: 'var(--mantine-color-brown-7)', lineHeight: 1.7 }}
              >
                "{t('illustrator.quote')}"
              </Text>
              <Text
                size="sm"
                mt="xs"
                style={{
                  fontFamily: '"Patrick Hand", cursive',
                  color: 'var(--mantine-color-brown-6)',
                  fontWeight: 600,
                }}
              >
                {t('illustrator.quoteAttribution')}
              </Text>
            </blockquote>

            <Text size="lg" style={bodyStyle}>{t('illustrator.linksTitle')}</Text>

            <Stack gap="sm">
              {socialLinks.map(({ platform, Icon, handle, url }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${platform}: ${handle}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    color: 'var(--mantine-color-brown-8)',
                    fontFamily: '"Baloo 2", sans-serif',
                    fontSize: '1rem',
                    padding: '0.4rem 0',
                  }}
                >
                  <Tooltip label={platform} withArrow position="top">
                    <span style={{ display: 'flex' }}><Icon /></span>
                  </Tooltip>
                  <span>{handle}</span>
                </a>
              ))}
            </Stack>
          </Stack>
        </Paper>
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
          {t('cta.browseCharacters')} →
        </Link>
        <Link
          to="/about"
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
          {t('cta.readAbout')} →
        </Link>
      </div>
    </div>
  );
}

export default AboutIllustrator;
