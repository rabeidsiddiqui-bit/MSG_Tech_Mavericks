import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Page State
  const [selectedMarketId, setSelectedMarketId] = useState('market-malir-1');
  const [selectedProduceModal, setSelectedProduceModal] = useState(null);

  // Global Search & Filter State
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    area: 'All',
    day: 'All',
    category: 'All',
    sort: 'nearest'
  });

  // Bookmarks State (LocalStorage backed)
  const [bookmarkedMarkets, setBookmarkedMarkets] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_bookmarked_markets');
      return saved ? JSON.parse(saved) : ['market-malir-1', 'market-malir-2'];
    } catch {
      return ['market-malir-1', 'market-malir-2'];
    }
  });

  const [bookmarkedProduce, setBookmarkedProduce] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_bookmarked_produce');
      return saved ? JSON.parse(saved) : ['produce-1', 'produce-4'];
    } catch {
      return ['produce-1', 'produce-4'];
    }
  });

  const [sessionNotes, setSessionNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_session_notes');
      return saved ? JSON.parse(saved) : {
        'market-malir-1': 'Pick up fresh organic spinach, coriander and radish before 10 AM!'
      };
    } catch {
      return {};
    }
  });

  // UI Modal & Drawer States
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfind_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshfind_bookmarked_markets', JSON.stringify(bookmarkedMarkets));
    } catch (e) {
      console.error('Error saving market bookmarks', e);
    }
  }, [bookmarkedMarkets]);

  useEffect(() => {
    try {
      localStorage.setItem('freshfind_bookmarked_produce', JSON.stringify(bookmarkedProduce));
    } catch (e) {
      console.error('Error saving produce bookmarks', e);
    }
  }, [bookmarkedProduce]);

  useEffect(() => {
    try {
      localStorage.setItem('freshfind_session_notes', JSON.stringify(sessionNotes));
    } catch (e) {
      console.error('Error saving session notes', e);
    }
  }, [sessionNotes]);

  const navigate = useNavigate();
  const location = useLocation();

  // Route-derived page identifier for active states and backward compatibility
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.startsWith('/market/')) return 'market-detail';
    if (path === '/find-market') return 'find-market';
    if (path === '/directory') return 'directory';
    if (path === '/produce') return 'produce';
    if (path === '/bookmarks') return 'bookmarks';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    return 'home';
  };

  const currentPage = getCurrentPage();

  const navigateTo = (page, params = {}) => {
    if (page === 'market-detail' || page.startsWith('market/')) {
      const id = params.id || (page.startsWith('market/') ? page.split('/')[1] : selectedMarketId);
      setSelectedMarketId(id);
      navigate(`/market/${id}`);
    } else if (page === 'directory') {
      navigate('/directory');
    } else if (page === 'produce') {
      navigate('/produce');
    } else if (page === 'bookmarks') {
      navigate('/bookmarks');
    } else if (page === 'about') {
      navigate('/about');
    } else if (page === 'contact') {
      navigate('/contact');
    } else if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMarketBookmark = (id) => {
    setBookmarkedMarkets((prev) => {
      const isBookmarked = prev.includes(id);
      const market = marketsData.find(m => m.id === id);
      const title = market ? market.name : 'Market';
      if (isBookmarked) {
        showToast(`Removed "${title}" from your saved markets.`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`Saved "${title}" to your favorites!`, 'success');
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#236338', '#a3e635', '#f4efe4']
          });
        } catch {
          // ignore if canvas not supported
        }
        return [...prev, id];
      }
    });
  };

  const toggleProduceBookmark = (id) => {
    setBookmarkedProduce((prev) => {
      const isBookmarked = prev.includes(id);
      const produce = produceData.find(p => p.id === id);
      const title = produce ? produce.name : 'Produce';
      if (isBookmarked) {
        showToast(`Removed "${title}" from saved produce.`, 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast(`Saved "${title}" to seasonal favorites!`, 'success');
        try {
          confetti({
            particleCount: 30,
            spread: 45,
            origin: { y: 0.8 },
            colors: ['#236338', '#a3e635', '#f59e0b']
          });
        } catch {
          // ignore
        }
        return [...prev, id];
      }
    });
  };

  const isMarketBookmarked = (id) => bookmarkedMarkets.includes(id);
  const isProduceBookmarked = (id) => bookmarkedProduce.includes(id);

  const updateSessionNote = (id, noteText) => {
    setSessionNotes((prev) => ({
      ...prev,
      [id]: noteText
    }));
    showToast('Shopping note saved.', 'success');
  };

  const deleteSessionNote = (id) => {
    setSessionNotes((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const loginUser = (userObj) => {
    setCurrentUser(userObj);
    try {
      localStorage.setItem('freshfind_user', JSON.stringify(userObj));
    } catch (e) {
      console.error(e);
    }
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${userObj.name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('freshfind_user');
    } catch (e) {
      console.error(e);
    }
    showToast('You have signed out.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedMarketId,
        setSelectedMarketId,
        selectedProduceModal,
        setSelectedProduceModal,
        searchFilters,
        setSearchFilters,
        bookmarkedMarkets,
        bookmarkedProduce,
        toggleMarketBookmark,
        toggleProduceBookmark,
        isMarketBookmarked,
        isProduceBookmarked,
        sessionNotes,
        updateSessionNote,
        deleteSessionNote,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        currentUser,
        loginUser,
        logoutUser,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
