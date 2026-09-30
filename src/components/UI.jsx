import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin shadow-md shadow-indigo-500/20`} />
      {text && <p className="text-xs font-semibold text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export const LoadingSkeleton = ({ rows = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 shadow-sm animate-pulse">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/40 dark:bg-dark-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-indigo-500/20">
      {Icon && <Icon size={30} className="text-indigo-600 dark:text-indigo-400" />}
    </div>
    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
    {description && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>}
    {action && action}
  </div>
);

export const PageHeader = ({ title, subtitle, action, badge }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-2">{action}</div>}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, color = 'indigo', change }) => {
  const colorStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-indigo-500/10',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
    orange: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-amber-500/10',
    blue: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 shadow-cyan-500/10',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 shadow-violet-500/10',
    primary: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-indigo-500/10',
  };

  return (
    <div className="stat-card group relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight group-hover:scale-105 transition-transform duration-200 origin-left">
            {value}
          </p>
          {change !== undefined && (
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
              <ArrowUpRight size={12} /> {change} new this week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md transition-transform duration-300 group-hover:rotate-6 ${colorStyles[color] || colorStyles.indigo}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

