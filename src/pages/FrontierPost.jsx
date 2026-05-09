import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Box, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { gsap } from 'gsap';
import { db } from '../firebase';
import { ANIMATION_PRESETS, SPEED_MAP, TRIGGER_MAP } from '../lib/animationPresets';
import '../assets/styles/tiptap.css';
import authorImg from '../assets/imgs/aboutAuthor/authorPic2.png' 

// Maps i18n language codes → Firestore field suffix
const LANG_CODE = { en: 'en', 'es-MX': 'es', 'pt-BR': 'pt' };

function getLocalized(post, field, i18nLang) {
  const code = LANG_CODE[i18nLang] || 'en';
  return post[`${field}_${code}`] || post[`${field}_en`] || post[field] || '';
}

function PostCard({ post, i18nLang }) {
  const title   = getLocalized(post, 'title',   i18nLang);
  const body    = getLocalized(post, 'body',     i18nLang);
  const summary = getLocalized(post, 'summary',  i18nLang);
  const summaryType = post.summaryType || null;
  const isLegacy = summaryType === null;

  const publishDate = post.publishedAt
    ? post.publishedAt.toDate().toLocaleDateString(i18nLang, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <Paper
      data-post-id={post.id}
      shadow="md"
      radius="xl"
      style={{
        backgroundColor: 'rgba(253, 244, 235, 0.97)',
        border: '3px solid var(--mantine-color-brown-3)',
        overflow: 'hidden',
      }}
    >
      {post.mediaUrl && (summaryType === 'image' || isLegacy) && (
        post.mediaType === 'video' ? (
          <video src={post.mediaUrl} controls
            style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
        ) : (
          <img src={post.mediaUrl} alt=""
            style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
        )
      )}

      <Box p="xl">
        <Title order={2} mb="xs"
          style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)' }}>
          {title}
        </Title>
        {publishDate && (
          <Text size="xs" c="brown.5" mb="md" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            {publishDate}
          </Text>
        )}

        {isLegacy ? (
          <div className="post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} />
        ) : (
          <>
            {summaryType === 'text' && summary && (
              <Text mb="md" style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-7)', lineHeight: 1.65 }}>
                {summary}
              </Text>
            )}
            <Link
              to={`/niloras-notes/${post.id}`}
              style={{
                display: 'inline-block',
                background: '#3a1e00',
                color: '#fdf4eb',
                borderRadius: 20,
                padding: '0.5rem 1.5rem',
                fontFamily: '"Bangers", cursive',
                fontSize: '1rem',
                letterSpacing: '1px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              Read More →
            </Link>
          </>
        )}
      </Box>
    </Paper>
  );
}

function FrontierPostFeed() {
  const { i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
    );
    const unsub = onSnapshot(q, snap => {
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.publishedAt?.seconds ?? 0) - (a.publishedAt?.seconds ?? 0));
      setPosts(sorted);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Apply GSAP scroll animations after posts render
  useEffect(() => {
    if (!posts.length) return;

    const ctx = gsap.context(() => {
      posts.forEach(post => {
        if (!post.scrollAnimation || post.scrollAnimation === 'none') return;

        const preset = ANIMATION_PRESETS[post.scrollAnimation];
        if (!preset?.fromVars) return;

        const el = document.querySelector(`[data-post-id="${post.id}"]`);
        if (!el) return;

        const duration = SPEED_MAP[post.animationSpeed || 'normal'];
        const triggerStart = TRIGGER_MAP[post.animationTrigger || 'center'];
        const ease = preset.ease || 'power2.out';

        if (preset.stagger) {
          gsap.from(el.querySelectorAll('h1,h2,h3,p,img,video'), {
            ...preset.fromVars,
            duration,
            stagger: 0.12,
            ease,
            scrollTrigger: { trigger: el, start: triggerStart, once: true },
          });
        } else {
          gsap.from(el, {
            ...preset.fromVars,
            duration,
            ease,
            scrollTrigger: { trigger: el, start: triggerStart, once: true },
          });
        }
      });
    });

    return () => ctx.revert();
  }, [posts]);

  if (loading) {
    return (
      <Center py="xl">
        <Loader color="brown" />
      </Center>
    );
  }

  if (!posts.length) {
    return (
      <Paper
        p="xl"
        radius="xl"
        ta="center"
        style={{
          backgroundColor: 'rgba(253, 244, 235, 0.95)',
          border: '2px dashed var(--mantine-color-brown-3)',
        }}
      >
        <Text
          size="lg"
          style={{ fontFamily: '"Bubblegum Sans", sans-serif', color: 'var(--mantine-color-brown-5)' }}
        >
          Nilora is typing… check back soon, partner!
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      {posts.map(post => <PostCard key={post.id} post={post} i18nLang={i18n.language} />)}
    </Stack>
  );
}

function NilorasMasthead() {
  const { t } = useTranslation();

  return (
    <Paper
      shadow="xl"
      radius="xl"
      style={{
        backgroundColor: 'rgba(253, 244, 235, 0.97)',
        border: '3px solid var(--mantine-color-brown-3)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top decorative rope-stitch border */}
      <div style={{
        height: 8,
        background: 'repeating-linear-gradient(90deg, #8B4513 0px, #8B4513 12px, #c87941 12px, #c87941 16px)',
        borderBottom: '2px solid #5a2800',
      }} />

      {/* Star divider row */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        color: '#8B4513',
        letterSpacing: '0.35rem',
        padding: '0.35rem 1rem',
        borderBottom: '1px solid rgba(139,69,19,0.2)',
        fontFamily: '"Rye", cursive',
        background: 'rgba(196,90,26,0.06)',
      }}>
        ✦ &nbsp; EST. IN THE STATE OF CA &nbsp; ✦
      </div>

      {/* Main masthead content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem 2rem',
        flexWrap: 'wrap',
      }}>
        {/* Author image placeholder — swap in Nilora's animated PNG/SVG when ready */}
        <div style={{
          flexShrink: 0,
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '3px solid #8B4513',
          background: 'linear-gradient(135deg, #f5e6d0 0%, #e8cfa8 100%)',
          boxShadow: '0 4px 16px rgba(90,40,0,0.25), inset 0 0 0 2px rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
          title="Nilora the dog's portrait"
        >
          <span style={{ opacity: 0.35, fontSize: '3rem' }}><img src={authorImg} alt="Nilora's portraitd" /></span>
          <span style={{
            position: 'absolute',
            bottom: 4,
            fontSize: '0.45rem',
            color: '#8B4513',
            fontFamily: '"Patrick Hand", cursive',
            letterSpacing: '0.05em',
            opacity: 0.6,
          }}>
            NILORA
          </span>
        </div>

        {/* Title + subtitle */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            fontSize: '0.65rem',
            fontFamily: '"Rye", cursive',
            color: '#8B4513',
            letterSpacing: '0.3rem',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
            opacity: 0.7,
          }}>
            — read along with —
          </div>
          <div style={{
            fontFamily: '"Rye", cursive',
            fontSize: 'clamp(2rem, 6vw, 3.2rem)',
            color: '#3d1a00',
            lineHeight: 1.1,
            textShadow: '2px 3px 0 rgba(139,69,19,0.18)',
            letterSpacing: '0.02em',
          }}>
            {t('frontier.title')}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(139,69,19,0.3)' }} />
            <span style={{
              fontFamily: '"Patrick Hand", cursive',
              color: '#8B4513',
              fontSize: '0.95rem',
              fontStyle: 'italic',
            }}>
              {t('frontier.subtitle')}
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(139,69,19,0.3)' }} />
          </div>
        </div>
      </div>

      {/* Bottom star divider */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        color: '#8B4513',
        letterSpacing: '0.35rem',
        padding: '0.35rem 1rem',
        borderTop: '1px solid rgba(139,69,19,0.2)',
        fontFamily: '"Rye", cursive',
        background: 'rgba(196,90,26,0.06)',
      }}>
        ✦ &nbsp; NILORA TAKIA &nbsp; · &nbsp; RESIDENT CORRESPONDENT &nbsp; ✦
      </div>

      {/* Bottom rope-stitch border */}
      <div style={{
        height: 8,
        background: 'repeating-linear-gradient(90deg, #8B4513 0px, #8B4513 12px, #c87941 12px, #c87941 16px)',
        borderTop: '2px solid #5a2800',
      }} />
    </Paper>
  );
}

function FrontierPost() {
  return (
    <div>
      <Box maw={760} mx="auto" py="xl">
        <Stack gap="xl">
          <NilorasMasthead />

          <FrontierPostFeed />
        </Stack>
      </Box>
      <div
        style={{
          background: '#2a1500',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1.5rem 2rem',
        }}
      >
        <Link
          to="/characters"
          style={{
            background: '#c45a1a',
            color: '#fdf4eb',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          Meet the Characters →
        </Link>
        <Link
          to="/parents"
          style={{
            background: 'transparent',
            color: '#f5c87a',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            border: '2px solid #f5c87a',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.2rem',
            letterSpacing: '1.5px',
            textDecoration: 'none',
          }}
        >
          For Parents →
        </Link>
      </div>
    </div>
  );
}

export default FrontierPost;
