import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { 
  Bell, CheckCircle2, ShieldCheck, AlertTriangle, 
  BookOpen, Brain, CheckSquare, Clock, Trash2, Check 
} from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, showToast } = useVault();
  const [filterType, setFilterType] = useState('all');

  const filtered = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => {
        const cat = n.category || n.type;
        if (filterType === 'material' || filterType === 'materials') {
          return cat === 'material' || cat === 'materials';
        }
        return cat === filterType;
      });

  const getIcon = (type) => {
    switch (type) {
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'duplicate':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'material':
      case 'materials':
        return <BookOpen className="w-5 h-5 text-vault-600" />;
      case 'revision':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      case 'quiz':
        return <CheckSquare className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time alerts on teacher verifications, duplicate flags, syllabus updates, and scheduled revisions.
          </p>
        </div>

        <button
          onClick={() => {
            notifications.forEach(n => markNotificationRead(n.id));
            showToast('All notifications marked as read', 'info');
          }}
          className="text-xs font-semibold text-vault-600 dark:text-vault-400 hover:text-vault-700 p-2 rounded-lg hover:bg-vault-50 dark:hover:bg-navy-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'verification', label: 'Teacher Verified' },
          { id: 'duplicate', label: 'Duplicate Flags' },
          { id: 'revision', label: 'Revision Due' },
          { id: 'material', label: 'New Material' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-vault-600 text-white shadow-sm'
                : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isRead = item.isRead ?? item.read;
          const msg = item.message ?? item.desc;
          const time = item.timestamp ?? item.time;
          const cat = item.category ?? item.type;

          return (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isRead
                  ? 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 opacity-75'
                  : 'bg-vault-50/40 dark:bg-vault-950/30 border-vault-200 dark:border-vault-900 shadow-vault-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(cat)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-vault-100 dark:bg-navy-800 text-vault-700 dark:text-vault-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {msg}
                </p>
              </div>

              {!isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-vault-600 shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
