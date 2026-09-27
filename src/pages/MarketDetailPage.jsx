import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Bookmark,
  Share2,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  ExternalLink,
  Users,
  Edit3,
  BookmarkCheck,
  ArrowLeft,
  Copy,
  Check,
  Navigation,
  MessageCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import ProduceModal from '../components/ProduceModal';

const DAYS_OF_WEEK = [
  { key: 'Monday', short: 'MON', label: 'Mon' },
  { key: 'Tuesday', short: 'TUE', label: 'Tue' },
  { key: 'Wednesday', short: 'WED', label: 'Wed' },
  { key: 'Thursday', short: 'THU', label: 'Thu' },
  { key: 'Friday', short: 'FRI', label: 'Fri' },
  { key: 'Saturday', short: 'SAT', label: 'Sat' },
  { key: 'Sunday', short: 'SUN', label: 'Sun' }
];

function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export default function MarketDetailPage() {
  const { id } = useParams();
  const {
    selectedMarketId,
    setSelectedMarketId,
    navigateTo,
    isMarketBookmarked,
    toggleMarketBookmark,
    sessionNotes,
    updateSessionNote,
    showToast
  } = useApp();

  // Find active market by id parameter or fallback
  const market =
    marketsData.find((m) => m.id === id || m.slug === id) ||
    marketsData.find((m) => m.id === selectedMarketId) ||
    marketsData[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quickViewProduce, setQuickViewProduce] = useState(null);
  const [noteInput, setNoteInput] = useState(() => sessionNotes[market.id] || '');
  const [isSavedNote, setIsSavedNote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync selectedMarketId and note input when market changes
  useEffect(() => {
    if (market?.id) {
      if (setSelectedMarketId && market.id !== selectedMarketId) {
        setSelectedMarketId(market.id);
      }
      setNoteInput(sessionNotes[market.id] || '');
      setActiveImageIndex(0);
    }
  }, [market?.id, sessionNotes]);

  const bookmarked = isMarketBookmarked(market.id);
  const [produceCategoryFilter, setProduceCategoryFilter] = useState('All');
  const [growerFilter, setGrowerFilter] = useState('All');

  // Available produce items at this market
  const marketProduce = produceData.filter((p) => {
    if (!market.produceIds?.includes(p.id)) return false;
    if (produceCategoryFilter !== 'All' && p.category !== produceCategoryFilter) return false;
    return true;
  });

  // Filtered growers
  const filteredGrowers = (market.growers || []).filter((g) => {
    if (growerFilter === 'All') return true;
    return g.specialty.toLowerCase().includes(growerFilter.toLowerCase());
  });

  // Today's day name in English (e.g. Sunday)
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const getMarketShareUrl = () => {
    return `${window.location.origin}/market/${market.id}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getMarketShareUrl());
    setCopiedLink(true);
    showToast(`Direct market link copied to clipboard!`, 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(market.address);
    setCopiedAddress(true);
    showToast(`Market address copied to clipboard!`, 'success');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🌿 Check out ${market.name} (${market.schedule}) on FreshFind!\nAddress: ${market.address}\nExplore here: ${getMarketShareUrl()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(getMarketShareUrl());
    setCopiedLink(true);
    showToast('📸 Link copied! Opening Instagram to share...', 'success');
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank');
      setCopiedLink(false);
    }, 500);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getMarketShareUrl())}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Discover fresh seasonal farm produce at ${market.name} (${market.schedule}) on FreshFind!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getMarketShareUrl())}`, '_blank');
  };

  const handleSaveMarketNote = (e) => {
    e.preventDefault();
    updateSessionNote(market.id, noteInput.trim());
    setIsSavedNote(true);
    showToast('Shopping note saved to your personal planner!', 'success');
    setTimeout(() => setIsSavedNote(false), 2500);
  };

  // Determine hours for each day of the week
  const isDaily =
    market.day === 'Daily' ||
    (market.hours?.days && market.hours.days.includes('Daily')) ||
    (market.hours?.days && market.hours.days.length === 7);

  const getDaySchedule = (dayObj) => {
    const isOpen =
      isDaily ||
      (market.hours?.days && market.hours.days.includes(dayObj.key)) ||
      market.day === dayObj.key;

    const isToday = dayObj.key === todayName;

    let timeText = 'Closed';
    if (isOpen) {
      if (market.hours?.open && market.hours?.close) {
        timeText = `${formatTime12(market.hours.open)} – ${formatTime12(market.hours.close)}`;
      } else {
        timeText = market.schedule;
      }
    }

    return {
      isOpen,
      isToday,
      timeText
    };
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#153e25] hover:text-[#236338] transition-colors py-1.5 px-3 rounded-lg bg-white border border-[#edf2f7] shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#2e6f40]" />
            <span>Back to Market Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#718096] hidden sm:inline">
              Market ID: <code className="text-[#153e25] font-mono">{market.id}</code>
            </span>
          </div>
        </div>

        {/* Top Header Hero */}
        <div className="bg-white rounded-3xl border border-[#edf2f7] overflow-hidden shadow-sm">
          {/* Main Hero Gallery */}
          <div className="relative h-80 sm:h-[420px] w-full bg-[#153e25]">
            <img
              src={market.gallery ? market.gallery[activeImageIndex] : market.image}
              alt={market.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none"></div>

            {/* Badges & Actions */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center flex-wrap gap-2">
                <span className="bg-[#153e25]/95 backdrop-blur-xs text-[#a3e635] text-xs font-bold px-3 py-1 rounded-full border border-[#2e6d45]/60 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse"></span>
                  {market.status || 'Open this week'}
                </span>
                <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                  {market.neighborhood}
                </span>
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full">
                  {market.distance} away
                </span>
              </div>

              {/* Top Hero Actions: Quick Share & Bookmark */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#153e25] backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title="Share this market (WhatsApp, Instagram, Facebook)"
                  aria-label="Share this market"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleMarketBookmark(market.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    bookmarked
                      ? 'bg-[#153e25] text-[#a3e635] scale-105'
                      : 'bg-white/95 hover:bg-white text-[#1a2f1d] backdrop-blur-xs hover:text-[#153e25]'
                  }`}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this market'}
                  title={bookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title & Core Details on Hero bottom */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2.5">
              <div className="flex items-center flex-wrap gap-2">
                <span className="bg-[#a3e635] text-[#153e25] text-xs font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Verified Local Market
                </span>
                <span className="flex items-center gap-1 text-xs font-bold bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {market.rating} ({market.reviewCount} community reviews)
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {market.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-[#cbdcd0] pt-1">
                <span className="flex items-center gap-1.5 font-bold text-white bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-[#a3e635]" />
                  {market.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#a3e635] shrink-0" />
                  <span>{market.address}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#a3e635] shrink-0" />
                  <span>{market.vendorCount} certified farm stalls</span>
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {market.gallery && market.gallery.length > 1 && (
            <div className="p-3 bg-[#f7f5ed] border-t border-[#edf2f7] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#526357] uppercase tracking-wider px-2 shrink-0">
                Photos:
              </span>
              {market.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#153e25] ring-2 ring-[#a3e635]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: Overview, Weekly Schedule Grid, Produce Available, Growers, Amenities (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            
            {/* About Market Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf2f7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#153e25]">
                  About This Market
                </h2>
                <span className="text-xs bg-[#eef5f0] text-[#1c502d] font-bold px-3 py-1 rounded-full border border-[#cde2d3]">
                  Direct-from-Farm
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#3d5143] leading-relaxed">
                {market.description}
              </p>

              {/* Tag Pills */}
              <div className="pt-2 flex flex-wrap gap-2">
                {market.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#f4efe4] text-[#153e25] font-semibold px-3 py-1 rounded-xl border border-[#ded8cb]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule & Hours Grid (Monday - Sunday) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf2f7] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#153e25] flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#2e6f40]" />
                    <span>Weekly Opening Schedule & Hours</span>
                  </h2>
                  <p className="text-xs text-[#526357] mt-0.5">
                    Verified weekly operational timetable and open market days.
                  </p>
                </div>
                <span className="text-xs bg-[#153e25] text-[#a3e635] font-bold px-3 py-1 rounded-full w-fit">
                  {market.schedule}
                </span>
              </div>

              {/* 7-Day Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
                {DAYS_OF_WEEK.map((dayObj) => {
                  const schedule = getDaySchedule(dayObj);

                  return (
                    <div
                      key={dayObj.key}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[110px] ${
                        schedule.isToday
                          ? 'bg-[#153e25] text-white border-[#153e25] ring-2 ring-[#a3e635] shadow-md -translate-y-1'
                          : schedule.isOpen
                          ? 'bg-[#f4efe4] border-[#2e6f40]/30 text-[#153e25]'
                          : 'bg-[#faf8f5] border-[#edf2f7] text-[#8e9d92] opacity-80'
                      }`}
                    >
                      <div>
                        {/* Today indicator */}
                        {schedule.isToday && (
                          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#a3e635] mb-1">
                            Today
                          </span>
                        )}
                        <span className={`text-xs font-black tracking-wider block ${
                          schedule.isToday ? 'text-white' : schedule.isOpen ? 'text-[#153e25]' : 'text-[#8e9d92]'
                        }`}>
                          {dayObj.short}
                        </span>
                        <span className={`text-[10px] block font-medium ${
                          schedule.isToday ? 'text-white/80' : 'text-[#6b7280]'
                        }`}>
                          {dayObj.label}
                        </span>
                      </div>

                      <div className="pt-2">
                        {schedule.isOpen ? (
                          <div className="space-y-1">
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded block ${
                              schedule.isToday ? 'bg-[#a3e635] text-[#153e25]' : 'bg-[#153e25] text-white'
                            }`}>
                              OPEN
                            </span>
                            <span className={`text-[10px] block font-bold leading-tight ${
                              schedule.isToday ? 'text-white/95' : 'text-[#1c502d]'
                            }`}>
                              {schedule.timeText}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#a0aec0] block py-1">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timing Tip Box */}
              <div className="p-4 bg-[#fbf9f4] rounded-2xl border border-[#ded8cb] flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#2e6f40] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-[#153e25]">
                    Fresh Harvest Timing Tip:
                  </p>
                  <p className="text-[#526357] leading-relaxed">
                    Peak selection occurs in early morning hours between 8:00 AM – 10:30 AM when farm trucks unload the morning harvest. Arriving near closing time offers great deals on bulk crates!
                  </p>
                </div>
              </div>
            </div>

            {/* Available Seasonal Produce at this market */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf2f7] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#153e25] flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#2e6f40]" />
                    <span>Produce Available at this Market</span>
                  </h2>
                  <p className="text-xs text-[#526357] mt-0.5">
                    Click any seasonal crop for harvest timing, culinary pairings, and storage guidance.
                  </p>
                </div>
                <Link
                  to="/produce"
                  className="text-xs font-bold text-[#236338] hover:text-[#153e25] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Full Product Guide</span>
                  <span>➔</span>
                </Link>
              </div>

              {/* Product Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f0ebe0]">
                <span className="text-[11px] font-bold text-[#153e25] mr-1">Category:</span>
                {['All', 'Vegetables', 'Fruits', 'Herbs', 'Dairy & Cheese', 'Local Products'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProduceCategoryFilter(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer border ${
                      produceCategoryFilter === cat
                        ? 'bg-[#153e25] text-white border-[#153e25]'
                        : 'bg-[#f8fafc] text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {marketProduce.length === 0 ? (
                <p className="text-xs text-[#718096] italic p-4 bg-[#f9f7f2] rounded-xl">
                  No produce matched this filter category for this market.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {marketProduce.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setQuickViewProduce(p)}
                      className="p-3.5 bg-[#fbf9f4] hover:bg-white rounded-2xl border border-[#ded8cb] hover:border-[#153e25] shadow-xs transition-all cursor-pointer flex items-center gap-3.5 group hover:-translate-y-0.5"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#ded8cb]"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] bg-[#153e25] px-2 py-0.5 rounded-md inline-block">
                            {p.category}
                          </span>
                          <span className="text-[10px] text-[#2e6f40] font-bold">
                            {p.season}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#153e25] group-hover:text-[#236338] transition-colors truncate">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#526357] truncate mt-0.5">
                          {p.seasonTag}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meet the Featured Growers */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf2f7] shadow-xs space-y-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#153e25] flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#2e6f40]" />
                  <span>Featured Growers & Family Farms</span>
                </h2>
                <p className="text-xs text-[#526357] mt-0.5">
                  Smallholders certified to bring 100% locally cultivated produce to this market.
                </p>
              </div>

              {/* Grower Specialty Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f0ebe0]">
                <span className="text-[11px] font-bold text-[#153e25] mr-1">Specialty:</span>
                {['All', 'Vegetable', 'Herb', 'Fruit', 'Organic'].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setGrowerFilter(spec)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer border ${
                      growerFilter === spec
                        ? 'bg-[#153e25] text-white border-[#153e25]'
                        : 'bg-[#f8fafc] text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {filteredGrowers.length === 0 ? (
                <p className="text-xs text-[#718096] italic p-4 bg-[#f9f7f2] rounded-xl">
                  No growers matched this specialty filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredGrowers.map((grower, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#f8f6ef] rounded-2xl border border-[#ded8cb] flex items-center gap-3.5"
                  >
                    <img
                      src={grower.avatar}
                      alt={grower.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#153e25]">
                        {grower.name}
                      </h4>
                      <p className="text-xs text-[#236338] font-medium mt-0.5">
                        {grower.specialty}
                      </p>
                      <p className="text-[11px] text-[#6c8273] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#236338]" />
                        <span>{grower.location}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Market Amenities & Facilities */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf2f7] shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#153e25]">
                Visitor Amenities & Facilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {market.amenities?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs text-[#2e4233] font-medium p-2.5 bg-[#f4efe4] rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#236338] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Map, Get Directions, Bookmark, Social Sharing, Shopping Notes (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive Map & Directions Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#edf2f7] shadow-sm space-y-4 sticky top-24">
              
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#153e25] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#236338]" />
                  <span>Location & Map</span>
                </h3>
                <span className="text-xs bg-[#eef5f0] text-[#1e5230] font-bold px-2 py-0.5 rounded-md">
                  {market.distance}
                </span>
              </div>

              {/* Exact Address with Copy Button */}
              <div className="p-3 bg-[#fbf9f4] rounded-xl border border-[#ded8cb] flex items-start justify-between gap-2">
                <p className="text-xs text-[#334155] leading-relaxed">
                  {market.address}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="text-[#236338] hover:text-[#153e25] p-1 rounded-md shrink-0 cursor-pointer"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  {copiedAddress ? <Check className="w-4 h-4 text-[#2e6f40]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Map Canvas / Simulated Embed */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-[#ded8cb] shadow-inner bg-[#e5e0d4]">
                <iframe
                  title={`Map of ${market.name}`}
                  src={market.mapEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(market.address)}&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Get Driving Directions CTA */}
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(market.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer group"
                >
                  <Navigation className="w-4 h-4 text-[#a3e635] group-hover:rotate-12 transition-transform" />
                  <span>Get Driving Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Bookmark Market Toggle Button */}
              <div>
                <button
                  onClick={() => toggleMarketBookmark(market.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    bookmarked
                      ? 'bg-[#153e25] hover:bg-[#1a4a2c] text-[#a3e635]'
                      : 'bg-[#f4efe4] hover:bg-[#eae3d5] text-[#153e25] border border-[#ded8cb]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                  <span>{bookmarked ? 'Market Saved in Bookmarks' : 'Save Market to Bookmarks'}</span>
                </button>
              </div>

              {/* Social Sharing Buttons */}
              <div className="pt-3 border-t border-[#edf2f7] space-y-2">
                <label className="text-[11px] font-bold text-[#526357] uppercase tracking-wider block">
                  Share this Market
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={handleShareWhatsApp}
                    className="p-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Share via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25d366]" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={handleShareTwitter}
                    className="p-2 bg-black/5 hover:bg-black/10 text-[#0f1419] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Share on X / Twitter"
                  >
                    <span className="font-bold text-xs">𝕏</span>
                    <span>Post</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-[#f4efe4] hover:bg-[#e8e1d2] text-[#153e25] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-[#ded8cb]"
                    title="Copy Direct Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2e6f40]" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Temporary Shopping Notes for this market (LocalStorage) */}
              <div className="pt-3 border-t border-[#edf2f7] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#153e25] uppercase tracking-wider flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-[#236338]" />
                    <span>My Shopping Notes</span>
                  </label>
                  {isSavedNote && (
                    <span className="text-[11px] text-[#236338] font-bold flex items-center gap-1">
                      <BookmarkCheck className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveMarketNote} className="space-y-2">
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="e.g. Bring cash for farm eggs, ask Tariq for heirloom herbs, arrive by 9:00 AM..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl bg-[#f9f7f2] border border-[#ded8cb] focus:outline-none focus:ring-2 focus:ring-[#153e25] text-[#1a2b20]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    Save Note to LocalStorage
                  </button>
                </form>
              </div>

              {/* Market Contact Information */}
              <div className="pt-3 border-t border-[#edf2f7] space-y-2 text-xs text-[#4c5f52]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#236338]" />
                  <span className="font-medium text-[#1e2f24]">{market.contact?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#236338]" />
                  <span>{market.contact?.email}</span>
                </div>
                {market.contact?.manager && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#236338]" />
                    <span>Market Director: {market.contact.manager}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produce Quick View Modal */}
      {quickViewProduce && (
        <ProduceModal
          produce={quickViewProduce}
          onClose={() => setQuickViewProduce(null)}
        />
      )}

      {/* Share Market Popup Modal (WhatsApp, Instagram, Facebook) */}
      {isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-[#ded8cb] shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 space-y-5 font-sans relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#153e25] text-[#a3e635] flex items-center justify-center shadow-xs">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#153e25]">
                    Share this Market
                  </h3>
                  <p className="text-xs text-[#718096] truncate max-w-[220px] sm:max-w-xs">
                    {market.name} · {market.neighborhood}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Apps Grid: WhatsApp, Instagram, Facebook */}
            <div className="grid grid-cols-3 gap-3">
              {/* 1. WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="group p-3.5 sm:p-4 rounded-2xl border border-[#ded8cb] bg-[#fbf9f4] hover:bg-[#25D366] text-[#153e25] hover:text-white transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="font-bold text-xs">WhatsApp</span>
                <span className="text-[10px] text-[#718096] group-hover:text-white/90">Direct Chat</span>
              </button>

              {/* 2. Instagram */}
              <button
                type="button"
                onClick={handleShareInstagram}
                className="group p-3.5 sm:p-4 rounded-2xl border border-[#ded8cb] bg-[#fbf9f4] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-[#153e25] hover:text-white transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-[#E1306C] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="font-bold text-xs">Instagram</span>
                <span className="text-[10px] text-[#718096] group-hover:text-white/90">Story / DM</span>
              </button>

              {/* 3. Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="group p-3.5 sm:p-4 rounded-2xl border border-[#ded8cb] bg-[#fbf9f4] hover:bg-[#1877F2] text-[#153e25] hover:text-white transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-[#1877F2] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-bold text-xs">Facebook</span>
                <span className="text-[10px] text-[#718096] group-hover:text-white/90">Feed / Groups</span>
              </button>
            </div>

            {/* Direct Copy Link Bar */}
            <div className="pt-2 border-t border-[#f0ebe0] space-y-1.5">
              <label className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
                Or copy page link
              </label>
              <div className="flex items-center gap-2 bg-[#f4efe4] p-1.5 rounded-2xl border border-[#ded8cb]">
                <input
                  type="text"
                  readOnly
                  value={getMarketShareUrl()}
                  className="bg-transparent text-xs text-[#153e25] font-mono px-2 flex-1 focus:outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#a3e635]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
