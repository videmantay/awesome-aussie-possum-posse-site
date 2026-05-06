/**
 * design-system/PageLoader.jsx
 *
 * Brand-styled Suspense fallback used while lazy-loaded page components
 * (PageFlipTeaser, CharacterParade, etc.) are fetching their JS chunk.
 *
 * Drop it into any <Suspense fallback={...}> wrapper:
 *
 *   import PageLoader from '../design-system/PageLoader';
 *   <Suspense fallback={<PageLoader />}>
 *     <HeavyComponent />
 *   </Suspense>
 *
 * The pulse animation is defined inline so the component is fully
 * self-contained — no external CSS file required.
 */

import possumIcon from '../assets/icons/possumSilohette.svg';

// Keyframe block injected once into the document <head>
const KEYFRAMES = `
  @keyframes possum-pulse {
    0%, 100% { opacity: 0.35; transform: scale(0.95); }
    50%       { opacity: 1;    transform: scale(1.05); }
  }
`;

let keyframesInjected = false;
function ensureKeyframes() {
  if (keyframesInjected) return;
  const style = document.createElement('style');
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  keyframesInjected = true;
}

function PageLoader() {
  // Inject keyframes on first render (safe to call multiple times — guarded above)
  if (typeof document !== 'undefined') ensureKeyframes();

  return (
    <div
      role="status"
      aria-label="Loading…"
      style={{
        minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '1.25rem',
        // Matches the hero / section gradient used throughout the site
        background: 'linear-gradient(160deg, #2a1500 0%, #5a2800 40%, #8b4400 70%, #c87828 100%)',
      }}
    >
      {/* Possum silhouette — pulses while loading */}
      <img
        src={possumIcon}
        alt=""
        aria-hidden="true"
        style={{
          height:    '80px',
          filter:    'invert(1) brightness(10)',   // white on dark background
          animation: 'possum-pulse 1.4s ease-in-out infinite',
        }}
      />

      {/* "Loading…" text in the display font */}
      <p
        style={{
          fontFamily:  'var(--font-display)',      // 'Rye', 'Rio Grande', cursive
          fontSize:    '1.1rem',
          color:       'var(--color-on-dark)',     // #fdf4eb parchment
          letterSpacing: '1px',
          margin:      0,
          opacity:     0.75,
        }}
      >
        Loading…
      </p>
    </div>
  );
}

export default PageLoader;
