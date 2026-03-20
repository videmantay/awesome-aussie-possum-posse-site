import { Title, Text, Stack } from '@mantine/core';

function Characters() {
  return (
    <Stack gap="md" py="xl">
      <Title order={1} style={{ color: 'var(--mantine-color-brown-8)' }}>
        Meet the Characters
      </Title>
      <Text size="lg">
        Our cast of awesome Aussie possums is getting ready to introduce
        themselves. Check back soon!
      </Text>
    </Stack>
  );
}

export default Characters;
