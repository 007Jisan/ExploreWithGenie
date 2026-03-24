import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const welcomeMsg = language === 'bn' 
      ? "হ্যালো! আমি জিনি। বাংলাদেশ ভ্রমণে আমি আপনাকে কীভাবে সাহায্য করতে পারি?" 
      : "Hello! I'm Genie. How can I help you plan your trip in Bangladesh?";
    setMessages([{ text: welcomeMsg, sender: 'bot' }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = language === 'bn' ? "দুঃখিত, সমস্যা হচ্ছে।" : "Sorry, something went wrong.";
      setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-[#00df9a] text-[#0a192f] p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-2xl border-4 border-white">
        {isOpen ? '✖' : '🤖'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="bg-[#0a192f] p-4 text-white font-bold flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00df9a] rounded-full animate-pulse"></span>
              <span className="tracking-wide">✨ {t('chatHeader') || 'Genie Assistant'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 text-xl">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] md:text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#00df9a] text-[#0a192f] rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 italic animate-pulse">Genie is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={t('chatPlaceholder') || 'Ask me...'} className="flex-1 text-sm border-none focus:ring-0 outline-none bg-gray-50 p-2 rounded-lg" autoFocus />
            <button onClick={handleSend} disabled={loading} className="text-[#00df9a] p-2">➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;