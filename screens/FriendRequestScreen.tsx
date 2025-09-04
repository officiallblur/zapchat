import React, { useState } from 'react';
import { BackIcon } from '../components/icons';
import { MOCK_FRIEND_REQUESTS } from '../constants';
import type { FriendRequest } from '../types';

interface FriendRequestScreenProps {
  onBack: () => void;
}

const FriendRequestItem: React.FC<{ request: FriendRequest; onAction: (id: string) => void; }> = ({ request, onAction }) => (
    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm">
        <img src={request.user.avatarUrl} alt={request.user.name} className="w-14 h-14 rounded-full" />
        <div className="flex-grow min-w-0">
            <p className="font-bold text-gray-800 truncate">{request.user.name}</p>
            <p className="text-sm text-gray-500">Sent you a friend request</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
            <button 
                onClick={() => onAction(request.id)}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#0047FF] rounded-full hover:bg-blue-700 transition-colors"
                aria-label={`Accept friend request from ${request.user.name}`}
            >
                Accept
            </button>
            <button
                onClick={() => onAction(request.id)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                aria-label={`Decline friend request from ${request.user.name}`}
            >
                Decline
            </button>
        </div>
    </div>
);

const FriendRequestScreen: React.FC<FriendRequestScreenProps> = ({ onBack }) => {
    const [requests, setRequests] = useState(MOCK_FRIEND_REQUESTS);

    const handleAction = (id: string) => {
        setRequests(prev => prev.filter(req => req.id !== id));
    }

  return (
    <div className="flex flex-col flex-grow bg-gray-100 min-h-0">
      <header className="bg-white px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 border-b z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 -ml-2 text-gray-700">
            <BackIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Friend Requests</h1>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto p-6">
        {requests.length > 0 ? (
            <div className="flex flex-col gap-3">
                {requests.map(request => (
                    <FriendRequestItem key={request.id} request={request} onAction={handleAction} />
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 mt-20">
                <p className="font-semibold text-lg">No Pending Requests</p>
                <p className="text-sm">You're all caught up!</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default FriendRequestScreen;
