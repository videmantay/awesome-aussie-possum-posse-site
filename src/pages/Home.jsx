import { Title, Text, Stack, Paper, Button, Group } from '@mantine/core';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <Stack align="center" gap="xl" py="xl">
      <Title
        order={1}
        ta="center"
        style={{ fontSize: '3rem', color: 'var(--mantine-color-brown-8)' }}
      >
        {t('home.title')}
      </Title>

      <Paper
        shadow="md"
        radius="md"
        p="xl"
        style={{
          backgroundColor: 'var(--mantine-color-brown-0)',
          border: '2px solid var(--mantine-color-brown-3)',
          maxWidth: 700,
        }}
      >
        <Text size="lg" ta="center" mb="md">
          {t('home.intro')}
        </Text>
        <Group justify="center">
          <Button
            component={Link}
            to="/about"
            size="lg"
            radius="md"
            color="brown"
          >
            {t('home.readStory')}
          </Button>
          <Button
            component={Link}
            to="/characters"
            size="lg"
            radius="md"
            variant="outline"
            color="brown"
          >
            {t('home.meetCharacters')}
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

export default Home;
