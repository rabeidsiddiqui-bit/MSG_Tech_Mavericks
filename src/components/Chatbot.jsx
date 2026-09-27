import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, RefreshCw, HelpCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import chatbotData from '../data/chatbotRules.json';

const POPULAR_FAQS = [
  { label: '🌿 Markets in Malir', query: 'What markets are located in Malir?' },
  { label: '📅 Sunday Bachat Bazars', query: 'Which markets are open on Sunday?' },
  { label: '🍅 Find Heirloom Tomatoes', query: 'Where can I buy fresh organic tomatoes?' },
  { label: '💳 Payment & Cash / Wallets', query: 'Do markets accept EasyPaisa or JazzCash?' },
  { label: '🍯 Organic Honey & Herbs', query: 'Where can I find organic honey and fresh herbs?' },
  { label: '🌱 How to list my farm', query: 'How can a local farmer list their stall?' }
];

export default function Chatbot() {
  const { navigateTo, setSearchFilters, setIsBookmarksOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: chatbotData.welcome.greeting + '\n\n' + chatbotData.welcome.intro,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const messageCounterRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleOpenToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setHasUnread(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.page === 'directory') {
      if (action.filter === 'snap') {
        setSearchFilters(prev => ({ ...prev, query: 'SNAP' }));
      } else if (action.filter === 'malir') {
        setSearchFilters(prev => ({ ...prev, query: 'Malir', area: 'All' }));
      }
      navigateTo('directory');
      setIsOpen(false);
    } else if (action.page === 'produce') {
      navigateTo('produce');
      setIsOpen(false);
    } else if (action.page === 'bookmarks') {
      setIsBookmarksOpen(true);
      setIsOpen(false);
    } else if (action.page === 'contact') {
      navigateTo('contact');
      setIsOpen(false);
    }
  };

  const processUserQuery = (queryText) => {
    const userMsg = {
      id: `user-${++messageCounterRef.current}`,
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    const lower = queryText.toLowerCase().trim();
    let matchedRule = null;

    for (const rule of chatbotData.rules) {
      const match = rule.keywords.some(kw => lower.includes(kw.toLowerCase()));
      if (match) {
        matchedRule = rule;
        break;
      }
    }

    setTimeout(() => {
      let botResponse;

      if (matchedRule) {
        botResponse = {
          id: `bot-${++messageCounterRef.current}`,
          sender: 'bot',
          isError: false,
          text: matchedRule.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionLink: matchedRule.actionLink
        };
      } else {
        botResponse = {
          id: `bot-${++messageCounterRef.current}`,
          sender: 'bot',
          isError: true,
          text: chatbotData.fallback.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionLink: {
            text: 'Browse Market Directory ➔',
            page: 'directory'
          }
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 550);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    processUserQuery(inputMessage);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: chatbotData.welcome.greeting + '\n\n' + chatbotData.welcome.intro,
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="bg-[#fcfbf7] w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] rounded-3xl shadow-2xl border border-[#ded8cb] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#153e25] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#a3e635] text-[#153e25] flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                  FreshFind Assistant
                  <span className="w-2 h-2 rounded-full bg-[#a3e635] inline-block animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-[#b9d5c2]">
                  Live Malir Harvest & Market Helper
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-[#b8d2c1] hover:text-white hover:bg-[#235836] transition-colors cursor-pointer"
                title="Restart chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#b8d2c1] hover:text-white hover:bg-[#235836] transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages History Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbf9f4]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#153e25] text-white rounded-br-xs shadow-xs'
                      : msg.isError
                      ? 'bg-[#fff7f5] text-[#991b1b] rounded-bl-xs border-2 border-[#fca5a5] shadow-xs'
                      : 'bg-white text-[#19271e] rounded-bl-xs border border-[#e2dcd0] shadow-xs'
                  }`}
                >
                  {msg.isError && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] mb-1.5 pb-1 border-b border-[#fecaca]">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                      <span>Market & Harvest Scope Guide</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Contextual Action Link */}
                  {msg.actionLink && (
                    <button
                      onClick={() => handleActionClick(msg.actionLink)}
                      className="mt-3 inline-flex items-center gap-1.5 bg-[#153e25] hover:bg-[#236338] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <span>{msg.actionLink.text}</span>
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-[#86998c] mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white text-[#153e25] border border-[#ded8cb] px-3.5 py-2 rounded-2xl w-fit shadow-xs">
                <span className="text-xs text-[#526a5a] font-medium">Assistant is looking up harvest data</span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-[#236338] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#236338] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#236338] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* FAQs Container Set Directly Above the Chat Input Field */}
          <div className="bg-[#f5f1e6] border-t border-[#ded8cb] p-2.5">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-bold text-[#153e25] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#2e6f40]" />
                <span>Frequently Asked Questions:</span>
              </span>
              <span className="text-[10px] text-[#718096]">Tap to ask</span>
            </div>

            {/* Scrollable / Wrap FAQ Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {POPULAR_FAQS.map((faq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => processUserQuery(faq.query)}
                  className="shrink-0 text-xs bg-white hover:bg-[#153e25] hover:text-white text-[#1c502d] font-semibold px-3 py-1.5 rounded-full border border-[#ded8cb] shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  {faq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#ded8cb] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about markets, produce, days..."
              className="flex-1 bg-[#f7f5ed] border border-[#e0dad0] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl text-[#1a2b20] placeholder-[#7d9183] focus:outline-none focus:ring-2 focus:ring-[#153e25] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-xl bg-[#153e25] hover:bg-[#236338] disabled:opacity-40 disabled:hover:bg-[#153e25] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-[#a3e635]" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleOpenToggle}
        className={`w-14 h-14 rounded-full bg-[#153e25] hover:bg-[#236338] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-2 border-[#a3e635] cursor-pointer relative ${
          isOpen ? 'rotate-90' : ''
        }`}
        aria-label="Toggle FreshFind Assistant Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-[#a3e635]" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                1
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
