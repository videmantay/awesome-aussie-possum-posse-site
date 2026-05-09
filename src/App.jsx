import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './fonts.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Navigate, Routes, Route } from 'react-router';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import About from './pages/About';
import Characters from './pages/Characters';
import ParentsGuide from './pages/ParentsGuide';
import AboutAuthor from './pages/AboutAuthor';
import FrontierPost from './pages/FrontierPost';
import NilorasNotesPost from './pages/NilorasNotesPost';
import AboutIllustrator from './pages/AboutIllustrator';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import PostsList from './pages/admin/PostsList';
import PostEditor from './pages/admin/PostEditor';
import Subscribers from './pages/admin/Subscribers';
import Banners from './pages/admin/Banners';
import NotFound from './pages/NotFound';


function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/parents" element={<ParentsGuide />} />
            <Route path="/author" element={<AboutAuthor />} />
            <Route path="/illustrator" element={<AboutIllustrator />} />
            <Route path="/niloras-notes" element={<FrontierPost />} />
            <Route path="/niloras-notes/:id" element={<NilorasNotesPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin — own layout, auth-gated */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/:id" element={<PostEditor />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="banners" element={<Banners />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
