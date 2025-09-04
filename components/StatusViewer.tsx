
import React, { useState, useEffect, useRef } from 'react';
import type { Status, User } from '../types';
import { StatusType } from '../types';
import { CloseIcon, HeartIcon, SendIcon, EyeIcon } from './icons';

interface StatusViewerProps {
    status: Status;
    onClose: () => void;
    onReply: (status: Status, reply: { type: 'like' | 'comment', text?: string }) => void;
    isOwnStatus: boolean;
}

const ViewersModal: React.FC<{ viewers: User[], onClose: () => void }> = ({ viewers, onClose }) => (
    <div className="absolute inset-0 bg-black/60 z-40 flex flex-col justify-end" onClick={onClose}>
        <div 
            className="bg-white rounded-t-2xl max-h-[60%] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
        >
            <h3 className="text-lg font-bold p-4 border-b text-center sticky top-0 bg-white">
                Viewed by {viewers.length}
            </h3>
            <ul className="overflow-y-auto p-4">
                {viewers.map(user => (
                    <li key={user.id} className="flex items-center gap-3 py-2">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                        <span className="font-semibold text-gray-800">{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


const StatusViewer: React.FC<StatusViewerProps> = ({ status, onClose, onReply, isOwnStatus }) => {
    const [comment, setComment] = useState('');
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showViewers, setShowViewers] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const STATUS_DURATION = 15000; // 15 seconds

    useEffect(() => {
        let timer: number;
        
        if (status.type === StatusType.VIDEO && videoRef.current) {
            const videoElement = videoRef.current;
            const onLoadedData = () => {
                const duration = videoElement.duration * 1000;
                 timer = window.setTimeout(onClose, duration);
                 // We don't animate progress for video, it's tied to video playback progress
                 // But for this project, let's keep it simple and just close after duration
            };
            videoElement.addEventListener('loadeddata', onLoadedData);
            videoElement.play().catch(e => console.error("Video autoplay failed:", e));
            return () => {
                 clearTimeout(timer);
                 videoElement.removeEventListener('loadeddata', onLoadedData);
            }
        } else {
             // For Image and Text
            const start = Date.now();
            const animate = () => {
                const elapsed = Date.now() - start;
                const newProgress = Math.min((elapsed / STATUS_DURATION) * 100, 100);
                setProgress(newProgress);
                if (newProgress < 100) {
                    requestAnimationFrame(animate);
                }
            };
            
            const startTimer = setTimeout(() => {
                 requestAnimationFrame(animate);
            }, 50);

            const closeTimer = setTimeout(onClose, STATUS_DURATION);

            return () => {
                clearTimeout(startTimer);
                clearTimeout(closeTimer);
            };
        }

    }, [status, onClose]);


    const handleSendComment = () => {
        if (comment.trim()) {
            onReply(status, { type: 'comment', text: comment.trim() });
            setComment('');
        }
    };

    const handleLike = () => {
        if (!isLiked) { // Prevent sending multiple like events per view
            onReply(status, { type: 'like' });
            setIsLiked(true);
        }
    };

    const renderStatusContent = () => {
        switch (status.type) {
            case StatusType.IMAGE:
                return <img src={status.imageUrl} alt="status" className="w-full h-full object-contain" />;
            case StatusType.VIDEO:
                return <video ref={videoRef} src={status.videoUrl} className="w-full h-full object-contain" playsInline />;
            case StatusType.TEXT:
                return (
                    <div className="w-full h-full flex items-center justify-center p-8" style={{ backgroundColor: status.backgroundColor }}>
                        <p className="text-white text-3xl font-bold text-center">{status.text}</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="absolute inset-0 bg-black z-30 flex flex-col animate-fade-in" onClick={onClose}>
            <div className="flex-grow relative flex items-center justify-center" onClick={e => e.stopPropagation()}>
                {renderStatusContent()}
                
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                    {/* Progress Bar */}
                    <div className="h-1 bg-white/30 rounded-full mb-3">
                        <div 
                            className="h-1 bg-white rounded-full"
                            style={{ width: `${progress}%`, transition: progress > 1 ? `width ${STATUS_DURATION/1000}s linear` : 'none' }}
                        ></div>
                    </div>
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <img src={status.user.avatarUrl} alt={status.user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-white">{status.user.name}</p>
                            <p className="text-xs text-gray-300">{status.timestamp}</p>
                        </div>
                         <button onClick={onClose} className="text-white ml-auto p-2">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Reply Bar or Viewers Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                     {status.caption && <p className="text-white text-center text-sm mb-3">{status.caption}</p>}
                     {isOwnStatus ? (
                        <div className="flex flex-col items-center">
                            <button onClick={() => setShowViewers(true)} className="flex flex-col items-center text-white font-semibold">
                                <EyeIcon className="w-6 h-6" />
                                <span>{status.viewedBy?.length || 0} views</span>
                            </button>
                        </div>
                     ) : (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                                placeholder="Reply..."
                                className="flex-grow bg-white/20 text-white placeholder-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                            />
                            <button onClick={handleLike} className="text-white p-2">
                                <HeartIcon className={`w-7 h-7 transition-colors duration-200 ${isLiked ? 'text-red-500' : 'text-white'}`} isFilled={isLiked} />
                            </button>
                            <button 
                                onClick={handleSendComment} 
                                className="bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                disabled={!comment.trim()}
                            >
                                <SendIcon className="w-5 h-5 -rotate-12" />
                            </button>
                        </div>
                     )}
                </div>
            </div>

            {showViewers && status.viewedBy && <ViewersModal viewers={status.viewedBy} onClose={() => setShowViewers(false)} />}
            
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                 @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default StatusViewer;