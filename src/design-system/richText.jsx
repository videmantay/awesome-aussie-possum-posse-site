/**
 * design-system/richText.jsx
 *
 * Illustrated rich-text annotation system for the Awesome Aussie Possum Posse.
 * Lets you mark up JSON copy strings (pageFlip-en.json, en.json, etc.) so
 * individual words or phrases render with different fonts, colours, and inline
 * icons — Geronimo Stilton-style — without touching any component code.
 *
 * ─── SYNTAX ──────────────────────────────────────────────────────────────────
 *
 *   Plain text — no annotation needed, renders as-is.
 *
 *   [word or phrase|styleName]
 *       Wraps the text in a <span> using the named style from STYLE_PALETTE.
 *       Example: "He was [shipwrecked|shout] and already looking for help."
 *
 *   [:iconName]
 *       Inserts an inline SVG icon from ICON_REGISTRY.
 *       Example: "[:paw] He's already looking for someone to help."
 *
 * ─── EXTENDING ───────────────────────────────────────────────────────────────
 *
 *   New text style  → add an entry to STYLE_PALETTE below.
 *   New inline icon → add an entry to ICON_REGISTRY below.
 *
 *   All colour values reference tokens from possum-tokens.css so that
 *   palette changes propagate automatically.
 *
 * ─── USAGE IN A COMPONENT ────────────────────────────────────────────────────
 *
 *   import { RichText } from '../design-system/richText';
 *
 *   // Inside JSX:
 *   <p style={...}><RichText>{paragraphStringFromJson}</RichText></p>
 *   <h3 style={...}><RichText>{headingStringFromJson}</RichText></h3>
 */

import React from 'react';

// =============================================================================
// STYLE PALETTE
// =============================================================================
// Keys  → the styleName you write inside [ | ] in your JSON strings.
// Values → plain React inline-style objects (CSS-in-JS).
//
// Colour tokens come from src/assets/styles/possum-tokens.css.
// Font  tokens: var(--font-display | --font-shout | --font-fun | --font-hand | --font-body)
// =============================================================================

export const STYLE_PALETTE = {

  // ── shout ──────────────────────────────────────────────────────────────────
  // Big action words, sound effects, dramatic single-word beats.
  // e.g. "Cage door [finally open|shout]."
  // Font: Bangers — the widest, loudest typeface in the set.
  shout: {
    fontFamily: 'var(--font-shout)',    // 'Bangers', 'Rye', cursive
    fontSize:   '1.3em',
    color:      'var(--color-rust)',    // #c45a1a warm orange
    letterSpacing: '1.5px',
    lineHeight:    1,
    display:       'inline-block',
    verticalAlign: 'middle',
  },

  // ── warm ───────────────────────────────────────────────────────────────────
  // Quiet emphasis with feeling, not volume.
  // e.g. "He's [already|warm] looking for someone to help."
  // Font: body bold italic, golden amber.
  warm: {
    fontFamily: 'var(--font-body)',     // 'Baloo 2', system-ui
    fontWeight: 700,
    fontStyle:  'italic',
    color:      'var(--color-ember)',   // var(--brown-5) #c87828 golden amber
  },

  // ── whisper ────────────────────────────────────────────────────────────────
  // Quiet asides, understated moments, dry irony.
  // e.g. "She did grab Brennen on the way out — [mostly because he was slowing her down|whisper]."
  // Font: Patrick Hand italic, muted mid-brown.
  whisper: {
    fontFamily: 'var(--font-hand)',     // 'Patrick Hand', cursive
    fontSize:   '0.88em',
    fontStyle:  'italic',
    color:      'var(--color-saddle)',  // var(--brown-3) #dca56c muted
  },

  // ── display ────────────────────────────────────────────────────────────────
  // Proper nouns, place names, titles treated as visual beats.
  // e.g. "Somewhere ahead: a city called [Philadelphia|display]."
  // Font: Rye — the most decorative western display typeface.
  display: {
    fontFamily: 'var(--font-display)',  // 'Rye', 'Rio Grande', cursive
    fontSize:   '1.05em',
    color:      'var(--color-mahogany)', // var(--brown-9) #824404 deep brown
  },

  // ── wild ───────────────────────────────────────────────────────────────────
  // Chaotic-good energy — things going sideways, plans that won't cooperate.
  // e.g. "Pygmy has a rabbit that [won't cooperate|wild]."
  // Font: Bubblegum Sans — playful and slightly unhinged.
  wild: {
    fontFamily:    'var(--font-fun)',   // 'Bubblegum Sans', sans-serif
    fontSize:      '1.12em',
    color:         'var(--char-gretel)', // #4a8a5a forest green
    letterSpacing: '0.5px',
  },

  // ── fine ───────────────────────────────────────────────────────────────────
  // Reassurance that is clearly a lie. Deadpan optimism.
  // e.g. "They're going to be [fine|fine]."
  // Font: Bangers, forest green — comedic contrast to chaos.
  fine: {
    fontFamily:    'var(--font-shout)', // 'Bangers', 'Rye', cursive
    fontSize:      '1.2em',
    color:         'var(--char-pygmy)', // #3a8a50 green
    letterSpacing: '1px',
    display:       'inline-block',
    verticalAlign: 'middle',
  },

  // ── note ───────────────────────────────────────────────────────────────────
  // Parenthetical, hand-written-feeling side notes.
  // e.g. "[He'd never been to America either|note]."
  // Font: Patrick Hand, ink colour.
  note: {
    fontFamily: 'var(--font-hand)',     // 'Patrick Hand', cursive
    fontSize:   '0.85em',
    color:      'var(--color-ink-2)',   // #5a3a1a softer ink
    fontStyle:  'italic',
  },

  // ── CHARACTER NAME STYLES ──────────────────────────────────────────────────
  // One style per possum. Use a character's name as the style key to render
  // their name in their personal accent colour from the character parade.
  // e.g. "While [Brennen|brennen] was trapped under the crate..."

  brennen: { fontFamily: 'var(--font-display)', color: 'var(--char-brennen)', fontWeight: 700 }, // #c45a1a
  gretel:  { fontFamily: 'var(--font-display)', color: 'var(--char-gretel)',  fontWeight: 700 }, // #4a8a5a
  hana:    { fontFamily: 'var(--font-display)', color: 'var(--char-hana)',    fontWeight: 700 }, // #8a4a9a
  plaid:   { fontFamily: 'var(--font-display)', color: 'var(--char-plaid)',   fontWeight: 700 }, // #c8a010
  pygmy:   { fontFamily: 'var(--font-display)', color: 'var(--char-pygmy)',   fontWeight: 700 }, // #3a8a50
  remmy:   { fontFamily: 'var(--font-display)', color: 'var(--char-remmy)',   fontWeight: 700 }, // #6a6a9a
  willow:  { fontFamily: 'var(--font-display)', color: 'var(--char-willow)',  fontWeight: 700 }, // #4a7a6a

  // ── Add new styles below this line ────────────────────────────────────────
};


// =============================================================================
// ICON REGISTRY
// =============================================================================
// Keys  → the iconName you write inside [: ] in your JSON strings.
// Values → React elements (inline SVG).
//
// Icons use em-relative sizing so they scale with surrounding text.
// The .possum-icon class from possum-tokens.css handles vertical alignment.
//
// To replace a placeholder with a real SVG:
//   1. Copy the <path d="..."> from your SVG file.
//   2. Drop it into the <svg> below.
//   3. Set fill="currentColor" so it inherits the text colour.
// =============================================================================

// Shared wrapper styles for all icons — references .possum-icon utility class
const ico = {
  display:       'inline-block',
  verticalAlign: '-0.15em',          // matches .possum-icon in possum-tokens.css
  width:         '1.1em',
  height:        '1.1em',
  marginInline:  '0.15em',
  flexShrink:    0,
};

export const ICON_REGISTRY = {

  // paw ── small paw-print (placeholder geometry — replace path when art is ready)
  paw: (
    <svg style={ico} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="6"  cy="6"  r="2" />
      <circle cx="12" cy="4"  r="2" />
      <circle cx="18" cy="6"  r="2" />
      <circle cx="3"  cy="11" r="1.5" />
      <ellipse cx="12" cy="15" rx="5" ry="6" />
    </svg>
  ),

  // star ── western sheriff / achievement star
  star: (
    <svg style={ico} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),

  // hat ── outback / cowboy hat silhouette (placeholder)
  hat: (
    <svg style={ico} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 17 Q4 10 12 9 Q20 10 22 17 Z" />
      <rect x="1" y="17" width="22" height="2.5" rx="1.25" />
      <path d="M9 9 Q10 5 12 4 Q14 5 15 9 Z" />
    </svg>
  ),

  // boat ── sailboat (Australia → California journey)
  boat: (
    <svg style={ico} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 17 L12 3 L21 17 Z" />
      <line x1="12" y1="3" x2="12" y2="19" />
      <path d="M2 20 Q12 23 22 20" />
    </svg>
  ),

  // possum ── tiny possum silhouette (placeholder — swap path from possumSilohette.svg)
  possum: (
    <svg style={ico} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="12" cy="14" rx="6" ry="5" />
      <circle  cx="12" cy="7"  r="4" />
      <path d="M8 6 Q6 2 4 3 M16 6 Q18 2 20 3" strokeWidth="1.5" stroke="currentColor" fill="none" />
      <path d="M18 18 Q22 20 23 17 Q20 16 18 18" />
    </svg>
  ),

  // ── Add new icons below this line ─────────────────────────────────────────
};


// =============================================================================
// PARSER  (internal — not exported)
// =============================================================================
// Splits an annotated string into typed segment descriptors.
//
// Returns an array of:
//   { type: 'text',   content: string }
//   { type: 'styled', content: string, style: string }
//   { type: 'icon',   name: string }
// =============================================================================

function parseRichText(str) {
  const segments = [];
  const TOKEN    = /\[([^\]]+)\]/g; // matches anything inside [ … ]
  let cursor     = 0;
  let match;

  while ((match = TOKEN.exec(str)) !== null) {
    // Plain text before this token
    if (match.index > cursor) {
      segments.push({ type: 'text', content: str.slice(cursor, match.index) });
    }

    const inner = match[1].trim();

    if (inner.startsWith(':')) {
      // [:iconName]
      segments.push({ type: 'icon', name: inner.slice(1).trim() });
    } else {
      const pipe = inner.indexOf('|');
      if (pipe !== -1) {
        // [text|style]
        segments.push({
          type:    'styled',
          content: inner.slice(0, pipe).trim(),
          style:   inner.slice(pipe + 1).trim(),
        });
      } else {
        // [text] — no style, treat as plain text
        segments.push({ type: 'text', content: inner });
      }
    }

    cursor = TOKEN.lastIndex;
  }

  // Any remaining plain text after the last token
  if (cursor < str.length) {
    segments.push({ type: 'text', content: str.slice(cursor) });
  }

  return segments;
}


// =============================================================================
// <RichText> COMPONENT
// =============================================================================
// Drop-in replacement for wherever you'd render a plain string.
// If the value has no annotations it renders exactly as before.
//
// Usage:
//   <p style={yourExistingStyle}>
//     <RichText>{paragraphStringFromJson}</RichText>
//   </p>
// =============================================================================

export function RichText({ children }) {
  // Non-string children (already-rendered nodes, null, undefined) pass through
  if (typeof children !== 'string') return children ?? null;

  const segments = parseRichText(children);

  return (
    <>
      {segments.map((seg, i) => {

        if (seg.type === 'text') {
          // Plain text — no wrapper
          return seg.content;
        }

        if (seg.type === 'icon') {
          const icon = ICON_REGISTRY[seg.name];
          // Unknown icon name → silent no-op so copy is never broken
          return icon ? <React.Fragment key={i}>{icon}</React.Fragment> : null;
        }

        // type === 'styled'
        const styles = STYLE_PALETTE[seg.style];
        if (!styles) {
          // Unknown style name → fall back to unstyled text so copy is never lost
          return seg.content;
        }
        return (
          <span key={i} style={styles}>
            {seg.content}
          </span>
        );
      })}
    </>
  );
}
