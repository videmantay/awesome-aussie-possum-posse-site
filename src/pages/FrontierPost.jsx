import { Title, Text, Stack, Paper } from '@mantine/core';

function FrontierPost() {
  return (
    <Stack gap="xl" py="xl" maw={750} mx="auto">
      <Title
        order={1}
        ta="center"
        style={{ color: 'var(--mantine-color-brown-8)' }}
      >
        The Frontier Post
      </Title>
      <Text ta="center" size="lg" c="dimmed" fs="italic">
        News, dispatches, and tales from the trail
      </Text>

      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        style={{
          backgroundColor: 'var(--mantine-color-brown-0)',
          border: '2px solid var(--mantine-color-brown-3)',
        }}
      >
        <Text size="lg" ta="center">
          The presses are warming up! Check back soon for the latest dispatches
          from the posse.
        </Text>
      </Paper>
    </Stack>
  );
}

export default FrontierPost;
