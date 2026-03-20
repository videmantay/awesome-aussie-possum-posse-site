import { Title, Text, Stack, Paper, Button, Group } from '@mantine/core';
import { Link } from 'react-router';

function Home() {
  return (
    <Stack align="center" gap="xl" py="xl">
      <Title
        order={1}
        ta="center"
        style={{ fontSize: '3rem', color: 'var(--mantine-color-brown-8)' }}
      >
        Welcome to the Wild West, Partner!
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
          Saddle up for an adventure with the most awesome possums this side of
          the outback! Join our furry friends as they explore the wild frontier.
        </Text>
        <Group justify="center">
          <Button
            component={Link}
            to="/about"
            size="lg"
            radius="md"
            color="brown"
          >
            Read the Story
          </Button>
          <Button
            component={Link}
            to="/characters"
            size="lg"
            radius="md"
            variant="outline"
            color="brown"
          >
            Meet the Characters
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

export default Home;
