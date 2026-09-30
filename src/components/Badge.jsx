import React from 'react';
import { CheckCircle2, Clock, XCircle, Star, ShieldCheck, Sparkles } from 'lucide-react';

const statusConfig = {
  verified: {
    label: 'Teacher Verified',
    icon: CheckCircle2,
    className: 'badge-verified',
  },
  pending: {
    label: 'Pending Review',
    icon: Clock,
    className: 'badge-pending',
  },
  rejected: {
    label: 'Needs Fix',
    icon: XCircle,
    className: 'badge-rejected',
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={config.className}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export const OfficialBadge = () => (
  <span className="badge-official">
    <ShieldCheck size={12} />
    Official Handout
  </span>
);

export const ImportantBadge = () => (
  <span className="badge-important">
    <Star size={12} />
    High Yield
  </span>
);

export const TypeBadge = ({ type }) => {
  const typeMap = {
    pdf: { label: 'PDF', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    doc: { label: 'DOC', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    ppt: { label: 'PPT', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    image: { label: 'IMG', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    notes: { label: 'Notes', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    video: { label: 'Video', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
    link: { label: 'Link', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
    'question-paper': { label: 'PYQ', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    assignment: { label: 'Task', bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  };

  const item = typeMap[type] || { label: type?.toUpperCase() || 'FILE', bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.bg}`}>
      {item.label}
    </span>
  );
};

