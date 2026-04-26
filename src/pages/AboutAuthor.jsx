import { Title, Text, Stack, Paper, Image, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import authPic from '../assets/imgs/aboutAuthor/authorPic1.png?format=webp&width=800&quality=75&as=url';
import daddySweetie from '../assets/imgs/aboutAuthor/daddySweetheart.jpg?format=webp&width=800&quality=75&as=url';

const sectionHeadingStyle = {
  fontFamily: '"Rye", cursive',
  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
  color: 'var(--mantine-color-brown-7)',
  margin: '0.5rem 0 0',
};

const bodyStyle = { fontFamily: '"Baloo 2", sans-serif' };

function AboutAuthor() {
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
            {t('author.title')}
          </Title>

          <Image src={authPic} h="25rem" w="auto" radius="lg" />

          {/* Introduction */}
          <h2 style={sectionHeadingStyle}>{t('author.introTitle')}</h2>
          <Text size="lg" style={bodyStyle}>{t('author.intro1')}</Text>
          <Text size="lg" style={bodyStyle}>{t('author.intro2')}</Text>
          <Text size="lg" style={{ ...bodyStyle, fontStyle: 'italic' }}>{t('author.introQuestion')}</Text>

          {/* The Discovery */}
          <h2 style={sectionHeadingStyle}>{t('author.discoveryTitle')}</h2>
          <Text size="lg" style={bodyStyle}>{t('author.discovery1')}</Text>
          <Text size="lg" style={bodyStyle}>{t('author.discovery2')}</Text>

          <Image h="25em" src={daddySweetie} fit="contain" radius="lg" />
          <Text ta="center" fs="italic" c="dimmed" size="sm" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            {t('author.photoCaption')}
          </Text>

          <Text size="lg" style={bodyStyle}>{t('author.discovery3')}</Text>
          <Text size="lg" style={bodyStyle}>
            <span dangerouslySetInnerHTML={{ __html: t('author.discovery4') }} />
          </Text>

          {/* The Legend */}
          <h2 style={sectionHeadingStyle}>{t('author.legendTitle')}</h2>
          <Text size="lg" style={bodyStyle}>
            <span dangerouslySetInnerHTML={{ __html: t('author.legend1') }} />
          </Text>
          <Text size="lg" style={bodyStyle}>{t('author.legend2')}</Text>
          <Text size="lg" style={bodyStyle}>{t('author.legend3')}</Text>

          <Text
            size="lg"
            ta="right"
            fs="italic"
            mt="md"
            style={{
              color: 'var(--mantine-color-brown-7)',
              fontFamily: '"Patrick Hand", cursive',
              fontSize: '1.3rem',
            }}
          >
            {t('author.signoff')}<br />{t('author.signoffName')}
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

export default AboutAuthor;
