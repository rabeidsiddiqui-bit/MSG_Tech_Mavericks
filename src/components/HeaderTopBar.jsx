import React, { useState, useEffect } from 'react';
import { Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HeaderTopBar() {
  const {
    setIsAuthModalOpen,
    setAuthMode,
    currentUser,
    logoutUser
  } = useApp();

  // Format helper for 12-hour format with seconds (HH:MM:SS AM/PM)
  const formatTime = (date = new Date()) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Real-time digital clock updating every second
  const [currentTime, setCurrentTime] = useState(() => formatTime());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatTime());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated live visitor counter: e.g. "005867 visitors"
  const [visitorCount, setVisitorCount] = useState(5867);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.45) {
        setVisitorCount((prev) => prev + (Math.random() > 0.7 ? 2 : 1));
      }
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#153e25] text-white text-[12px] py-1.5 px-4 sm:px-8 border-b border-[#1b4d2e] relative z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Real-time digital clock */}
        <div className="flex items-center gap-1.5 font-medium text-white/95">
          <Clock className="w-3.5 h-3.5 text-white/90" />
          <span className="tabular-nums tracking-wide">{currentTime}</span>
        </div>

        {/* Right: Live visitor counter, Log in, Sign up button */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-1.5 text-white/95 font-medium">
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635]"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-white/90" />
            <span className="tracking-wide font-mono text-[11px] sm:text-[12px]">
              {String(visitorCount).padStart(6, '0')} visitors
            </span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-white/90 font-medium">Hi, {currentUser.name}</span>
              <button
                onClick={logoutUser}
                className="text-white/70 hover:text-white underline text-[11px] cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-white/95 hover:text-white font-medium cursor-pointer transition-opacity hover:opacity-85"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="border border-white/90 text-white hover:bg-white hover:text-[#153e25] px-3 py-0.5 rounded text-[12px] font-semibold transition-all cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
