import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Routes, Route } from 'react-router';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Characters from './pages/Characters';
import ParentsGuide from './pages/ParentsGuide';
import AboutAuthor from './pages/AboutAuthor';
import FrontierPost from './pages/FrontierPost';

function App() {
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/parents" element={<ParentsGuide />} />
          <Route path="/author" element={<AboutAuthor />} />
          <Route path="/frontier-post" element={<FrontierPost />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}

export default App;
