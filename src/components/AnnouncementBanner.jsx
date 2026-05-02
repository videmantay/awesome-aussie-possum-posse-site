import { useEffect, useState } from 'react';
import { Anchor, Group, Text } from '@mantine/core';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const STYLE_COLORS = {
  promo: { bg: '#c8a010', text: '#2a1500' },
  alert: { bg: '#c45a1a', text: '#fdf4eb' },
  info:  { bg: '#4a8a5a', text: '#fdf4eb' },
};

export default function AnnouncementBanner({ onPresence }) {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let unsub;
    try {
      const q = query(
        collection(db, 'banners'),
        where('active', '==', true),
      );
      unsub = onSnapshot(q, snap => {
        const now = new Date();
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          .find(b => {
            if (b.startDate && b.startDate.toDate() > now) return false;
            if (b.endDate   && b.endDate.toDate()   < now) return false;
            return true;
          });
        const next = active || null;
        setBanner(next);
        onPresence?.(!!next);
      }, () => { setBanner(null); onPresence?.(false); });
    } catch {
      setBanner(null);
      onPresence?.(false);
    }
    return () => unsub?.();
  }, []);

  if (!banner) return null;

  const colors = STYLE_COLORS[banner.style] || STYLE_COLORS.info;

  return (
    <Group
      h={36}
      px="md"
      justify="center"
      align="center"
      style={{ background: colors.bg, flexShrink: 0 }}
    >
      <Text
        size="sm"
        fw={600}
        style={{
          color: colors.text,
          fontFamily: '"Bangers", cursive',
          letterSpacing: '1px',
          fontSize: '1rem',
        }}
      >
        {banner.text}
        {banner.linkUrl && banner.linkText && (
          <>
            {' '}
            <Anchor
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.text, textDecoration: 'underline' }}
            >
              {banner.linkText}
            </Anchor>
          </>
        )}
      </Text>
    </Group>
  );
}
