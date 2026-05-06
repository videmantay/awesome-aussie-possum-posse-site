import { Box, Stack, Paper, Title, Text, Divider } from '@mantine/core';

const Section = ({ title, children }) => (
  <Stack gap="xs">
    <Text
      fw={700}
      style={{ fontFamily: '"Rye", cursive', color: '#c45a1a', fontSize: '1rem' }}
    >
      {title}
    </Text>
    {children}
  </Stack>
);

const Body = ({ children }) => (
  <Text
    size="sm"
    style={{
      fontFamily: '"Baloo 2", sans-serif',
      color: 'var(--mantine-color-brown-8)',
      lineHeight: 1.75,
    }}
  >
    {children}
  </Text>
);

function Privacy() {
  return (
    <Box maw={760} mx="auto" py="xl" px="md">
      <Paper
        shadow="xl"
        radius="xl"
        p="xl"
        style={{
          backgroundColor: 'rgba(253, 244, 235, 0.97)',
          border: '3px solid var(--mantine-color-brown-3)',
        }}
      >
        <Stack gap="lg">
          <Stack gap="xs">
            <Title
              order={1}
              style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)' }}
            >
              Privacy Policy
            </Title>
            <Text
              size="xs"
              style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-5)' }}
            >
              Last updated: April 30, 2026
            </Text>
          </Stack>

          <Body>
            This policy covers how The Awesome Aussie Possum Posse collects, uses,
            and protects the personal information you provide when signing up for our newsletter.
          </Body>

          <Divider color="brown.2" />

          <Section title="What We Collect">
            <Body>
              When you sign up for our newsletter we collect your email address (required),
              your name (optional), and your preferred language. That is all.
              We do not use tracking cookies, fingerprinting, or third-party analytics
              that identify individual visitors.
            </Body>
          </Section>

          <Section title="How We Use It">
            <Body>
              Your information is used only to send you updates about The Awesome Aussie
              Possum Posse — book launch news, behind-the-scenes dispatches, and posse
              updates. We will never sell, rent, or share your information with third
              parties for marketing purposes.
            </Body>
          </Section>

          <Section title="Where It's Stored">
            <Body>
              Subscriber data is stored securely using Google Firebase / Firestore,
              hosted on Google Cloud infrastructure in the United States. Google's
              data handling practices apply to that storage layer.
            </Body>
          </Section>

          <Section title="Children's Privacy (COPPA)">
            <Body>
              This website promotes a children's book but is intended to be used by
              parents and guardians on behalf of children. We do not knowingly collect
              personal information from children under 13. All newsletter signup forms
              are directed at adults only. If you believe a child under 13 has
              submitted information to us, contact us immediately and we will delete it.
            </Body>
          </Section>

          <Section title="Your Rights">
            <Body>
              Regardless of where you live, you may unsubscribe at any time using the
              link in any email we send, or by contacting us directly. You may also
              request that we permanently delete your data. California residents (CCPA)
              and Brazilian residents (LGPD) may additionally request a copy of the
              data we hold. We will respond to all requests within 30 days.
            </Body>
          </Section>

          <Section title="Contact">
            <Body>
              Questions or deletion requests:{' '}
              <a
                href="mailto:info@awesomeaussiepossumposse.com"
                style={{ color: '#c45a1a', fontFamily: 'inherit' }}
              >
                info@awesomeaussiepossumposse.com
              </a>
            </Body>
          </Section>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Privacy;
