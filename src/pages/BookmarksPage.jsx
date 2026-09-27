import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  MapPin,
  Sprout,
  Share2,
  Trash2,
  Edit3,
  Printer,
  Download,
  ExternalLink,
  Navigation,
  Clock,
  ArrowRight,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import ProduceModal from '../components/ProduceModal';
import confetti from 'canvas-confetti';

export default function BookmarksPage() {
  const {
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

  const [activeTab, setActiveTab] = useState('markets');
  const [editingId, setEditingId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [quickViewProduce, setQuickViewProduce] = useState(null);
  const [bookmarkSearch, setBookmarkSearch] = useState('');
  const [bookmarkMarketArea, setBookmarkMarketArea] = useState('All');
  const [bookmarkProduceCategory, setBookmarkProduceCategory] = useState('All');

  const savedMarkets = marketsData.filter((m) => bookmarkedMarkets.includes(m.id));
  const savedProduce = produceData.filter((p) => bookmarkedProduce.includes(p.id));

  const filteredSavedMarkets = savedMarkets.filter((m) => {
    if (bookmarkSearch.trim()) {
      const q = bookmarkSearch.toLowerCase().trim();
      if (!m.name.toLowerCase().includes(q) && !m.neighborhood.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (bookmarkMarketArea !== 'All' && !m.neighborhood.toLowerCase().includes(bookmarkMarketArea.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredSavedProduce = savedProduce.filter((p) => {
    if (bookmarkSearch.trim()) {
      const q = bookmarkSearch.toLowerCase().trim();
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (bookmarkProduceCategory !== 'All' && p.category !== bookmarkProduceCategory) {
      return false;
    }
    return true;
  });

  const handleEditNote = (id) => {
    setEditingId(id);
    setNoteDraft(sessionNotes[id] || '');
  };

  const handleSaveNote = (id) => {
    if (noteDraft.trim()) {
      updateSessionNote(id, noteDraft.trim());
      showToast('Shopping reminder saved!', 'success');
    } else {
      deleteSessionNote(id);
      showToast('Shopping reminder cleared.', 'info');
    }
    setEditingId(null);
  };

  const generatePlanText = () => {
    let summary = `🌿 FreshFind Shopping Plan & Local Harvest Favorites\n`;
    summary += `Generated on: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}\n`;
    summary += `=====================================================\n\n`;

    if (savedMarkets.length > 0) {
      summary += `📍 SAVED FARMERS MARKETS (${savedMarkets.length}):\n`;
      savedMarkets.forEach((m, idx) => {
        summary += `${idx + 1}. ${m.name}\n`;
        summary += `   • Schedule: ${m.schedule}\n`;
        summary += `   • Neighborhood: ${m.neighborhood} (${m.distance})\n`;
        summary += `   • Address: ${m.address}\n`;
        if (sessionNotes[m.id]) {
          summary += `   • Shopping Reminder: "${sessionNotes[m.id]}"\n`;
        }
        summary += `\n`;
      });
    } else {
      summary += `📍 SAVED FARMERS MARKETS: None added yet.\n\n`;
    }

    if (savedProduce.length > 0) {
      summary += `🥕 SEASONAL CROPS TO PICK UP (${savedProduce.length}):\n`;
      savedProduce.forEach((p, idx) => {
        summary += `${idx + 1}. ${p.name} [${p.category}]\n`;
        summary += `   • Peak Season: ${p.seasonTag}\n`;
        if (sessionNotes[p.id]) {
          summary += `   • Kitchen & Recipe Note: "${sessionNotes[p.id]}"\n`;
        }
        summary += `\n`;
      });
    } else {
      summary += `🥕 SEASONAL CROPS: None added yet.\n\n`;
    }

    summary += `Organized with FreshFind: Discover fresh, seasonal local produce near you.\n`;
    summary += `Visit: ${window.location.origin}\n`;
    return summary;
  };

  const handleCopySummary = () => {
    const summary = generatePlanText();
    navigator.clipboard.writeText(summary);
    showToast('Complete shopping plan copied to clipboard!', 'success');
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#153e25', '#a3e635']
      });
    } catch {
      // ignore
    }
  };

  const handleExportBookmarks = () => {
    const summary = generatePlanText();
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FreshFind-Shopping-Checklist-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Checklist downloaded successfully!', 'success');
  };

  const handleShareWhatsApp = () => {
    const plan = `🌿 My FreshFind Local Market Plan:\n${savedMarkets.map(m => `• ${m.name} (${m.schedule})`).join('\n')}\nPlan yours at: ${window.location.origin}/bookmarks`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(plan)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Planning my weekend market haul with FreshFind! Check out local farm markets and seasonal harvest.`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + '/bookmarks')}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#edf2f7]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6f40] uppercase tracking-wider mb-1">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Personal Harvest Planner</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153e25]">
              My Bookmarks & Favorites
            </h1>
            <p className="text-sm text-[#526357] mt-1 max-w-2xl">
              Organize your weekend market stops, in-season produce shopping checklist, and custom vendor reminders. All stored safely in your browser.
            </p>
          </div>

          {/* Quick Action Tools: Export, Print, Share */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportBookmarks}
              className="bg-white hover:bg-[#f4efe4] text-[#153e25] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-[#ded8cb] shadow-2xs hover:shadow-xs"
              title="Download formatted text checklist"
            >
              <Download className="w-4 h-4 text-[#2e6f40]" />
              <span>Export Bookmarks</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white hover:bg-[#f4efe4] text-[#153e25] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-[#ded8cb] shadow-2xs hover:shadow-xs"
              title="Print your market checklist"
            >
              <Printer className="w-4 h-4 text-[#2e6f40]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
              title="Copy formatted plan"
            >
              <Share2 className="w-4 h-4 text-[#a3e635]" />
              <span>Copy Plan</span>
            </button>
          </div>
        </div>

        {/* Social Sharing Quick Bar */}
        <div className="bg-[#f4efe4] p-3 rounded-2xl border border-[#ded8cb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-[#153e25] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#2e6f40]" />
            <span>Share your shopping list with family or friends:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-[#25d366] hover:bg-[#22c55e] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleShareTwitter}
              className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="font-bold">𝕏</span>
              <span>Post to X</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f2ece0] p-1.5 rounded-2xl w-fit border border-[#ded8cb]">
          <button
            onClick={() => setActiveTab('markets')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'markets'
                ? 'bg-white text-[#153e25] shadow-xs'
                : 'text-[#5b6e61] hover:text-[#153e25]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#2e6f40]" />
            <span>Saved Markets</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === 'markets' ? 'bg-[#153e25] text-[#a3e635]' : 'bg-[#ded8cb] text-[#526357]'
            }`}>
              {savedMarkets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('produce')}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'produce'
                ? 'bg-white text-[#153e25] shadow-xs'
                : 'text-[#5b6e61] hover:text-[#153e25]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-[#2e6f40]" />
            <span>Seasonal Produce</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === 'produce' ? 'bg-[#153e25] text-[#a3e635]' : 'bg-[#ded8cb] text-[#526357]'
            }`}>
              {savedProduce.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Saved Markets */}
        {activeTab === 'markets' && (
          <div>
            {savedMarkets.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-[#edf2f7] shadow-xs space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#f4efe4] text-[#2e6f40] flex items-center justify-center mx-auto">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#153e25]">
                  No markets bookmarked yet
                </h3>
                <p className="text-xs text-[#526357] leading-relaxed">
                  Browse through our local directory and tap the bookmark icon on any market to add it to your personal favorites.
                </p>
                <Link
                  to="/directory"
                  className="inline-block bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Browse Market Directory
                </Link>
              </div>
            ) : (
              <div>
                {/* Saved Markets Filter Toolbar */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ded8cb] mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bookmarkSearch}
                      onChange={(e) => setBookmarkSearch(e.target.value)}
                      placeholder="Search saved markets..."
                      className="text-xs bg-[#f9f7f2] border border-[#ded8cb] px-3 py-1.5 rounded-xl text-[#153e25] focus:outline-none"
                    />
                    {bookmarkSearch && (
                      <button onClick={() => setBookmarkSearch('')} className="text-xs text-[#ef4444] font-bold cursor-pointer">Clear</button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#153e25] mr-1">Area:</span>
                    {['All', ...new Set(savedMarkets.map((m) => m.neighborhood.split('/')[0].trim()))].map((a) => (
                      <button
                        key={a}
                        onClick={() => setBookmarkMarketArea(a)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer border ${
                          bookmarkMarketArea === a
                            ? 'bg-[#153e25] text-white border-[#153e25]'
                            : 'bg-[#f8fafc] text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSavedMarkets.map((market) => (
                  <div
                    key={market.id}
                    className="bg-white rounded-[16px] overflow-hidden border border-[#edf2f7] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-[#edf2f7]">
                        <img
                          src={market.image}
                          alt={market.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                          <span className="bg-[#153e25] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                            {market.status || 'Open this week'}
                          </span>
                          <span className="bg-white/90 text-[#1a2f1d] text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {market.schedule}
                          </span>
                        </div>

                        {/* Remove Bookmark Button */}
                        <button
                          onClick={() => toggleMarketBookmark(market.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#153e25] text-[#a3e635] hover:bg-[#1f5533] flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
                          title="Remove from bookmarks"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2.5">
                        <Link
                          to={`/market/${market.id}`}
                          className="block text-[17px] font-bold text-[#1a2f1d] hover:text-[#236338] transition-colors leading-snug line-clamp-1"
                        >
                          {market.name}
                        </Link>

                        <p className="text-[12px] font-medium text-[#718096] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2e6f40] shrink-0" />
                          <span>{market.neighborhood} • {market.distance}</span>
                        </p>

                        <p className="text-[12px] text-[#4a5568] line-clamp-2 leading-relaxed">
                          {market.description}
                        </p>

                        {/* Directions Link */}
                        <div className="pt-1">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(market.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2e6f40] hover:text-[#153e25] hover:underline"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Get Directions</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Shopping Note + View Details */}
                    <div className="p-4 pt-0 space-y-3">
                      {/* Attached Shopping Note */}
                      <div className="bg-[#fbf9f4] rounded-xl p-3 border border-[#ded8cb] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#153e25] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Edit3 className="w-3 h-3 text-[#2e6f40]" />
                            <span>Shopping Note:</span>
                          </span>
                          <button
                            onClick={() => handleEditNote(market.id)}
                            className="text-[#236338] hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            {sessionNotes[market.id] ? 'Edit' : 'Add Note'}
                          </button>
                        </div>

                        {editingId === market.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="e.g. Arrive early for fresh bread..."
                              rows={2}
                              className="w-full text-xs p-2 rounded-lg border border-[#c8d7cd] bg-white text-[#1a2b20] focus:ring-1 focus:ring-[#153e25]"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-[11px] px-2 py-0.5 text-[#526357] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNote(market.id)}
                                className="text-[11px] px-2.5 py-0.5 bg-[#153e25] text-white rounded font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[#3c5043] italic text-[11px] leading-relaxed">
                            {sessionNotes[market.id] || 'No notes added yet for this market.'}
                          </p>
                        )}
                      </div>

                      {/* Card Action Link */}
                      <div className="pt-2 border-t border-[#edf2f7] flex items-center justify-between">
                        <span className="text-[11px] text-[#718096] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2e6f40]" />
                          <span>{market.day}</span>
                        </span>
                        <Link
                          to={`/market/${market.id}`}
                          className="text-[12px] font-bold text-[#1e5230] hover:text-[#153e25] flex items-center gap-1 group"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Produce */}
        {activeTab === 'produce' && (
          <div>
            {savedProduce.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-[#edf2f7] shadow-xs space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#f4efe4] text-[#2e6f40] flex items-center justify-center mx-auto">
                  <Sprout className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#153e25]">
                  No seasonal crops bookmarked
                </h3>
                <p className="text-xs text-[#526357] leading-relaxed">
                  Browse our seasonal harvest guide and bookmark your favorite local fruits, vegetables, and herbs.
                </p>
                <Link
                  to="/produce"
                  className="inline-block bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Explore Product Guide
                </Link>
              </div>
            ) : (
              <div>
                {/* Saved Produce Filter Toolbar */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ded8cb] mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bookmarkSearch}
                      onChange={(e) => setBookmarkSearch(e.target.value)}
                      placeholder="Search saved produce..."
                      className="text-xs bg-[#f9f7f2] border border-[#ded8cb] px-3 py-1.5 rounded-xl text-[#153e25] focus:outline-none"
                    />
                    {bookmarkSearch && (
                      <button onClick={() => setBookmarkSearch('')} className="text-xs text-[#ef4444] font-bold cursor-pointer">Clear</button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#153e25] mr-1">Category:</span>
                    {['All', ...new Set(savedProduce.map((p) => p.category))].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBookmarkProduceCategory(c)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer border ${
                          bookmarkProduceCategory === c
                            ? 'bg-[#153e25] text-white border-[#153e25]'
                            : 'bg-[#f8fafc] text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSavedProduce.map((produce) => (
                  <div
                    key={produce.id}
                    className="bg-white rounded-3xl p-5 border border-[#edf2f7] shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={produce.image}
                          alt={produce.name}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[#e2dcd0]"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] bg-[#153e25] px-2 py-0.5 rounded-md inline-block mb-1">
                            {produce.category}
                          </span>
                          <h4 className="font-serif font-bold text-base text-[#153e25] truncate">
                            {produce.name}
                          </h4>
                          <p className="text-xs text-[#526357]">
                            {produce.seasonTag}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleProduceBookmark(produce.id)}
                          className="text-[#8ea093] hover:text-[#ef4444] p-1.5 rounded-lg cursor-pointer transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Recipe & Kitchen Note */}
                      <div className="mt-3 pt-2.5 border-t border-[#f0ebe0] text-xs">
                        {editingId === produce.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="e.g. Roast with sea salt and rosemary..."
                              rows={2}
                              className="w-full text-xs p-2 rounded-lg border border-[#c8d7cd] bg-white text-[#1a2b20]"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-[11px] px-2 py-0.5 text-[#526357] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNote(produce.id)}
                                className="text-[11px] px-2.5 py-0.5 bg-[#153e25] text-white rounded font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-[#3c5043] italic bg-[#f9f7f2] p-2 rounded-lg text-[11px] flex-1 mr-2 leading-relaxed">
                              {sessionNotes[produce.id] || 'No recipe note added.'}
                            </p>
                            <button
                              onClick={() => handleEditNote(produce.id)}
                              className="text-[#236338] hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
                            >
                              {sessionNotes[produce.id] ? 'Edit' : 'Add Note'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#edf2f7] flex items-center justify-between">
                      <button
                        onClick={() => setQuickViewProduce(produce)}
                        className="text-xs font-bold text-[#153e25] hover:text-[#236338] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Harvest Profile & Tips</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
