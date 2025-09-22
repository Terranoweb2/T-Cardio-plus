import React, { useState, useRef, useEffect } from 'react';
import { ChatbotMessage } from '../types';
import { sendMessageToChatbot, resetChatSession } from '../services/chatbotService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      role: 'model',
      text: "Bonjour ! Je suis T-Cardio, votre assistant IA spécialisé en cardiologie. Posez-moi vos questions sur la santé cardiovasculaire."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat session when component mounts/unmounts to clear history
    resetChatSession();
    return () => {
      resetChatSession();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isLoading) return;

    const userMessage: ChatbotMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChatbot(userInput);
      const modelMessage: ChatbotMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatbotMessage = {
        role: 'model',
        text: "Désolé, une erreur est survenue. Veuillez réessayer."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col h-[70vh]">
        <header className="pb-4 border-b border-slate-200 flex items-center gap-3">
          <img src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1743347071/T-Cardio_Icon_krz8gs.png" alt="Logo T-Cardio" className="h-10 w-10" />
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Chatbot T-Cardio</h2>
            <p className="text-sm text-slate-500">Votre expert en santé cardiovasculaire</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <img src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1743347071/T-Cardio_Icon_krz8gs.png" className="h-8 w-8 rounded-full flex-shrink-0" alt="Bot avatar" />
              )}
              <div className={`max-w-md p-3 rounded-2xl text-sm break-words ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <img src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1743347071/T-Cardio_Icon_krz8gs.png" className="h-8 w-8 rounded-full flex-shrink-0" alt="Bot avatar" />
               <div className="max-w-md p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none flex items-center">
                    <SpinnerIcon className="h-5 w-5 animate-spin text-slate-500"/>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="pt-4 border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              disabled={isLoading}
            />
            <button type="submit" className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:bg-slate-400" disabled={!input.trim() || isLoading}>
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </div>
    </section>
  );
};

export default Chatbot;