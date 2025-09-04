import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { useTheme } from '../hooks/useTheme';
import { fileToBase64 } from '../utils';
import {
  CameraIcon,
  ChevronRightIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '../components/icons';

interface SettingsScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser }) => {
  const { theme, toggleTheme } = useTheme();
  const [bio, setBio] = useState(user.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onUpdateUser({ ...user, avatarUrl: base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Failed to upload image. Please try another file.");
      }
    }
  };
  
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  }
  
  const handleBioSave = () => {
    onUpdateUser({ ...user, bio });
    setIsEditingBio(false);
  }

  const settingsItems = [
    { icon: UserCircleIcon, label: 'Account', color: 'text-blue-500' },
    { icon: ShieldCheckIcon, label: 'Privacy', color: 'text-green-500' },
    { icon: BellIcon, label: 'Notifications', color: 'text-red-500' },
    { icon: QuestionMarkCircleIcon, label: 'Help', color: 'text-yellow-500' },
  ];

  return (
    <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900 min-h-0 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800/50 px-6 pt-8 sm:pt-12 pb-6 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold">Settings</h1>
      </header>
      
      <main className="flex-grow overflow-y-auto p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/50" />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-900 hover:bg-blue-700 transition-colors"
              aria-label="Change profile picture"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {isEditingBio ? (
             <div className="flex items-center gap-2 mt-2">
                 <input 
                    type="text" 
                    value={bio} 
                    onChange={handleBioChange} 
                    className="text-sm bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    autoFocus
                    onBlur={handleBioSave}
                    onKeyPress={(e) => e.key === 'Enter' && handleBioSave()}
                 />
             </div>
          ) : (
            <p onClick={() => setIsEditingBio(true)} className="text-sm text-gray-500 dark:text-gray-400 mt-1 cursor-pointer">
              {bio || 'Tap to add bio'}
            </p>
          )}
        </div>
        
        {/* Settings List */}
        <div className="space-y-3">
            {/* Theme Toggle */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-500 flex items-center justify-center">
                        {theme === 'light' ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
                    </div>
                    <span className="font-semibold">Dark Mode</span>
                </div>
                <button
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                    role="switch"
                    aria-checked={theme === 'dark'}
                >
                    <span className="w-4 h-4 bg-white rounded-full block shadow-md transform transition-transform duration-300"></span>
                </button>
            </div>


            {settingsItems.map(item => (
                <button key={item.label} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl flex justify-between items-center shadow-sm text-left">
                    <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 ${item.color} flex items-center justify-center`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold">{item.label}</span>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </button>
            ))}

             <button className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl flex justify-between items-center shadow-sm text-left mt-4">
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 text-red-500 flex items-center justify-center">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Log Out</span>
                </div>
            </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;