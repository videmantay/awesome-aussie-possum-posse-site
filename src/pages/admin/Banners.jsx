import { useEffect, useState } from 'react';
import {
  Box, Button, Center, Group, Loader, Paper, Select, Stack,
  Switch, Text, TextInput, Title, Badge,
} from '@mantine/core';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy,
  query, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { db } from '../../firebase';

const STYLE_OPTIONS = [
  { value: 'promo', label: '🟡 Promo (amber)' },
  { value: 'alert', label: '🟠 Alert (rust)' },
  { value: 'info',  label: '🟢 Info (green)' },
];

const STYLE_COLORS = {
  promo: { bg: '#c8a010', text: '#2a1500' },
  alert: { bg: '#c45a1a', text: '#fdf4eb' },
  info:  { bg: '#4a8a5a', text: '#fdf4eb' },
};

const BLANK = { text: '', linkUrl: '', linkText: '', style: 'promo' };

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'banners'), {
        ...form,
        active: true,
        createdAt: serverTimestamp(),
      });
      setForm(BLANK);
      notifications.show({ message: 'Banner created!', color: 'green' });
    } catch {
      notifications.show({ message: 'Failed to create banner.', color: 'red' });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(banner) {
    try {
      await updateDoc(doc(db, 'banners', banner.id), { active: !banner.active });
    } catch {
      notifications.show({ message: 'Update failed.', color: 'red' });
    }
  }

  async function handleDelete(banner) {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', banner.id));
      notifications.show({ message: 'Banner deleted.', color: 'brown' });
    } catch {
      notifications.show({ message: 'Delete failed.', color: 'red' });
    }
  }

  return (
    <Box maw={800} mx="auto">
      <Title
        order={2}
        mb="xs"
        style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)' }}
      >
        Announcement Banners
      </Title>
      <Text size="sm" c="brown.6" mb="xl" style={{ fontFamily: '"Patrick Hand", cursive' }}>
        Active banners show as a colored strip at the top of every page.
      </Text>

      {/* Create form */}
      <Paper
        p="lg"
        radius="lg"
        mb="xl"
        style={{ border: '2px solid var(--mantine-color-brown-3)', background: '#fff9f3' }}
      >
        <Text fw={700} mb="sm" style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', fontSize: '1.1rem', color: 'var(--mantine-color-brown-7)' }}>
          New Banner
        </Text>
        <form onSubmit={handleCreate}>
          <Stack gap="sm">
            <TextInput
              label="Banner text"
              placeholder="Big news from the Posse!"
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              required
              styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600 } }}
            />
            <Group grow>
              <TextInput
                label="Link URL (optional)"
                placeholder="https://..."
                value={form.linkUrl}
                onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600 } }}
              />
              <TextInput
                label="Link text (optional)"
                placeholder="Learn more"
                value={form.linkText}
                onChange={e => setForm(f => ({ ...f, linkText: e.target.value }))}
                styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600 } }}
              />
            </Group>
            <Select
              label="Style"
              data={STYLE_OPTIONS}
              value={form.style}
              onChange={v => setForm(f => ({ ...f, style: v }))}
              styles={{ label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600 } }}
            />
            {/* Preview */}
            {form.text && (
              <Box
                p="xs"
                ta="center"
                style={{
                  background: STYLE_COLORS[form.style]?.bg || '#c8a010',
                  borderRadius: 8,
                  color: STYLE_COLORS[form.style]?.text || '#2a1500',
                  fontFamily: '"Bangers", cursive',
                  letterSpacing: '1px',
                  fontSize: '1rem',
                }}
              >
                {form.text}
                {form.linkText && ` — ${form.linkText}`}
              </Box>
            )}
            <Button
              type="submit"
              loading={saving}
              style={{
                background: '#3a1e00', color: '#f5c87a',
                fontFamily: '"Bangers", cursive', fontSize: '1.1rem',
                letterSpacing: '1px', borderRadius: '20px', alignSelf: 'flex-start',
              }}
            >
              Post Banner
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Banner list */}
      {loading ? (
        <Center py="xl"><Loader color="brown" /></Center>
      ) : banners.length === 0 ? (
        <Text c="brown.5" ta="center" style={{ fontFamily: '"Bubblegum Sans", sans-serif' }}>
          No banners yet.
        </Text>
      ) : (
        <Stack gap="sm">
          {banners.map(banner => {
            const colors = STYLE_COLORS[banner.style] || STYLE_COLORS.info;
            return (
              <Paper
                key={banner.id}
                p="md"
                radius="lg"
                style={{ border: '2px solid var(--mantine-color-brown-3)', background: '#fff9f3' }}
              >
                <Group justify="space-between" align="center">
                  <Box style={{ flex: 1 }}>
                    <Box
                      px="sm"
                      py={4}
                      mb={6}
                      style={{
                        background: colors.bg,
                        borderRadius: 6,
                        display: 'inline-block',
                        color: colors.text,
                        fontFamily: '"Bangers", cursive',
                        letterSpacing: '1px',
                        fontSize: '0.95rem',
                      }}
                    >
                      {banner.text}
                    </Box>
                    {banner.linkUrl && (
                      <Text size="xs" c="brown.5" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                        Link: {banner.linkText} → {banner.linkUrl}
                      </Text>
                    )}
                  </Box>
                  <Group gap="sm">
                    <Switch
                      checked={!!banner.active}
                      onChange={() => toggleActive(banner)}
                      label={
                        <Badge color={banner.active ? 'green' : 'gray'} size="sm">
                          {banner.active ? 'Live' : 'Off'}
                        </Badge>
                      }
                      color="green"
                    />
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(banner)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
