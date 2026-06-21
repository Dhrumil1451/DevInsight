import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Layout from './layouts/Layout';

// Pages
import Home from './pages/Home';
import DeveloperProfile from './pages/DeveloperProfile';
import Compare from './pages/Compare';
import Trending from './pages/Trending';
import Saved from './pages/Saved';

function App() {
  // Initialize theme on mount — syncs 'dark' class to <html>
  useTheme();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/developer/:username" element={<DeveloperProfile />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
