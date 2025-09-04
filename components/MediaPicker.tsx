
import React from 'react';
import { SearchIcon, TaskIcon } from './icons';

interface MediaPickerProps {
  onClose: () => void;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ onClose }) => {
  const images = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/media${i}/200/200`);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-30 z-20 flex flex-col justify-end" onClick={onClose}>
      <div className="bg-white rounded-t-3xl p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-blue-500 font-semibold">Cancel</button>
          <h2 className="font-bold text-lg">Media</h2>
          <button className="text-blue-500">
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-1 mb-4">
          {images.map((src, index) => (
            <div key={index} className="aspect-square bg-gray-200">
              <img src={src} alt={`media ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex justify-around items-center text-gray-600">
          <button className="flex flex-col items-center gap-1 text-blue-500">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">📷</div>
            <span className="text-xs font-semibold">Media</span>
          </button>
           <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"><TaskIcon className="w-5 h-5"/></div>
            <span className="text-xs font-semibold">Task</span>
          </button>
           <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">📁</div>
            <span className="text-xs font-semibold">File</span>
          </button>
           <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">📍</div>
            <span className="text-xs font-semibold">Location</span>
          </button>
           <button className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">👤</div>
            <span className="text-xs font-semibold">Contact</span>
          </button>
        </div>
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

export default MediaPicker;
