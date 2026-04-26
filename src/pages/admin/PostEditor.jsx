import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DOMPurify from 'dompurify';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  ActionIcon, Badge, Box, Button, Group, Loader, Paper,
  Select, SegmentedControl, Stack, Text, TextInput, Tooltip,
} from '@mantine/core';
import {
  doc, getDoc, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { notifications } from '@mantine/notifications';
import { db, storage } from '../../firebase';
import { ANIMATION_PRESETS, SPEED_MAP, TRIGGER_MAP } from '../../lib/animationPresets';
import { translateText } from '../../lib/translate';
import '../../assets/styles/tiptap.css';

const BLANK_POST = {
  status: 'draft',
  mediaUrl: '',
  mediaType: null,
  scrollAnimation: 'none',
  animationSpeed: 'normal',
  animationTrigger: 'center',
};

const BLANK_LANGS = {
  en: { title: '', body: '' },
  es: { title: '', body: '' },
  pt: { title: '', body: '' },
};

const LANG_TABS = [
  { code: 'en', flag: '🇺🇸', label: 'English',   translateCode: null },
  { code: 'es', flag: '🇲🇽', label: 'Español',   translateCode: 'es' },
  { code: 'pt', flag: '🇧🇷', label: 'Português', translateCode: 'pt' },
];

const ANIMATION_OPTIONS = Object.entries(ANIMATION_PRESETS).map(([value, { label }]) => ({
  value, label,
}));

// ─── Preview ────────────────────────────────────────────────────────────────

function PostPreview({ langs, activeLang, post }) {
  const title = langs[activeLang]?.title || langs.en?.title || '';
  const body  = langs[activeLang]?.body  || langs.en?.body  || '';

  return (
    <Box maw={760} mx="auto" py="xl">
      <Paper
        shadow="xl"
        radius="xl"
        style={{
          backgroundColor: 'rgba(253, 244, 235, 0.97)',
          border: '3px solid var(--mantine-color-brown-3)',
          overflow: 'hidden',
        }}
      >
        {post.mediaUrl && (
          post.mediaType === 'video'
            ? <video src={post.mediaUrl} controls style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
            : <img src={post.mediaUrl} alt="" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }} />
        )}
        <Box p="xl">
          <Text
            component="h2"
            style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', margin: '0 0 0.5rem' }}
          >
            {title || <span style={{ opacity: 0.35 }}>No title yet…</span>}
          </Text>
          <Text size="xs" c="brown.5" mb="md" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            Preview — not yet published
          </Text>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
            style={!body ? { color: 'var(--mantine-color-brown-3)', fontFamily: '"Baloo 2", sans-serif' } : undefined}
          />
          {!body && <Text c="brown.3" style={{ fontFamily: '"Baloo 2", sans-serif' }}>No body yet…</Text>}
        </Box>
      </Paper>
    </Box>
  );
}

// ─── Toolbar ────────────────────────────────────────────────────────────────

function ToolbarBtn({ active, title, onClick, children }) {
  return (
    <Tooltip label={title} withArrow>
      <ActionIcon
        size="sm"
        variant={active ? 'filled' : 'subtle'}
        color="brown"
        onClick={onClick}
        aria-label={title}
        style={{ borderRadius: 6 }}
      >
        {children}
      </ActionIcon>
    </Tooltip>
  );
}

const SEP = (
  <Box style={{ width: 1, height: 18, background: 'var(--mantine-color-brown-3)', margin: '0 4px' }} />
);

function EditorToolbar({ editor, onImageUpload }) {
  if (!editor) return null;
  return (
    <Box style={{
      border: '2px solid var(--mantine-color-brown-3)',
      borderBottom: 'none',
      borderRadius: '0 0 0 0',
      background: 'var(--mantine-color-brown-0)',
      padding: '6px 10px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'center',
    }}>
      <ToolbarBtn title="Bold"          active={editor.isActive('bold')}   onClick={() => editor.chain().focus().toggleBold().run()}><b style={{ fontSize: 12 }}>B</b></ToolbarBtn>
      <ToolbarBtn title="Italic"        active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i style={{ fontSize: 12 }}>I</i></ToolbarBtn>
      <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><s style={{ fontSize: 11 }}>S</s></ToolbarBtn>
      {SEP}
      <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><span style={{ fontSize: 10, fontWeight: 700 }}>H1</span></ToolbarBtn>
      <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span style={{ fontSize: 10, fontWeight: 700 }}>H2</span></ToolbarBtn>
      <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><span style={{ fontSize: 10, fontWeight: 700 }}>H3</span></ToolbarBtn>
      <ToolbarBtn title="Paragraph"  active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}><span style={{ fontSize: 10 }}>P</span></ToolbarBtn>
      {SEP}
      <ToolbarBtn title="Align left"   active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()}><span style={{ fontSize: 10 }}>L</span></ToolbarBtn>
      <ToolbarBtn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><span style={{ fontSize: 10 }}>C</span></ToolbarBtn>
      <ToolbarBtn title="Align right"  active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()}><span style={{ fontSize: 10 }}>R</span></ToolbarBtn>
      {SEP}
      <ToolbarBtn title="Bullet list"   active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}><span style={{ fontSize: 11 }}>•—</span></ToolbarBtn>
      <ToolbarBtn title="Ordered list"  active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><span style={{ fontSize: 11 }}>1.</span></ToolbarBtn>
      <ToolbarBtn title="Blockquote"    active={editor.isActive('blockquote')}  onClick={() => editor.chain().focus().toggleBlockquote().run()}><span style={{ fontSize: 14 }}>"</span></ToolbarBtn>
      <ToolbarBtn title="Divider" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}><span style={{ fontSize: 11 }}>—</span></ToolbarBtn>
      {SEP}
      <ToolbarBtn title="Insert link" active={editor.isActive('link')} onClick={() => { const url = window.prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}><span style={{ fontSize: 11 }}>🔗</span></ToolbarBtn>
      <ToolbarBtn title="Insert image" active={false} onClick={onImageUpload}><span style={{ fontSize: 11 }}>🖼</span></ToolbarBtn>
    </Box>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [postId]    = useState(() => isNew ? crypto.randomUUID() : id);
  const [post, setPost]       = useState(BLANK_POST);
  const [langs, setLangs]     = useState(BLANK_LANGS);
  const [activeLang, setActiveLang] = useState('en');
  const activeLangRef = useRef('en');

  const [loadingPost, setLoadingPost] = useState(!isNew);
  const [saving, setSaving]           = useState(false);
  const [translating, setTranslating] = useState(false);
  const [preview, setPreview]         = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const imageInputRef = useRef();

  // ── Editor ──────────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your Frontier Post here, partner…' }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const lang = activeLangRef.current;
      setLangs(prev => ({ ...prev, [lang]: { ...prev[lang], body: editor.getHTML() } }));
    },
  });

  // When active language tab changes, load that lang's body into the editor
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(langs[activeLang].body || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLang, editor]);

  // Load existing post
  useEffect(() => {
    if (isNew || !editor) return;
    getDoc(doc(db, 'posts', postId)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setPost({ ...BLANK_POST, ...d });
        const loaded = {
          en: { title: d.title_en || d.title || '', body: d.body_en || d.body || '' },
          es: { title: d.title_es || '', body: d.body_es || '' },
          pt: { title: d.title_pt || '', body: d.body_pt || '' },
        };
        setLangs(loaded);
        editor.commands.setContent(loaded.en.body || '');
      }
      setLoadingPost(false);
    });
  }, [isNew, postId, editor]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function switchLang(newLang) {
    activeLangRef.current = newLang;
    setActiveLang(newLang);
  }

  function setLangField(field, value) {
    setLangs(prev => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
  }

  async function handleTranslate() {
    const tab = LANG_TABS.find(t => t.code === activeLang);
    if (!tab?.translateCode) return;
    if (!langs.en.title && !langs.en.body) {
      notifications.show({ message: 'Write the English version first.', color: 'orange' });
      return;
    }
    setTranslating(true);
    try {
      const [title, body] = await Promise.all([
        translateText(langs.en.title, tab.translateCode),
        translateText(langs.en.body,  tab.translateCode),
      ]);
      setLangs(prev => ({ ...prev, [activeLang]: { title, body } }));
      editor?.commands.setContent(body || '');
      notifications.show({ message: 'Translation loaded — review and edit as needed.', color: 'green' });
    } catch (err) {
      notifications.show({ message: `Translation failed: ${err.message}`, color: 'red' });
    } finally {
      setTranslating(false);
    }
  }

  function triggerImageUpload() { imageInputRef.current?.click(); }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const storageRef = ref(storage, `posts/${postId}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => setUploadProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      ()   => { notifications.show({ message: 'Image upload failed.', color: 'red' }); setUploadProgress(null); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        editor?.chain().focus().setImage({ src: url }).run();
        setUploadProgress(null);
        e.target.value = '';
      },
    );
  }

  function handleMediaFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const storageRef = ref(storage, `posts/${postId}/hero_${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    setUploadProgress(0);
    task.on('state_changed',
      snap => setUploadProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      ()   => { notifications.show({ message: 'Upload failed.', color: 'red' }); setUploadProgress(null); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setPost(p => ({ ...p, mediaUrl: url, mediaType }));
        setUploadProgress(null);
        e.target.value = '';
      },
    );
  }

  async function handleSave(status) {
    if (!langs.en.title.trim()) {
      notifications.show({ message: 'Give the English title first.', color: 'orange' });
      return;
    }
    setSaving(true);
    const data = {
      ...post,
      // Localized fields
      title_en: langs.en.title,
      title_es: langs.es.title,
      title_pt: langs.pt.title,
      body_en:  langs.en.body,
      body_es:  langs.es.body,
      body_pt:  langs.pt.body,
      // Legacy fallback (English)
      title: langs.en.title,
      body:  langs.en.body,
      status,
      updatedAt: serverTimestamp(),
    };
    if (status === 'published' && !post.publishedAt) data.publishedAt = serverTimestamp();
    try {
      if (isNew) {
        await setDoc(doc(db, 'posts', postId), { ...data, createdAt: serverTimestamp() });
        navigate(`/admin/posts/${postId}`, { replace: true });
      } else {
        await updateDoc(doc(db, 'posts', postId), data);
      }
      notifications.show({ message: status === 'published' ? 'Post published!' : 'Draft saved.', color: 'green' });
      setPost(p => ({ ...p, status }));
    } catch {
      notifications.show({ message: 'Save failed.', color: 'red' });
    } finally {
      setSaving(false);
    }
  }

  if (loadingPost) return <Box ta="center" py="xl"><Loader color="brown" /></Box>;

  const selectedPreset = ANIMATION_PRESETS[post.scrollAnimation] || ANIMATION_PRESETS.none;

  return (
    <Box maw={1100} mx="auto">

      {/* ── Top bar ── */}
      <Group justify="space-between" mb="lg" align="center">
        <Group gap="sm">
          <Button variant="subtle" color="brown" size="sm" onClick={() => navigate('/admin/posts')}
            style={{ fontFamily: '"Baloo 2", sans-serif' }}>← Posts</Button>
          <Badge color={post.status === 'published' ? 'green' : 'brown'}
            variant={post.status === 'published' ? 'filled' : 'outline'}>
            {post.status}
          </Badge>
        </Group>
        <Group gap="sm">
          <Button
            variant={preview ? 'filled' : 'outline'}
            color="brown"
            onClick={() => setPreview(p => !p)}
            style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: '20px' }}
          >
            {preview ? '✏️ Edit' : '👁 Preview'}
          </Button>
          <Button variant="outline" color="brown" loading={saving} onClick={() => handleSave('draft')}
            style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: '20px' }}>Save Draft</Button>
          <Button loading={saving} onClick={() => handleSave('published')}
            style={{ background: '#3a1e00', color: '#fdf4eb', fontFamily: '"Bangers", cursive', fontSize: '1.1rem', letterSpacing: '1px', borderRadius: '20px' }}>
            {post.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </Group>
      </Group>

      {/* ── Preview mode ── */}
      {preview && <PostPreview langs={langs} activeLang={activeLang} post={post} />}

      {/* ── Two-column layout ── */}
      <Box style={{ display: preview ? 'none' : 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left: language tabs + editor ── */}
        <Stack gap="md">

          {/* Language tab bar */}
          <Paper radius="lg" style={{ border: '2px solid var(--mantine-color-brown-3)', overflow: 'hidden', background: '#fff9f3' }}>
            <Group gap={0} style={{ borderBottom: '2px solid var(--mantine-color-brown-3)' }}>
              {LANG_TABS.map(tab => {
                const hasContent = !!langs[tab.code].title;
                const isActive   = activeLang === tab.code;
                return (
                  <button
                    key={tab.code}
                    onClick={() => switchLang(tab.code)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      border: 'none',
                      borderRight: '1px solid var(--mantine-color-brown-3)',
                      background: isActive ? 'var(--mantine-color-brown-1)' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: '"Bubblegum Sans", sans-serif',
                      fontSize: '0.95rem',
                      color: isActive ? 'var(--mantine-color-brown-8)' : 'var(--mantine-color-brown-5)',
                      fontWeight: isActive ? 700 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'background 0.15s',
                    }}
                  >
                    <span>{tab.flag}</span>
                    <span>{tab.label}</span>
                    {hasContent && !isActive && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mantine-color-brown-5)', display: 'inline-block' }} />
                    )}
                  </button>
                );
              })}

              {/* Translate button — only on ES / PT tabs */}
              {activeLang !== 'en' && (
                <button
                  onClick={handleTranslate}
                  disabled={translating}
                  style={{
                    padding: '10px 14px',
                    border: 'none',
                    background: translating ? 'var(--mantine-color-brown-2)' : 'var(--mantine-color-brown-7)',
                    color: '#fdf4eb',
                    cursor: translating ? 'wait' : 'pointer',
                    fontFamily: '"Bangers", cursive',
                    fontSize: '0.95rem',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {translating ? '⏳ Translating…' : '✨ Translate from English'}
                </button>
              )}
            </Group>

            {/* Title input */}
            <Box px="md" pt="md" pb="xs">
              <TextInput
                placeholder={`Post title in ${LANG_TABS.find(t => t.code === activeLang)?.label}…`}
                value={langs[activeLang].title}
                onChange={e => setLangField('title', e.target.value)}
                styles={{
                  input: {
                    fontFamily: '"Rye", cursive',
                    fontSize: '1.5rem',
                    color: 'var(--mantine-color-brown-8)',
                    border: 'none',
                    borderBottom: '2px solid var(--mantine-color-brown-2)',
                    borderRadius: 0,
                    padding: '4px 0',
                    background: 'transparent',
                  },
                }}
              />
            </Box>

            {/* Toolbar + editor — no outer border, Paper provides it */}
            <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
            <EditorToolbar editor={editor} onImageUpload={triggerImageUpload} />
            <EditorContent editor={editor} className="tiptap-editor" style={{ borderRadius: 0, border: 'none', borderTop: '2px solid var(--mantine-color-brown-3)' }} />
          </Paper>

          {uploadProgress !== null && (
            <Text size="sm" c="brown.6" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Uploading… {uploadProgress}%
            </Text>
          )}

          {/* Translation completeness hint */}
          <Group gap="xs">
            {LANG_TABS.map(tab => (
              <Badge
                key={tab.code}
                size="sm"
                color={langs[tab.code].title && langs[tab.code].body ? 'green' : 'gray'}
                variant="dot"
              >
                {tab.flag} {tab.label}
              </Badge>
            ))}
            <Text size="xs" c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              — translation completeness
            </Text>
          </Group>
        </Stack>

        {/* ── Right: settings panel ── */}
        <Stack gap="md">

          {/* Hero media */}
          <Paper p="md" radius="lg" style={{ border: '2px solid var(--mantine-color-brown-3)', background: '#fff9f3' }}>
            <Text fw={700} mb="sm" style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)' }}>
              Hero Media
            </Text>
            {post.mediaUrl ? (
              <Stack gap="xs">
                {post.mediaType === 'video'
                  ? <video src={post.mediaUrl} controls style={{ width: '100%', borderRadius: 8 }} />
                  : <img src={post.mediaUrl} alt="" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 160 }} />
                }
                <Button size="xs" variant="subtle" color="brown"
                  onClick={() => setPost(p => ({ ...p, mediaUrl: '', mediaType: null }))}>
                  Remove
                </Button>
              </Stack>
            ) : (
              <Button component="label" variant="outline" color="brown" fullWidth
                style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: 10, cursor: 'pointer' }}>
                Upload Image / Video
                <input type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleMediaFile} />
              </Button>
            )}
          </Paper>

          {/* GSAP Animation */}
          <Paper p="md" radius="lg" style={{ border: '2px solid var(--mantine-color-brown-5)', background: '#fff9f3' }}>
            <Text fw={700} mb="xs" style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1.05rem' }}>
              Scroll Animation
            </Text>
            <Stack gap="sm">
              <Select
                label="Style"
                data={ANIMATION_OPTIONS}
                value={post.scrollAnimation}
                onChange={v => setPost(p => ({ ...p, scrollAnimation: v || 'none' }))}
                styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600, fontSize: '0.8rem' } }}
              />
              {post.scrollAnimation !== 'none' && (
                <Text size="xs" c="brown.6" fs="italic" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                  {selectedPreset.description}
                </Text>
              )}
              {post.scrollAnimation !== 'none' && (
                <>
                  <Box>
                    <Text size="xs" fw={600} mb={4} style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-7)' }}>Speed</Text>
                    <SegmentedControl fullWidth size="xs" color="brown"
                      data={[{ value: 'slow', label: 'Slow' }, { value: 'normal', label: 'Normal' }, { value: 'fast', label: 'Fast' }]}
                      value={post.animationSpeed}
                      onChange={v => setPost(p => ({ ...p, animationSpeed: v }))}
                    />
                  </Box>
                  <Box>
                    <Text size="xs" fw={600} mb={4} style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-7)' }}>Fires when post reaches…</Text>
                    <SegmentedControl fullWidth size="xs" color="brown"
                      data={[{ value: 'top', label: 'Early' }, { value: 'center', label: 'Mid' }, { value: 'bottom', label: 'Late' }]}
                      value={post.animationTrigger}
                      onChange={v => setPost(p => ({ ...p, animationTrigger: v }))}
                    />
                  </Box>
                  <Text size="xs" c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                    Duration: {SPEED_MAP[post.animationSpeed]}s · Trigger: {TRIGGER_MAP[post.animationTrigger]}
                  </Text>
                </>
              )}
            </Stack>
          </Paper>

        </Stack>
      </Box>
    </Box>
  );
}
