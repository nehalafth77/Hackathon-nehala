import React from 'react';
import { CheckCircle2, ShieldCheck, Star, AlertTriangle, FileText, Image, Link as LinkIcon, Video, HelpCircle, FileSpreadsheet } from 'lucide-react';

export const VerificationBadge = ({ verified = true, teacherName }) => {
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Community Upload
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30 shadow-sm"
      title={teacherName ? `Verified by ${teacherName}` : 'Teacher Verified'}
    >
      <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
      <span>Teacher Verified</span>
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const configs = {
    pdf: { label: 'PDF', bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/60' },
    notes: { label: 'Notes', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/60' },
    'question-paper': { label: 'PYQ', bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60' },
    ppt: { label: 'Slides', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/60' },
    image: { label: 'Image', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/60' },
    video: { label: 'Video', bg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/60' },
    link: { label: 'Link', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60' },
  };

  const item = configs[type] || { label: type?.toUpperCase() || 'DOC', bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${item.bg}`}>
      {item.label}
    </span>
  );
};

export const HealthBadge = ({ score = 90 }) => {
  let color = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60';
  if (score < 80) color = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60';
  else if (score < 90) color = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${color}`}>
      <span>Health:</span>
      <span>{score}%</span>
    </span>
  );
};

export const ExamImportance = ({ level = 5 }) => {
  return (
    <div className="inline-flex items-center gap-0.5 text-amber-500" title={`Exam Importance: ${level}/5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < level ? 'currentColor' : 'none'}
          className={i < level ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
    </div>
  );
};
