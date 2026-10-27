import React, { useState } from 'react';
import { useApp, TabType } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { SupportedLanguage } from '../i18n/translations.js';
import { 
  Sprout, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  ShoppingCart, 
  UserCheck, 
  Menu, 
  X,
  ShieldCheck,
  Languages
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCart }) => {
  const { 
    language, 
    setLanguage, 
    t, 
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab, 
    cartCount, 
    isSpeaking, 
    stopSpeaking,
    speakText 
  } = useApp();
  const { user, isAdmin, logout, switchRoleDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems: Array<{ id: TabType; label: string }> = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'crops', label: t.nav.crops },
    { id: 'soil', label: t.nav.soil },
    { id: 'weather', label: t.nav.weather },
    { id: 'marketplace', label: t.nav.marketplace },
    { id: 'mandi', label: t.nav.mandi },
    { id: 'consult', label: t.nav.consult },
    { id: 'forum', label: t.nav.forum },
    { id: 'schemes', label: t.nav.schemes },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: t.nav.admin });
  }

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${t.appName}. ${t.tagline}. ${t.weather.forecast5Day}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* ZONE 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:bg-emerald-700 transition-colors">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap leading-tight">
                  {t.appName}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium whitespace-nowrap">
                  Digital Krishi Sahayak
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Primary Actions (Language, Audio, Theme, Cart, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Audio Read-Aloud for Rural Accessibility */}
            <button
              onClick={handleVoiceToggle}
              title={isSpeaking ? t.common.stopReading : t.common.readAloud}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                isSpeaking 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-400 animate-pulse' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              aria-label={t.common.readAloud}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span className="hidden xl:inline text-xs font-medium">{isSpeaking ? 'Listening...' : 'Voice'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="appearance-none bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold py-1.5 pl-7 pr-6 rounded-lg cursor-pointer border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
              <Languages className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 absolute left-2 top-2.5 pointer-events-none" />
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500" 
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isAdmin ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {isAdmin ? 'Admin' : 'Farmer'}
                </span>
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{user?.role === 'admin' ? 'System Administrator' : 'Verified Farmer Profile'}</span>
                    </div>
                  </div>

                  <div className="px-2 py-1.5">
                    <p className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Quick Demo Switcher
                    </p>
                    <button
                      onClick={() => {
                        switchRoleDemo('farmer');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center justify-between"
                    >
                      <span>🌾 Ramesh Patel (Farmer)</span>
                      {!isAdmin && <span className="text-[10px] text-emerald-600 font-bold">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRoleDemo('admin');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center justify-between"
                    >
                      <span>🛡️ Dr. Anita Roy (Admin)</span>
                      {isAdmin && <span className="text-[10px] text-purple-600 font-bold">Active</span>}
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1 px-2">
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                    >
                      Custom Sign In / Register
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    >
                      {t.auth.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2 animate-in fade-in duration-150">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg text-left truncate ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
