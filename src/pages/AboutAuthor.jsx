import { Title, Text, Stack, Paper, Image, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import authPic from '../assets/imgs/authorPic1.png';
import daddySweetie from '../assets/imgs/daddySweetheart.jpg';

function AboutAuthor() {
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
            {t('author.title')}
          </Title>

          <Image src={authPic} h="25rem" w="auto" radius="lg" />

          <Text size="lg" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
            <span dangerouslySetInnerHTML={{ __html: t('author.intro') }} />
          </Text>

          <Text size="lg" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
            {t('author.whyPossums')}
          </Text>

          <Image h="25em" src={daddySweetie} fit="contain" radius="lg" />

          <Text ta="center" fs="italic" c="dimmed" size="sm" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            {t('author.photoCaption')}
          </Text>

          <Text size="lg" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
            {t('author.discovery')}
          </Text>

          <Text size="lg" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
            <span dangerouslySetInnerHTML={{ __html: t('author.whitePossum') }} />
          </Text>

          <Text size="lg" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
            <span dangerouslySetInnerHTML={{ __html: t('author.legend') }} />
          </Text>

          <Text
            size="lg"
            ta="right"
            fs="italic"
            mt="md"
            style={{
              color: 'var(--mantine-color-brown-7)',
              fontFamily: '"Patrick Hand", cursive',
              fontSize: '1.3rem',
            }}
          >
            {t('author.signoff')}
          </Text>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AboutAuthor;
