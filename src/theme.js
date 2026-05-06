/**
 * Mantine theme — extended with the Possum Posse design system.
 * Replaces site/src/theme.js. Adds the full character accent palette
 * and exposes display fonts under `theme.other.*` so any component can
 * read them without re-declaring font-family strings inline.
 */

import { createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'brown',
  colors: {
    // Sun-faded leather, dust, hide — primary brand scale
    brown: [
      '#fdf4eb', // 0  parchment
      '#f3e4d2', // 1  sand
      '#e8c6a1', // 2  warm tan
      '#dca56c', // 3  saddle
      '#d38a42', // 4  rust-orange
      '#c87828', // 5  primary brand orange
      '#c06e1e', // 6  burnt sienna
      '#a95c14', // 7  deep tan body
      '#96510f', // 8  signage brown
      '#824404', // 9  mahogany / footer
    ],
    // Eucalyptus greens — used by Gretel + Pygmy character themes
    eucalyptus: [
      '#eaf4ec', '#cfe5d4', '#a8d2b0', '#7dba8a', '#5aa86b',
      '#4a8a5a', '#3e7449', '#345e3a', '#2a4a2e', '#1f3622',
    ],
    // Dusk blues — Remmy / Willow character themes
    dusk: [
      '#e9eaf2', '#cfd1e0', '#a9adcb', '#8589b6', '#6a6a9a',
      '#585886', '#494973', '#3a3a5e', '#2c2c4a', '#1f1f35',
    ],
  },
  fontFamily: '"Baloo 2", system-ui, sans-serif',
  headings: {
    fontFamily: '"Rye", "Rio Grande", cursive',
    sizes: {
      h1: { fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: '1.1', fontWeight: '400' },
      h2: { fontSize: 'clamp(2rem, 5vw, 3.2rem)',   lineHeight: '1.15', fontWeight: '400' },
      h3: { fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', lineHeight: '1.25', fontWeight: '400' },
    },
  },
  defaultRadius: 'md',
  other: {
    // Font tokens — read with `useMantineTheme().other.fontShout` etc.
    fontDisplay: '"Rye", "Rio Grande", cursive',
    fontShout:   '"Bangers", "Rye", cursive',
    fontFun:     '"Bubblegum Sans", sans-serif',
    fontHand:    '"Patrick Hand", cursive',
    fontBody:    '"Baloo 2", system-ui, sans-serif',

    // Backwards-compat aliases (existing code reads these)
    handwrittenFont: '"Patrick Hand", cursive',
    funFont:         '"Bangers", cursive',
    bodyFont:        '"Baloo 2", system-ui, sans-serif',

    // Character accent colors
    charBrennen: '#c45a1a',
    charGretel:  '#4a8a5a',
    charHana:    '#8a4a9a',
    charPlaid:   '#c8a010',
    charPygmy:   '#3a8a50',
    charRemmy:   '#6a6a9a',
    charWillow:  '#4a7a6a',

    // Sunset gradient (used on non-home AppShell.Main)
    sunsetGradient:
      'linear-gradient(160deg, #6b2a0a 0%, #c45a1a 40%, #e8901a 70%, #f5c87a 100%)',

    // Shadow & ink tokens
    shadowCard: '0 8px 32px rgba(0,0,0,0.25)',
    shadowCta:  '0 4px 16px rgba(0,0,0,0.35)',
    inkColor:   '#3a1e00',
    inkColor2:  '#5a3a1a',
  },
});

export default theme;
