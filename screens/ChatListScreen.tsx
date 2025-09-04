import React, { useState } from 'react';
import type { Chat, Notification } from '../types';
import ChatListItem from '../components/ChatListItem';
import { MOCK_CHATS, MOCK_NOTIFICATIONS } from '../constants';
import { SearchIcon, UserPlusIcon, SettingsIcon, CameraIcon, TaskIcon, ChatIcon } from '../components/icons';
import NotificationModal from '../components/NotificationModal';
import SpeedDial from '../components/SpeedDial';
import type { SpeedDialAction } from '../components/SpeedDial';

interface ChatListScreenProps {
  onChatSelect: (chat: Chat) => void;
  onNavigateToSubScreen: (screen: 'FriendRequests' | 'Status' | 'CreateStatus') => void;
  onNavigate: (screen: 'Chat' | 'Cash' | 'Task' | 'Settings') => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onChatSelect, onNavigateToSubScreen, onNavigate }) => {
  const [chats] = useState<Chat[]>(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
      setNotifications(notifications.map(n => ({...n, isRead: true})));
  }

  const speedDialActions: SpeedDialAction[] = [
    {
      label: 'New Status',
      icon: CameraIcon,
      onClick: () => onNavigateToSubScreen('CreateStatus'),
    },
    {
      label: 'New Task',
      icon: TaskIcon,
      onClick: () => onNavigate('Task'),
    },
    {
      label: 'Add Friend',
      icon: UserPlusIcon,
      onClick: () => onNavigateToSubScreen('FriendRequests'),
    },
     {
      label: 'New Chat',
      icon: ChatIcon,
      onClick: () => alert('"New Chat" feature coming soon!'),
    },
  ];

  return (
    <div className="flex flex-col flex-grow bg-gray-100 min-h-0">
      <header className="bg-[#0047FF] text-white rounded-b-3xl px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 z-10 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Chats</h1>
          <div className="flex items-center gap-2">
             <button onClick={() => onNavigateToSubScreen('FriendRequests')} className="relative p-2 bg-white/20 rounded-full">
                <UserPlusIcon className="w-6 h-6"/>
             </button>
             <button onClick={() => setIsNotifOpen(true)} className="relative p-2 bg-white/20 rounded-full">
                <SettingsIcon className="w-6 h-6"/>
                {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0047FF]">
                        {unreadNotifsCount}
                    </span>
                )}
             </button>
          </div>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/30 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto px-4 pt-4 pb-20">
        <div className="flex justify-between items-center mb-3 px-2">
            <h2 className="font-bold text-gray-800">Messages</h2>
            <button onClick={() => onNavigateToSubScreen('Status')} className="text-sm font-semibold text-blue-600">
                View Status
            </button>
        </div>
        <div className="flex flex-col gap-2">
          {filteredChats.map(chat => (
            <ChatListItem key={chat.id} chat={chat} onClick={() => onChatSelect(chat)} />
          ))}
        </div>
      </main>

       <SpeedDial 
          isOpen={isSpeedDialOpen}
          onToggle={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
          actions={speedDialActions}
        />

        <NotificationModal 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
        />
    </div>
  );
};

export default ChatListScreen;