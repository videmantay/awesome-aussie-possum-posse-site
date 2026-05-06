import { useState } from 'react';
import { AppShell, Box, Burger, Group, NavLink, Stack, Text, Title, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import possumIcon from '../../assets/icons/possumSilohette.svg';

const NAV_ITEMS = [
  { to: '/admin/posts',       label: 'Frontier Posts', icon: '📰' },
  { to: '/admin/subscribers', label: 'Subscribers',    icon: '🤠' },
  { to: '/admin/banners',     label: 'Banners',        icon: '📣' },
];

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut(auth);
    navigate('/admin/login', { replace: true });
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 230, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header
        style={{
          background: '#3a1e00',
          borderBottom: '3px solid #824404',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
        }}
      >
        <Group gap="sm" h="100%">
          <Burger opened={opened} onClick={toggle} color="#fdf4eb" size="sm" hiddenFrom="sm" />
          <img src={possumIcon} alt="" style={{ height: 32, filter: 'invert(1) brightness(3) sepia(1) hue-rotate(0deg) saturate(5)', opacity: 0.85 }} />
          <Title
            order={4}
            style={{
              fontFamily: '"Rye", cursive',
              color: '#fdf4eb',
              letterSpacing: '1px',
              fontSize: '1rem',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            Admin Post Office
          </Title>
          <Box style={{ marginLeft: 'auto' }}>
            <Text
              component={Link}
              to="/"
              size="xs"
              style={{
                color: '#fdf4eb',
                fontFamily: '"Patrick Hand", cursive',
                textDecoration: 'none',
                marginRight: '1rem',
                opacity: 0.85,
              }}
            >
              ← View Site
            </Text>
            <Button
              size="xs"
              variant="subtle"
              onClick={handleSignOut}
              style={{ color: '#fdf4eb', fontFamily: '"Baloo 2", sans-serif', opacity: 0.85 }}
            >
              Sign Out
            </Button>
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        style={{ background: '#4a2800', borderRight: '2px solid #824404', padding: '1rem 0.5rem' }}
      >
        <Stack gap={4}>
          <Text
            size="xs"
            tt="uppercase"
            style={{
              color: '#dca56c',
              fontFamily: '"Bangers", cursive',
              letterSpacing: '2px',
              padding: '0 0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Manage
          </Text>
          {NAV_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                component={Link}
                to={item.to}
                active={active}
                label={
                  <Text
                    size="sm"
                    fw={600}
                    style={{
                      fontFamily: '"Bubblegum Sans", sans-serif',
                      color: active ? '#3a1e00' : '#fdf4eb',
                    }}
                  >
                    {item.icon} {item.label}
                  </Text>
                }
                styles={{
                  root: {
                    borderRadius: '10px',
                    backgroundColor: active ? '#f5c87a' : 'transparent',
                    '&:hover': { backgroundColor: active ? '#f5c87a' : 'rgba(245,200,122,0.15)' },
                  },
                }}
              />
            );
          })}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ background: '#fdf4eb', minHeight: '100vh' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
