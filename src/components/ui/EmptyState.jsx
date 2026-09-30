import React from 'react';
import { FolderOpen, Search, BookOpen, AlertCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon,
  type,
  title = 'No materials found',
  description = 'Try adjusting your search query or filters to find what you need.',
  action,
  actionText,
  onAction,
}) => {
  let DisplayIcon = Icon;
  if (!DisplayIcon) {
    if (type === 'search') DisplayIcon = Search;
    else if (type === 'error') DisplayIcon = AlertCircle;
    else DisplayIcon = FolderOpen;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
        <DisplayIcon size={26} />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-5">{description}</p>
      {action ? (
        action
      ) : actionText && onAction ? (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
