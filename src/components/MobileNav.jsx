import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, Upload, Brain, Bookmark } from 'lucide-react';

const studentMobileNav = [
  { path: '/student/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/student/search', icon: Search, label: 'Search' },
  { path: '/student/upload', icon: Upload, label: 'Upload' },
  { path: '/student/ai', icon: Brain, label: 'AI' },
  { path: '/student/bookmarks', icon: Bookmark, label: 'Saved' },
];

const teacherMobileNav = [
  { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/teacher/verification', icon: Upload, label: 'Verify' },
  { path: '/teacher/materials', icon: Search, label: 'Materials' },
  { path: '/teacher/announcements', icon: Brain, label: 'Posts' },
];

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navItems = user?.role === 'teacher' ? teacherMobileNav : studentMobileNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
