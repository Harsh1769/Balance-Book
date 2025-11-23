import React, { useRef } from 'react';
import { Moon, Sun, Globe, Database, Trash2, Monitor, User, Camera, Upload, X } from 'lucide-react';
import { CurrencyCode, UserProfile } from '../App';

interface SettingsProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  onResetData: () => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  theme, 
  toggleTheme, 
  currency, 
  setCurrency,
  onResetData,
  userProfile,
  setUserProfile
}) => {
  
  const currencies: { code: CurrencyCode; label: string }[] = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
    { code: 'INR', label: 'Indian Rupee (₹)' },
    { code: 'JPY', label: 'Japanese Yen (¥)' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const displayAvatar = userProfile.avatar && userProfile.avatar.trim() !== ''
    ? userProfile.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=0D8ABC&color=fff`;

  return (
    <div className="p-6 animate-fade-in max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your workspace preferences and profile</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={20} className="text-indigo-600" /> My Profile
             </h3>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-md relative group">
                   <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                   >
                       <Camera className="text-white" size={24} />
                   </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                />
                <div className="flex gap-2 mt-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        <Upload size={14} /> Upload
                    </button>
                    {userProfile.avatar && (
                        <button 
                            onClick={() => setUserProfile({...userProfile, avatar: ''})}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors flex items-center gap-2"
                        >
                            <X size={14} /> Remove
                        </button>
                    )}
                </div>
             </div>
             <div className="flex-1 w-full space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={userProfile.name} 
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role / Title</label>
                    <input 
                      type="text" 
                      value={userProfile.role} 
                      onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                    />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avatar URL (Optional)</label>
                    <input 
                      type="text" 
                      value={userProfile.avatar} 
                      onChange={(e) => setUserProfile({...userProfile, avatar: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm" 
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-400 mt-1">Upload an image, paste a URL, or leave empty to use generated initials.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor size={20} className="text-blue-600" /> Appearance
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Theme Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark interface</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'light' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Sun size={16} /> Light
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={20} className="text-emerald-600" /> Regional
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Primary Currency</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Used for all transactions and reports</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Database size={20} className="text-rose-600" /> Data Management
            </h3>
          </div>
          <div className="p-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Reset Application</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clear all local transactions and invoices</p>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm("Are you sure? This will delete all your locally saved transactions and invoices.")) {
                    onResetData();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
              >
                <Trash2 size={16} /> Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};