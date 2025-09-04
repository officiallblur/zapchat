import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '../types';
import MessageBubble from '../components/MessageBubble';
import MediaPicker from '../components/MediaPicker';
import { BackIcon, PhoneIcon, MoreIcon, PaperclipIcon, SmileyIcon, SendIcon } from '../components/icons';

interface ChatScreenProps {
  chat: Chat;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chat, onBack }) => {
  const [isMediaPickerOpen, setMediaPickerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  return (
    <div className="flex flex-col flex-grow bg-gray-100 min-h-0">
      <header className="bg-[#0047FF] text-white rounded-b-3xl px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 z-10 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1 -ml-2">
              <BackIcon className="w-6 h-6" />
            </button>
            <img src={chat.user.avatarUrl} alt={chat.user.name} className="w-11 h-11 rounded-full" />
            <div>
              <p className="text-lg font-bold">{chat.user.name}</p>
              {chat.user.isTyping && <p className="text-xs font-light text-blue-200">Typing...</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2">
              <PhoneIcon className="w-6 h-6" />
            </button>
            <button className="p-2">
              <MoreIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto px-4 pt-4 pb-2">
        <div className="flex flex-col gap-4">
          {chat.messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <button onClick={() => setMediaPickerOpen(true)} className="text-gray-500">
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <input 
            type="text" 
            placeholder="Send your message..." 
            className="flex-grow bg-transparent px-4 text-sm focus:outline-none" 
          />
          <button className="text-gray-500 mr-2">
             <SmileyIcon className="w-6 h-6" />
          </button>
          <button className="bg-[#0047FF] text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            {/* FIX: Removed unsupported 'strokeWidth' prop from SendIcon component. */}
            <SendIcon className="w-5 h-5 -rotate-12" />
          </button>
        </div>
      </footer>

      {isMediaPickerOpen && <MediaPicker onClose={() => setMediaPickerOpen(false)} />}
    </div>
  );
};

export default ChatScreen;