import React from 'react';
import type { Notification } from '../types';
import { NotificationType } from '../types';
import { HeartIcon, UserPlusIcon, WalletIcon } from './icons';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { user, type, timestamp, isRead } = notification;

  const renderIcon = () => {
    const iconBaseClasses = "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0";
    switch (type) {
      case NotificationType.STATUS_LIKE:
        return (
          <div className={`${iconBaseClasses} bg-red-100 text-red-500`}>
            <HeartIcon className="w-6 h-6" isFilled />
          </div>
        );
      case NotificationType.FRIEND_REQUEST:
        return (
          <div className={`${iconBaseClasses} bg-blue-100 text-blue-500`}>
            <UserPlusIcon className="w-6 h-6" />
          </div>
        );
      case NotificationType.WALLET_RECEIVED:
      case NotificationType.WALLET_FUNDED:
        return (
           <div className={`${iconBaseClasses} bg-green-100 text-green-500`}>
            <WalletIcon className="w-6 h-6" />
          </div>
        );
      case NotificationType.WALLET_SENT:
         return (
           <div className={`${iconBaseClasses} bg-gray-200 text-gray-600`}>
            <WalletIcon className="w-6 h-6" />
          </div>
        );
      default: // STATUS_COMMENT
        return <img src={user.avatarUrl} alt={user.name} className="w-11 h-11 rounded-full flex-shrink-0" />;
    }
  };

  const renderContent = () => {
    switch (type) {
      case NotificationType.STATUS_LIKE:
        return <p><span className="font-bold">{user.name}</span> liked your status.</p>;
      case NotificationType.STATUS_COMMENT:
        return <p><span className="font-bold">{user.name}</span> replied: "{notification.commentText}"</p>;
      case NotificationType.FRIEND_REQUEST:
        return <p><span className="font-bold">{user.name}</span> sent you a friend request.</p>;
      case NotificationType.WALLET_RECEIVED:
        return <p><span className="font-bold">{user.name}</span> sent you <span className="font-bold text-green-600">{notification.amount}</span>.</p>;
      case NotificationType.WALLET_SENT:
        return <p>You sent <span className="font-bold text-gray-800">{notification.amount}</span> to <span className="font-bold">{user.name}</span>.</p>;
      case NotificationType.WALLET_FUNDED:
        return <p>You funded your wallet with <span className="font-bold text-green-600">{notification.amount}</span>.</p>;
      default:
        return null;
    }
  };
  
  const renderStatusPreview = () => {
      if (!notification.statusPreview) return null;

      const { imageUrl, text, backgroundColor } = notification.statusPreview;
      if (imageUrl) {
          return <img src={imageUrl} alt="status preview" className="w-12 h-12 rounded-lg object-cover ml-2"/>
      }
      if (text) {
          return (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center p-1 ml-2"
                style={{ backgroundColor: backgroundColor || '#718096' }}
              >
                <p className="text-white font-bold text-[9px] leading-tight text-center line-clamp-3">{text}</p>
              </div>
          )
      }
      return null;
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-2xl ${!isRead ? 'bg-blue-50' : 'bg-transparent'}`}>
      {renderIcon()}
      <div className="flex-grow min-w-0">
        <div className="text-sm text-gray-700">
            {renderContent()}
        </div>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
      {renderStatusPreview()}
    </div>
  );
};

export default NotificationItem;
