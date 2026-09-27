import React, { useState } from 'react';
import { Bookmark, X, Trash2, ExternalLink, Calendar, MapPin, Edit3, Share2, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';

export default function BookmarksDrawer() {
  const {
    isBookmarksOpen,
    setIsBookmarksOpen,
    bookmarkedMarkets,
    bookmarkedProduce,
    toggleMarketBookmark,
    toggleProduceBookmark,
    sessionNotes,
    updateSessionNote,
    deleteSessionNote,
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('markets'); // 'markets' or 'produce'
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');

  if (!isBookmarksOpen) return null;

  const savedMarketsList = marketsData.filter((m) =>
    bookmarkedMarkets.includes(m.id)
  );
  const savedProduceList = produceData.filter((p) =>
    bookmarkedProduce.includes(p.id)
  );

  const handleStartEditNote = (id) => {
    setEditingNoteId(id);
    setTempNoteText(sessionNotes[id] || '');
  };

  const handleSaveNote = (id) => {
    if (tempNoteText.trim()) {
      updateSessionNote(id, tempNoteText.trim());
    } else {
      deleteSessionNote(id);
    }
    setEditingNoteId(null);
  };

  const handleCopyShareList = () => {
    let summary = `🌿 FreshFind Shopping Plan & Favorites:\n\n`;

    if (savedMarketsList.length > 0) {
      summary += `📍 Saved Farmers Markets:\n`;
      savedMarketsList.forEach((m) => {
        summary += `• ${m.name} (${m.schedule}) - ${m.address}\n`;
        if (sessionNotes[m.id]) {
          summary += `  Note: "${sessionNotes[m.id]}"\n`;
        }
      });
      summary += `\n`;
    }

    if (savedProduceList.length > 0) {
      summary += `🥕 In-Season Produce to Find:\n`;
      savedProduceList.forEach((p) => {
        summary += `• ${p.name} (${p.season})\n`;
        if (sessionNotes[p.id]) {
          summary += `  Note: "${sessionNotes[p.id]}"\n`;
        }
      });
    }

    summary += `\nOrganized via FreshFind Local Harvest Guide`;

    navigator.clipboard.writeText(summary);
    showToast('Shopping list & market notes copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">

      <div
        onClick={() => setIsBookmarksOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fcfbf7] border-l border-[#ded8cb] shadow-2xl flex flex-col">

          <div className="p-5 bg-[#153e25] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#a3e635] text-[#153e25] flex items-center justify-center font-bold">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">
                  My Saved Favorites
                </h2>
                <p className="text-xs text-[#b8d4c1]">
                  LocalStorage sync · Personal shopping plan
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBookmarksOpen(false)}
              className="p-2 rounded-xl text-[#b8d4c1] hover:text-white hover:bg-[#235836] transition-colors cursor-pointer"
              aria-label="Close bookmarks drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          <div className="bg-[#f2ece0] p-2 flex gap-2 border-b border-[#ded8cb]">
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'markets'
                  ? 'bg-white text-[#153e25] shadow-xs'
                  : 'text-[#566a5c] hover:text-[#153e25]'
                }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Markets ({savedMarketsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('produce')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'produce'
                  ? 'bg-white text-[#153e25] shadow-xs'
                  : 'text-[#566a5c] hover:text-[#153e25]'
                }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Produce ({savedProduceList.length})</span>
            </button>
          </div>


          <div className="px-5 py-3 bg-[#faf7ef] border-b border-[#e7e1d5] flex items-center justify-between">
            <span className="text-xs text-[#526357]">
              {activeTab === 'markets'
                ? `${savedMarketsList.length} saved market location(s)`
                : `${savedProduceList.length} seasonal item(s) to pick up`}
            </span>
            <button
              onClick={handleCopyShareList}
              className="flex items-center gap-1.5 text-xs text-[#153e25] font-semibold hover:underline cursor-pointer bg-[#e8f1ec] px-3 py-1.5 rounded-lg border border-[#c5dcce]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#236338]" />
              <span>Copy Shopping Plan</span>
            </button>
          </div>


          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fcfbf7]">
            {activeTab === 'markets' ? (
              savedMarketsList.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#eee8db] text-[#86998c] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-[#153e25]">No saved markets yet</h4>
                  <p className="text-xs text-[#526357] max-w-xs mx-auto">
                    Browse our directory and click the bookmark icon on any market card to save it for easy access.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookmarksOpen(false);
                      navigateTo('directory');
                    }}
                    className="inline-block bg-[#153e25] text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 cursor-pointer shadow-xs"
                  >
                    Explore Markets
                  </button>
                </div>
              ) : (
                savedMarketsList.map((market) => (
                  <div
                    key={market.id}
                    className="bg-white rounded-2xl p-4 border border-[#e2dcd0] shadow-xs space-y-3 transition-all hover:border-[#236338]"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={market.image}
                        alt={market.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#eee9dc]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#236338] bg-[#eef5f0] px-2 py-0.5 rounded-md inline-block mb-1">
                          {market.neighborhood}
                        </span>
                        <h4
                          onClick={() => {
                            setIsBookmarksOpen(false);
                            navigateTo('market-detail', { id: market.id });
                          }}
                          className="font-serif font-bold text-sm text-[#153e25] hover:underline cursor-pointer truncate"
                        >
                          {market.name}
                        </h4>
                        <p className="text-xs text-[#526357] flex items-center gap-1 mt-0.5 truncate">
                          <Calendar className="w-3 h-3 text-[#236338] shrink-0" />
                          <span>{market.schedule}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleMarketBookmark(market.id)}
                        className="text-[#96a89c] hover:text-[#ef4444] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>


                    <div className="pt-2 border-t border-[#f0ebe0]">
                      {editingNoteId === market.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Add a shopping note (e.g. Arrive before 10 for berries)..."
                            className="w-full text-xs p-2.5 rounded-xl border border-[#cddad1] bg-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#153e25]"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="text-xs px-2.5 py-1 text-[#526357] hover:text-black cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(market.id)}
                              className="text-xs px-3 py-1 bg-[#153e25] text-white rounded-lg font-medium cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          {sessionNotes[market.id] ? (
                            <p className="text-[#3c5043] italic bg-[#f7f5ee] p-2 rounded-lg flex-1 mr-2 text-[11px]">
                              📝 "{sessionNotes[market.id]}"
                            </p>
                          ) : (
                            <span className="text-[#8e9e93] text-[11px]">No notes added</span>
                          )}
                          <button
                            onClick={() => handleStartEditNote(market.id)}
                            className="text-[#236338] hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{sessionNotes[market.id] ? 'Edit' : 'Add Note'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setIsBookmarksOpen(false);
                          navigateTo('market-detail', { id: market.id });
                        }}
                        className="text-xs text-[#153e25] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : (
              savedProduceList.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#eee8db] text-[#86998c] flex items-center justify-center mx-auto">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-[#153e25]">No saved produce items</h4>
                  <p className="text-xs text-[#526357] max-w-xs mx-auto">
                    Explore our Seasonal Product Guide and bookmark heritage crops you want to cook with this week.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookmarksOpen(false);
                      navigateTo('produce');
                    }}
                    className="inline-block bg-[#153e25] text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 cursor-pointer shadow-xs"
                  >
                    Browse Product Guide
                  </button>
                </div>
              ) : (
                savedProduceList.map((produce) => (
                  <div
                    key={produce.id}
                    className="bg-white rounded-2xl p-4 border border-[#e2dcd0] shadow-xs space-y-3 transition-all hover:border-[#236338]"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={produce.image}
                        alt={produce.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#eee9dc]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] bg-[#153e25] px-2 py-0.5 rounded-md inline-block mb-1">
                          {produce.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#153e25] truncate">
                          {produce.name}
                        </h4>
                        <p className="text-xs text-[#526357] line-clamp-1 mt-0.5">
                          {produce.seasonTag}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleProduceBookmark(produce.id)}
                        className="text-[#96a89c] hover:text-[#ef4444] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove produce bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Session Note section */}
                    <div className="pt-2 border-t border-[#f0ebe0]">
                      {editingNoteId === produce.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Add a recipe or shopping reminder..."
                            className="w-full text-xs p-2.5 rounded-xl border border-[#cddad1] bg-[#fbfbf9] focus:outline-none focus:ring-1 focus:ring-[#153e25]"
                            rows={2}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="text-xs px-2.5 py-1 text-[#526357] hover:text-black cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(produce.id)}
                              className="text-xs px-3 py-1 bg-[#153e25] text-white rounded-lg font-medium cursor-pointer"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          {sessionNotes[produce.id] ? (
                            <p className="text-[#3c5043] italic bg-[#f7f5ee] p-2 rounded-lg flex-1 mr-2 text-[11px]">
                              📝 "{sessionNotes[produce.id]}"
                            </p>
                          ) : (
                            <span className="text-[#8e9e93] text-[11px]">No recipe notes</span>
                          )}
                          <button
                            onClick={() => handleStartEditNote(produce.id)}
                            className="text-[#236338] hover:underline flex items-center gap-1 font-medium cursor-pointer shrink-0"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{sessionNotes[produce.id] ? 'Edit' : 'Add Note'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
