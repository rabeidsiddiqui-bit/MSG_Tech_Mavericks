import React, { useState, useMemo } from 'react';
import { ChevronDown, X, MapPin, Calendar, Layers, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import MarketCard from '../components/MarketCard';

export default function MarketDirectoryPage() {
  const { searchFilters, setSearchFilters } = useApp();
  const { area, day, category, sort } = searchFilters;

  // Selected quick filter tag
  const [selectedTag, setSelectedTag] = useState('All');

  // Real-time client-side filtering without page refresh
  const filteredMarkets = useMemo(() => {
    return marketsData.filter((market) => {
      // 1. Area match
      if (area !== 'All' && !market.neighborhood.toLowerCase().includes(area.toLowerCase())) {
        return false;
      }

      // 2. Day of week match
      if (day !== 'All') {
        const matchesDay = market.hours?.days && market.hours.days.some(d => d.toLowerCase().includes(day.toLowerCase()));
        const matchesDayString = market.day && market.day.toLowerCase().includes(day.toLowerCase());
        if (!matchesDay && !matchesDayString) {
          return false;
        }
      }

      // 3. Product Category match
      if (category !== 'All' && !market.categories?.includes(category)) {
        return false;
      }

      // 4. Selected Tag match
      if (selectedTag !== 'All' && !market.tags?.includes(selectedTag)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'az') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'rating') {
        return b.rating - a.rating;
      } else if (sort === 'vendors') {
        return b.vendorCount - a.vendorCount;
      } else {
        // 'nearest' default
        return a.distanceMiles - b.distanceMiles;
      }
    });
  }, [area, day, category, sort, selectedTag]);

  const handleClearFilters = () => {
    setSearchFilters({
      query: '',
      area: 'All',
      day: 'All',
      category: 'All',
      sort: 'nearest'
    });
    setSelectedTag('All');
  };

  const hasActiveFilters =
    area !== 'All' ||
    day !== 'All' ||
    category !== 'All' ||
    selectedTag !== 'All';

  const quickTags = [
    'All',
    'Organic',
    'Vegetables',
    'Fruits',
    'Bachat Bazar',
    'Fresh Harvest',
    'Herbs',
    'Dairy',
    'Honey'
  ];

  const neighborhoodsList = [
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

  const categoriesList = [
    'All',
    'Vegetables',
    'Fruits',
    'Herbs',
    'Dairy & Cheese',
    'Honey & Preserves',
    'Local Products'
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Title & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6f40] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Regional Agricultural Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1a2f1d] tracking-tight">
              Market Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#718096] mt-1 max-w-2xl">
              Browse complete listings of verified farmers markets, community bachat bazars, and family farm stalls across Malir.
            </p>
          </div>

          <div className="text-xs font-semibold text-[#153e25] bg-[#f4efe4] px-4 py-2 rounded-full border border-[#ded8cb] self-start sm:self-auto shadow-2xs">
            Showing <strong className="text-[#153e25] font-bold">{filteredMarkets.length}</strong> of {marketsData.length} verified markets
          </div>
        </div>

        {/* Adjusted Filter & Sort Toolbar Card - Search Bar Removed, Area/Day/Sort Adjusted */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ded8cb] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#f0ebe0] pb-3">
            <span className="text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#2e6f40]" />
              <span>Directory Filters</span>
            </span>
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

          {/* Adjusted 4-Column Controls: Area, Day, Category, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Neighborhood / Area Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>Area / Neighborhood</span>
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  <option value="All">All Malir Neighborhoods</option>
                  {neighborhoodsList.slice(1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Specific Operating Day Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>Operating Day</span>
              </label>
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  {daysList.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Product Category Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>Product Category</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  <option value="All">All Product Categories</option>
                  {categoriesList.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Sort Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>Sort Markets</span>
              </label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, sort: e.target.value }))}
                  className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-3.5 py-3 rounded-xl text-[#1a2f1d] focus:outline-none focus:ring-2 focus:ring-[#153e25] appearance-none cursor-pointer pr-8"
                >
                  <option value="nearest">Nearest First (Distance)</option>
                  <option value="rating">Highest Rated (Reviews)</option>
                  <option value="vendors">Most Farm Vendors</option>
                  <option value="az">Alphabetical (A-Z)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Quick Tag Pills */}
          <div className="pt-3 border-t border-[#f0ebe0] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#718096] mr-1">Popular Filters:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#153e25] text-white shadow-xs'
                      : 'bg-[#f4efe4] hover:bg-[#ede6d8] text-[#3c5243] border border-[#ded8cb]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#718096]">
              Real-time directory updates
            </div>
          </div>
        </div>

        {/* Market Cards Grid */}
        {filteredMarkets.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-[#ded8cb] shadow-xs space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-[#f4efe4] text-[#2e6f40] flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#153e25]">
              No markets matched your filters
            </h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Try adjusting your selected operating day, neighborhood, or category filter to discover other local bachat bazars.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#153e25] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2e6f40] transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
