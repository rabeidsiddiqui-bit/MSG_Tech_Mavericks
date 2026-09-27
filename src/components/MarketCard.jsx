import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MarketCard({ market }) {
  const { navigateTo, isMarketBookmarked, toggleMarketBookmark } = useApp();
  const bookmarked = isMarketBookmarked(market.id);

  return (
    <div className="bg-white rounded-[12px] overflow-hidden border border-[#edf2f7] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group hover:-translate-y-0.5">
      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#edf2f7]">
        <Link to={`/market/${market.id}`} className="block w-full h-full">
          <img
            src={market.image}
            alt={market.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Top Status & Time Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center pointer-events-none">
          <span className="bg-[#153e25] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            {market.status || 'Open this week'}
          </span>
          <span className="bg-[#ffffff]/90 text-[#1a2f1d] text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
            {market.schedule}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMarketBookmark(market.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
            bookmarked
              ? 'bg-[#153e25] text-[#a3e635] scale-105 shadow-md'
              : 'bg-white/90 hover:bg-white text-[#4a5568] hover:text-[#153e25]'
          }`}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark market'}
          title={bookmarked ? 'Saved to Bookmarks' : 'Bookmark this market'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            to={`/market/${market.id}`}
            className="block text-[17px] font-bold text-[#1a2f1d] group-hover:text-[#1e5230] transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {market.name}
          </Link>

          {/* Location formatted exactly as "📍 Area • Distance" */}
          <p className="text-[12px] font-medium text-[#718096] flex items-center gap-1 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1e5230] shrink-0" />
            <span>{market.neighborhood} • {market.distance}</span>
          </p>

          <p className="text-[12px] text-[#4a5568] mt-2 line-clamp-2 leading-relaxed">
            {market.description}
          </p>
        </div>

        {/* Tag pills */}
        <div className="pt-1">
          <div className="flex flex-wrap gap-1.5">
            {market.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-[#f8fafc] text-[#2d3748] font-medium px-2 py-0.5 rounded border border-[#edf2f7]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-[#edf2f7] flex items-center justify-end">
          <Link
            to={`/market/${market.id}`}
            className="text-[12px] font-bold text-[#1e5230] hover:text-[#153e25] flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
          >
            <span>View market details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1e5230]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
