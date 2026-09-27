import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Flame,
  Award,
  Sprout,
  Bookmark,
  ArrowRight,
  MapPin,
  CheckCircle2,
  ChefHat,
  Apple,
  Carrot,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import produceData from '../data/produce.json';
import marketsData from '../data/markets.json';
import ProduceModal from '../components/ProduceModal';

export default function SeasonalRecommendationsPage() {
  const {
    isProduceBookmarked,
    toggleProduceBookmark,
    navigateTo,
    showToast
  } = useApp();

  const [activeSeason, setActiveSeason] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRecipeDifficulty, setActiveRecipeDifficulty] = useState('All');
  const [selectedProduce, setSelectedProduce] = useState(null);

  const seasonsList = [
    { id: 'All', label: 'All In-Season Picks' },
    { id: 'summer', label: 'Summer Peak' },
    { id: 'fall', label: 'Autumn / Fall Harvest' },
    { id: 'spring', label: 'Spring Specials' },
    { id: 'all-year', label: 'Year-Round Staples' }
  ];

  const categoriesList = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Local Products'];

  const filteredPicks = useMemo(() => {
    return produceData.filter((item) => {
      if (activeSeason !== 'All') {
        if (activeSeason === 'all-year') {
          if (item.seasonKey !== 'all-year') return false;
        } else if (item.seasonKey !== activeSeason && item.seasonKey !== 'all-year') {
          return false;
        }
      }
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      return true;
    });
  }, [activeSeason, activeCategory]);

  // Chef recipe inspirations
  const recipeInspirations = [
    {
      title: 'Fresh Malir Coriander & Pudina Chutney',
      heroCrop: 'Garden Herbs (Pudina & Coriander)',
      prepTime: '10 Mins',
      difficulty: 'Easy',
      desc: 'Stone-ground fresh mint, coriander leaves, green chilies, cumin, and rock salt. The quintessential fresh condiment for Sunday bachat market snacks.',
      produceId: 'produce-3'
    },
    {
      title: 'Heirloom Tomato & Buffalo Feta Bruschetta',
      heroCrop: 'Heirloom Tomatoes',
      prepTime: '15 Mins',
      difficulty: 'Easy',
      desc: 'Thick slices of vine-ripened tomatoes tossed in cold-pressed extra virgin oil, coarse sea salt, and crumbled local farm cheese on toasted bread.',
      produceId: 'produce-1'
    },
    {
      title: 'Roasted Rainbow Carrots with Sidr Honey Glaze',
      heroCrop: 'Rainbow Carrots',
      prepTime: '25 Mins',
      difficulty: 'Medium',
      desc: 'Tender purple and golden carrots roasted at high heat with crushed cumin seeds and finished with raw mountain Sidr honey from Kirthar.',
      produceId: 'produce-2'
    }
  ];

  const filteredRecipes = useMemo(() => {
    if (activeRecipeDifficulty === 'All') return recipeInspirations;
    return recipeInspirations.filter(
      (r) => r.difficulty.toLowerCase() === activeRecipeDifficulty.toLowerCase()
    );
  }, [activeRecipeDifficulty]);

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Banner */}
        <div className="bg-[#153e25] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#235836]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#2e6f40] px-3.5 py-1 rounded-full text-xs font-bold text-[#a3e635] border border-[#3e8a54]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seasonal Harvest Recommendations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Eat with the seasons.<br />
              <span className="text-[#a3e635]">Taste the peak of freshness.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Discover what local farmers are harvesting right now across the Malir agricultural greenbelt. Fruits and vegetables picked at biological maturity contain the highest nutrient density, unmatched aroma, and zero cold-storage aging.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none select-none hidden lg:block">
            <img
              src="/logo-white.png"
              alt="FreshFind logo watermark"
              className="w-full h-full object-contain p-6"
            />
          </div>
        </div>

        {/* Season & Category Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-[#ded8cb] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#153e25] mr-2">Season:</span>
            {seasonsList.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeSeason === season.id
                    ? 'bg-[#153e25] text-white border-[#153e25] shadow-xs'
                    : 'bg-[#f4efe4] text-[#526357] border-[#ded8cb] hover:border-[#153e25] hover:text-[#153e25]'
                }`}
              >
                {season.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#f0ebe0]">
            <span className="text-xs font-bold text-[#153e25] mr-2">Category:</span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-[#2e6f40] text-white border-[#2e6f40] shadow-xs'
                    : 'bg-[#fcfbf7] text-[#526357] border-[#ded8cb] hover:bg-[#f4efe4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Produce Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#153e25]">
                Peak Harvest Picks ({filteredPicks.length})
              </h2>
              <p className="text-xs text-[#526357] mt-0.5">
                Verified crops arriving fresh this week at community bachat bazars.
              </p>
            </div>

            <Link
              to="/produce"
              className="text-xs font-bold text-[#2e6f40] hover:text-[#153e25] hover:underline"
            >
              View Full Product Guide ➔
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPicks.map((crop) => {
              const bookmarked = isProduceBookmarked(crop.id);
              // Find matching markets that carry this crop
              const availableMarkets = marketsData.filter(m => crop.marketIds?.includes(m.id));

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-3xl border border-[#edf2f7] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Image & Quick Badges */}
                    <div className="relative h-48 w-full bg-[#f4efe4] overflow-hidden">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-[#153e25] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {crop.category}
                        </span>
                        <span className="bg-[#a3e635] text-[#153e25] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          {crop.seasonTag}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProduceBookmark(crop.id);
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          bookmarked
                            ? 'bg-[#153e25] text-[#a3e635]'
                            : 'bg-white/90 hover:bg-white text-[#4a5568] hover:text-[#153e25]'
                        }`}
                        aria-label="Bookmark crop"
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#153e25] group-hover:text-[#2e6f40] transition-colors">
                          {crop.name}
                        </h3>
                        <p className="text-[11px] font-mono text-[#718096] italic">
                          {crop.botanicalName}
                        </p>
                      </div>

                      <p className="text-xs text-[#526357] line-clamp-2 leading-relaxed">
                        {crop.shortDescription || crop.description}
                      </p>

                      {/* Nutritional Highlights */}
                      <div className="pt-1 flex flex-wrap gap-1">
                        {crop.nutrition?.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#f4efe4] text-[#153e25] font-semibold px-2 py-0.5 rounded-md border border-[#ded8cb]"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>

                      {/* Where to find it */}
                      {availableMarkets.length > 0 && (
                        <div className="pt-2 text-[11px] text-[#4a5568]">
                          <span className="font-bold text-[#153e25] flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-[#2e6f40]" />
                            <span>Available at:</span>
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {availableMarkets.map(m => (
                              <Link
                                key={m.id}
                                to={`/market/${m.id}`}
                                className="bg-[#f0f4f1] text-[#1c502d] hover:bg-[#153e25] hover:text-white px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                              >
                                {m.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 pt-0 border-t border-[#edf2f7] mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProduce(crop)}
                      className="text-xs font-bold text-[#153e25] hover:text-[#2e6f40] hover:underline flex items-center gap-1 cursor-pointer pt-3"
                    >
                      <span>Harvest Tips & Storage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef Recipe & Culinary Inspiration Section */}
        <div className="bg-[#f4efe4] rounded-3xl p-8 sm:p-12 border border-[#ded8cb] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e6f40] uppercase tracking-wider mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Farm to Table Culinary Inspirations</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153e25]">
                What to Cook with This Week's Harvest
              </h2>
            </div>
            <Link
              to="/directory"
              className="bg-[#153e25] hover:bg-[#2e6f40] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              Shop Fresh Ingredients ➔
            </Link>
          </div>

          {/* Recipe Difficulty Filter Tabs */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#ded8cb]">
            <span className="text-xs font-bold text-[#153e25] mr-1">Recipe Level:</span>
            {['All', 'Easy', 'Medium'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveRecipeDifficulty(lvl)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer border ${
                  activeRecipeDifficulty === lvl
                    ? 'bg-[#153e25] text-white border-[#153e25]'
                    : 'bg-white text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                }`}
              >
                {lvl === 'All' ? 'All Recipes' : `${lvl} Recipes`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#ded8cb] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#718096] mb-1">
                    <span className="font-bold text-[#2e6f40] bg-[#eef5f0] px-2 py-0.5 rounded">
                      {recipe.heroCrop}
                    </span>
                    <span>{recipe.prepTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#153e25]">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-[#526357] leading-relaxed mt-2">
                    {recipe.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#edf2f7] flex items-center justify-between text-xs">
                  <span className="text-[#8e9d92]">Difficulty: {recipe.difficulty}</span>
                  <button
                    onClick={() => {
                      const produceItem = produceData.find(p => p.id === recipe.produceId);
                      if (produceItem) setSelectedProduce(produceItem);
                    }}
                    className="font-bold text-[#2e6f40] hover:underline cursor-pointer"
                  >
                    View Harvest Profile ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Storage & Freshness Guide */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#edf2f7] shadow-xs space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#153e25]">
              Farm-Fresh Storage Rules
            </h2>
            <p className="text-xs text-[#526357] mt-1">
              Store your harvest properly to extend freshness by up to 2 weeks without losing natural moisture or flavor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edf2f7] space-y-2">
              <span className="text-xl">🍅</span>
              <h4 className="font-serif font-bold text-sm text-[#153e25]">Tomatoes</h4>
              <p className="text-xs text-[#526357] leading-relaxed">
                Always countertop at room temperature! Cold destroys aromatic volatile sugars.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edf2f7] space-y-2">
              <span className="text-xl">🌿</span>
              <h4 className="font-serif font-bold text-sm text-[#153e25]">Garden Herbs</h4>
              <p className="text-xs text-[#526357] leading-relaxed">
                Trim stems and keep upright like flowers in a glass of water on your kitchen counter.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edf2f7] space-y-2">
              <span className="text-xl">🥕</span>
              <h4 className="font-serif font-bold text-sm text-[#153e25]">Root Vegetables</h4>
              <p className="text-xs text-[#526357] leading-relaxed">
                Remove leafy tops immediately so they don’t draw moisture. Store roots in crisper.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edf2f7] space-y-2">
              <span className="text-xl">🍓</span>
              <h4 className="font-serif font-bold text-sm text-[#153e25]">Berries & Fruits</h4>
              <p className="text-xs text-[#526357] leading-relaxed">
                Do not wash until immediately before eating. Moisture accelerates mold growth.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Produce Modal */}
      {selectedProduce && (
        <ProduceModal
          produce={selectedProduce}
          onClose={() => setSelectedProduce(null)}
        />
      )}
    </div>
  );
}
