import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function AboutIllustrator() {
  const { t } = useTranslation();

  return (
    <Box maw={800} mx="auto" py="xl">
      <Paper
        className="page-card"
        shadow="xl"
        radius="xl"
        p="xl"
        style={{
          backgroundColor: 'rgba(253, 244, 235, 0.95)',
          border: '3px solid var(--mantine-color-brown-3)',
        }}
      >
        <Stack gap="md">
          <Title
            order={1}
            ta="center"
            style={{
              color: 'var(--mantine-color-brown-8)',
              fontFamily: '"Rio Grande", "Bangers", cursive',
            }}
          >
            {t('illustrator.title')}
          </Title>
          <Text
            size="lg"
            ta="center"
            style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}
          >
            {t('illustrator.comingSoon')}
          </Text>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AboutIllustrator;
