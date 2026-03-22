import { AppShell, Group, Title, Anchor, Container } from '@mantine/core';
import { Link, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Layout() {
  const { t } = useTranslation();

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header
        style={{
          backgroundColor: 'var(--mantine-color-brown-7)',
          borderBottom: '3px solid var(--mantine-color-brown-9)',
        }}
      >
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Title
              order={3}
              component={Link}
              to="/"
              style={{ color: '#fdf4eb', textDecoration: 'none' }}
            >
              {t('nav.siteTitle')}
            </Title>
            <Group gap="lg">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/about', label: t('nav.theBook') },
                { to: '/characters', label: t('nav.characters') },
                { to: '/parents', label: t('nav.forParents') },
                { to: '/author', label: t('nav.theAuthor') },
                { to: '/illustrator', label: t('nav.theIllustrator') },
                { to: '/frontier-post', label: t('nav.frontierPost') },
              ].map((link) => (
                <Anchor
                  key={link.to}
                  component={Link}
                  to={link.to}
                  style={{ color: '#f3e4d2', fontWeight: 600 }}
                  underline="never"
                >
                  {link.label}
                </Anchor>
              ))}
              <LanguageSwitcher />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;
