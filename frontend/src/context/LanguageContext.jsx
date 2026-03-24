import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // শুরুতে লোকাল স্টোরেজ চেক করবে, না থাকলে ডিফল্ট 'en' সেট করবে
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  // 📝 ডিকশনারি বা ট্রান্সলেশন ডেটা
  const translations = {
    en: {
      // --- Navbar & General ---
      navHome: "Home",
      navDestinations: "Destinations",
      navAbout: "About",
      login: "Log in",
      signup: "Sign up",

      // --- Home Page ---
      exploreTitle: "Where do you want to explore?",
      available: "Available Now ✨",
      comingSoon: "Coming Soon 🔒",
      
      // --- Bangladesh / Spots Page ---
      spotsTitle: "Popular Tourist Spots in Bangladesh",
      location: "Location",
      budget: "Estimated Budget",
      exploreBtn: "View Details",
      aiGenieHint: "Ask Genie about this place!",

      // --- Chatbot ---
      chatHeader: "Genie Assistant",
      chatPlaceholder: "Ask me anything about your trip...",
      welcome: "Hello! I'm Genie. How can I help you plan your trip in Bangladesh?",
      thinking: "Genie is thinking...",
      errorMsg: "Sorry, I'm having trouble connecting right now.",

      // --- SweetAlert / Pop-ups ---
      loginTitle: "Access Restricted!",
      loginText: "Please login first to explore Bangladesh! 🧞‍♂️",
      lockedTitle: "is Locked! 🔒",
      lockedText: "Our AI Genie is currently working on this destination. It will be available soon!",
      goLogin: "Go to Login"
    },
    bn: {
      // --- Navbar & General ---
      navHome: "হোম",
      navDestinations: "গন্তব্য",
      navAbout: "আমাদের সম্পর্কে",
      login: "লগইন",
      signup: "সাইন আপ",

      // --- Home Page ---
      exploreTitle: "আপনি কোথায় ঘুরতে চান?",
      available: "এখনই দেখুন ✨",
      comingSoon: "শীঘ্রই আসছে 🔒",

      // --- Bangladesh / Spots Page ---
      spotsTitle: "বাংলাদেশের জনপ্রিয় পর্যটন কেন্দ্র",
      location: "অবস্থান",
      budget: "আনুমানিক বাজেট",
      exploreBtn: "বিস্তারিত দেখুন",
      aiGenieHint: "জিনিকে জিজ্ঞাসা করুন এই জায়গা সম্পর্কে!",

      // --- Chatbot ---
      chatHeader: "জিনি অ্যাসিস্ট্যান্ট",
      chatPlaceholder: "আপনার ভ্রমণ সম্পর্কে জিজ্ঞাসা করুন...",
      welcome: "হ্যালো! আমি জিনি। বাংলাদেশ ভ্রমণে আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      thinking: "জিনি ভাবছে...",
      errorMsg: "দুঃখিত, আমি এই মুহূর্তে কানেক্ট হতে পারছি না।",

      // --- SweetAlert / Pop-ups ---
      loginTitle: "প্রবেশাধিকার সীমিত!",
      loginText: "বাংলাদেশ দেখতে চাইলে আগে লগইন করুন! 🧞‍♂️",
      lockedTitle: "বন্ধ আছে! 🔒",
      lockedText: "আমাদের এআই জিনি এই গন্তব্য নিয়ে কাজ করছে। সাথেই থাকুন!",
      goLogin: "লগইন করুন"
    }
  };

  // ✅ ল্যাঙ্গুয়েজ চেঞ্জ করার ফাংশন (Navbar এটি কল করবে)
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  // 🔍 ট্রান্সলেশন সহজে পাওয়ার জন্য হেল্পার ফাংশন
  const t = (key) => {
    // যদি কী খুঁজে না পায়, তবে সরাসরি কী-টাই রিটার্ন করবে (যাতে এরর না হয়)
    return (translations[language] && translations[language][key]) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// কাস্টম হুক (সহজে ব্যবহার করার জন্য)
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};