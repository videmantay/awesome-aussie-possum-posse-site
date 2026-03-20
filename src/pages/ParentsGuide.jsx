import { Title, Text, Stack } from '@mantine/core';

function ParentsGuide() {
  return (
    <Stack gap="md" py="xl">
      <Title order={1} style={{ color: 'var(--mantine-color-brown-8)' }}>
        For Parents
      </Title>
      <Text size="lg">
        Information for parents about the book, reading level, and educational
        themes — coming soon!
      </Text>
    </Stack>
  );
}

export default ParentsGuide;
