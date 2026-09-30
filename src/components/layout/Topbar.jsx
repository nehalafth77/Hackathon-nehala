import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Upload, Plus, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useVault } from '../../context/VaultContext';

export const Topbar = () => {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const { notifications, searchQuery, setSearchQuery, markNotificationRead } = useVault();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(searchQuery || '');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 gap-4 sticky top-0 z-30 transition-colors">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search notes, PDFs, topics, subjects... (e.g. Normalization, Deadlocks)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="input pl-10 pr-16 h-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900"
          />
          <div className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-400 pointer-events-none">
            <span>/</span>
          </div>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Upload Action */}
        <Link
          to="/upload"
          className="btn btn-primary text-xs px-3.5 py-2 font-bold hidden sm:inline-flex"
        >
          <Plus size={15} />
          <span>Upload Material</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-vault-lg overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications
                </h4>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.slice(0, 4).map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Card */}
        <Link
          to="/settings"
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {user?.avatarInitials || 'AS'}
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline truncate max-w-[90px]">
            {user?.name?.split(' ')[0]}
          </span>
        </Link>
      </div>
    </header>
  );
};
