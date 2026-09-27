import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  ExternalLink,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const { showToast } = useApp();

  const [topRightAlert, setTopRightAlert] = useState(null);
  const alertTimerRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    inquiryType: 'Shopper / Community',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [locationCopied, setLocationCopied] = useState(false);
  const showAlert = (message, title = 'Misinformation Alert') => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }
    setTopRightAlert({
      message,
      title,
      id: Date.now()
    });
    alertTimerRef.current = setTimeout(() => {
      setTopRightAlert(null);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  // Field validation rules
  const validateField = (field, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (field === 'name') {
      if (!trimmed) {
        error = 'Your name is required.';
      } else if (/\d/.test(trimmed)) {
        error = 'Name field cannot contain numbers or digits.';
      } else if (trimmed.length < 3) {
        error = 'Name must be at least 3 characters.';
      } else if (!/^[a-zA-Z\s'.]+$/.test(trimmed)) {
        error = 'Name should only contain letters and spaces.';
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!trimmed) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Please enter a valid email address (e.g. name@example.com).';
      }
    }

    if (field === 'inquiryType') {
      if (!trimmed) {
        error = 'Please select an inquiry category.';
      }
    }

    if (field === 'subject') {
      if (!trimmed) {
        error = 'Subject line is required.';
      } else if (trimmed.length < 5) {
        error = 'Subject must be at least 5 characters.';
      }
    }

    if (field === 'message') {
      if (!trimmed) {
        error = 'Message is required.';
      } else if (trimmed.length < 15) {
        error = 'Message must be at least 15 characters describing your question.';
      }
    }

    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));

    if (field === 'name' && /\d/.test(form.name)) {
      showAlert(
        'Name field me numbers allowed nahi hain! Barah-e-karam apna sahi naam likhein.',
        'Misinformation Alert'
      );
    } else if (error) {
      showAlert(error, 'Validation Alert');
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Instant misinformation alert if user types numbers into the name field
    if (field === 'name' && /\d/.test(value)) {
      showAlert(
        'Name field me numbers allowed nahi hain! Sirf alphabetic letters darj karein.',
        'Misinformation Alert'
      );
    }

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      inquiryType: true,
      subject: true,
      message: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateAll();

    if (!isValid) {
      if (form.name && /\d/.test(form.name)) {
        showAlert(
          'Name field me number likha gaya hai! Barah-e-karam apna sahi naam darj karein.',
          'Misinformation Detected'
        );
      } else if (!form.name.trim()) {
        showAlert('Barah-e-karam apna naam enter karein.', 'Required Field Missing');
      } else if (errors.email || !form.email.trim()) {
        showAlert('Sahi email address darj karein (e.g. name@example.com).', 'Invalid Email');
      } else {
        const firstErrKey = Object.keys(form).find((key) => validateField(key, form[key]));
        showAlert(
          firstErrKey ? validateField(firstErrKey, form[firstErrKey]) : 'Form me ghalat maloomat hain, barah-e-karam theek karein.',
          'Misinformation Alert'
        );
      }
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setSubmitted(true);
    showToast('🌱 Message received! A FreshFind team member will reply within 24 hours.', 'success');
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#153e25', '#a3e635', '#2e6f40']
      });
    } catch {
      // ignore
    }
  };

  // Malir Hub Location Details
  const marketLocation = {
    name: 'FreshFind Central Malir Agricultural Hub',
    address: 'Main National Highway near Kala Board & Malir River Greenbelt, Malir, Karachi',
    lat: 24.8967,
    lng: 67.1947,
    mapUrl: 'https://maps.google.com/?q=24.8967,67.1947'
  };

  const handleShareMarketLocation = () => {
    const shareText = `📍 Visit ${marketLocation.name}!\nAddress: ${marketLocation.address}\nGoogle Maps: ${marketLocation.mapUrl}`;

    if (navigator.share) {
      navigator.share({
        title: marketLocation.name,
        text: shareText,
        url: marketLocation.mapUrl
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareText);
      setLocationCopied(true);
      showToast('📍 Market location link copied to clipboard!', 'success');
      setTimeout(() => setLocationCopied(false), 2500);
    }
  };

  const shareTextEncoded = encodeURIComponent(`📍 FreshFind Malir Market Location: ${marketLocation.address} - Explore: ${marketLocation.mapUrl}`);

  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');

  const faqs = [
    {
      category: 'Growers',
      q: 'How can a local farmer or artisanal producer list their market on FreshFind?',
      a: 'We welcome certified smallholders, urban farms, and cooperative farmers markets in Malir! Select "Farmer / Market Listing Request" in our inquiry form or email directory@freshfind.pk. Our agricultural advisory team verifies your grower credentials and uploads your schedule within 48 hours.'
    },
    {
      category: 'Produce',
      q: 'Are all markets listed on FreshFind organic?',
      a: 'While over 80% of our listed markets feature pesticide-free or transitional organic growers, we also champion traditional low-intervention regenerative smallholders who harvest daily without industrial cold storage.'
    },
    {
      category: 'Payment',
      q: 'What payment methods do local stallholders accept?',
      a: 'Most vendors accept Cash, EasyPaisa, and JazzCash. Higher-volume stalls in Malir Cantt and Model Colony also accept debit cards and online bank transfers.'
    },
    {
      category: 'Community',
      q: 'Can I volunteer with FreshFind or at local market hubs?',
      a: 'Yes! Volunteers help with zero-waste composting stations, bilingual translation navigators, and senior produce bag delivery programs. Reach out via the contact form to join our volunteer guild.'
    },
    {
      category: 'Timing',
      q: 'What is the best time of day to visit weekly bachat bazars in Malir?',
      a: 'Early morning between 8:00 AM and 10:30 AM is ideal when farm trucks unload fresh dawn harvests from Malir River basin farms.'
    },
    {
      category: 'Produce',
      q: 'How do I check which fruits and vegetables are in season right now?',
      a: 'Visit our Product Guide and Seasonal Recommendations pages to view real-time ripening calendars and market stall availability.'
    }
  ];

  const filteredFaqs = faqs.filter((f) => {
    if (faqCategoryFilter === 'All') return true;
    return f.category === faqCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* 3-Second Top-Right Alert Popup */}
      {topRightAlert && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-5 right-5 z-[99999] max-w-sm sm:max-w-md w-[92vw] bg-white border-2 border-[#ef4444] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 fade-in duration-300"
          style={{ boxShadow: '0 20px 30px -10px rgba(239, 68, 68, 0.4)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#ef4444] flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-xs font-extrabold text-[#b91c1c] uppercase tracking-wider">
                  {topRightAlert.title}
                </h5>
                <span className="text-[10px] font-bold bg-red-100 text-[#b91c1c] px-2 py-0.5 rounded-full shrink-0">
                  3s Auto-dismiss
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1f2937] leading-relaxed mt-1">
                {topRightAlert.message}
              </p>
            </div>
            <button
              onClick={() => setTopRightAlert(null)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Animated 3-second progress indicator bar */}
          <div className="mt-3 w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
            <div
              key={topRightAlert.id}
              className="bg-[#ef4444] h-full animate-alert-timer rounded-full"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-16">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#eef5f0] text-[#1c552f] px-3.5 py-1 rounded-full text-xs font-bold border border-[#cae2d2]">
            <MessageSquare className="w-3.5 h-3.5 text-[#236338]" />
            <span>Community Support & Inquiries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#153e25]">
            Let's start a conversation.
          </h1>
          <p className="text-sm text-[#526357]">
            Have a question about a local Malir farmers market, want to list your agricultural cooperative, or suggest a new seasonal crop? We'd love to hear from you.
          </p>
        </div>

        {/* 2-Column: Form & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Form Card (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#ded8cb] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#153e25]">
                Send an Inquiry
              </h3>
              <span className="text-[11px] text-[#718096]">
                * Required fields
              </span>
            </div>

            {submitted ? (
              <div className="bg-[#eef5f0] border border-[#a3e635]/60 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-[#236338] text-[#a3e635] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#153e25]">
                  Thank You, {form.name}!
                </h4>
                <p className="text-xs text-[#3b5141] leading-relaxed max-w-sm mx-auto">
                  Your inquiry regarding "{form.subject || form.inquiryType}" has been verified and forwarded to our regional coordinator. We will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      inquiryType: 'Shopper / Community',
                      subject: '',
                      message: ''
                    });
                    setTouched({});
                    setErrors({});
                  }}
                  className="bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* 1. Name & Email Row with Validation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider">
                        Your Full Name *
                      </label>
                      {touched.name && !errors.name && (
                        <span className="text-[10px] text-[#2e6f40] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        placeholder="e.g. Tariq Mehmood"
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-all ${touched.name && errors.name
                            ? 'bg-[#fff5f5] border-2 border-[#ef4444] text-[#991b1b] focus:ring-1 focus:ring-[#ef4444]'
                            : touched.name && !errors.name
                              ? 'bg-[#f4faf5] border border-[#2e6f40] text-[#153e25]'
                              : 'bg-[#fbf9f4] border border-[#ded8cb] text-[#1a2b20] focus:ring-2 focus:ring-[#153e25]'
                          } focus:outline-none`}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-[11px] text-[#ef4444] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider">
                        Email Address *
                      </label>
                      {touched.email && !errors.email && (
                        <span className="text-[10px] text-[#2e6f40] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="tariq@example.com"
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-all ${touched.email && errors.email
                            ? 'bg-[#fff5f5] border-2 border-[#ef4444] text-[#991b1b] focus:ring-1 focus:ring-[#ef4444]'
                            : touched.email && !errors.email
                              ? 'bg-[#f4faf5] border border-[#2e6f40] text-[#153e25]'
                              : 'bg-[#fbf9f4] border border-[#ded8cb] text-[#1a2b20] focus:ring-2 focus:ring-[#153e25]'
                          } focus:outline-none`}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-[#ef4444] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Category & Subject Row with Validation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider mb-1">
                      Inquiry Category *
                    </label>
                    <div className="relative">
                      <select
                        value={form.inquiryType}
                        onChange={(e) => handleChange('inquiryType', e.target.value)}
                        onBlur={() => handleBlur('inquiryType')}
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e25] cursor-pointer appearance-none pr-8"
                      >
                        <option value="Shopper / Community">Shopper / Community Question</option>
                        <option value="Farmer / Market Listing Request">Farmer / Market Listing Request</option>
                        <option value="Malir Agricultural Cooperative">Malir Agricultural Cooperative</option>
                        <option value="Volunteer Guild">Volunteer & Community Drives</option>
                        <option value="Press / Media">Press & Media Inquiries</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#718096] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider">
                        Subject *
                      </label>
                      {touched.subject && !errors.subject && (
                        <span className="text-[10px] text-[#2e6f40] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        onBlur={() => handleBlur('subject')}
                        placeholder="e.g. Stall inquiry for Sunday Bachat Bazar"
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-all ${touched.subject && errors.subject
                            ? 'bg-[#fff5f5] border-2 border-[#ef4444] text-[#991b1b] focus:ring-1 focus:ring-[#ef4444]'
                            : touched.subject && !errors.subject
                              ? 'bg-[#f4faf5] border border-[#2e6f40] text-[#153e25]'
                              : 'bg-[#fbf9f4] border border-[#ded8cb] text-[#1a2b20] focus:ring-2 focus:ring-[#153e25]'
                          } focus:outline-none`}
                      />
                    </div>
                    {touched.subject && errors.subject && (
                      <p className="text-[11px] text-[#ef4444] font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Message Textarea with Validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#153e25] uppercase tracking-wider">
                      Your Message *
                    </label>
                    <span className="text-[11px] text-[#718096]">
                      {form.message.length} characters (min 15)
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      rows={4}
                      placeholder="Please write your questions, market recommendations, or grower details here..."
                      className={`w-full text-xs sm:text-sm p-3.5 rounded-xl transition-all ${touched.message && errors.message
                          ? 'bg-[#fff5f5] border-2 border-[#ef4444] text-[#991b1b] focus:ring-1 focus:ring-[#ef4444]'
                          : touched.message && !errors.message
                            ? 'bg-[#f4faf5] border border-[#2e6f40] text-[#153e25]'
                            : 'bg-[#fbf9f4] border border-[#ded8cb] text-[#1a2b20] focus:ring-2 focus:ring-[#153e25]'
                        } focus:outline-none`}
                    />
                  </div>
                  {touched.message && errors.message && (
                    <p className="text-[11px] text-[#ef4444] font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full bg-[#153e25] hover:bg-[#236338] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
                >
                  <Send className="w-4 h-4 text-[#a3e635]" />
                  <span>Send Message to FreshFind</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details, Map, Share Button & Social Icons (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Contact Details Card */}
            <div className="bg-[#153e25] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#235836]">
              <div className="flex items-center gap-2.5">
                <img src="/logo-white.png" alt="FreshFind" className="h-7 w-auto object-contain" />
                <h3 className="font-serif text-xl font-bold text-white">
                  FreshFind Malir Regional Hub
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#cbdcd0]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Community Headquarters:</strong>
                    <span>Main National Highway near Kala Board Flyover, Malir, Karachi</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Email Desk:</strong>
                    <span>support@freshfind.pk / directory@freshfind.pk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Helpline:</strong>
                    <span>+92 (021) 3450-8921 (Daily 8:00 AM – 6:00 PM)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Weekend Market Desk:</strong>
                    <span>Active from 7:00 AM PST every Friday & Sunday</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive HQ Location Map Preview */}
            <div className="bg-white rounded-3xl p-5 border border-[#ded8cb] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-[#153e25] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2e6f40]" />
                  <span>FreshFind Malir Hub Map</span>
                </h4>
                <span className="text-[10px] bg-[#eef5f0] text-[#1e5230] font-bold px-2 py-0.5 rounded">
                  Open Hub
                </span>
              </div>

              {/* Map Canvas */}
              <div className="h-48 w-full rounded-2xl overflow-hidden border border-[#ded8cb] shadow-inner bg-[#e5e0d4]">
                <iframe
                  title="FreshFind Malir Office Location"
                  src="https://maps.google.com/maps?q=24.8967,67.1947&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>

              {/* Working Share Market Location Button (as requested) */}
              <div>
                <button
                  type="button"
                  onClick={handleShareMarketLocation}
                  className="w-full bg-[#153e25] hover:bg-[#236338] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer group"
                >
                  {locationCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#a3e635]" />
                      <span>Market Location Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#a3e635] group-hover:scale-110 transition-transform" />
                      <span>Share Market Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Media App Icons Container (Under the button as requested) */}
              <div className="pt-2 border-t border-[#edf2f7] space-y-2">
                <span className="text-[11px] font-bold text-[#526357] uppercase tracking-wider block text-center">
                  Share via Social Apps:
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareTextEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/25 text-[#128c7e] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group shadow-2xs hover:-translate-y-0.5"
                    title="Share on WhatsApp"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-[10px] font-bold text-[#128c7e]">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(marketLocation.mapUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#1877f2]/10 hover:bg-[#1877f2]/25 text-[#1877f2] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group shadow-2xs hover:-translate-y-0.5"
                    title="Share on Facebook"
                  >
                    <span className="text-lg font-bold">f</span>
                    <span className="text-[10px] font-bold text-[#1877f2]">Facebook</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#e1306c]/10 hover:bg-[#e1306c]/25 text-[#e1306c] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group shadow-2xs hover:-translate-y-0.5"
                    title="Share on Instagram"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-[10px] font-bold text-[#e1306c]">Instagram</span>
                  </a>

                  {/* X (formerly Twitter) */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Discover verified farmers markets and seasonal farm picks in Malir on FreshFind!')}&url=${encodeURIComponent(marketLocation.mapUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-black/5 hover:bg-black/15 text-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group shadow-2xs hover:-translate-y-0.5"
                    title="Share on X"
                  >
                    <span className="text-base font-bold">𝕏</span>
                    <span className="text-[10px] font-bold text-black">Twitter / 𝕏</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-[#f4efe4] rounded-3xl p-8 sm:p-12 border border-[#ded8cb] space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#236338]">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#153e25]">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'Growers', 'Produce', 'Payment', 'Timing', 'Community'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFaqCategoryFilter(cat);
                  setOpenFaq(0);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${faqCategoryFilter === cat
                    ? 'bg-[#153e25] text-white border-[#153e25] shadow-xs'
                    : 'bg-white text-[#526357] border-[#ded8cb] hover:bg-[#ede6d8]'
                  }`}
              >
                {cat === 'All' ? 'All Topics' : cat}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#ded8cb] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer font-serif font-bold text-sm sm:text-base text-[#153e25] hover:text-[#236338]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#236338] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#889d8f] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#45584b] leading-relaxed border-t border-[#f4efe4]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
