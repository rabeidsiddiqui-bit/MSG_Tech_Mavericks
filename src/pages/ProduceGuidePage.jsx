import React, { useState, useMemo } from 'react';
import { Sprout, Search, X, CheckCircle2 } from 'lucide-react';
import produceData from '../data/produce.json';
import ProduceCard from '../components/ProduceCard';
import ProduceModal from '../components/ProduceModal';

export default function ProduceGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [activeModalProduce, setActiveModalProduce] = useState(null);

  const categories = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Local Products'];
  const seasons = [
    { label: 'All Cycles', value: 'All' },
    { label: 'Spring', value: 'spring' },
    { label: 'Summer', value: 'summer' },
    { label: 'Fall / Autumn', value: 'fall' },
    { label: 'Year-Round', value: 'all-year' }
  ];

  const filteredProduce = useMemo(() => {
    return produceData.filter((item) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBot = item.botanicalName.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchFlavor = item.flavorNotes.toLowerCase().includes(q);
        if (!matchName && !matchBot && !matchDesc && !matchFlavor) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Season filter
      if (selectedSeason !== 'All') {
        if (selectedSeason === 'all-year') {
          if (item.seasonKey !== 'all-year') return false;
        } else if (item.seasonKey !== selectedSeason && item.seasonKey !== 'all-year') {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedSeason, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedSeason('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedSeason !== 'All' || searchQuery.trim() !== '' || sortBy !== 'default';

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="bg-[#153e25] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#236338] opacity-30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-[#a3e635] text-[#153e25] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Seasonal Eating Guide
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Eat with the Seasons. <br />
              Taste Real Regional Flavor.
            </h1>
            <p className="text-sm sm:text-base text-[#c5ded0] leading-relaxed">
              Discover what's ripening across regional farms this week. Learn which markets carry your favorite heritage crops, how to store them for maximum shelf life, and chef pairing tips.
            </p>
          </div>

          {/* White Logo Watermark */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none select-none hidden lg:block">
            <img
              src="/logo-white.png"
              alt="FreshFind white logo watermark"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>

        {/* Toolbar Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#ded8cb] shadow-sm space-y-6">
          {/* Top Search & Season Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7d9183] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce (e.g. Tomatoes, Basil, Honey)..."
                className="w-full bg-[#f9f7f2] border border-[#ded8cb] text-sm pl-10 pr-8 py-2.5 rounded-2xl text-[#1a2b20] focus:outline-none focus:ring-2 focus:ring-[#153e25]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9f93] hover:text-[#153e25] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Season & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Season Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-[#153e25] shrink-0">Harvest Season:</span>
                {seasons.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSeason(s.value)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                      selectedSeason === s.value
                        ? 'bg-[#153e25] text-white font-bold shadow-xs'
                        : 'bg-[#f4efe4] hover:bg-[#ede6d8] text-[#3c5243]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#153e25] shrink-0">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f9f7f2] border border-[#ded8cb] text-xs font-semibold px-2.5 py-1.5 rounded-xl text-[#153e25] focus:outline-none cursor-pointer"
                >
                  <option value="default">Featured Harvest</option>
                  <option value="az">Alphabetical (A-Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills Filter */}
          <div className="pt-4 border-t border-[#f0ebe0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#153e25] mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-2xl transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#236338] text-white shadow-sm'
                      : 'bg-[#f7f5ee] hover:bg-[#ece5d5] text-[#2c4031]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#b91c1c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#526357] px-1">
          <p>
            Showing <strong className="text-[#153e25] font-bold">{filteredProduce.length}</strong> of{' '}
            <strong className="text-[#153e25] font-bold">{produceData.length}</strong> seasonal crops & artisanal staples
          </p>
          <span className="text-[#236338] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Regional & Fresh Harvest
          </span>
        </div>

        {/* Produce Grid */}
        {filteredProduce.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#ded8cb] shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#f4efe4] text-[#86998c] flex items-center justify-center mx-auto">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#153e25]">
              No produce matched your criteria
            </h3>
            <p className="text-xs text-[#526357]">
              Try choosing "All Cycles" or "All Fresh Categories" to browse our complete regional catalogue.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-5 py-2.5 rounded-2xl transition-all cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduce.map((produce) => (
              <ProduceCard
                key={produce.id}
                produce={produce}
                onQuickView={(p) => setActiveModalProduce(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Produce Modal */}
      {activeModalProduce && (
        <ProduceModal
          produce={activeModalProduce}
          onClose={() => setActiveModalProduce(null)}
        />
      )}
    </div>
  );
}
