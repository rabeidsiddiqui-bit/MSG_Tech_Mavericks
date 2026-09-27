import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function Footer() {
  const { navigateTo, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubscribed(true);
    showToast('You are subscribed to weekly local harvest updates!', 'success');
    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.9 },
        colors: ['#a3e635', '#ffffff', '#236338']
      });
    } catch {
     
    }
  };

  return (
    <footer className="bg-[#153e25] text-white pt-14 pb-8 border-t border-[#1b4d2e] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#215433]">
          
          <div className="lg:col-span-4 space-y-3">
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <img
                src="/logo-white.png"
                alt="FreshFind Logo"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>

            <p className="text-[13px] text-white/75 leading-relaxed max-w-sm">
              FreshFind connects local neighborhoods directly with regional family farms, seasonal bachat bazars, and organic growers in Malir. Real food, zero middlemen, and genuine neighborhood taste.
            </p>
          </div>

          
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[12px] font-bold text-[#a3e635] uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-[13px] text-white/80">
              <li>
                <button
                  onClick={() => navigateTo('find-market')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Find Market
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('directory')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Market Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('produce')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Product Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('seasonal-recommendations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Seasonal Recommendations
                </button>
              </li>
            </ul>
          </div>

          
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[12px] font-bold text-[#a3e635] uppercase tracking-wider">
              FreshFind
            </h4>
            <ul className="space-y-2 text-[13px] text-white/80">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact us
                </button>
              </li>
            </ul>
          </div>

        
          <div className="lg:col-span-4 space-y-3 bg-[#18462b] p-5 rounded-[12px] border border-[#225736]">
            <div>
              <h3 className="text-sm font-bold text-white">
                A fresh local update, once a week.
              </h3>
              <p className="text-[12px] text-white/75 mt-0.5">
                Market operating hours, seasonal arrivals, and community harvest tips directly to your inbox.
              </p>
            </div>

            {isSubscribed ? (
              <div className="bg-[#153e25] border border-[#a3e635]/40 rounded-lg p-3 flex items-center gap-2.5 text-xs text-white">
                <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                <span>You're on the list for weekly local updates!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full bg-[#153e25] border border-[#28603c] text-white text-[13px] pl-9 pr-3 py-2 rounded-lg placeholder-white/45 focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#a3e635] hover:bg-[#bef264] text-[#153e25] font-semibold text-[13px] py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Subscribe to harvest updates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright bar: "© 2026 FreshFind. Grown with care for local communities. Privacy - Accessibility" */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/70">
          <p>
            © 2026 FreshFind. Grown with care for local communities.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors cursor-pointer">
              Privacy
            </button>
            <span>-</span>
            <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors cursor-pointer">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
