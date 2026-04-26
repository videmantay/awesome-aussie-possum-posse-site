import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Badge, Box, Button, Center, Group, Loader, Paper, Stack, Table, Text, Title,
} from '@mantine/core';
import {
  collection, deleteDoc, doc, onSnapshot, orderBy, query,
} from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { db } from '../../firebase';

const STATUS_COLORS = { published: 'green', draft: 'brown' };

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      notifications.show({ message: 'Post deleted.', color: 'brown' });
    } catch {
      notifications.show({ message: 'Delete failed.', color: 'red' });
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
            Frontier Posts
          </Title>
          <Text size="sm" c="brown.6" style={{ fontFamily: '"Patrick Hand", cursive' }}>
            Your published & draft posts
          </Text>
        </div>
        <Button
          component={Link}
          to="/admin/posts/new"
          style={{
            background: '#3a1e00',
            color: '#f5c87a',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.1rem',
            letterSpacing: '1px',
            borderRadius: '20px',
          }}
        >
          + New Post
        </Button>
      </Group>

      {loading ? (
        <Center py="xl"><Loader color="brown" /></Center>
      ) : posts.length === 0 ? (
        <Paper
          p="xl"
          radius="lg"
          ta="center"
          style={{ border: '2px dashed var(--mantine-color-brown-3)', background: 'transparent' }}
        >
          <Text c="brown.5" style={{ fontFamily: '"Bubblegum Sans", sans-serif', fontSize: '1.1rem' }}>
            No posts yet. Write your first Frontier Post!
          </Text>
        </Paper>
      ) : (
        <Paper shadow="sm" radius="lg" style={{ overflow: 'hidden', border: '2px solid var(--mantine-color-brown-3)' }}>
          <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead style={{ background: 'var(--mantine-color-brown-1)' }}>
              <Table.Tr>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Title</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Status</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Animation</Table.Th>
                <Table.Th style={{ fontFamily: '"Bangers", cursive', letterSpacing: '1px', color: 'var(--mantine-color-brown-7)', fontSize: '1rem' }}>Date</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {posts.map(post => (
                <Table.Tr key={post.id}>
                  <Table.Td>
                    <Text
                      fw={600}
                      style={{ fontFamily: '"Baloo 2", sans-serif', color: 'var(--mantine-color-brown-8)' }}
                    >
                      {post.title || '(Untitled)'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={STATUS_COLORS[post.status] || 'gray'}
                      variant={post.status === 'published' ? 'filled' : 'outline'}
                      radius="sm"
                    >
                      {post.status || 'draft'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="brown.5" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                      {post.scrollAnimation || 'none'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="brown.5">
                      {post.createdAt?.toDate().toLocaleDateString() || '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <Button
                        size="xs"
                        variant="outline"
                        color="brown"
                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                        style={{ fontFamily: '"Baloo 2", sans-serif' }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(post)}
                        style={{ fontFamily: '"Baloo 2", sans-serif' }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
