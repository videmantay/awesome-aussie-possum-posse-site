import { useEffect, useState } from 'react';
import {
  Box, Button, Center, Group, Loader, Paper, Stack, Table, Text, Textarea, Title, Badge,
} from '@mantine/core';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { db } from '../../firebase';

function exportCSV(subscribers) {
  const rows = [
    ['Name', 'Email', 'Date', 'Active', 'Notes'],
    ...subscribers.map(s => [
      s.name || '',
      s.email || '',
      s.subscribedAt?.toDate().toLocaleDateString() || '',
      s.active ? 'Yes' : 'No',
      s.notes || '',
    ]),
  ];
  const csv = rows
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  async function toggleActive(sub) {
    try {
      await updateDoc(doc(db, 'subscribers', sub.id), { active: !sub.active });
    } catch {
      notifications.show({ message: 'Update failed.', color: 'red' });
    }
  }

  async function saveNotes(sub) {
    try {
      await updateDoc(doc(db, 'subscribers', sub.id), { notes: notesDraft });
      setEditingId(null);
      notifications.show({ message: 'Notes saved.', color: 'green' });
    } catch {
      notifications.show({ message: 'Save failed.', color: 'red' });
    }
  }

  return (
    <Box maw={900} mx="auto">
      <Group justify="space-between" mb="lg" align="flex-end">
        <div>
          <Title
            order={2}
            style={{ fontFamily: '"Rye", cursive', color: 'var(--mantine-color-brown-8)' }}
          >
            Subscribers
          </Title>
          <Text size="sm" c="brown.6" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            {subscribers.length} folks on the trail
          </Text>
        </div>
        <Button
          onClick={() => exportCSV(subscribers)}
          variant="outline"
          color="brown"
          style={{ fontFamily: '"Baloo 2", sans-serif', borderRadius: '20px' }}
        >
          Export CSV
        </Button>
      </Group>

      {loading ? (
        <Center py="xl"><Loader color="brown" /></Center>
      ) : subscribers.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          ta="center"
          style={{ border: '2px dashed var(--mantine-color-brown-3)', background: 'transparent' }}
        >
          <Text c="brown.5" style={{ fontFamily: '"Bubblegum Sans", sans-serif', fontSize: '1.1rem' }}>
            No subscribers yet. They'll show up here once folks sign up.
          </Text>
        </Paper>
      ) : (
        <Paper shadow="sm" radius="lg" style={{ overflow: 'hidden', border: '2px solid var(--mantine-color-brown-3)' }}>
          <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead style={{ background: 'var(--mantine-color-brown-1)' }}>
              <Table.Tr>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Name</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Email</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Joined</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Status</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Notes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {subscribers.map(sub => (
                <>
                  <Table.Tr key={sub.id}>
                    <Table.Td>
                      <Text size="sm" fw={600} style={{ fontFamily: '"Baloo 2", sans-serif' }}>
                        {sub.name || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ fontFamily: '"Baloo 2", sans-serif' }}>
                        {sub.email}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="brown.5">
                        {sub.subscribedAt?.toDate().toLocaleDateString() || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={sub.active ? 'green' : 'gray'}
                        variant={sub.active ? 'filled' : 'outline'}
                        radius="sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleActive(sub)}
                        title="Click to toggle"
                      >
                        {sub.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {editingId === sub.id ? (
                        <Stack gap={4}>
                          <Textarea
                            value={notesDraft}
                            onChange={e => setNotesDraft(e.target.value)}
                            autosize
                            minRows={2}
                            size="xs"
                          />
                          <Group gap={4}>
                            <Button size="xs" color="brown" onClick={() => saveNotes(sub)}>Save</Button>
                            <Button size="xs" variant="subtle" color="gray" onClick={() => setEditingId(null)}>Cancel</Button>
                          </Group>
                        </Stack>
                      ) : (
                        <Text
                          size="xs"
                          c={sub.notes ? 'brown.7' : 'brown.4'}
                          style={{ cursor: 'pointer', fontFamily: '"Patrick Hand", cursive' }}
                          onClick={() => { setEditingId(sub.id); setNotesDraft(sub.notes || ''); }}
                          title="Click to add notes"
                        >
                          {sub.notes || 'Add notes…'}
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                </>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
