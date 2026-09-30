import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Search, Bookmark, Upload, Brain,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  FileText, CheckSquare, Megaphone, AlertTriangle,
  GraduationCap, Sparkles, ShieldCheck
} from 'lucide-react';

const studentNav = [
  { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/student/materials', icon: FileText, label: 'My Materials' },
  { path: '/student/search', icon: Search, label: 'Search' },
  { path: '/student/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/student/upload', icon: Upload, label: 'Upload Note' },
  { path: '/student/ai', icon: Brain, label: 'AI Assistant', isSpecial: true },
  { path: '/student/announcements', icon: Bell, label: 'Announcements' },
];

const teacherNav = [
  { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/teacher/verification', icon: CheckSquare, label: 'Verification' },
  { path: '/teacher/materials', icon: FileText, label: 'Materials' },
  { path: '/teacher/upload', icon: Upload, label: 'Upload Handout' },
  { path: '/teacher/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/teacher/reports', icon: AlertTriangle, label: 'Reports' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = user?.role === 'teacher' ? teacherNav : studentNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white/85 dark:bg-dark-900/85 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-all duration-300 shadow-sidebar flex-shrink-0 h-screen sticky top-0 z-40`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200/70 dark:border-slate-800/70 justify-between">
        <Link to={`/${user?.role || 'student'}/dashboard`} className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0 group">
            <GraduationCap size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                StudySphere
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                <Sparkles size={9} /> Academic Hub
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label, isSpecial }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`sidebar-link relative group ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? label : ''}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isSpecial && !active
                  ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                  : active
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}>
                <Icon size={18} />
              </div>
              {!collapsed && (
                <span className="flex-1 truncate font-medium text-sm">
                  {label}
                </span>
              )}
              {!collapsed && isSpecial && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="p-3 border-t border-slate-200/70 dark:border-slate-800/70 space-y-2">
        <Link
          to={`/${user?.role}/settings`}
          className={`sidebar-link ${isActive(`/${user?.role}/settings`) ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Settings' : ''}
        >
          <div className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400">
            <Settings size={18} />
          </div>
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>

        {!collapsed && user && (
          <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-dark-850/80 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex-shrink-0">
              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck size={10} className={user.role === 'teacher' ? 'text-violet-500' : 'text-indigo-500'} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`sidebar-link text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 w-full ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <div className="p-1.5 rounded-lg">
            <LogOut size={18} />
          </div>
          {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

