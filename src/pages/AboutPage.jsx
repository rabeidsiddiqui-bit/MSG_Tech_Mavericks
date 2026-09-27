import React, { useState } from 'react';
import { Sprout, Users, ArrowRight, Award, Leaf, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AboutPage() {
  const { navigateTo } = useApp();
  const [valueFilter, setValueFilter] = useState('All');

  const coreValues = [
    {
      icon: <Sprout className="w-6 h-6 text-[#a3e635]" />,
      title: 'Keep It Local',
      desc: 'We prioritize small regional growers situated within a 100-mile radius. Short food chains mean unbeatably fresh produce, lower carbon emissions, and dollars staying inside community economies.'
    },
    {
      icon: <Target className="w-6 h-6 text-[#a3e635]" />,
      title: 'Make It Simple',
      desc: 'Finding when and where your local farmers market is running shouldn’t require scrolling through out-of-date social pages. We provide real-time verified schedules and live seasonal harvest tracking.'
    },
    {
      icon: <Users className="w-6 h-6 text-[#a3e635]" />,
      title: 'Grow Together',
      desc: 'Farmers markets are modern town squares. We support SNAP/EBT matching programs, community food donation drives, and educational chef demos so everyone can access nutritious harvest.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#a3e635]" />,
      title: 'Radical Freshness',
      desc: 'Produce picked within 24 to 48 hours tastes completely different from grocery stock picked green weeks prior. We celebrate living flavor, heirloom varieties, and biodiversity.'
    }
  ];

  const filteredValues = coreValues.filter((v) => {
    if (valueFilter === 'All') return true;
    return v.title.toLowerCase().includes(valueFilter.toLowerCase());
  });

  const milestones = [
    {
      year: '2024',
      title: 'FreshFind Founded',
      description: 'Started as a weekend volunteer mapping project among urban food gardeners and coastal farmers.'
    },
    {
      year: '2026',
      title: 'Regional Network Launch',
      description: 'Expanded across 18 regional farmers markets, introducing live harvest availability tracking.'
    },
    {
      year: '2026',
      title: '34 Markets & SNAP Matching',
      description: 'Now supporting over 120 certified smallholders with 10,000+ weekly shoppers discovering local harvest.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Mission Statement Hero */}
        <div className="bg-[#153e25] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#235836] border border-[#3b7d52] px-4 py-1.5 rounded-full text-xs font-semibold text-[#a3e635]">
            <Leaf className="w-3.5 h-3.5" />
            <span>Our Core Philosophy</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            "Good food should connect us."
          </h1>

          <p className="text-sm sm:text-lg text-[#c5ded0] max-w-2xl mx-auto leading-relaxed font-light">
            FreshFind was created on a simple conviction: when people know who grew their food and eat what is naturally in season, communities become healthier, more resilient, and deeply connected.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#236338]">
              The Story Behind FreshFind
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#153e25]">
              Bridging the gap between rural soil and urban tables.
            </h2>
            <p className="text-sm text-[#4b5f52] leading-relaxed">
              Industrial grocery supply chains travel an average of 1,500 miles before landing on a supermarket shelf. In that journey, crops are selected for transport durability rather than flavor, nutrition, or ripeness.
            </p>
            <p className="text-sm text-[#4b5f52] leading-relaxed">
              Yet right outside our cities, multi-generational family farms and organic smallholders cultivate incredible heirloom tomatoes, hand-churned goat cheeses, stone-milled sourdough, and fragrant mountain honeys. FreshFind makes those treasures effortlessly discoverable.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('directory')}
                className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Find Your Local Market</span>
                <ArrowRight className="w-4 h-4 text-[#a3e635]" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#e8e4dc]">
              <img
                src="/images/about-farmer.jpg"
                alt="Farmer displaying fresh harvest"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#f4efe4] border border-[#ded8cb] p-4 rounded-2xl shadow-lg max-w-xs hidden sm:block">
              <span className="font-serif text-2xl font-bold text-[#153e25] block">
                120+ Farms
              </span>
              <span className="text-xs text-[#526357]">
                Supported directly without distributor markups.
              </span>
            </div>
          </div>
        </div>

        {/* Core Values Cards */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#236338]">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#153e25]">
              Our Guiding Principles
            </h2>
          </div>

          {/* Principle Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'Keep It Local', 'Make It Simple', 'Grow Together', 'Radical Freshness'].map((p) => (
              <button
                key={p}
                onClick={() => setValueFilter(p)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
                  valueFilter === p
                    ? 'bg-[#153e25] text-white border-[#153e25] shadow-xs'
                    : 'bg-white text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#ded8cb] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#153e25] flex items-center justify-center shadow-xs">
                  {val.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#153e25]">
                  {val.title}
                </h3>
                <p className="text-xs text-[#526357] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Highlights Timeline */}
        <div className="bg-[#f4efe4] rounded-3xl p-8 sm:p-12 border border-[#ded8cb] space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#236338]">
              Growth & Community Impact
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#153e25]">
              Launch Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#ded8cb] space-y-2 shadow-xs"
              >
                <span className="font-serif text-2xl font-bold text-[#236338]">
                  {m.year}
                </span>
                <h4 className="font-serif text-base font-bold text-[#153e25]">
                  {m.title}
                </h4>
                <p className="text-xs text-[#526357] leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
