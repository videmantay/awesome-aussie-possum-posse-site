import { Navigate } from 'react-router';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const user = useAuth();

  if (user === undefined) {
    return (
      <Center h="100vh" style={{ background: '#fdf4eb' }}>
        <Loader color="brown" size="lg" />
      </Center>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
