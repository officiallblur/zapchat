
import React from 'react';
import type { Chat } from '../types';
import { DoubleCheckIcon } from './icons';

interface ChatListItemProps {
  chat: Chat;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onClick }) => {
  const isTyping = chat.lastMessage.text === 'Danielle is Typing...';
  
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-3 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors duration-200">
      <div className="relative flex-shrink-0">
        <img src={chat.user.avatarUrl} alt={chat.user.name} className="w-14 h-14 rounded-full" />
        {chat.unreadCount && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            +{chat.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-gray-800 truncate">{chat.user.name}</p>
        <p className={`text-sm truncate ${isTyping ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}>
          {chat.lastMessage.senderId === 'user-me' && !isTyping && <DoubleCheckIcon className="inline-block w-4 h-4 mr-1 text-blue-500" />}
          {chat.lastMessage.text}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-gray-400">{chat.lastMessage.timestamp}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
