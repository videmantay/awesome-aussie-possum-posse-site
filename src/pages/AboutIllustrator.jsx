import { Title, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function AboutIllustrator() {
  const { t } = useTranslation();

  return (
    <Stack gap="md" py="xl">
      <Title order={1} style={{ color: 'var(--mantine-color-brown-8)' }}>
        {t('illustrator.title')}
      </Title>
      <Text size="lg">
        {t('illustrator.comingSoon')}
      </Text>
    </Stack>
  );
}

export default AboutIllustrator;
