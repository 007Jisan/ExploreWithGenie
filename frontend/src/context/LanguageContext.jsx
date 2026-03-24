import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language English

  const dictionary = {
    en: {
      navHome: "Home",
      navDestinations: "Destinations",
      navAbout: "About",
      chatHeader: "Genie AI Assistant",
      chatPlaceholder: "Ask me anything about your trip...",
      heroTitle: "Explore Beautiful Bangladesh",
      heroSub: "Discover historical landmarks and hidden gems across the country."
    },
    bn: {
      navHome: "হোম",
      navDestinations: "গন্তব্য",
      navAbout: "আমাদের সম্পর্কে",
      chatHeader: "জিনি এআই অ্যাসিস্ট্যান্ট",
      chatPlaceholder: "আপনার ট্রিপ সম্পর্কে কিছু জিজ্ঞাসা করুন...",
      heroTitle: "মনোরম বাংলাদেশ ঘুরে দেখুন",
      heroSub: "দেশের ঐতিহাসিক নিদর্শন এবং লুকানো রত্নগুলো আবিষ্কার করুন।"
    }
  };

  const t = (key) => dictionary[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);