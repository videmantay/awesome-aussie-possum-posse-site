import { Title, Text, Stack, Paper } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';

function AboutAuthor() {
  const { t } = useTranslation();

  return (
    <Stack gap="xl" py="xl" maw={750} mx="auto">
      <Title
        order={1}
        ta="center"
        style={{ color: 'var(--mantine-color-brown-8)' }}
      >
        {t('author.title')}
      </Title>

      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        style={{
          backgroundColor: 'var(--mantine-color-brown-0)',
          border: '2px solid var(--mantine-color-brown-3)',
        }}
      >
        <Stack gap="md">
          <Text size="lg">
            <span dangerouslySetInnerHTML={{ __html: t('author.intro') }} />
          </Text>

          <Text size="lg">
            {t('author.whyPossums')}
          </Text>

          <Text
            ta="center"
            fs="italic"
            c="dimmed"
            size="sm"
          >
            {t('author.photoCaption')}
          </Text>

          <Text size="lg">
            {t('author.discovery')}
          </Text>

          <Text size="lg">
            <span dangerouslySetInnerHTML={{ __html: t('author.whitePossum') }} />
          </Text>

          <Text size="lg">
            <span dangerouslySetInnerHTML={{ __html: t('author.legend') }} />
          </Text>

          <Text
            size="lg"
            ta="right"
            fs="italic"
            mt="md"
            style={{ color: 'var(--mantine-color-brown-7)' }}
          >
            {t('author.signoff')}
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AboutAuthor;
