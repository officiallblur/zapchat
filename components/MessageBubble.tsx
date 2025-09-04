import React from 'react';
import type { Message } from '../types';
import { MessageType } from '../types';
import { DoubleCheckIcon, PlayIcon, HeartIcon, FileTextIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isSentByMe = message.senderId === 'user-me';

  const renderContent = () => {
    switch (message.type) {
      case MessageType.IMAGE:
        return (
          <img src={message.imageUrl} alt="sent content" className="rounded-xl max-w-xs w-full" />
        );
      case MessageType.VOICE:
        return (
          <div className="flex items-center gap-3 w-52">
            <button className="bg-white text-[#0047FF] w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
              <PlayIcon className="w-5 h-5 ml-0.5" />
            </button>
            <div className="w-full h-1 bg-blue-300 rounded-full relative">
                <div className="absolute top-0 left-0 h-1 bg-white rounded-full" style={{width: '70%'}}></div>
                <div className="absolute -top-0.5 right-1/3 w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xs font-mono text-blue-200">{message.voiceDuration}</span>
          </div>
        );
      case MessageType.STATUS_REPLY:
        return (
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                  {message.statusReply?.imageUrl ? (
                     <img src={message.statusReply.imageUrl} alt="status preview" className="w-10 h-10 rounded-md object-cover"/>
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-md flex items-center justify-center p-1"
                      style={{ backgroundColor: message.statusReply?.backgroundColor || '#718096' }}
                    >
                      {message.statusReply?.statusText ? (
                        <p className="text-white font-bold text-[8px] leading-tight text-center line-clamp-3">{message.statusReply.statusText}</p>
                      ) : (
                        <FileTextIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                  )}
                  <div className="text-sm">
                      <p className="font-semibold">Status Reply</p>
                      <p className="text-xs opacity-80">You replied to their status</p>
                  </div>
              </div>
              {message.statusReply?.liked ? (
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-6 h-6 text-red-400" isFilled={true} />
                    <p className="text-sm">Liked status</p>
                  </div>
              ) : (
                <p className="text-sm">{message.statusReply?.replyText}</p>
              )}
           </div>
        );
      case MessageType.TEXT:
      default:
        return <p className="text-sm">{message.text}</p>;
    }
  };

  const bubbleClasses = isSentByMe
    ? 'bg-[#0047FF] text-white rounded-br-none'
    : 'bg-white text-gray-800 rounded-bl-none';
  
  const wrapperClasses = isSentByMe ? 'justify-end' : 'justify-start';

  const hasPadding = message.type !== MessageType.IMAGE;

  return (
    <div className={`flex ${wrapperClasses}`}>
      <div className="flex flex-col items-end gap-1 max-w-[80%]">
        <div className={`rounded-2xl ${bubbleClasses} ${hasPadding ? 'p-3' : 'p-1'}`}>
          {renderContent()}
        </div>
        <div className="flex items-center gap-2 px-1">
          <p className="text-xs text-gray-400">{message.timestamp}</p>
          {isSentByMe && <DoubleCheckIcon className={`w-4 h-4 ${message.read ? 'text-blue-500' : 'text-gray-400'}`} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;