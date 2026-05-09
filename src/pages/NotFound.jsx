import { Title, Text, Stack, Paper, Image, Box, Group } from '@mantine/core';
import { Link } from 'react-router';
import confusedPic from '../assets/imgs/aboutAuthor/confused-404.png?format=webp&width=600&quality=80&as=url';

function NotFound() {
  return (
    <Box maw={700} mx="auto" py="xl">
      <Paper
        className="page-card"
        shadow="xl"
        radius="xl"
        p="xl"
        style={{
          backgroundColor: 'rgba(253, 244, 235, 0.95)',
          border: '3px solid var(--mantine-color-brown-3)',
          textAlign: 'center',
        }}
      >
        <Stack gap="md" align="center">
          <Title
            order={1}
            style={{
              fontFamily: '"Rye", cursive',
              color: 'var(--mantine-color-brown-8)',
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              lineHeight: 1,
            }}
          >
            404
          </Title>

          <Title
            order={2}
            style={{
              fontFamily: '"Rye", cursive',
              color: 'var(--mantine-color-brown-7)',
              fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
            }}
          >
            Well, That Trail's Gone Cold...
          </Title>

          <Image
            src={confusedPic}
            h="22rem"
            w="auto"
            radius="lg"
            style={{ maxWidth: '100%' }}
          />

          <Text
            size="lg"
            style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-8)' }}
          >
            Beg your pardon, even I can't figure out what page you're trying to dig up. Seems like I hid it under some other URL!
          </Text>

          <Text
            size="md"
            c="dimmed"
            style={{ fontFamily: '"Patrick Hand", cursive', fontStyle: 'italic' }}
          >
            — Nilora, equally baffled
          </Text>
        </Stack>
      </Paper>

      <div
        style={{
          background: '#2a1500',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1.5rem 2rem',
          borderRadius: '0 0 1rem 1rem',
          marginTop: '-1rem',
        }}
      >
        <Link
          to="/"
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
          Head Home →
        </Link>
        <Link
          to="/characters"
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
          Meet the Posse →
        </Link>
      </div>
    </Box>
  );
}

export default NotFound;
