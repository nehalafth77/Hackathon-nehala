import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsAPI } from '../services/api';
import {
  Search, Bell, Moon, Sun, ChevronDown, LogOut, Settings,
  Sparkles, CheckCircle2, Shield, User
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      const prefix = user?.role === 'teacher' ? '/teacher' : '/student';
      navigate(`${prefix}/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    } catch {}
  };

  const handleBellClick = () => {
    setShowNotifMenu(v => !v);
    if (!showNotifMenu) loadNotifications();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative group">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search study notes, question papers, topics..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="input pl-10 pr-16 h-10 text-xs sm:text-sm bg-slate-100/60 dark:bg-dark-850/80 border-slate-200/70 dark:border-slate-800/80 focus:bg-white dark:focus:bg-dark-900"
          />
          <div className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-dark-800 text-[10px] font-semibold text-slate-400 pointer-events-none">
            <span>Ctrl</span><span>K</span>
          </div>
        </div>
      </form>

      <div className="flex items-center gap-2.5 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={18} className="text-amber-400 animate-spin-slow" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:scale-95 transition-all relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                {unread}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-12 w-80 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-glass overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-dark-850/50">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Bell size={13} className="text-indigo-500" /> Notifications
                </h3>
                {unread > 0 && <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{unread} unread</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className={`p-3.5 hover:bg-slate-50 dark:hover:bg-dark-850/60 transition-colors ${!n.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}`}>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Sparkles size={11} className="text-indigo-500" /> {n.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] font-semibold text-slate-400 capitalize">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-glass overflow-hidden z-50 animate-slide-up p-1.5">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                to={`/${user?.role}/settings`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings size={14} className="text-slate-400" />
                Settings & Preferences
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

