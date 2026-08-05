import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GenericPage from './pages/GenericPage';
import Pendaftaran from './pages/Pendaftaran';
import SuksesPendaftaran from './pages/SuksesPendaftaran';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pendaftaran" element={<Pendaftaran />} />
          <Route path="pendaftaran/sukses" element={<SuksesPendaftaran />} />
          {/* Catch-all for generic content pages */}
          <Route path="*" element={<GenericPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
