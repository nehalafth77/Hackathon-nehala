import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, Search, Bookmark, Upload, Brain,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  FileText, Users, CheckSquare, Megaphone, AlertTriangle,
  BookMarked, GraduationCap, Menu
} from 'lucide-react';

const studentNav = [
  { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/student/materials', icon: FileText, label: 'My Materials' },
  { path: '/student/search', icon: Search, label: 'Search' },
  { path: '/student/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/student/upload', icon: Upload, label: 'Upload' },
  { path: '/student/ai', icon: Brain, label: 'AI Assistant' },
  { path: '/student/announcements', icon: Bell, label: 'Announcements' },
];

const teacherNav = [
  { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/teacher/verification', icon: CheckSquare, label: 'Verification' },
  { path: '/teacher/materials', icon: FileText, label: 'Materials' },
  { path: '/teacher/upload', icon: Upload, label: 'Upload' },
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
    <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-sidebar flex-shrink-0 h-screen sticky top-0`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">StudySphere</span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${isActive(path) ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5">
        <Link
          to={`/${user?.role}/settings`}
          className={`sidebar-link ${isActive(`/${user?.role}/settings`) ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Settings' : ''}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-2 bg-gray-50 dark:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`sidebar-link text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
