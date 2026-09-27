import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HeaderTopBar from './components/HeaderTopBar';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import BookmarksDrawer from './components/BookmarksDrawer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import FindMarketPage from './pages/FindMarketPage';
import MarketDirectoryPage from './pages/MarketDirectoryPage';
import MarketDetailPage from './pages/MarketDetailPage';
import ProduceGuidePage from './pages/ProduceGuidePage';
import SeasonalRecommendationsPage from './pages/SeasonalRecommendationsPage';
import BookmarksPage from './pages/BookmarksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] text-[#19271e] font-sans antialiased selection:bg-[#a3e635] selection:text-[#153e25]">
      <ScrollToTop />

      {/* 1. Header / Top Bar */}
      <HeaderTopBar />

      {/* 2. Main Navigation Bar */}
      <Navbar />

      {/* 3. Dynamic Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* 4. Active Page Content via React Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-market" element={<FindMarketPage />} />
          <Route path="/directory" element={<MarketDirectoryPage />} />
          <Route path="/market/:id" element={<MarketDetailPage />} />
          <Route path="/produce" element={<ProduceGuidePage />} />
          <Route path="/seasonal-recommendations" element={<SeasonalRecommendationsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 5. Dark Forest Green Footer */}
      <Footer />

      {/* 6. Floating Chatbot Assistant */}
      <Chatbot />

      {/* 7. Bookmarks Drawer */}
      <BookmarksDrawer />

      {/* 8. Auth Modal */}
      <AuthModal />

      {/* 9. Feedback Toast Notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
