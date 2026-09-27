import React from 'react';
import { Bookmark, Sparkles, MapPin, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';

export default function ProduceCard({ produce, onQuickView }) {
  const { navigateTo, isProduceBookmarked, toggleProduceBookmark } = useApp();
  const bookmarked = isProduceBookmarked(produce.id);

  // Match markets carrying this produce
  const carryingMarkets = marketsData.filter((m) =>
    produce.marketIds.includes(m.id)
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#e5decb] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Produce Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-[#e8e4dc]">
        <img
          src={produce.image}
          alt={produce.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

        {/* Season Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-[#153e25]/90 backdrop-blur-xs text-[#a3e635] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#2e6d45]/60 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
            {produce.seasonTag}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleProduceBookmark(produce.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
            bookmarked
              ? 'bg-[#153e25] text-[#a3e635] scale-110 shadow-lg'
              : 'bg-white/80 hover:bg-white text-[#2a3c30] backdrop-blur-xs hover:text-[#153e25]'
          }`}
          aria-label={bookmarked ? 'Remove produce bookmark' : 'Bookmark produce'}
          title={bookmarked ? 'Saved to Bookmarks' : 'Bookmark this crop'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-xs text-[#153e25] text-xs font-bold px-2.5 py-0.8 rounded-lg shadow-xs">
            {produce.category}
          </span>
        </div>
      </div>

      {/* Produce Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3
              onClick={() => onQuickView(produce)}
              className="font-serif text-lg font-bold text-[#153e25] group-hover:text-[#236338] transition-colors cursor-pointer leading-snug line-clamp-1"
            >
              {produce.name}
            </h3>
          </div>

          <p className="text-[11px] text-[#718476] italic font-mono mt-0.5">
            {produce.botanicalName}
          </p>

          <p className="text-xs text-[#526357] mt-2 line-clamp-2 leading-relaxed">
            {produce.shortDescription}
          </p>
        </div>

        {/* Nutrition Highlights */}
        <div className="pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7e71] block mb-1">
            Key Nutrients & Flavor:
          </span>
          <div className="flex flex-wrap gap-1">
            {produce.nutrition.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#f2ede2] text-[#2e4936] font-medium px-2 py-0.5 rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Carrying Markets */}
        <div className="pt-2 border-t border-[#f0ebd9] space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#526357]">
            <span className="font-semibold flex items-center gap-1 text-[#153e25]">
              <MapPin className="w-3 h-3 text-[#236338]" />
              Found at {carryingMarkets.length} markets:
            </span>
            <button
              onClick={() => onQuickView(produce)}
              className="text-[#236338] hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>Harvest Tips</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            {carryingMarkets.map((m) => (
              <button
                key={m.id}
                onClick={() => navigateTo('market-detail', { id: m.id })}
                className="text-[11px] bg-[#eef5f0] hover:bg-[#153e25] text-[#1e5a32] hover:text-white font-medium px-2.5 py-0.8 rounded-lg transition-colors cursor-pointer border border-[#cbe1d3]"
              >
                {m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
