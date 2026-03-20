import { Title, Text, Stack } from '@mantine/core';

function About() {
  return (
    <Stack gap="md" py="xl">
      <Title order={1} style={{ color: 'var(--mantine-color-brown-8)' }}>
        The Book
      </Title>
      <Text size="lg">
        Coming soon — more details about the story and where to get your copy!
      </Text>
    </Stack>
  );
}

export default About;
