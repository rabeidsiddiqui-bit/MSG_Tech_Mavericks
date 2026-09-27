import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  Calendar,
  Sparkles,
  ArrowRight,
  Bookmark,
  Clock,
  Users,
  Star,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import MarketCard from '../components/MarketCard';

export default function FindMarketPage() {
  const { isMarketBookmarked, toggleMarketBookmark, showToast } = useApp();

  // Primary Area & Market Dropdown states
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedMarketId, setSelectedMarketId] = useState('All');

  // Additional Filter states
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // List of distinct areas
  const areasList = [
    { value: 'All', label: 'All Malir Areas' },
    { value: 'Kachi Malir / Kala Board', label: 'Kachi Malir / Kala Board' },
    { value: 'Malir City', label: 'Malir City' },
    { value: 'Model Colony', label: 'Model Colony' },
    { value: 'Malir Cantt', label: 'Malir Cantt' },
    { value: 'Khokhrapar', label: 'Khokhrapar' },
    { value: 'Saudabad', label: 'Saudabad' },
    { value: 'Jaffar-e-Tayyar', label: 'Jaffar-e-Tayyar' },
    { value: 'Gharibabad', label: 'Gharibabad' }
  ];

  // Markets available for the currently selected area
  const marketsInSelectedArea = useMemo(() => {
    if (selectedArea === 'All') return marketsData;
    return marketsData.filter((m) =>
      m.neighborhood.toLowerCase().includes(selectedArea.toLowerCase())
    );
  }, [selectedArea]);

  // Handle Area Change: reset market dropdown if selected market is not in new area
  const handleAreaChange = (newArea) => {
    setSelectedArea(newArea);
    setSelectedMarketId('All');
  };

  // Days list
  const daysList = [
    { label: 'All Operating Days', value: 'All' },
    { label: 'Sunday Markets', value: 'Sunday' },
    { label: 'Saturday Markets', value: 'Saturday' },
    { label: 'Friday Markets', value: 'Friday' },
    { label: 'Monday Markets', value: 'Monday' },
    { label: 'Tuesday Markets', value: 'Tuesday' },
    { label: 'Wednesday Markets', value: 'Wednesday' },
    { label: 'Thursday Markets', value: 'Thursday' }
  ];

  // Quick Tags
  const quickTags = [
    'All',
    'Organic',
    'Vegetables',
    'Fruits',
    'Bachat Bazar',
    'Fresh Harvest',
    'Dairy & Cheese'
  ];

  // Filtered Markets based on all active controls
  const filteredMarkets = useMemo(() => {
    return marketsData.filter((market) => {
      // 1. Area filter
      if (selectedArea !== 'All') {
        if (!market.neighborhood.toLowerCase().includes(selectedArea.toLowerCase())) {
          return false;
        }
      }

      // 2. Specific market dropdown selection
      if (selectedMarketId !== 'All') {
        if (market.id !== selectedMarketId) {
          return false;
        }
      }

      // 3. Operating Day filter
      if (selectedDay !== 'All') {
        const matchesDayArray = market.hours?.days && market.hours.days.some((d) =>
          d.toLowerCase().includes(selectedDay.toLowerCase())
        );
        const matchesDayStr = market.day && market.day.toLowerCase().includes(selectedDay.toLowerCase());
        if (!matchesDayArray && !matchesDayStr) {
          return false;
        }
      }

      // 4. Status filter
      if (selectedStatus === 'today' && !market.isOpenToday) {
        return false;
      }
      if (selectedStatus === 'thisWeek' && !market.isOpenThisWeek) {
        return false;
      }

      // 5. Tag filter
      if (selectedTag !== 'All' && !market.tags?.includes(selectedTag)) {
        return false;
      }

      return true;
    });
  }, [selectedArea, selectedMarketId, selectedDay, selectedStatus, selectedTag]);

  // Selected single market for the spotlight banner (if a specific market is chosen)
  const spotlightMarket = useMemo(() => {
    if (selectedMarketId !== 'All') {
      return marketsData.find((m) => m.id === selectedMarketId);
    }
    // If area has only 1 market, spotlight it
    if (marketsInSelectedArea.length === 1) {
      return marketsInSelectedArea[0];
    }
    return null;
  }, [selectedMarketId, marketsInSelectedArea]);

  const handleClearFilters = () => {
    setSelectedArea('All');
    setSelectedMarketId('All');
    setSelectedDay('All');
    setSelectedStatus('All');
    setSelectedTag('All');
  };

  const hasActiveFilters =
    selectedArea !== 'All' ||
    selectedMarketId !== 'All' ||
    selectedDay !== 'All' ||
    selectedStatus !== 'All' ||
    selectedTag !== 'All';

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    showToast('Market address copied to clipboard!', 'success');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Header Banner */}
        <div className="bg-[#153e25] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#235836]">
          <div className="relative z-10 max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 bg-[#2e6f40] px-3.5 py-1 rounded-full text-xs font-bold text-[#a3e635] border border-[#3e8a54]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Interactive Market Finder</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Find Markets in Your Area
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl font-normal">
              Select your neighborhood below to instantly browse verified farmers markets, weekly bachat bazars, and family grower stalls across Malir.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none select-none hidden lg:block">
            <img
              src="/images/logo-white.png"
              alt="FreshFind white logo watermark"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>

        {/* 2. Interactive Finder Controls Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded8cb] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#1e5230]" />
              <h2 className="text-base sm:text-lg font-bold text-[#153e25]">
                Quick Market Finder
              </h2>
            </div>
            <div className="text-xs font-semibold text-[#1e5230] bg-[#f4efe4] px-3 py-1 rounded-full border border-[#ded8cb]">
              Found <strong>{filteredMarkets.length}</strong> {filteredMarkets.length === 1 ? 'market' : 'markets'}
            </div>
          </div>

          {/* Primary Selectors: Area & Markets in that Area Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Step 1: Area Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>1. Select Area</span>
              </label>
              <div className="relative">
                <select
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  {areasList.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Area ki sari markets ka dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>2. Markets in this Area</span>
              </label>
              <div className="relative">
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8 truncate"
                >
                  <option value="All">
                    {selectedArea === 'All' ? 'All Markets Across Malir' : `All Markets in ${selectedArea}`} ({marketsInSelectedArea.length})
                  </option>
                  {marketsInSelectedArea.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.schedule})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 3: Operating Day Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>3. Operating Day</span>
              </label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  {daysList.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Step 4: Status Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>4. Operating Status</span>
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  <option value="All">All Schedules</option>
                  <option value="today">Open Today</option>
                  <option value="thisWeek">Open This Week</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Quick Filter Tag Pills & Reset */}
          <div className="pt-4 border-t border-[#f0ebe0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#718096] mr-1">Market Tag:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#153e25] text-white shadow-xs'
                      : 'bg-[#f4efe4] hover:bg-[#ede6d8] text-[#3c5243] border border-[#ded8cb]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#ef4444] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. SPOTLIGHT CARD (When a specific market is selected from the dropdown) */}
        {spotlightMarket && (
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#1e5230] shadow-md animate-in fade-in-50 duration-200">
            <div className="bg-[#153e25] px-6 py-2.5 flex items-center justify-between text-white text-xs font-bold">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#a3e635]" />
                <span>Selected Market Spotlight</span>
              </div>
              <span className="text-[#a3e635] bg-[#236338] px-2.5 py-0.5 rounded-full text-[11px]">
                {spotlightMarket.neighborhood}
              </span>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Photo */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-64 lg:h-72 bg-[#edf2f7]">
                <img
                  src={spotlightMarket.image}
                  alt={spotlightMarket.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#153e25]/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                  {spotlightMarket.schedule}
                </div>
                <button
                  onClick={() => toggleMarketBookmark(spotlightMarket.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-all shadow-sm ${
                    isMarketBookmarked(spotlightMarket.id)
                      ? 'bg-[#153e25] text-[#a3e635]'
                      : 'bg-white/90 hover:bg-white text-[#153e25]'
                  }`}
                  title="Bookmark Market"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isMarketBookmarked(spotlightMarket.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Spotlight Details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#eef5f0] text-[#1e5230] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      {spotlightMarket.status}
                    </span>
                    <span className="text-xs font-bold text-[#f59e0b] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {spotlightMarket.rating} ({spotlightMarket.reviewCount} reviews)
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#153e25]">
                    {spotlightMarket.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#718096] flex items-center gap-1.5 mt-1.5">
                    <MapPin className="w-4 h-4 text-[#2e6f40] shrink-0" />
                    <span>{spotlightMarket.address}</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed">
                  {spotlightMarket.description}
                </p>

                {/* Key stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f0ebe0]">
                  <div className="bg-[#f9f7f2] p-2.5 rounded-xl border border-[#ded8cb]">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">
                      Local Vendors
                    </span>
                    <span className="text-sm font-bold text-[#153e25]">
                      {spotlightMarket.vendorCount}+ Farm Stalls
                    </span>
                  </div>
                  <div className="bg-[#f9f7f2] p-2.5 rounded-xl border border-[#ded8cb]">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">
                      Approx. Distance
                    </span>
                    <span className="text-sm font-bold text-[#153e25]">
                      {spotlightMarket.distance}
                    </span>
                  </div>
                  <div className="bg-[#f9f7f2] p-2.5 rounded-xl border border-[#ded8cb] col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-[#718096] uppercase block">
                      Operating Day
                    </span>
                    <span className="text-sm font-bold text-[#153e25]">
                      {spotlightMarket.day}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/market/${spotlightMarket.id}`}
                    className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Full Details & Stalls</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e635]" />
                  </Link>

                  <button
                    onClick={() => copyAddress(spotlightMarket.address)}
                    className="bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] text-xs font-semibold px-4 py-3 rounded-xl transition-all border border-[#ded8cb] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-4 h-4 text-[#16a34a]" />
                        <span>Address Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  {spotlightMarket.mapEmbed && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(spotlightMarket.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1e5230] hover:underline flex items-center gap-1 ml-auto"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Matching Markets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#153e25]">
              {selectedArea === 'All' ? 'All Verified Markets' : `Markets in ${selectedArea}`}
            </h2>
            <Link
              to="/directory"
              className="text-xs font-bold text-[#1e5230] hover:underline flex items-center gap-1"
            >
              <span>Explore Full Market Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredMarkets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#ded8cb] shadow-xs space-y-4 max-w-md mx-auto my-6">
              <div className="w-14 h-14 rounded-full bg-[#f4efe4] text-[#2e6f40] flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#153e25]">
                No markets match your criteria
              </h3>
              <p className="text-xs text-[#718096] leading-relaxed">
                Try selecting a different area or operating day to find nearby community markets.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-[#153e25] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2e6f40] transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <div
                  key={market.id}
                  className={`rounded-2xl transition-all ${
                    selectedMarketId === market.id ? 'ring-3 ring-[#1e5230] shadow-lg' : ''
                  }`}
                >
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
