import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Plus, Check, UserCheck, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useVault } from '../../context/VaultContext';
import toast from 'react-hot-toast';

export const Topbar = () => {
  const { user, isTeacher, switchRole } = useAuth();
  const { isDark, toggle } = useTheme();
  const { notifications, searchQuery, setSearchQuery, markNotificationRead, markAllNotificationsRead } = useVault();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(searchQuery || '');
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Keyboard shortcut: press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    setShowNotifications(false);
    if (n.materialId) {
      navigate(`/material/${n.materialId}`);
    } else {
      navigate('/notifications');
    }
  };

  const handleRoleToggle = () => {
    switchRole();
    toast.success(isTeacher ? 'Switched to Student Workspace' : 'Switched to Faculty Portal', {
      icon: isTeacher ? '👨‍🎓' : '👩‍🏫',
    });
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 sticky top-0 z-30 transition-colors">
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes, PDFs, topics... (Press '/' to focus)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="input pl-10 pr-12 h-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900"
          />
          <div className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-400 pointer-events-none">
            <span>/</span>
          </div>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Role Toggle Pill Button (Quick Tester Switch) */}
        <button
          onClick={handleRoleToggle}
          className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            isTeacher
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 hover:bg-purple-100'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 hover:bg-blue-100'
          }`}
          title="Click to toggle between Student and Faculty View"
        >
          {isTeacher ? <ShieldCheck size={14} /> : <GraduationCap size={14} />}
          <span>{isTeacher ? 'Faculty Mode' : 'Student Mode'}</span>
          <span className="text-[10px] opacity-60 ml-0.5 font-normal">(Switch)</span>
        </button>

        {/* Quick Upload Action */}
        <Link
          to="/upload"
          className="btn btn-primary text-xs px-3.5 py-2 font-bold hidden sm:inline-flex items-center gap-1.5 shadow-sm"
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
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-vault-lg overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-0.5"
                      title="Mark all as read"
                    >
                      <Check size={11} /> Mark read
                    </button>
                  )}
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
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
