import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DOMPurify from 'dompurify';
import { Box, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { db } from '../firebase';
import { ANIMATION_PRESETS, SPEED_MAP, TRIGGER_MAP } from '../lib/animationPresets';
import '../assets/styles/tiptap.css';

gsap.registerPlugin(ScrollTrigger);

const LANG_CODE = { en: 'en', 'es-MX': 'es', 'pt-BR': 'pt' };

function getLocalized(post, field, i18nLang) {
  const code = LANG_CODE[i18nLang] || 'en';
  return post[`${field}_${code}`] || post[`${field}_en`] || post[field] || '';
}

export default function NilorasNotesPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'posts', id)).then(snap => {
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!post?.scrollAnimation || post.scrollAnimation === 'none') return;
    const preset = ANIMATION_PRESETS[post.scrollAnimation];
    if (!preset?.fromVars) return;

    const el = document.querySelector('[data-post-id]');
    if (!el) return;

    const duration = SPEED_MAP[post.animationSpeed || 'normal'];
    const triggerStart = TRIGGER_MAP[post.animationTrigger || 'center'];
    const ease = preset.ease || 'power2.out';

    const ctx = gsap.context(() => {
      if (preset.stagger) {
        gsap.from(el.querySelectorAll('h1,h2,h3,p,img,video'), {
          ...preset.fromVars, duration, stagger: 0.12, ease,
          scrollTrigger: { trigger: el, start: triggerStart, once: true },
        });
      } else {
        gsap.from(el, {
          ...preset.fromVars, duration, ease,
          scrollTrigger: { trigger: el, start: triggerStart, once: true },
        });
      }
    });

    return () => ctx.revert();
  }, [post]);

  if (loading) {
    return <Center py="xl"><Loader color="brown" /></Center>;
  }

  if (notFound) {
    return (
      <Box maw={760} mx="auto" py="xl" ta="center">
        <Text style={{ fontFamily: '"Bubblegum Sans", sans-serif', color: 'var(--mantine-color-brown-5)', fontSize: '1.2rem' }}>
          That post has wandered off, partner.
        </Text>
        <button onClick={() => navigate('/niloras-notes')} style={backBtnStyle}>
          ← Back to Nilora's Notes
        </button>
      </Box>
    );
  }

  const title = getLocalized(post, 'title', i18n.language);
  const body  = getLocalized(post, 'body',  i18n.language);
  const publishDate = post.publishedAt
    ? post.publishedAt.toDate().toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <Box maw={760} mx="auto" py="xl">
      <Stack gap="xl">
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          ← Back
        </button>

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
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
            ) : (
              <img src={post.mediaUrl} alt=""
                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
            )
          )}
          <Box p="xl">
            <Title order={2} mb="xs"
              style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)' }}>
              {title}
            </Title>
            {publishDate && (
              <Text size="xs" c="brown.5" mb="xl" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                {publishDate}
              </Text>
            )}
            <div className="post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} />
          </Box>
        </Paper>

        <button onClick={() => navigate('/niloras-notes')} style={backBtnStyle}>
          ← All of Nilora's Notes
        </button>
      </Stack>
    </Box>
  );
}

const backBtnStyle = {
  alignSelf: 'flex-start',
  background: 'transparent',
  color: 'var(--mantine-color-brown-6)',
  border: '2px solid var(--mantine-color-brown-3)',
  borderRadius: 20,
  padding: '0.4rem 1.2rem',
  fontFamily: '"Baloo 2", sans-serif',
  fontSize: '0.9rem',
  cursor: 'pointer',
  width: 'fit-content',
};
