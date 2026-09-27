import React, { useState } from 'react';
import { X, Sprout, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, loginUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = name.trim() || (email ? email.split('@')[0] : 'Harvest Friend');
    loginUser({
      name: displayName,
      email: email || 'shopper@freshfind.org',
      loggedIn: true
    });
  };

  const handleGuestLogin = () => {
    loginUser({
      name: 'Community Shopper',
      email: 'guest@freshfind.org',
      loggedIn: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        ></div>

        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#fcfbf7] border border-[#ded8cb] shadow-2xl rounded-3xl z-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#eee8db]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#153e25] text-[#a3e635] flex items-center justify-center">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif text-xl font-bold text-[#153e25]">FreshFind Account</span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 rounded-lg text-[#8e9f93] hover:text-[#153e25] hover:bg-[#ede7da] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          
          <div className="flex bg-[#ede7da] p-1 rounded-xl my-5">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#153e25] shadow-xs'
                  : 'text-[#64796b] hover:text-[#153e25]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-[#153e25] shadow-xs'
                  : 'text-[#64796b] hover:text-[#153e25]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#324538] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8ea093] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    required
                    className="w-full bg-white border border-[#ded8cb] text-sm pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e25]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#324538] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8ea093] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  required
                  className="w-full bg-white border border-[#ded8cb] text-sm pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e25]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#324538] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8ea093] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[#ded8cb] text-sm pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e25]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#153e25] hover:bg-[#236338] text-white font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{authMode === 'login' ? 'Sign In to FreshFind' : 'Join FreshFind Community'}</span>
              <ArrowRight className="w-4 h-4 text-[#a3e635]" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#eee8db] text-center">
            <button
              onClick={handleGuestLogin}
              className="text-xs text-[#236338] font-semibold hover:underline cursor-pointer"
            >
              Continue as Guest Shopper ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
