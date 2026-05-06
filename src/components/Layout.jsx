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
  Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import WesternIcon from './icons/WesternIcon';
import AnnouncementBanner from './AnnouncementBanner';

const LANGUAGES = [
  { code: 'en',    countryCode: 'US', label: 'English'   },
  { code: 'es-MX', countryCode: 'MX', label: 'Español'   },
  { code: 'pt-BR', countryCode: 'BR', label: 'Português' },
];

// Western SVG icons replace the old emoji glyphs.
const navLinks = [
  { to: '/',              labelKey: 'nav.home',           icon: 'hat' },
  { to: '/about',         labelKey: 'nav.theBook',        icon: 'poster' },
  { to: '/characters',    labelKey: 'nav.characters',     icon: 'paw' },
  { to: '/parents',       labelKey: 'nav.forParents',     icon: 'family' },
  { to: '/author',        labelKey: 'nav.theAuthor',      icon: 'quill' },
  { to: '/illustrator',   labelKey: 'nav.theIllustrator', icon: 'palette' },
  { to: '/niloras-notes', labelKey: 'nav.frontierPost',   icon: 'mailbox' },
];

function Layout() {
  const { t, i18n } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [hasBanner, setHasBanner] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppShell
      header={{ height: hasBanner ? 65 + 36 : 65 }}
      footer={{ height: 56 }}
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnnouncementBanner onPresence={setHasBanner} />
        <Group h="65px" px="md">
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
                fontFamily: 'var(--font-display, "Rye", cursive)',
                letterSpacing: '1px',
                fontSize: 'clamp(0.7rem, 3vw, 1.1rem)',
                whiteSpace: 'nowrap',
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
              style={{ fontFamily: 'var(--font-shout, "Bangers", cursive)', letterSpacing: '2px', fontSize: '0.85rem' }}
            >
              {t('nav.explore', 'Explore')}
            </Text>

            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  component={Link}
                  to={link.to}
                  label={
                    <Group gap={8} wrap="nowrap">
                      <WesternIcon
                        name={link.icon}
                        size={20}
                        color={active ? '#3a1e00' : '#5a3a1a'}
                      />
                      <Text size="md" fw={600} style={{ fontFamily: 'var(--font-fun, "Bubblegum Sans", sans-serif)' }}>
                        {t(link.labelKey)}
                      </Text>
                    </Group>
                  }
                  active={active}
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
              );
            })}

            <Divider my="md" color="brown.3" />

            <Box px="sm">
              <Text
                size="xs"
                fw={700}
                tt="uppercase"
                c="brown.5"
                mb={6}
                style={{ fontFamily: 'var(--font-shout, "Bangers", cursive)', letterSpacing: '2px', fontSize: '0.75rem' }}
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
                          fontFamily: 'var(--font-fun, "Bubblegum Sans", sans-serif)',
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
                        onClick={() => { i18n.changeLanguage(code); close(); }}
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
                style={{ fontFamily: 'var(--font-hand, "Patrick Hand", cursive)' }}
              >
                {t('nav.tagline', 'Adventure awaits, mate!')}
              </Text>
            </Box>
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      {/* --- Main Content --- */}
      <AppShell.Main
        style={isHome ? undefined : {
          background: 'linear-gradient(160deg, #6b2a0a 0%, #c45a1a 40%, #e8901a 70%, #f5c87a 100%)',
          minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
        }}
      >
        <Outlet />
      </AppShell.Main>

{/* --- Footer --- */}
      <AppShell.Footer
        style={{
          backgroundColor: 'var(--mantine-color-brown-9)',
          borderTop: '2px solid var(--mantine-color-brown-7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Group gap="xl" justify="center" align="center">
          <Group gap="sm">
            <Anchor href="https://www.facebook.com/awesausspossposs/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <ActionIcon variant="subtle" size="lg" style={{ color: '#fdf4eb' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </ActionIcon>
            </Anchor>
            <Anchor href="https://www.instagram.com/awesausspossposs" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <ActionIcon variant="subtle" size="lg" style={{ color: '#fdf4eb' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </ActionIcon>
            </Anchor>
            <Anchor href="https://www.youtube.com/@awesausspossposs" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <ActionIcon variant="subtle" size="lg" style={{ color: '#fdf4eb' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" style={{ fill: 'var(--mantine-color-brown-9)' }}/>
                </svg>
              </ActionIcon>
            </Anchor>
          </Group>
          <Text size="xs" c="brown.4" style={{ fontFamily: 'var(--font-hand, "Patrick Hand", cursive)' }}>
            © {new Date().getFullYear()} The Awesome Aussie Possum Posse
            {' · '}
            <Link to="/privacy" style={{ color: 'var(--mantine-color-brown-4)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}

export default Layout;
