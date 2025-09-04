
import React from 'react';
import { ChatIcon, CashIcon, TaskIcon, SettingsIcon } from './icons';

type Screen = 'Chat' | 'Cash' | 'Task' | 'Settings';

interface BottomNavProps {
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems: { name: Screen, icon: React.FC<{className?: string}> }[] = [
    { name: 'Chat', icon: ChatIcon },
    { name: 'Cash', icon: CashIcon },
    { name: 'Task', icon: TaskIcon },
    { name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="relative flex-shrink-0 h-20">
        <div className="absolute bottom-0 left-0 right-0 bg-white h-full rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] flex justify-around items-center px-4">
        {navItems.map(item => {
            const isActive = activeScreen === item.name;
            return (
            <button 
                key={item.name} 
                onClick={() => onNavigate(item.name)}
                className="flex flex-col items-center gap-1 text-gray-400"
            >
                <item.icon className={`w-7 h-7 ${isActive ? 'text-[#0047FF]' : ''}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-[#0047FF]' : ''}`}>{item.name}</span>
            </button>
            )
        })}
        </div>
    </div>
  );
};

export default BottomNav;
