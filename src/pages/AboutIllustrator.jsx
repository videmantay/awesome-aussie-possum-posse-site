import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

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
          <Text
            size="lg"
            ta="center"
            style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}
          >
            {t('illustrator.comingSoon')}
          </Text>
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
        Meet the Characters →
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
        Read the Book →
      </Link>
    </div>
    </div>
  );
}

export default AboutIllustrator;
