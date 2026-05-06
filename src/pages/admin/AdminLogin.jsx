import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Box, Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { auth } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import possumIcon from '../../assets/icons/possumSilohette.svg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const user = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin/posts', { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/posts', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center
      h="100vh"
      style={{
        background: 'linear-gradient(160deg, #3a1e00 0%, #824404 60%, #c45a1a 100%)',
      }}
    >
      <Paper
        shadow="xl"
        radius="xl"
        p="xl"
        w={380}
        style={{
          backgroundColor: '#fdf4eb',
          border: '4px solid var(--mantine-color-brown-5)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="lg" align="center">
            <img
              src={possumIcon}
              alt=""
              style={{ height: 60, opacity: 0.8 }}
            />
            <Title
              order={2}
              style={{
                fontFamily: '"Rye", cursive',
                color: 'var(--mantine-color-brown-8)',
                textAlign: 'center',
                letterSpacing: '1px',
              }}
            >
              Admin Post Office
            </Title>
            <Text
              size="sm"
              c="brown.6"
              ta="center"
              style={{ fontFamily: '"Patrick Hand", cursive' }}
            >
              Authorized personnel only, partner.
            </Text>

            <Box w="100%">
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                styles={{
                  label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600, color: 'var(--mantine-color-brown-7)' },
                  input: { borderColor: 'var(--mantine-color-brown-3)' },
                }}
              />
            </Box>

            <Box w="100%">
              <PasswordInput
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                styles={{
                  label: { fontFamily: '"Baloo 2", sans-serif', fontWeight: 600, color: 'var(--mantine-color-brown-7)' },
                  input: { borderColor: 'var(--mantine-color-brown-3)' },
                }}
              />
            </Box>

            {error && (
              <Text c="red.7" size="sm" ta="center">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              style={{
                background: '#3a1e00',
                color: '#f5c87a',
                fontFamily: '"Bangers", cursive',
                fontSize: '1.2rem',
                letterSpacing: '1.5px',
                borderRadius: '30px',
              }}
            >
              Ride In
            </Button>

            <Text size="xs" c="brown.5" ta="center" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Create your account in the Firebase Console → Authentication → Users
            </Text>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
