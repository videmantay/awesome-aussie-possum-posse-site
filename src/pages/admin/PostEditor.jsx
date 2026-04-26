import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  ActionIcon, Badge, Box, Button, Divider, Group, Loader, Paper, Select,
  SegmentedControl, Stack, Text, TextInput, Title, Tooltip,
} from '@mantine/core';
import {
  addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { notifications } from '@mantine/notifications';
import { db, storage } from '../../firebase';
import { ANIMATION_PRESETS, SPEED_MAP, TRIGGER_MAP } from '../../lib/animationPresets';
import '../../assets/styles/tiptap.css';

const BLANK_POST = {
  title: '',
  body: '',
  status: 'draft',
  mediaUrl: '',
  mediaType: null,
  scrollAnimation: 'none',
  animationSpeed: 'normal',
  animationTrigger: 'center',
};

const ANIMATION_OPTIONS = Object.entries(ANIMATION_PRESETS).map(([value, { label }]) => ({
  value,
  label,
}));

function ToolbarButton({ active, title, onClick, children }) {
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

function EditorToolbar({ editor, onImageUpload }) {
  if (!editor) return null;
  return (
    <Box
      style={{
        border: '2px solid var(--mantine-color-brown-3)',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        background: 'var(--mantine-color-brown-0)',
        padding: '6px 10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        alignItems: 'center',
      }}
    >
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b style={{ fontSize: 12 }}>B</b>
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i style={{ fontSize: 12 }}>I</i>
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s style={{ fontSize: 11 }}>S</s>
      </ToolbarButton>

      <Box style={{ width: 1, height: 18, background: 'var(--mantine-color-brown-3)', margin: '0 4px' }} />

      <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <span style={{ fontSize: 10, fontWeight: 700 }}>H1</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <span style={{ fontSize: 10, fontWeight: 700 }}>H2</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <span style={{ fontSize: 10, fontWeight: 700 }}>H3</span>
      </ToolbarButton>
      <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
        <span style={{ fontSize: 10 }}>P</span>
      </ToolbarButton>

      <Box style={{ width: 1, height: 18, background: 'var(--mantine-color-brown-3)', margin: '0 4px' }} />

      <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <span style={{ fontSize: 11 }}>⬤≡</span>
      </ToolbarButton>
      <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <span style={{ fontSize: 11 }}>≡</span>
      </ToolbarButton>
      <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <span style={{ fontSize: 11 }}>≡⬤</span>
      </ToolbarButton>

      <Box style={{ width: 1, height: 18, background: 'var(--mantine-color-brown-3)', margin: '0 4px' }} />

      <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <span style={{ fontSize: 11 }}>•—</span>
      </ToolbarButton>
      <ToolbarButton title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <span style={{ fontSize: 11 }}>1.</span>
      </ToolbarButton>
      <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <span style={{ fontSize: 14 }}>"</span>
      </ToolbarButton>
      <ToolbarButton title="Horizontal rule" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <span style={{ fontSize: 11 }}>—</span>
      </ToolbarButton>

      <Box style={{ width: 1, height: 18, background: 'var(--mantine-color-brown-3)', margin: '0 4px' }} />

      <ToolbarButton
        title="Insert link"
        active={editor.isActive('link')}
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <span style={{ fontSize: 11 }}>🔗</span>
      </ToolbarButton>

      <ToolbarButton title="Insert image" active={false} onClick={onImageUpload}>
        <span style={{ fontSize: 11 }}>🖼</span>
      </ToolbarButton>
    </Box>
  );
}

export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [postId] = useState(() => isNew ? crypto.randomUUID() : id);
  const [post, setPost] = useState(BLANK_POST);
  const [loadingPost, setLoadingPost] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const imageInputRef = useRef();

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
      setPost(p => ({ ...p, body: editor.getHTML() }));
    },
  });

  // Load existing post
  useEffect(() => {
    if (isNew || !editor) return;
    getDoc(doc(db, 'posts', postId)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setPost({ ...BLANK_POST, ...data });
        editor.commands.setContent(data.body || '');
      }
      setLoadingPost(false);
    });
  }, [isNew, postId, editor]);

  function handleField(key, value) {
    setPost(p => ({ ...p, [key]: value }));
  }

  // Image upload to Firebase Storage
  function triggerImageUpload() {
    imageInputRef.current?.click();
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const storageRef = ref(storage, `posts/${postId}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      'state_changed',
      snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => {
        notifications.show({ message: 'Image upload failed.', color: 'red' });
        setUploadProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        editor?.chain().focus().setImage({ src: url }).run();
        setUploadProgress(null);
        e.target.value = '';
      },
    );
  }

  // Media hero upload (for post card thumbnail)
  function handleMediaFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const storageRef = ref(storage, `posts/${postId}/hero_${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    setUploadProgress(0);
    task.on(
      'state_changed',
      snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => {
        notifications.show({ message: 'Upload failed.', color: 'red' });
        setUploadProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setPost(p => ({ ...p, mediaUrl: url, mediaType }));
        setUploadProgress(null);
        e.target.value = '';
      },
    );
  }

  async function handleSave(status) {
    if (!post.title.trim()) {
      notifications.show({ message: 'Give the post a title first.', color: 'orange' });
      return;
    }
    setSaving(true);
    const data = {
      ...post,
      status,
      body: editor?.getHTML() || '',
      updatedAt: serverTimestamp(),
    };
    if (status === 'published' && !post.publishedAt) {
      data.publishedAt = serverTimestamp();
    }
    try {
      if (isNew) {
        await setDoc(doc(db, 'posts', postId), { ...data, createdAt: serverTimestamp() });
        notifications.show({ message: status === 'published' ? 'Post published!' : 'Draft saved.', color: 'green' });
        navigate(`/admin/posts/${postId}`, { replace: true });
      } else {
        await updateDoc(doc(db, 'posts', postId), data);
        notifications.show({ message: status === 'published' ? 'Post published!' : 'Draft saved.', color: 'green' });
      }
      setPost(p => ({ ...p, status }));
    } catch {
      notifications.show({ message: 'Save failed.', color: 'red' });
    } finally {
      setSaving(false);
    }
  }

  if (loadingPost) {
    return (
      <Box ta="center" py="xl">
        <Loader color="brown" />
      </Box>
    );
  }

  const selectedPreset = ANIMATION_PRESETS[post.scrollAnimation] || ANIMATION_PRESETS.none;

  return (
    <Box maw={1100} mx="auto">
      {/* Header */}
      <Group justify="space-between" mb="lg" align="center">
        <Group gap="sm">
          <Button
            variant="subtle"
            color="brown"
            size="sm"
            onClick={() => navigate('/admin/posts')}
            style={{ fontFamily: '"Baloo 2", sans-serif' }}
          >
            ← Posts
          </Button>
          <Badge
            color={post.status === 'published' ? 'green' : 'brown'}
            variant={post.status === 'published' ? 'filled' : 'outline'}
          >
            {post.status}
          </Badge>
        </Group>
        <Group gap="sm">
          <Button
            variant="outline"
            color="brown"
            loading={saving}
            onClick={() => handleSave('draft')}
            style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: '20px' }}
          >
            Save Draft
          </Button>
          <Button
            loading={saving}
            onClick={() => handleSave('published')}
            style={{
              background: '#3a1e00', color: '#f5c87a',
              fontFamily: '"Bangers", cursive', fontSize: '1.1rem',
              letterSpacing: '1px', borderRadius: '20px',
            }}
          >
            {post.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </Group>
      </Group>

      {/* Two-column layout */}
      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Title + Editor */}
        <Stack gap="md">
          <TextInput
            placeholder="Post title…"
            value={post.title}
            onChange={e => handleField('title', e.target.value)}
            styles={{
              input: {
                fontFamily: '"Rye", cursive',
                fontSize: '1.6rem',
                color: 'var(--mantine-color-brown-8)',
                border: '2px solid var(--mantine-color-brown-3)',
                borderRadius: 12,
                padding: '12px 16px',
                background: '#fff9f3',
              },
            }}
          />

          {/* hidden inputs */}
          <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />

          <Box>
            <EditorToolbar editor={editor} onImageUpload={triggerImageUpload} />
            <EditorContent editor={editor} className="tiptap-editor" />
          </Box>

          {uploadProgress !== null && (
            <Text size="sm" c="brown.6" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Uploading… {uploadProgress}%
            </Text>
          )}
        </Stack>

        {/* Right: Settings panel */}
        <Stack gap="md">

          {/* Hero media */}
          <Paper p="md" radius="lg" style={{ border: '2px solid var(--mantine-color-brown-3)', background: '#fff9f3' }}>
            <Text fw={700} mb="sm" style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)' }}>
              Hero Media
            </Text>
            {post.mediaUrl ? (
              <Stack gap="xs">
                {post.mediaType === 'video' ? (
                  <video src={post.mediaUrl} controls style={{ width: '100%', borderRadius: 8 }} />
                ) : (
                  <img src={post.mediaUrl} alt="" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 160 }} />
                )}
                <Button
                  size="xs"
                  variant="subtle"
                  color="brown"
                  onClick={() => setPost(p => ({ ...p, mediaUrl: '', mediaType: null }))}
                >
                  Remove
                </Button>
              </Stack>
            ) : (
              <Button
                component="label"
                variant="outline"
                color="brown"
                fullWidth
                style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: 10, cursor: 'pointer' }}
              >
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
                onChange={v => handleField('scrollAnimation', v || 'none')}
                styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600, fontSize: '0.8rem' } }}
              />

              {post.scrollAnimation !== 'none' && (
                <Text
                  size="xs"
                  c="brown.6"
                  fs="italic"
                  style={{ fontFamily: '"Patrick Hand", cursive' }}
                >
                  {selectedPreset.description}
                </Text>
              )}

              {post.scrollAnimation !== 'none' && (
                <>
                  <Box>
                    <Text size="xs" fw={600} mb={4} style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-7)' }}>
                      Speed
                    </Text>
                    <SegmentedControl
                      fullWidth
                      size="xs"
                      data={[
                        { value: 'slow',   label: 'Slow'   },
                        { value: 'normal', label: 'Normal' },
                        { value: 'fast',   label: 'Fast'   },
                      ]}
                      value={post.animationSpeed}
                      onChange={v => handleField('animationSpeed', v)}
                      color="brown"
                    />
                  </Box>

                  <Box>
                    <Text size="xs" fw={600} mb={4} style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-7)' }}>
                      Fires when post reaches…
                    </Text>
                    <SegmentedControl
                      fullWidth
                      size="xs"
                      data={[
                        { value: 'top',    label: 'Early' },
                        { value: 'center', label: 'Mid'   },
                        { value: 'bottom', label: 'Late'  },
                      ]}
                      value={post.animationTrigger}
                      onChange={v => handleField('animationTrigger', v)}
                      color="brown"
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
