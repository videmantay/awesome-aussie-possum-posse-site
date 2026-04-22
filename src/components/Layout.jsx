import {
  AppShell,
  Group,
  Title,
  Text,
  Burger,
  NavLink,
  Stack,
  Divider,
  Box,
  ScrollArea,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import MusicPlayer from './MusicPlayer';

const LANGUAGES = [
  { code: 'en',    countryCode: 'US', label: 'English'   },
  { code: 'es-MX', countryCode: 'MX', label: 'Español'   },
  { code: 'pt-BR', countryCode: 'BR', label: 'Português' },
];

const navLinks = [
  { to: '/', labelKey: 'nav.home', emoji: '\u{1F3E0}' },
  { to: '/about', labelKey: 'nav.theBook', emoji: '\u{1F4D6}' },
  { to: '/characters', labelKey: 'nav.characters', emoji: '\u{1F43E}' },
  { to: '/parents', labelKey: 'nav.forParents', emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}' },
  { to: '/author', labelKey: 'nav.theAuthor', emoji: '\u270D\uFE0F' },
  { to: '/illustrator', labelKey: 'nav.theIllustrator', emoji: '\u{1F3A8}' },
  { to: '/frontier-post', labelKey: 'nav.frontierPost', emoji: '\u{1F4EC}' },
];

function Layout() {
  const { t, i18n } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppShell
      header={{ height: 65 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding={isHome ? 0 : 'md'}
    >
      {/* --- Header Bar --- */}
      <AppShell.Header
        style={{
          backgroundColor: isHome
            ? 'rgba(13, 3, 0, 0.75)'
            : 'var(--mantine-color-brown-8)',
          borderBottom: isHome
            ? '1px solid rgba(200, 110, 30, 0.3)'
            : '4px solid var(--mantine-color-brown-9)',
          backdropFilter: isHome ? 'blur(8px)' : 'none',
          transition: 'background-color 0.3s',
        }}
      >
        <Group h="100%" px="md">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              size="md"
              color="#fdf4eb"
              aria-label="Toggle navigation"
            />
            <Title
              order={3}
              component={Link}
              to="/"
              style={{
                color: '#fdf4eb',
                textDecoration: 'none',
                fontFamily: '"Rye", cursive',
                letterSpacing: '1px',
              }}
            >
              {t('The Awesome Aussie Possum Posse')}
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      {/* --- Side Drawer / Navbar --- */}
      <AppShell.Navbar
        p="md"
        className="nav-drawer"
        style={{
          backgroundColor: 'var(--mantine-color-brown-1)',
          borderRight: '3px solid var(--mantine-color-brown-3)',
        }}
      >
        <ScrollArea type="auto" offsetScrollbars>
          <Stack gap={4}>
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              c="brown.6"
              px="sm"
              mb={4}
              style={{ fontFamily: '"Bangers", cursive', letterSpacing: '2px', fontSize: '0.85rem' }}
            >
              {t('nav.explore', 'Explore')}
            </Text>

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                component={Link}
                to={link.to}
                label={
                  <Text size="md" fw={600} style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}>
                    {link.emoji} {t(link.labelKey)}
                  </Text>
                }
                active={location.pathname === link.to}
                onClick={close}
                className="nav-link"
                styles={{
                  root: {
                    borderRadius: '12px',
                    padding: '10px 14px',
                    '&[dataActive]': {
                      backgroundColor: 'var(--mantine-color-brown-3)',
                    },
                  },
                }}
                color="brown"
              />
            ))}

            <Divider my="md" color="brown.3" />

            <Box px="sm">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="brown.5"
                mb={6}
                style={{ fontFamily: '"Bangers", cursive', letterSpacing: '2px', fontSize: '0.75rem' }}
              >
                {t('languageSwitcher.label')}
              </Text>
              <Group gap={6}>
                {LANGUAGES.map(({ code, countryCode, label }) => {
                  const isActive = i18n.language === code;
                  return (
                    <Tooltip
                      key={code}
                      label={label}
                      position="top"
                      withArrow
                      arrowSize={6}
                      styles={{
                        tooltip: {
                          backgroundColor: 'var(--mantine-color-brown-8)',
                          color: '#fdf4eb',
                          fontFamily: '"Bubblegum Sans", sans-serif',
                          fontSize: '0.8rem',
                          border: '1px solid var(--mantine-color-brown-5)',
                        },
                        arrow: { borderColor: 'var(--mantine-color-brown-5)' },
                      }}
                    >
                      <ActionIcon
                        variant={isActive ? 'filled' : 'subtle'}
                        size="lg"
                        radius="md"
                        onClick={() => i18n.changeLanguage(code)}
                        aria-label={label}
                        aria-pressed={isActive}
                        style={{
                          fontSize: '1.4rem',
                          backgroundColor: isActive ? 'var(--mantine-color-brown-3)' : 'transparent',
                          border: isActive
                            ? '2px solid var(--mantine-color-brown-5)'
                            : '2px solid transparent',
                          transition: 'background-color 0.2s ease, border-color 0.2s ease',
                        }}
                      >
                        <ReactCountryFlag
                          countryCode={countryCode}
                          svg
                          style={{ width: '1.4rem', height: '1.4rem', display: 'block' }}
                          aria-hidden="true"
                        />
                      </ActionIcon>
                    </Tooltip>
                  );
                })}
              </Group>
            </Box>

            <Box px="sm">
              <Text
                size="sm"
                c="brown.6"
                ta="center"
                fs="italic"
                style={{ fontFamily: '"Patrick Hand", cursive' }}
              >
                {t('nav.tagline', 'Adventure awaits, mate!')}
              </Text>
            </Box>
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      {/* --- Main Content --- */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      {/* --- Persistent Music Player --- */}
      <MusicPlayer />
    </AppShell>
  );
}

export default Layout;
