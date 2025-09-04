import React from 'react';
import { PlusIcon } from './icons';

export interface SpeedDialAction {
  label: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
}

interface SpeedDialProps {
  isOpen: boolean;
  onToggle: () => void;
  actions: SpeedDialAction[];
}

const SpeedDial: React.FC<SpeedDialProps> = ({ isOpen, onToggle, actions }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
        aria-hidden="true"
      />
      
      <div className="absolute bottom-24 right-6 z-20 flex flex-col items-center gap-4">
        {/* Action Items */}
        <div 
          id="speed-dial-menu"
          className="flex flex-col-reverse items-end gap-3"
        >
          {actions.map((action, index) => (
            <div
              key={action.label}
              className={`flex items-center gap-3 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
              style={{ transitionDelay: `${isOpen ? index * 40 : 0}ms` }}
            >
              <span className="bg-white text-sm font-semibold text-gray-700 px-3 py-1.5 rounded-lg shadow-md">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  onToggle(); // Close menu after action
                }}
                className="bg-white text-gray-700 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                aria-label={action.label}
                tabIndex={isOpen ? 0 : -1}
              >
                <action.icon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={onToggle}
          className="bg-[#0047FF] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ease-in-out hover:bg-blue-700"
          aria-expanded={isOpen}
          aria-controls="speed-dial-menu"
          aria-label="Toggle actions menu"
        >
          <PlusIcon className={`w-7 h-7 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
        </button>
      </div>
    </>
  );
};

export default SpeedDial;