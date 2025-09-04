import React from 'react';
import type { Notification } from '../types';
import { CloseIcon } from './icons';
import NotificationItem from './NotificationItem';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notifications, onMarkAllAsRead }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 z-40 flex flex-col justify-end" onClick={onClose}>
      <div 
        className="bg-white rounded-t-3xl h-[85%] flex flex-col animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">Notifications</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-4">
            {notifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 pt-20">
                    <p className="font-semibold text-lg">No Notifications Yet</p>
                    <p className="text-sm">You'll see updates about your account here.</p>
                </div>
            )}
        </main>
        
        <footer className="p-4 border-t flex-shrink-0">
             <button 
                onClick={onMarkAllAsRead}
                className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                disabled={notifications.every(n => n.isRead)}
            >
                Mark all as read
            </button>
        </footer>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default NotificationModal;
