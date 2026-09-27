import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Sprout, Sparkles, ArrowRight, Bookmark, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import MarketCard from '../components/MarketCard';
import ProduceModal from '../components/ProduceModal';

export default function HomePage() {
  const { navigateTo, setSearchFilters, isProduceBookmarked, toggleProduceBookmark } = useApp();

  // Floating Quick Search Bar State
  const [quickQuery, setQuickQuery] = useState('');
  const [quickArea, setQuickArea] = useState('All');
  const [quickDay, setQuickDay] = useState('All');
  const [quickProduce, setQuickProduce] = useState('All');

  // Produce modal state
  const [quickViewProduce, setQuickViewProduce] = useState(null);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    setSearchFilters({
      query: quickQuery,
      area: quickArea,
      day: quickDay,
      category: quickProduce,
      sort: 'nearest'
    });
    navigateTo('directory');
  };

  // 1. Near You Now Filters
  const [homeMarketArea, setHomeMarketArea] = useState('All');
  const [homeMarketDay, setHomeMarketDay] = useState('All');

  const filteredNearMarkets = marketsData.filter((market) => {
    if (homeMarketArea !== 'All' && !market.neighborhood.toLowerCase().includes(homeMarketArea.toLowerCase())) {
      return false;
    }
    if (homeMarketDay !== 'All') {
      const matchesDayArray = market.hours?.days && market.hours.days.some((d) =>
        d.toLowerCase().includes(homeMarketDay.toLowerCase())
      );
      const matchesDayStr = market.day && market.day.toLowerCase().includes(homeMarketDay.toLowerCase());
      if (!matchesDayArray && !matchesDayStr) return false;
    }
    return true;
  });

  // 2. Fresh Produce Showcase Category Filter
  const [homeProduceCategory, setHomeProduceCategory] = useState('All');
  const filteredProduceShowcase = produceData.filter((crop) => {
    if (homeProduceCategory !== 'All' && crop.category !== homeProduceCategory) {
      return false;
    }
    return true;
  });

  // 3. Harvest Calendar Cycle Filter
  const [homeHarvestSeason, setHomeHarvestSeason] = useState('All');
  const filteredHarvestPicks = produceData.filter((item) => {
    if (homeHarvestSeason !== 'All') {
      if (!item.seasonTag.toLowerCase().includes(homeHarvestSeason.toLowerCase())) {
        return false;
      }
    }
    return true;
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1a2f1d] pb-16 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#153e25] text-white min-h-[500px] sm:min-h-[540px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hero-fresh-produce.jpg')`
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2c1a]/95 via-[#153e25]/85 to-black/40 pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-2xl space-y-3.5">
            <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#a3e635]">
              FRESH FROM YOUR NEIGHBORHOOD
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.12]">
              Discover fresh, seasonal<br />local produce near you.
            </h1>

            <p className="text-sm sm:text-base text-white/85 font-normal max-w-xl leading-relaxed pt-1">
              Meet the growers, explore community bachat bazars, and bring home vegetables picked within 24 hours from Malir family farms.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('directory')}
                className="bg-[#a3e635] hover:bg-[#8fd822] text-[#153e25] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Find Markets in Malir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('seasonal-recommendations')}
                className="bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all border border-white/20 cursor-pointer"
              >
                <span>Seasonal Recommendations</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING SEARCH BAR */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 -mt-9 sm:-mt-10 mb-14">
        <div className="bg-white rounded-[14px] shadow-lg border border-[#edf2f7] p-3 sm:p-4">
          <form
            onSubmit={handleQuickSearch}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Quick find input */}
            <div className="md:col-span-4 flex items-center gap-3 px-3 py-1.5 border-b md:border-b-0 md:border-r border-[#edf2f7]">
              <Search className="w-4 h-4 text-[#718096] shrink-0" />
              <div className="w-full">
                <span className="block text-[12px] font-bold text-[#1a2f1d] leading-none mb-1">
                  Quick find
                </span>
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Market, crop, or neighborhood..."
                  className="w-full text-[13px] text-[#1a2f1d] placeholder-[#718096] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Area dropdown */}
            <div className="md:col-span-2 px-3 py-1.5 border-b md:border-b-0 md:border-r border-[#edf2f7]">
              <label className="block text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-0.5">
                AREA
              </label>
              <div className="relative">
                <select
                  value={quickArea}
                  onChange={(e) => setQuickArea(e.target.value)}
                  className="w-full text-[13px] font-medium text-[#1a2f1d] bg-transparent focus:outline-none appearance-none cursor-pointer pr-4 truncate"
                >
                  <option value="All">All Malir Areas</option>
                  <option value="Kala Board">Kala Board</option>
                  <option value="Malir City">Malir City</option>
                  <option value="Model Colony">Model Colony</option>
                  <option value="Khokhrapar">Khokhrapar</option>
                  <option value="Malir Cantt">Malir Cantt</option>
                  <option value="Saudabad">Saudabad</option>
                  <option value="Jaffar-e-Tayyar">Jaffar-e-Tayyar</option>
                  <option value="Gharibabad">Gharibabad</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#718096] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Day dropdown */}
            <div className="md:col-span-2 px-3 py-1.5 border-b md:border-b-0 md:border-r border-[#edf2f7]">
              <label className="block text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-0.5">
                DAY
              </label>
              <div className="relative">
                <select
                  value={quickDay}
                  onChange={(e) => setQuickDay(e.target.value)}
                  className="w-full text-[13px] font-medium text-[#1a2f1d] bg-transparent focus:outline-none appearance-none cursor-pointer pr-4 truncate"
                >
                  <option value="All">Any day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Friday">Friday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Monday">Monday</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#718096] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Produce dropdown */}
            <div className="md:col-span-2 px-3 py-1.5">
              <label className="block text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-0.5">
                PRODUCE
              </label>
              <div className="relative">
                <select
                  value={quickProduce}
                  onChange={(e) => setQuickProduce(e.target.value)}
                  className="w-full text-[13px] font-medium text-[#1a2f1d] bg-transparent focus:outline-none appearance-none cursor-pointer pr-4 truncate"
                >
                  <option value="All">All produce</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Dairy & Cheese">Dairy & Cheese</option>
                  <option value="Local Products">Local Products</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#718096] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="w-full bg-[#1e5230] hover:bg-[#153e25] text-white text-[13px] font-semibold py-2.5 px-4 rounded-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Find markets</span>
                <span className="text-white">→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. NEAR YOU NOW - MARKETS OPEN TODAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#1e5230] block">
              Near you now · Malir District
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2f1d] tracking-tight">
              Markets open today & this week
            </h2>
          </div>

          <button
            onClick={() => navigateTo('directory')}
            className="text-[13px] font-bold text-[#1e5230] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all {marketsData.length} markets</span>
            <span>→</span>
          </button>
        </div>

        {/* Section Filter Pills */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#edf2f7] mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#153e25] mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2e6f40]" />
              <span>Area:</span>
            </span>
            {['All', 'Kala Board', 'Malir City', 'Model Colony', 'Khokhrapar', 'Saudabad', 'Cantt'].map((a) => (
              <button
                key={a}
                onClick={() => setHomeMarketArea(a)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  homeMarketArea === a
                    ? 'bg-[#153e25] text-white shadow-2xs'
                    : 'bg-[#f8fafc] hover:bg-[#ede6d8] text-[#4a5568] border border-[#edf2f7]'
                }`}
              >
                {a === 'All' ? 'All Areas' : a}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#153e25] mr-1">Day:</span>
            {['All', 'Sunday', 'Saturday', 'Friday'].map((d) => (
              <button
                key={d}
                onClick={() => setHomeMarketDay(d)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  homeMarketDay === d
                    ? 'bg-[#236338] text-white'
                    : 'bg-[#f8fafc] hover:bg-[#edf2f7] text-[#4a5568] border border-[#edf2f7]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Cards Grid (Filtered Near Markets) */}
        {filteredNearMarkets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#edf2f7] text-xs text-[#718096]">
            No markets found matching the selected area or day filter.
            <button
              onClick={() => { setHomeMarketArea('All'); setHomeMarketDay('All'); }}
              className="block mx-auto mt-2 text-[#153e25] font-bold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNearMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </section>

      {/* 4. NEW DEDICATED FRESH SEASONAL PRODUCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#edf2f7] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6f40] uppercase tracking-wider mb-1">
                <Sprout className="w-4 h-4" />
                <span>Malir Agricultural Greenbelts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2f1d] tracking-tight">
                Fresh Seasonal Produce
              </h2>
              <p className="text-xs sm:text-sm text-[#718096] mt-1">
                Picked early at dawn and delivered straight to neighborhood stalls. High natural sweetness, crisp texture, and zero preservatives.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/produce"
                className="text-xs font-bold text-[#153e25] hover:text-[#2e6f40] hover:underline flex items-center gap-1"
              >
                <span>Browse All Crops</span>
                <span>→</span>
              </Link>
              <Link
                to="/seasonal-recommendations"
                className="bg-[#153e25] hover:bg-[#2e6f40] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
              >
                <span>View Recommendations</span>
              </Link>
            </div>
          </div>

          {/* Product Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f0ebe0]">
            <span className="text-xs font-bold text-[#153e25] mr-1">Filter Category:</span>
            {['All', 'Vegetables', 'Fruits', 'Herbs', 'Dairy', 'Local Products'].map((cat) => (
              <button
                key={cat}
                onClick={() => setHomeProduceCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  homeProduceCategory === cat
                    ? 'bg-[#153e25] text-white shadow-2xs'
                    : 'bg-[#f4efe4] hover:bg-[#ede6d8] text-[#3c5243] border border-[#ded8cb]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Produce Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredProduceShowcase.map((crop) => {
              const bookmarked = isProduceBookmarked(crop.id);

              return (
                <div
                  key={crop.id}
                  onClick={() => setQuickViewProduce(crop)}
                  className="bg-[#fcfbf7] hover:bg-white rounded-2xl border border-[#ded8cb] hover:border-[#153e25] p-4 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#ded8cb]"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] bg-[#153e25] px-2 py-0.5 rounded-md">
                          {crop.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProduceBookmark(crop.id);
                          }}
                          className={`p-1 rounded-full cursor-pointer transition-colors ${
                            bookmarked ? 'text-[#153e25]' : 'text-[#8ea093] hover:text-[#153e25]'
                          }`}
                          aria-label="Bookmark crop"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#153e25] group-hover:text-[#2e6f40] transition-colors truncate">
                        {crop.name}
                      </h4>
                      <p className="text-[11px] text-[#2e6f40] font-semibold">
                        {crop.seasonTag}
                      </p>
                      <p className="text-xs text-[#526357] line-clamp-1 mt-1">
                        {crop.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#ded8cb]/70 flex items-center justify-between text-[11px]">
                    <span className="text-[#718096]">
                      {crop.nutrition?.[0] || 'Rich in vitamins'}
                    </span>
                    <span className="font-bold text-[#1e5230] group-hover:translate-x-0.5 transition-transform">
                      Harvest Tips & Recipes →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HARVEST CALENDAR - THIS WEEK'S SEASONAL PICKS (2x2 Grid with #F4EFE4 background) */}
      <section className="bg-[#F4EFE4] py-14 mb-12 border-y border-[#ede6d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1e5230] block">
                Harvest Calendar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a2f1d] tracking-tight">
                This week's seasonal picks
              </h2>
            </div>

            <button
              onClick={() => navigateTo('produce')}
              className="text-[13px] font-bold text-[#1e5230] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Product Guide</span>
              <span>→</span>
            </button>
          </div>

          {/* Harvest Season Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[#153e25] mr-1">Harvest Cycle:</span>
            {['All', 'Summer', 'Autumn', 'Fresh Daily'].map((s) => (
              <button
                key={s}
                onClick={() => setHomeHarvestSeason(s)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  homeHarvestSeason === s
                    ? 'bg-[#153e25] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#ede6d8] text-[#3c5243] border border-[#ded8cb]'
                }`}
              >
                {s === 'All' ? 'All Harvests' : `${s} Picks`}
              </button>
            ))}
          </div>

          {/* 2x2 Grid with 01, 02, 03, 04 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredHarvestPicks.map((item, idx) => {
              const indexNumber = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={item.id}
                  onClick={() => setQuickViewProduce(item)}
                  className="bg-white rounded-[12px] border border-[#edf2f7] p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-36 h-36 rounded-[10px] overflow-hidden bg-[#edf2f7] shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-[#153e25]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {item.seasonTag}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#1e5230]/70 group-hover:text-[#1e5230] transition-colors">
                          {indexNumber}
                        </span>
                        <span className="text-[10px] font-semibold bg-[#f8fafc] text-[#4a5568] px-2 py-0.5 rounded border border-[#edf2f7]">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-[17px] font-bold text-[#1a2f1d] group-hover:text-[#1e5230] transition-colors mt-1">
                        {item.name}
                      </h3>

                      <p className="text-[12px] text-[#718096] line-clamp-2 mt-1 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#1e5230] font-bold">
                      <span>Available at local Malir markets</span>
                      <span className="group-hover:translate-x-1 transition-transform">Guide & tips →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. IMPACT BANNER (Dark Green Rounded Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4 mb-8">
        <div className="bg-[#153e25] text-white rounded-[14px] p-8 sm:p-10 shadow-md">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a3e635]">
              BETTER FOOD. STRONGER PLACES.
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Every local choice makes an impact.
            </h2>
            <p className="text-sm text-white/80 max-w-xl">
              By sourcing directly from neighborhood smallholders and bachat bazars, our community cuts food miles and keeps local agriculture flourishing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#235836]">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#a3e635] block">
                {marketsData.length}
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                local markets in Malir
              </span>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#a3e635] block">
                120+
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                trusted local growers
              </span>
            </div>

            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#a3e635] block">
                3.5 mi
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                average food journey
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Produce Quick View Modal */}
      {quickViewProduce && (
        <ProduceModal
          produce={quickViewProduce}
          onClose={() => setQuickViewProduce(null)}
        />
      )}
    </div>
  );
}
