import React, { useState } from 'react';
import { BackIcon, PlusIcon, PlayIcon } from '../components/icons';
import StatusViewer from '../components/StatusViewer';
import { MOCK_STATUSES, users } from '../constants';
import type { Status } from '../types';
import { StatusType } from '../types';

interface StatusScreenProps {
  myStatus: Status | null;
  onBack: () => void;
  onStatusReply: (status: Status, reply: { type: 'like' | 'comment', text?: string }) => void;
  onNavigateToSubScreen: (screen: 'CreateStatus') => void;
}

const StatusItem: React.FC<{ status: Status, onClick: () => void }> = ({ status, onClick }) => (
    <button onClick={onClick} className="flex-shrink-0 w-28 h-44 rounded-2xl relative overflow-hidden group">
        <div className={`absolute inset-0 rounded-2xl p-1 ${status.viewed ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600'}`}>
            <img src={status.imageUrl} alt={status.user.name} className="w-full h-full rounded-xl object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
            <img src={status.user.avatarUrl} alt={status.user.name} className="w-8 h-8 rounded-full border-2 border-blue-400 mb-1" />
            <p className="text-xs font-bold truncate">{status.user.name}</p>
        </div>
    </button>
);

const StatusScreen: React.FC<StatusScreenProps> = ({ myStatus, onBack, onStatusReply, onNavigateToSubScreen }) => {
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const myUser = users['user-me'];
  const recentUpdates = MOCK_STATUSES.filter(s => !s.viewed);
  const viewedUpdates = MOCK_STATUSES.filter(s => s.viewed);

  const handleReply = (status: Status, reply: { type: 'like' | 'comment', text?: string }) => {
    onStatusReply(status, reply);
  };
  
  const handleViewMyStatus = () => {
    if (myStatus) {
        setViewingStatus(myStatus);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white min-h-0">
      <header className="bg-gray-50 px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 border-b z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 -ml-2 text-gray-700">
            <BackIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Status</h1>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto">
        <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    {myStatus ? (
                         <button onClick={handleViewMyStatus} className="w-16 h-16 rounded-full p-0.5 border-2 border-blue-500">
                            {myStatus.type === StatusType.IMAGE && <img src={myStatus.imageUrl} alt="My Status" className="w-full h-full rounded-full object-cover" />}
                            {myStatus.type === StatusType.VIDEO && <video src={myStatus.videoUrl} className="w-full h-full rounded-full object-cover" />}
                            {myStatus.type === StatusType.TEXT && (
                                <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold truncate" style={{ backgroundColor: myStatus.backgroundColor }}>
                                    {myStatus.text}
                                </div>
                            )}
                         </button>
                    ) : (
                         <img src={myUser.avatarUrl} alt={myUser.name} className="w-16 h-16 rounded-full" />
                    )}
                    <button onClick={() => onNavigateToSubScreen('CreateStatus')} className="absolute bottom-0 right-0 w-6 h-6 bg-[#0047FF] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <p className="text-lg font-bold">My Status</p>
                    <p className="text-sm text-gray-500">{myStatus ? myStatus.timestamp : 'Add to my status'}</p>
                </div>
            </div>
        </div>
        
        {recentUpdates.length > 0 && (
            <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-6">Recent Updates</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                    <div className="w-6 flex-shrink-0"></div>
                    {recentUpdates.map(status => (
                        <StatusItem key={status.id} status={status} onClick={() => setViewingStatus(status)} />
                    ))}
                    <div className="w-6 flex-shrink-0"></div>
                </div>
            </div>
        )}
        
         {viewedUpdates.length > 0 && (
             <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-6">Viewed Updates</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                    <div className="w-6 flex-shrink-0"></div>
                    {viewedUpdates.map(status => (
                        <StatusItem key={status.id} status={status} onClick={() => setViewingStatus(status)} />
                    ))}
                    <div className="w-6 flex-shrink-0"></div>
                </div>
            </div>
         )}
      </main>
      {viewingStatus && (
        <StatusViewer 
            status={viewingStatus} 
            onClose={() => setViewingStatus(null)}
            onReply={handleReply}
            isOwnStatus={viewingStatus.user.id === myUser.id}
        />
      )}
       <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StatusScreen;