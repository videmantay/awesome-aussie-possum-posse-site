# Design System → Site Integration

This folder mirrors `site/src/` so you can drop the files straight into your repo. **Copy these on top of your existing site:**

```
site_integration/src/assets/styles/possum-tokens.css   →  site/src/assets/styles/possum-tokens.css   (NEW)
site_integration/src/components/icons/WesternIcon.jsx  →  site/src/components/icons/WesternIcon.jsx  (NEW)
site_integration/src/theme.js                          →  site/src/theme.js                          (REPLACE)
site_integration/src/main.jsx                          →  site/src/main.jsx                          (REPLACE — adds 1 import)
site_integration/src/components/Layout.jsx             →  site/src/components/Layout.jsx             (REPLACE — emoji → WesternIcon)
```

No new npm packages needed. Existing pages, MusicPlayer, ThreeBook, PageFlipTeaser, etc. keep working unchanged.

## What changed

### 1. `possum-tokens.css` — new file
Brand CSS variables that live alongside Mantine's tokens. You can now write `var(--font-display)`, `var(--color-rust)`, `var(--char-brennen)`, `var(--shadow-card)` anywhere in your styles.

Key tokens:

| Variable | Use for |
|---|---|
| `--font-display` (Rye) | H1/H2 headings, hero titles |
| `--font-shout` (Bangers) | CTAs, eyebrow labels, badges |
| `--font-fun` (Bubblegum Sans) | Nav links, friendly subtitles |
| `--font-hand` (Patrick Hand) | Notes, captions, taglines |
| `--font-body` (Baloo 2) | Body copy |
| `--color-rust`, `--color-ember`, `--color-mahogany`, `--color-ink` | Brand semantic colors |
| `--char-brennen` … `--char-willow` | Per-character accent (use on character cards) |
| `--shadow-card`, `--shadow-cta` | Drop shadows |
| `--text-shadow-hero` | The big stamped hero look |

Plus utility classes: `.possum-eyebrow`, `.possum-note`, `.possum-display`, `.possum-stamp`.

### 2. `WesternIcon.jsx` — new component
Hand-drawn SVG icons replace emoji glyphs. **9 icons:** `star`, `hat`, `paw`, `poster`, `horseshoe`, `quill`, `palette`, `family`, `mailbox`.

```jsx
import WesternIcon from './components/icons/WesternIcon';

<WesternIcon name="star"  size={16} color="#fff" />     // skill chips
<WesternIcon name="paw"   size={20} color="#3a1e00" />  // nav active
<WesternIcon name="quill" size={24} />                  // inherits color
```

All icons share the same outline style (1.2px ink stroke at `#3a1e00`) so they read as a coherent illustrated set, not stock glyphs.

### 3. `theme.js` — replaced
- Adds `eucalyptus` and `dusk` color scales (10 stops each, Mantine-compatible).
- Sets heading sizes via clamp() to match the design system.
- Exposes `theme.other.fontDisplay / fontShout / fontFun / fontHand / fontBody` for inline reads:
  ```jsx
  const theme = useMantineTheme();
  <Text style={{ fontFamily: theme.other.fontShout }}>HOWDY</Text>
  ```
- Exposes `theme.other.charBrennen` … `charWillow`, `theme.other.sunsetGradient`, `theme.other.shadowCard`.
- Keeps the old `handwrittenFont / funFont / bodyFont` aliases so existing code doesn't break.

### 4. `main.jsx` — one new import
Adds `import './assets/styles/possum-tokens.css';` after the existing imports. That's it.

### 5. `Layout.jsx` — emoji → SVG
Side-drawer nav links now use `<WesternIcon>` for **Home (hat)**, **The Book (poster)**, **Characters (paw)**, **For Parents (family)**, **The Author (quill)**, **The Illustrator (palette)**, **Frontier Post (horseshoe)**. Inline `fontFamily` strings now reference `var(--font-display)` etc. so they pick up token changes automatically.

## How to use the system going forward

**On any page:**

```jsx
// Eyebrow + display heading + handwritten note
<div className="possum-eyebrow">Chapter One</div>
<h2 className="possum-display">Brennen Gets a Hat</h2>
<p className="possum-note">— from the journal of B. Brushtail</p>

// Skill chip with western icon
<span style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'var(--char-brennen)', color: '#fff',
  padding: '4px 14px 4px 10px', borderRadius: 'var(--radius-xl)',
  fontFamily: 'var(--font-shout)', letterSpacing: 1,
}}>
  <WesternIcon name="star" size={14} color="#fff" />
  NATURAL-BORN LEADER
</span>
```

**On a character card,** pull the character's accent from theme.other:

```jsx
const theme = useMantineTheme();
<Card style={{ borderTop: `4px solid ${theme.other.charGretel}` }}>…</Card>
```

## Brand rules — don't break these

- **Display type = Rye** (or Bangers for shouts). Never substitute a generic display font.
- **Body = Baloo 2 / Patrick Hand / Bubblegum Sans.** No Inter, Roboto, system stacks.
- **Rio Grande font is personal-use only** per its bundled license — keep using **Rye** in production.
- **Outline every illustrated icon** in `#3a1e00` ink at ~1.2px stroke (matches `WesternIcon`).
- **Background is always parchment** (`#fdf4eb` + `au2cal.png` texture), never flat white.
- **No emoji in chrome.** Use `<WesternIcon>` or commission a real illustration.

## Missing assets

`Bookcover.png` failed to copy from the local mount during the import — your existing `site/src/assets/imgs/shared/Bookcover.png` is still there and unaffected.
