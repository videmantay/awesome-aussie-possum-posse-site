import { Title, Text, Stack, Paper, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function FrontierPost() {
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
        <Stack gap="xl">
          <div>
            <Title
              order={1}
              ta="center"
              style={{
                color: 'var(--mantine-color-brown-8)',
                fontFamily: '"Rio Grande", "Bangers", cursive',
              }}
            >
              {t('frontier.title')}
            </Title>
            <Text
              ta="center"
              size="lg"
              fs="italic"
              mt="xs"
              style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-6)' }}
            >
              {t('frontier.subtitle')}
            </Text>
          </div>

          <Paper
            shadow="sm"
            radius="lg"
            p="xl"
            style={{
              backgroundColor: 'var(--mantine-color-brown-0)',
              border: '2px dashed var(--mantine-color-brown-3)',
            }}
          >
            <Text
              size="lg"
              ta="center"
              style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}
            >
              {t('frontier.comingSoon')}
            </Text>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}

export default FrontierPost;
