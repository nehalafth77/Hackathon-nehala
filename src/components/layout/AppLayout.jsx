import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LayoutDashboard, FolderOpen, Search, Brain, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-50 px-2 shadow-lg">
        {[
          { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
          { path: '/vault', label: 'Vault', icon: FolderOpen },
          { path: '/search', label: 'Search', icon: Search },
          { path: '/ai', label: 'AI Study', icon: Brain },
          { path: '/revision', label: 'Revision', icon: Calendar },
        ].map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AppLayout;
