import { AppShell, Group, Title, Anchor, Container } from '@mantine/core';
import { Link, Outlet } from 'react-router';

function Layout() {
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
              Awesome Aussie Possums
            </Title>
            <Group gap="lg">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'The Book' },
                { to: '/characters', label: 'Characters' },
                { to: '/parents', label: 'For Parents' },
                { to: '/author', label: 'The Author' },
                { to: '/frontier-post', label: 'Frontier Post' },
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
