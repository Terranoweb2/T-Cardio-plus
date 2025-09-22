
import React, { useState, useRef, useEffect } from 'react';
import { Message, User } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import FileMessage from './FileMessage';
import PendingFileMessage from './PendingFileMessage';

type DisplayMessage = Message & {
    tempId?: string;
    status?: 'sending' | 'error';
    file?: File;
};
interface ChatInterfaceProps {
  messages: DisplayMessage[];
  currentUser: User;
  contactName: string;
  onSendMessage: (text: string) => void;
  onSendFile: (file: File) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, currentUser, contactName, onSendMessage, onSendFile, isLoading }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("La taille du fichier ne doit pas dépasser 10 Mo.");
        return;
      }
      onSendFile(file);
    }
     // Reset the input value to allow selecting the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[60vh] bg-slate-50 rounded-xl border border-slate-200">
      <header className="p-4 border-b border-slate-200 bg-white rounded-t-xl">
        <h3 className="font-semibold text-slate-800">Conversation avec {contactName}</h3>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <SpinnerIcon className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-slate-500">Commencez la conversation.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id || msg.tempId} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                <div className={`p-0.5 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-red-600 text-white rounded-br-lg' : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-lg'}`}>
                  {msg.status === 'sending' || msg.status === 'error' ? (
                        <PendingFileMessage file={msg.file!} status={msg.status} isSender={msg.senderId === currentUser.id} />
                  ) : msg.fileId ? (
                        <FileMessage fileId={msg.fileId} />
                  ) : null}
                  {msg.text && (
                    <p className="text-sm px-3 py-2.5 break-words">{msg.text}</p>
                  )}
                </div>
                <p className={`text-xs mt-1 px-2 ${msg.senderId === currentUser.id ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.status === 'sending' && 'Envoi...'}
                    {msg.status === 'error' && 'Échec'}
                    {!msg.status && new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf"
            capture="environment"
          />
          <button
            type="button"
            onClick={handleAttachmentClick}
            className="p-3 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-700"
            aria-label="Joindre un fichier"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          <button type="submit" className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:bg-slate-400" disabled={!newMessage.trim()}>
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
