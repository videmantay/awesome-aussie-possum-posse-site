import { forwardRef, useRef, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useTranslation } from 'react-i18next';
import { RichText } from '../design-system/richText';
import coverImg from '../assets/imgs/shared/Bookcover.png';

const rightModules = import.meta.glob('../assets/imgs/pageFlipTeaser/right-img*.{jpg,jpeg,png,webp}', { eager: true });
const rightImgs = Object.keys(rightModules).sort().map((k) => rightModules[k].default);

// Preload all images at module-load time (when the lazy chunk arrives) so the browser
// cache is warm before the first render — prevents the blur-then-sharpen flash.
if (typeof window !== 'undefined') {
  [coverImg, ...rightImgs].forEach(src => { new Image().src = src; });
}

// pageInner fills the outer ref-div (which page-flip controls via style.cssText).
// Visual styles live here so they survive the library's cssText replacement.
const pageInner = { position: 'absolute', inset: 0, overflow: 'hidden', boxSizing: 'border-box' };

const ImagePage = forwardRef(({ src, alt }, ref) => (
  <div ref={ref}>
    <div style={{ ...pageInner, background: '#fff' }}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  </div>
));
ImagePage.displayName = 'ImagePage';

const TextPage = forwardRef(({ data }, ref) => (
  <div ref={ref}>
    <div style={{
      ...pageInner,
      background: '#fdf4eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {data ? (
        <>
          <h3 style={{
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.2rem)',
            color: '#a95c14',
            margin: '0 0 1rem 0',
            lineHeight: 1.25,
          }}>
            <RichText>{data.heading}</RichText>
          </h3>
          {data.paragraphs.map((p, i) => (
            <p key={i} style={{
              fontFamily: '"Patrick Hand", cursive',
              fontSize: 'clamp(0.75rem, 1.4vw, 0.95rem)',
              color: '#3a1e00',
              margin: i < data.paragraphs.length - 1 ? '0 0 0.6rem 0' : '0',
              lineHeight: 1.6,
            }}>
              <RichText>{p}</RichText>
            </p>
          ))}
        </>
      ) : (
        <span style={{
          fontFamily: '"Rye", cursive',
          fontSize: '1.2rem',
          color: '#a95c14',
          textAlign: 'center',
        }}>
          Coming Soon...
        </span>
      )}
    </div>
  </div>
));
TextPage.displayName = 'TextPage';

const CtaPage = forwardRef((_, ref) => (
  <div ref={ref}>
    <div style={{
      ...pageInner,
      background: '#3a1000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: '"Rye", cursive',
        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
        color: '#f5c87a',
        margin: '0 0 0.75rem 0',
        lineHeight: 1.3,
      }}>
        The Awesome Aussie Possum Posse
      </p>
      <p style={{
        fontFamily: '"Patrick Hand", cursive',
        fontSize: '0.95rem',
        color: '#d4a055',
        fontStyle: 'italic',
        margin: 0,
      }}>
        Coming soon to bookstores everywhere.
      </p>
    </div>
  </div>
));
CtaPage.displayName = 'CtaPage';

function PageFlipTeaser() {
  const { t } = useTranslation();
  const { t: tFlip } = useTranslation('pageFlip');
  const leftPages = tFlip('pages', { returnObjects: true, fallbackLng: 'en' }) || [];
  const bookRef = useRef(null);

  // Memoised so react-pageflip always receives the same element instances.
  // Rebuilding this array on re-renders causes the library to remount pages,
  // which triggers image re-fetches and the blur-then-sharpen effect.
  const pages = useMemo(() => [
    <ImagePage key="cover" src={coverImg} alt="The Awesome Aussie Possum Posse — book cover" />,
    ...rightImgs.flatMap((src, i) => [
      <TextPage key={`text-${i}`} data={Array.isArray(leftPages) ? leftPages[i] : null} />,
      <ImagePage key={`img-${i}`} src={src} alt={`Illustration ${i + 1}`} />,
    ]),
    <CtaPage key="cta" />,
  ], [leftPages]);

  return (
    <section style={{
      minHeight: 'calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 56px))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #0d0500 0%, #2a1000 50%, #0d0500 100%)',
      padding: '3rem 2rem',
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{
          fontFamily: '"Rye", cursive',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          color: '#f5c87a',
          margin: 0,
          textShadow: '3px 3px 0 #6b2a0a',
          letterSpacing: '2px',
        }}>
          {t('teaser.heading')}
        </h2>
        <p style={{
          fontFamily: '"Patrick Hand", cursive',
          color: '#d4a055',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          margin: '0.5rem 0 0',
        }}>
          {t('teaser.subheading')}
        </p>
      </div>

      <HTMLFlipBook
        ref={bookRef}
        width={440}
        height={580}
        size="stretch"
        minWidth={220}
        maxWidth={440}
        minHeight={300}
        maxHeight={580}
        showCover={true}
        usePortrait={true}
        flippingTime={650}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
      >
        {pages}
      </HTMLFlipBook>

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          aria-label="Previous page"
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '2rem', lineHeight: 1, color: '#a07040', cursor: 'pointer',
          }}
        >
          ‹
        </button>
        <button
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          aria-label="Next page"
          style={{
            background: 'none', border: 'none', padding: 0,
            fontSize: '2rem', lineHeight: 1, color: '#a07040', cursor: 'pointer',
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default PageFlipTeaser;
