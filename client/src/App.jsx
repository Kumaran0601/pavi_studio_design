import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useApi } from './hooks/useApi';
import { ThemeProvider } from './context/ThemeContext';

// Layout & Shell
import { PublicShell } from './components/layout/PublicShell';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ClassesPage } from './pages/ClassesPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Components
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminPage } from './admin/AdminPage';

function AppRoutes() {
  const home = useApi('/public/home');

  return (
    <Routes>
      <Route path="/" element={<PublicShell><HomePage state={home} /></PublicShell>} />
      <Route path="/about" element={<PublicShell><AboutPage state={home} /></PublicShell>} />
      <Route path="/services" element={<PublicShell><ServicesPage state={home} /></PublicShell>} />
      <Route path="/services/:slug" element={<PublicShell><ServiceDetailPage state={home} /></PublicShell>} />
      <Route path="/classes" element={<PublicShell><ClassesPage state={home} /></PublicShell>} />
      <Route path="/materials" element={<PublicShell><MaterialsPage state={home} /></PublicShell>} />
      <Route path="/gallery" element={<PublicShell><GalleryPage state={home} /></PublicShell>} />
      <Route path="/contact" element={<PublicShell><ContactPage state={home} /></PublicShell>} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<PublicShell><NotFoundPage /></PublicShell>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

