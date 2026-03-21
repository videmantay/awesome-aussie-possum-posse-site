import { Title, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function ParentsGuide() {
  const { t } = useTranslation();

  return (
    <Stack gap="md" py="xl">
      <Title order={1} style={{ color: 'var(--mantine-color-brown-8)' }}>
        {t('parents.title')}
      </Title>
      <Text size="lg">
        {t('parents.comingSoon')}
      </Text>
    </Stack>
  );
}

export default ParentsGuide;
