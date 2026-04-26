import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { Box, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { gsap } from 'gsap';
import { db } from '../firebase';
import { ANIMATION_PRESETS, SPEED_MAP, TRIGGER_MAP } from '../lib/animationPresets';
import '../assets/styles/tiptap.css';

// Maps i18n language codes → Firestore field suffix
const LANG_CODE = { en: 'en', 'es-MX': 'es', 'pt-BR': 'pt' };

function getLocalized(post, field, i18nLang) {
  const code = LANG_CODE[i18nLang] || 'en';
  return post[`${field}_${code}`] || post[`${field}_en`] || post[field] || '';
}

function PostCard({ post, i18nLang }) {
  const title = getLocalized(post, 'title', i18nLang);
  const body  = getLocalized(post, 'body',  i18nLang);

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
      {post.mediaUrl && (
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
        {post.publishedAt && (
          <Text size="xs" c="brown.5" mb="md" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            {post.publishedAt.toDate().toLocaleDateString(i18nLang, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </Text>
        )}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} />
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
          Dispatches coming soon — check back, partner!
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

function FrontierPost() {
  const { t } = useTranslation();

  return (
    <div>
      <Box maw={760} mx="auto" py="xl">
        <Stack gap="xl">
          <Paper
            shadow="xl"
            radius="xl"
            p="xl"
            ta="center"
            style={{
              backgroundColor: 'rgba(253, 244, 235, 0.97)',
              border: '3px solid var(--mantine-color-brown-3)',
            }}
          >
            <Title
              order={1}
              style={{
                fontFamily: '"Rye", cursive',
                color: 'var(--mantine-color-brown-8)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.1)',
              }}
            >
              {t('frontier.title')}
            </Title>
            <Text
              ta="center"
              size="lg"
              fs="italic"
              mt="xs"
              style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-6)' }}
            >
              {t('frontier.subtitle')}
            </Text>
          </Paper>

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
