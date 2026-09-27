import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Bookmark,
  Search,
  ArrowRight,
  MapPin,
  Sprout,
  SlidersHorizontal,
  Calendar,
  Layers,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    bookmarkedMarkets,
    bookmarkedProduce,
    setIsBookmarksOpen,
    searchFilters,
    setSearchFilters
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Cross-Page Filter Popover State
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const totalBookmarks = bookmarkedMarkets.length + bookmarkedProduce.length;

  // Filter options for cross-page filter
  const filterAreas = [
    'All',
    'Kala Board',
    'Malir City',
    'Model Colony',
    'Khokhrapar',
    'Malir Cantt',
    'Saudabad',
    'Jaffar-e-Tayyar',
    'Gharibabad'
  ];

  const filterDays = [
    { label: 'All Days', value: 'All' },
    { label: 'Sunday Markets', value: 'Sunday' },
    { label: 'Saturday Markets', value: 'Saturday' },
    { label: 'Friday Markets', value: 'Friday' },
    { label: 'Monday Markets', value: 'Monday' },
    { label: 'Tuesday Markets', value: 'Tuesday' },
    { label: 'Wednesday Markets', value: 'Wednesday' },
    { label: 'Thursday Markets', value: 'Thursday' }
  ];

  const filterCategories = [
    'All',
    'Vegetables',
    'Fruits',
    'Herbs',
    'Dairy & Cheese',
    'Honey & Preserves',
    'Local Products'
  ];

  const filterSorts = [
    { label: 'Nearest to You', value: 'nearest' },
    { label: 'Highest Community Rating', value: 'rating' },
    { label: 'Alphabetical (A-Z)', value: 'az' }
  ];

  const activeFiltersCount =
    (searchFilters.area && searchFilters.area !== 'All' ? 1 : 0) +
    (searchFilters.day && searchFilters.day !== 'All' ? 1 : 0) +
    (searchFilters.category && searchFilters.category !== 'All' ? 1 : 0) +
    (searchFilters.sort && searchFilters.sort !== 'nearest' ? 1 : 0);

  const handleApplyFilter = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyAndNavigate = () => {
    setIsFilterDropdownOpen(false);
    navigate('/directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchFilters({
      query: '',
      area: 'All',
      day: 'All',
      category: 'All',
      sort: 'nearest'
    });
  };

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation Links matching user requested layout:
  // "find market ko navbar mai home ke baraber mai rakho ab bookmark ki jagha seasonals Recommendation ka page rakhna"
  const navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/find-market', label: 'Find Market' },
    { path: '/directory', label: 'Market Directory' },
    { path: '/produce', label: 'Product Guide' },
    { path: '/seasonal-recommendations', label: 'Seasonal Recommendations' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ];

  const isLinkActive = (link) => {
    if (link.exact) {
      return location.pathname === '/';
    }
    if (link.path === '/find-market') {
      return location.pathname === '/find-market';
    }
    if (link.path === '/directory') {
      return location.pathname === '/directory' || location.pathname.startsWith('/market/');
    }
    return location.pathname.startsWith(link.path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Close search preview dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchResults(false);
        if (!navSearchQuery) {
          setIsSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navSearchQuery]);

  // Real-time Global Search matching Markets and Produce
  const searchResults = React.useMemo(() => {
    const q = navSearchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return { markets: [], produce: [] };

    const matchingMarkets = marketsData
      .filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.neighborhood.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 3);

    const matchingProduce = produceData
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seasonTag.toLowerCase().includes(q)
      )
      .slice(0, 3);

    return { markets: matchingMarkets, produce: matchingProduce };
  }, [navSearchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (navSearchQuery.trim()) {
      setSearchFilters((prev) => ({
        ...prev,
        query: navSearchQuery.trim()
      }));
      setShowSearchResults(false);
      navigate('/directory');
    }
  };

  return (
    <nav className="bg-[#ffffff] border-b border-[#e5e7eb] sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[70px] gap-2">
          
          {/* 1. Brand Logo: Green Uploaded Logo with normal proper sizing */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0 py-1"
          >
            <img
              src="/logo.png"
              alt="FreshFind Logo"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
            />
          </div>

          {/* 2. Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`text-[13.5px] font-semibold transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'text-[#1e5230] font-bold'
                      : 'text-[#374151] hover:text-[#153e25]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1e5230] rounded-full"></span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* 3. Right Corner Actions: Expandable Global Search & Bookmarks Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Expandable Cross-Page Global Search Bar */}
            <div
              ref={searchContainerRef}
              onMouseEnter={() => setIsSearchExpanded(true)}
              className="relative flex items-center"
            >
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${
                  isSearchExpanded
                    ? 'w-48 sm:w-64 lg:w-72 bg-[#fcfbf7] border-[#153e25] ring-2 ring-[#a3e635]/40 shadow-sm px-3 py-1.5'
                    : 'w-10 h-10 bg-[#f4efe4] hover:bg-[#eadeca] border-[#ded8cb] justify-center cursor-pointer shadow-2xs'
                }`}
              >
                <Search
                  onClick={() => {
                    setIsSearchExpanded(true);
                    searchInputRef.current?.focus();
                  }}
                  className={`shrink-0 transition-transform ${
                    isSearchExpanded
                      ? 'w-4 h-4 text-[#153e25]'
                      : 'w-4 h-4 text-[#153e25] hover:scale-110'
                  }`}
                />

                {isSearchExpanded && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={navSearchQuery}
                    onChange={(e) => {
                      setNavSearchQuery(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    placeholder="Search markets, crops..."
                    className="w-full text-xs text-[#1a2f1d] placeholder-[#718096] bg-transparent focus:outline-none ml-2"
                  />
                )}

                {isSearchExpanded && navSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setNavSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="text-[#718096] hover:text-[#1a2f1d] p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Instant Search Results Dropdown */}
              {showSearchResults && navSearchQuery.trim().length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-[#edf2f7] shadow-xl p-3 z-50 animate-in fade-in-50 duration-150 space-y-3">
                  {/* Markets Matches */}
                  {searchResults.markets.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#718096] uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2e6f40]" />
                        <span>Matching Markets</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.markets.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              navigate(`/market/${m.id}`);
                              setShowSearchResults(false);
                            }}
                            className="p-2 rounded-xl hover:bg-[#f4efe4] transition-colors cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="truncate mr-2">
                              <p className="font-bold text-[#153e25] truncate">{m.name}</p>
                              <p className="text-[11px] text-[#718096] truncate">{m.neighborhood} • {m.schedule}</p>
                            </div>
                            <span className="text-[10px] bg-[#eef5f0] text-[#1e5230] font-bold px-2 py-0.5 rounded">
                              View
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produce Matches */}
                  {searchResults.produce.length > 0 && (
                    <div className="pt-2 border-t border-[#edf2f7]">
                      <div className="text-[10px] font-bold text-[#718096] uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                        <Sprout className="w-3 h-3 text-[#2e6f40]" />
                        <span>Matching Produce</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.produce.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate('/produce');
                              setShowSearchResults(false);
                            }}
                            className="p-2 rounded-xl hover:bg-[#f4efe4] transition-colors cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 truncate mr-2">
                              <img src={p.image} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-[#153e25] truncate">{p.name}</p>
                                <p className="text-[11px] text-[#718096] truncate">{p.seasonTag}</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-[#153e25] text-[#a3e635] font-bold px-2 py-0.5 rounded">
                              {p.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.markets.length === 0 && searchResults.produce.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#718096]">
                      No direct results found for "{navSearchQuery}".
                    </div>
                  )}

                  {/* View all directory results link */}
                  <div className="pt-2 border-t border-[#edf2f7]">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Search All for "{navSearchQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button & Popover */}
            <div ref={filterDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                className={`relative w-10 h-10 rounded-full border transition-all cursor-pointer flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 ${
                  activeFiltersCount > 0
                    ? 'bg-[#153e25] text-[#a3e635] border-[#153e25] shadow-sm'
                    : 'bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] border-[#ded8cb]'
                }`}
                title="Filter"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#a3e635] text-[#153e25] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Filter Dropdown Popover */}
              {isFilterDropdownOpen && (
                <div className="absolute top-full right-0 mt-2.5 w-[310px] sm:w-[350px] bg-white rounded-3xl border border-[#ded8cb] shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in-50 zoom-in-95 duration-150 space-y-3.5 font-sans">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#eef5f0] text-[#1e5230] flex items-center justify-center">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#153e25] uppercase tracking-wider">
                        Filter
                      </h4>
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-[11px] text-[#ef4444] hover:underline font-bold cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Filter Controls */}
                  <div className="space-y-2.5 text-left">
                    {/* 1. Area / Neighborhood */}
                    <div>
                      <label className="text-[11px] font-bold text-[#153e25] uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2e6f40]" />
                        <span>Area / Neighborhood</span>
                      </label>
                      <select
                        value={searchFilters.area || 'All'}
                        onChange={(e) => handleApplyFilter('area', e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3 py-2 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] cursor-pointer"
                      >
                        <option value="All">All Malir Neighborhoods</option>
                        {filterAreas.slice(1).map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Operating Day */}
                    <div>
                      <label className="text-[11px] font-bold text-[#153e25] uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#2e6f40]" />
                        <span>Operating Day</span>
                      </label>
                      <select
                        value={searchFilters.day || 'All'}
                        onChange={(e) => handleApplyFilter('day', e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3 py-2 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] cursor-pointer"
                      >
                        {filterDays.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Product Category */}
                    <div>
                      <label className="text-[11px] font-bold text-[#153e25] uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#2e6f40]" />
                        <span>Product Category</span>
                      </label>
                      <select
                        value={searchFilters.category || 'All'}
                        onChange={(e) => handleApplyFilter('category', e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3 py-2 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] cursor-pointer"
                      >
                        <option value="All">All Product Categories</option>
                        {filterCategories.slice(1).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* 4. Sort */}
                    <div>
                      <label className="text-[11px] font-bold text-[#153e25] uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3 text-[#2e6f40]" />
                        <span>Sort Markets</span>
                      </label>
                      <select
                        value={searchFilters.sort || 'nearest'}
                        onChange={(e) => handleApplyFilter('sort', e.target.value)}
                        className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3 py-2 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] cursor-pointer"
                      >
                        {filterSorts.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions Button */}
                  <div className="pt-2 border-t border-[#f0ebe0]">
                    <button
                      type="button"
                      onClick={handleApplyAndNavigate}
                      className="w-full bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Apply & View Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Bookmarks Button in the Right Corner (Opens Bookmarks Drawer directly) */}
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="relative p-2.5 rounded-full bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center"
              title="Open My Bookmarks"
              aria-label="Open saved bookmarks"
            >
              <Bookmark className="w-5 h-5 fill-current text-[#153e25]" />
              {totalBookmarks > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#ef4444] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white animate-in zoom-in-50 duration-150">
                  {totalBookmarks}
                </span>
              )}
            </button>

            {/* 5. Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#153e25] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2e8f0] px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top duration-150">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              placeholder="Search markets or seasonal produce..."
              className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs py-2.5 pl-9 pr-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e25]"
            />
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => {
            const active = isLinkActive(link);

            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-[#153e25] text-white'
                    : 'text-[#334155] hover:bg-[#f8fafc]'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsFilterDropdownOpen(true);
            }}
            className={`w-full mt-2 text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer border ${
              activeFiltersCount > 0
                ? 'bg-[#153e25] text-[#a3e635] border-[#153e25]'
                : 'bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] border-[#ded8cb]'
            }`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#a3e635] text-[#153e25] text-[10px] font-black px-2 py-0.5 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setIsBookmarksOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-between cursor-pointer border border-[#ded8cb]"
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 fill-current text-[#153e25]" />
              <span>Saved Bookmarks</span>
            </span>
            <span className="bg-[#153e25] text-[#a3e635] text-[11px] font-black px-2 py-0.5 rounded-full">
              {totalBookmarks}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
