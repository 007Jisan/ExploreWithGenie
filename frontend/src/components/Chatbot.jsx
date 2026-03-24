import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00df9a] text-[#0a192f] p-4 rounded-full shadow-2xl hover:scale-110 transition-all text-2xl"
      >
        {isOpen ? '✖' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-fadeInUp">
          <div className="bg-[#0a192f] p-4 text-white font-bold flex justify-between items-center">
            <span>✨ {t('chatHeader')}</span>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[#00df9a] text-[#0a192f] rounded-tr-none' : 'bg-white text-gray-700 shadow-sm rounded-tl-none border border-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 animate-pulse italic">Genie is thinking...</div>}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatPlaceholder')}
              className="flex-1 text-sm border-none focus:ring-0 outline-none"
            />
            <button onClick={handleSend} className="text-[#00df9a] text-xl px-2">➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;