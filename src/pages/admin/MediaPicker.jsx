import { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Center, Checkbox, Group, Loader, Modal, Progress,
  SimpleGrid, Stack, Tabs, Text, TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  addDoc, collection, onSnapshot, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { notifications } from '@mantine/notifications';
import { db, storage } from '../../firebase';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_ALL   = [...ALLOWED_IMAGE, 'video/mp4', 'video/webm', 'video/ogg'];

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function extractYouTubeId(url) {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
const MAX_IMAGE = 10  * 1024 * 1024;
const MAX_VIDEO = 100 * 1024 * 1024;

function validateFile(file, accept) {
  const allowed = accept === 'all' ? ALLOWED_ALL : ALLOWED_IMAGE;
  const maxBytes = file.type.startsWith('video/') ? MAX_VIDEO : MAX_IMAGE;
  if (!allowed.includes(file.type)) {
    const exts = allowed.map(t => t.split('/')[1].toUpperCase()).join(', ');
    return `"${file.name}" is not supported. Allowed: ${exts}.`;
  }
  if (file.size > maxBytes) {
    const limit = maxBytes / 1024 / 1024;
    return `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — max is ${limit} MB.`;
  }
  return null;
}

function storageError(err) {
  const map = {
    'storage/unauthorized':          'Permission denied — check that you are logged in.',
    'storage/unauthenticated':       'You must be logged in to upload.',
    'storage/quota-exceeded':        'Storage quota exceeded.',
    'storage/canceled':              'Upload was cancelled.',
    'storage/invalid-checksum':      'File corrupted in transit — try again.',
    'storage/retry-limit-exceeded':  'Upload timed out. Check your connection.',
  };
  return map[err?.code] || err?.message || 'Unknown upload error.';
}

// ─── Unsplash helpers ─────────────────────────────────────────────────────────

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

async function searchUnsplash(q) {
  if (!UNSPLASH_KEY) throw new Error('Add VITE_UNSPLASH_ACCESS_KEY to your .env file.');
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=24&client_id=${UNSPLASH_KEY}`,
  );
  if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
  return res.json();
}

function triggerUnsplashDownload(location) {
  if (!UNSPLASH_KEY) return;
  fetch(`${location}&client_id=${UNSPLASH_KEY}`).catch(() => {});
}

// ─── Shared media card ────────────────────────────────────────────────────────

function MediaCard({ url, thumb, label, sublabel, type = 'image', onSelect }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `2px solid ${hover ? '#c45a1a' : 'var(--mantine-color-brown-2)'}`,
        background: '#f5e6d0',
        transition: 'border-color 0.12s',
      }}
    >
      {type === 'video' ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6 }}>
          <span style={{ fontSize: '2rem' }}>▶</span>
          <Text size="xs" ta="center" lineClamp={2} style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-6)' }}>
            {label}
          </Text>
        </div>
      ) : type === 'youtube' ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {thumb
            ? <img src={thumb} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}><span style={{ fontSize: '2rem' }}>▶</span></div>
          }
          <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(255,0,0,0.85)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, letterSpacing: 1 }}>
            YT
          </div>
        </div>
      ) : (
        <img
          src={thumb || url}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      )}

      {hover && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(58,30,0,0.72)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 4, padding: 8,
        }}>
          <Text style={{ color: '#fdf4eb', fontFamily: '"Bangers", cursive', fontSize: '1.1rem', letterSpacing: '1px' }}>
            Select
          </Text>
          {sublabel && (
            <Text size="xs" ta="center" style={{ color: '#f5c87a', fontFamily: '"Patrick Hand", cursive' }}>
              {sublabel}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Library tab ──────────────────────────────────────────────────────────────

function LibraryTab({ accept, onSelect }) {
  const [media, setMedia]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [libError, setLibError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      snap => {
        setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        setLibError(`Could not load library: ${err.message}`);
        setLoading(false);
      },
    );
  }, []);

  const items = media.filter(item => {
    if (accept === 'image' && (item.type === 'video' || item.type === 'youtube')) return false;
    return !search || item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Stack gap="md">
      <TextInput
        placeholder="Search by filename…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        styles={{ input: { fontFamily: '"Baloo 2", sans-serif' } }}
      />
      {loading ? (
        <Center py="xl"><Loader color="brown" /></Center>
      ) : libError ? (
        <Center py="xl">
          <Stack align="center" gap="xs">
            <Text c="red" size="sm" style={{ fontFamily: '"Patrick Hand", cursive' }}>{libError}</Text>
            <Text size="xs" c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Check your Firestore rules — the <code>media</code> collection needs read access for authenticated users.
            </Text>
          </Stack>
        </Center>
      ) : items.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="xs">
            <Text c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              {search ? `No matches for "${search}"` : 'No media yet — use the Upload tab to add some.'}
            </Text>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={3} spacing="xs">
          {items.map(item => (
            <MediaCard
              key={item.id}
              url={item.url}
              thumb={item.thumb}
              label={item.name}
              sublabel={item.source === 'unsplash' ? `by ${item.unsplashUser}` : null}
              type={item.type}
              onSelect={() => onSelect(item.url, item.type, item.name)}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}

// ─── Unsplash tab ─────────────────────────────────────────────────────────────

function UnsplashTab({ onSelect }) {
  const [search, setSearch]           = useState('');
  const [debouncedSearch]             = useDebouncedValue(search, 600);
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!debouncedSearch.trim()) { setResults([]); return; }
    setLoading(true);
    setError(null);
    searchUnsplash(debouncedSearch)
      .then(data => setResults(data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  async function handleSelect(photo) {
    triggerUnsplashDownload(photo.links.download_location);
    const alt = `Photo by ${photo.user.name} on Unsplash`;
    await addDoc(collection(db, 'media'), {
      url: photo.urls.regular,
      thumb: photo.urls.small,
      name: photo.alt_description || photo.id,
      type: 'image',
      size: 0,
      source: 'unsplash',
      unsplashUser: photo.user.name,
      unsplashUserUrl: photo.user.links.html,
      createdAt: serverTimestamp(),
    }).catch(() => {}); // non-fatal if save fails
    onSelect(photo.urls.regular, 'image', alt);
  }

  return (
    <Stack gap="md">
      {!UNSPLASH_KEY && (
        <Box p="sm" style={{ background: '#fff3cd', borderRadius: 8, border: '1px solid #ffc107' }}>
          <Text size="sm" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            Add <code>VITE_UNSPLASH_ACCESS_KEY=your_key</code> to your <code>.env</code> file, then restart the dev server.
          </Text>
        </Box>
      )}
      <TextInput
        placeholder="Search millions of free photos…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={!UNSPLASH_KEY}
        styles={{ input: { fontFamily: '"Baloo 2", sans-serif' } }}
      />

      {loading && <Center py="xl"><Loader color="brown" /></Center>}
      {error   && <Text c="red" size="sm" style={{ fontFamily: '"Patrick Hand", cursive' }}>{error}</Text>}

      {!loading && !error && !search && (
        <Center py="xl">
          <Text c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>Type above to search Unsplash</Text>
        </Center>
      )}
      {!loading && !error && search && results.length === 0 && (
        <Center py="xl">
          <Text c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>No results for "{debouncedSearch}"</Text>
        </Center>
      )}

      {results.length > 0 && (
        <>
          <SimpleGrid cols={3} spacing="xs">
            {results.map(photo => (
              <MediaCard
                key={photo.id}
                url={photo.urls.regular}
                thumb={photo.urls.small}
                label={photo.alt_description || photo.user.name}
                sublabel={`by ${photo.user.name}`}
                onSelect={() => handleSelect(photo)}
              />
            ))}
          </SimpleGrid>
          <Text size="xs" c="brown.4" ta="center" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            Photos from{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: 'var(--mantine-color-brown-5)' }}>
              Unsplash
            </a>
            {' '}— photographer credit is set as the image alt text automatically.
          </Text>
        </>
      )}
    </Stack>
  );
}

// ─── Upload tab ───────────────────────────────────────────────────────────────

function UploadTab({ postId, accept, onSelect }) {
  const fileRef = useRef();
  const [progress, setProgress] = useState(null);
  const [error, setError]       = useState(null);
  const [dragging, setDragging] = useState(false);

  async function processFile(file) {
    const err = validateFile(file, accept);
    if (err) { setError(err); return; }
    setError(null);
    setProgress(0);
    const type     = file.type.startsWith('video/') ? 'video' : 'image';
    const fileRef2 = storageRef(storage, `posts/${postId}/${Date.now()}_${file.name}`);
    const task     = uploadBytesResumable(fileRef2, file);

    task.on(
      'state_changed',
      snap => setProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      err  => { notifications.show({ title: 'Upload failed', message: storageError(err), color: 'red', autoClose: 8000 }); setProgress(null); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        let savedToLibrary = false;
        try {
          await addDoc(collection(db, 'media'), {
            url, name: file.name, type, size: file.size,
            postId, source: 'upload', createdAt: serverTimestamp(),
          });
          savedToLibrary = true;
        } catch {}
        setProgress(null);
        if (savedToLibrary) {
          notifications.show({ message: `"${file.name}" uploaded and saved to library.`, color: 'green', autoClose: 4000 });
        } else {
          notifications.show({
            title: `"${file.name}" uploaded to storage`,
            message: 'Could not save to library — run: firebase deploy --only firestore',
            color: 'yellow', autoClose: 10000,
          });
        }
        onSelect(url, type, file.name);
      },
    );
  }

  const acceptAttr = accept === 'all'
    ? 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg'
    : 'image/jpeg,image/png,image/gif,image/webp';

  return (
    <Stack gap="md">
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer?.files?.[0]; if (f) processFile(f); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `3px dashed ${dragging ? '#c45a1a' : 'var(--mantine-color-brown-3)'}`,
          borderRadius: 12,
          padding: '3rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(196,90,26,0.06)' : '#fff9f3',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept={acceptAttr}
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
        />
        <Text style={{ fontSize: '2.5rem', marginBottom: 8 }}>📁</Text>
        <Text style={{ fontFamily: '"Bubblegum Sans", sans-serif', color: 'var(--mantine-color-brown-6)', fontSize: '1rem' }}>
          Drag & drop or click to browse
        </Text>
        <Text size="xs" c="brown.4" mt="xs" style={{ fontFamily: '"Patrick Hand", cursive' }}>
          {accept === 'all'
            ? 'Images: JPG PNG GIF WEBP (max 10 MB)  ·  Video: MP4 WEBM OGG (max 100 MB)'
            : 'JPG, PNG, GIF, WEBP · max 10 MB'}
        </Text>
      </div>

      {error && (
        <Text size="sm" c="red" style={{ fontFamily: '"Patrick Hand", cursive' }}>{error}</Text>
      )}

      {progress !== null && (
        <Stack gap={4}>
          <Progress value={progress} color="brown" animated size="sm" radius="xl" />
          <Text size="xs" c="brown.6" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            Uploading… {progress}%
          </Text>
        </Stack>
      )}
    </Stack>
  );
}

// ─── YouTube tab ──────────────────────────────────────────────────────────────

function YouTubeTab({ onSelect }) {
  const [url, setUrl]     = useState('');
  const [error, setError] = useState(null);

  async function handleEmbed() {
    const id = extractYouTubeId(url.trim());
    if (!id) { setError('Could not find a YouTube video ID in that URL.'); return; }
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    const thumbUrl = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    await addDoc(collection(db, 'media'), {
      url: embedUrl, thumb: thumbUrl,
      name: `YouTube: ${id}`, type: 'youtube', size: 0,
      source: 'youtube', createdAt: serverTimestamp(),
    }).catch(() => {});
    onSelect(embedUrl, 'youtube', `YouTube video ${id}`);
  }

  return (
    <Stack gap="md">
      <Text size="sm" style={{ fontFamily: '"Patrick Hand", cursive', color: 'var(--mantine-color-brown-6)' }}>
        Paste any YouTube link — watch page, short, or share URL — to embed it as the hero video.
      </Text>
      <TextInput
        placeholder="https://www.youtube.com/watch?v=…"
        value={url}
        onChange={e => { setUrl(e.target.value); setError(null); }}
        styles={{ input: { fontFamily: '"Baloo 2", sans-serif' } }}
        onKeyDown={e => e.key === 'Enter' && url.trim() && handleEmbed()}
      />
      {error && <Text size="sm" c="red" style={{ fontFamily: '"Patrick Hand", cursive' }}>{error}</Text>}
      <Button
        color="brown"
        onClick={handleEmbed}
        disabled={!url.trim()}
        style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: 10 }}
      >
        Embed YouTube Video
      </Button>
    </Stack>
  );
}

// ─── Main MediaPicker ─────────────────────────────────────────────────────────

const TAB_STYLE = { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600 };

export default function MediaPicker({ opened, onClose, onSelect, postId, accept = 'image' }) {
  const [allLangs, setAllLangs] = useState(true);
  const isBodyPicker = accept === 'image'; // hero uses 'all', body uses 'image'

  function pick(url, type, alt) { onSelect(url, type, alt, allLangs); onClose(); }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Media Library"
      size="xl"
      centered
      styles={{
        title: {
          fontFamily: '"Bangers", cursive',
          letterSpacing: '1px',
          fontSize: '1.4rem',
          color: 'var(--mantine-color-brown-8)',
        },
      }}
    >
      <Tabs defaultValue="library" styles={{ tab: TAB_STYLE }}>
        <Tabs.List mb="md" style={{ borderBottom: '2px solid var(--mantine-color-brown-2)' }}>
          <Tabs.Tab value="library">My Library</Tabs.Tab>
          <Tabs.Tab value="unsplash">Unsplash</Tabs.Tab>
          <Tabs.Tab value="upload">Upload</Tabs.Tab>
          {!isBodyPicker && <Tabs.Tab value="youtube">YouTube</Tabs.Tab>}
        </Tabs.List>

        <Box style={{ minHeight: 380, maxHeight: '62vh', overflowY: 'auto', paddingRight: 4 }}>
          <Tabs.Panel value="library">
            <LibraryTab accept={accept} onSelect={pick} />
          </Tabs.Panel>
          <Tabs.Panel value="unsplash">
            <UnsplashTab onSelect={pick} />
          </Tabs.Panel>
          <Tabs.Panel value="upload">
            <UploadTab postId={postId} accept={accept} onSelect={pick} />
          </Tabs.Panel>
          {!isBodyPicker && (
            <Tabs.Panel value="youtube">
              <YouTubeTab onSelect={pick} />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>

      {isBodyPicker && (
        <Group mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-brown-2)' }}>
          <Checkbox
            checked={allLangs}
            onChange={e => setAllLangs(e.currentTarget.checked)}
            color="brown"
            label="Insert into all language versions"
            styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontSize: '0.9rem', cursor: 'pointer' } }}
          />
          {!allLangs && (
            <Text size="xs" c="brown.4" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Image will only appear in the language tab you are currently editing.
            </Text>
          )}
        </Group>
      )}
    </Modal>
  );
}
