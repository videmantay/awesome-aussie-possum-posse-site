import { Title, Text, Stack, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function FrontierPost() {
  const { t } = useTranslation();

  return (
    <Stack gap="xl" py="xl" maw={750} mx="auto">
      <Title
        order={1}
        ta="center"
        style={{ color: 'var(--mantine-color-brown-8)' }}
      >
        {t('frontier.title')}
      </Title>
      <Text ta="center" size="lg" c="dimmed" fs="italic">
        {t('frontier.subtitle')}
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
          {t('frontier.comingSoon')}
        </Text>
      </Paper>
    </Stack>
  );
}

export default FrontierPost;
