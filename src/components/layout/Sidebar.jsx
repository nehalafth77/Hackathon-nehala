import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Brain,
  CheckCircle2,
  Calendar,
  HelpCircle,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vault', label: 'My Vault', icon: FolderOpen },
  { path: '/search', label: 'Smart Search', icon: Search, badge: 'AI' },
  { path: '/ai', label: 'AI Study Assistant', icon: Brain, isSpecial: true },
  { path: '/quiz', label: 'Quiz Generator', icon: HelpCircle },
  { path: '/revision', label: 'Revision Center', icon: Calendar },
  { path: '/verified', label: 'Verified Materials', icon: CheckCircle2 },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ collapsed, onToggle }) => {
  const { user, isTeacher, switchRole, logout } = useAuth();
  const { notifications, revisionTasks } = useVault();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingTasks = revisionTasks.filter(t => t.status === 'pending').length;

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 h-screen sticky top-0 z-40 select-none shadow-vault-sm`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-800/80 justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            {/* Minimal Logo: Book + Vault */}
            <span className="font-extrabold text-sm tracking-wider">SV</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-normal text-slate-800 dark:text-slate-200 text-base">Study</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-base">Vault</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Intelligent Study OS
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Workspace
          </p>
        )}

        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-900/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : ''}
            >
              <div
                className={`p-1 rounded-lg ${
                  item.isSpecial
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-inherit'
                }`}
              >
                <Icon size={17} />
              </div>

              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {/* Dynamic Badges */}
              {!collapsed && item.path === '/notifications' && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {unreadCount}
                </span>
              )}

              {!collapsed && item.path === '/revision' && pendingTasks > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {pendingTasks}
                </span>
              )}

              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Switcher & User Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Instant Role Toggle for Demo evaluation */}
        {!collapsed && (
          <button
            onClick={switchRole}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle between Student and Teacher demo views"
          >
            <span className="flex items-center gap-1.5">
              <UserCheck size={13} className="text-blue-600" />
              <span>Role: {isTeacher ? 'Faculty View' : 'Student View'}</span>
            </span>
            <span className="text-[10px] text-blue-600 font-bold uppercase underline">
              Switch
            </span>
          </button>
        )}

        {/* Profile Info */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${
            collapsed ? 'justify-center p-1.5' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.avatarInitials || 'AS'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Arjun Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {isTeacher ? 'Professor' : `Sem ${user?.semester || 6} • CS`}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
