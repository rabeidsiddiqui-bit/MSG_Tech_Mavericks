import React from 'react';
import { X, Bookmark, MapPin, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';

export default function ProduceModal({ produce, onClose }) {
  const { navigateTo, isProduceBookmarked, toggleProduceBookmark } = useApp();

  if (!produce) return null;

  const bookmarked = isProduceBookmarked(produce.id);
  const carryingMarkets = marketsData.filter((m) =>
    produce.marketIds.includes(m.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        ></div>

        <div className="relative inline-block w-full max-w-2xl overflow-hidden text-left align-middle transition-all transform bg-[#fcfbf7] border border-[#ded8cb] shadow-2xl rounded-3xl z-10 my-8">
          {/* Header Image */}
          <div className="relative h-64 w-full overflow-hidden bg-[#e8e4dc]">
            <img
              src={produce.image}
              alt={produce.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="bg-[#a3e635] text-[#153e25] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1 shadow-sm">
                {produce.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                {produce.name}
              </h2>
              <p className="text-xs text-[#dbe8de] font-mono italic mt-0.5">
                {produce.botanicalName}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fcfbf7]">
            {/* Seasonality bar & Bookmark */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f2ede2] rounded-2xl border border-[#e2dcd0]">
              <div>
                <span className="text-xs text-[#526357] block font-medium">Peak Season Availability</span>
                <span className="text-sm font-bold text-[#153e25] flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#236338]" />
                  {produce.season} ({produce.peakMonths.join(', ')})
                </span>
              </div>

              <button
                onClick={() => toggleProduceBookmark(produce.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  bookmarked
                    ? 'bg-[#153e25] text-[#a3e635] ring-2 ring-[#a3e635]/40'
                    : 'bg-[#153e25] hover:bg-[#236338] text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Bookmarked' : 'Bookmark Produce'}</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526357] mb-1.5">
                Harvest Profile
              </h4>
              <p className="text-sm text-[#2d3f33] leading-relaxed">
                {produce.description}
              </p>
            </div>

            {/* Grid of Storage Tip & Flavor Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-[#ded8cb] shadow-xs">
                <h5 className="text-xs font-bold text-[#153e25] uppercase tracking-wider mb-1 flex items-center gap-1">
                  📦 Pro Storage Advice
                </h5>
                <p className="text-xs text-[#526357] leading-relaxed">
                  {produce.storageTip}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#ded8cb] shadow-xs">
                <h5 className="text-xs font-bold text-[#153e25] uppercase tracking-wider mb-1 flex items-center gap-1">
                  ✨ Flavor & Aroma Notes
                </h5>
                <p className="text-xs text-[#526357] leading-relaxed">
                  {produce.flavorNotes}
                </p>
              </div>
            </div>

            {/* Best Culinary Pairings */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526357] mb-2">
                Chef Recommended Pairings
              </h4>
              <div className="flex flex-wrap gap-2">
                {produce.bestUses.map((use, i) => (
                  <span
                    key={i}
                    className="bg-[#eef5f0] text-[#1c552f] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cae2d2] flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-[#236338]" />
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Markets */}
            <div className="pt-2 border-t border-[#eee8db]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526357] mb-3">
                Where to pick this up this week
              </h4>
              <div className="space-y-2">
                {carryingMarkets.map((market) => (
                  <div
                    key={market.id}
                    className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#ded8cb] hover:border-[#153e25] transition-colors"
                  >
                    <div>
                      <h5 className="font-serif font-bold text-sm text-[#153e25]">
                        {market.name}
                      </h5>
                      <p className="text-xs text-[#607466] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#236338]" />
                        {market.neighborhood} · {market.schedule}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        navigateTo('market-detail', { id: market.id });
                      }}
                      className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Market Page</span>
                      <ArrowRight className="w-3 h-3 text-[#a3e635]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
