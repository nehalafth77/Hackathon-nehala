import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, FileText, Image, Video, Link as LinkIcon, Download, Eye, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { TypeBadge, VerificationBadge, HealthBadge, ExamImportance } from '../ui/Badge';
import { useVault } from '../../context/VaultContext';

export const getFileIcon = (type) => {
  switch (type) {
    case 'pdf':
      return <FileText size={20} className="text-rose-500" />;
    case 'image':
      return <Image size={20} className="text-purple-500" />;
    case 'video':
      return <Video size={20} className="text-cyan-500" />;
    case 'link':
      return <LinkIcon size={20} className="text-emerald-500" />;
    default:
      return <FileText size={20} className="text-blue-500" />;
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MaterialCard = ({ material, viewMode = 'grid' }) => {
  const { toggleBookmark } = useVault();

  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 hover:border-blue-500/50 hover:shadow-vault transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            {getFileIcon(material.type)}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              to={`/material/${material.id}`}
              className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
            >
              {material.title}
            </Link>
            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{material.subject}</span>
              <span>•</span>
              <span>{material.unit}</span>
              <span>•</span>
              <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Source: {material.source}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 sm:justify-end flex-shrink-0">
          <VerificationBadge verified={material.isTeacherVerified} teacherName={material.teacherName} />
          <TypeBadge type={material.type} />
          <HealthBadge score={material.healthScore} />

          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <button
              onClick={() => toggleBookmark(material.id)}
              className={`p-2 rounded-xl transition-colors ${
                material.isBookmarked
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={material.isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
            >
              <Bookmark size={15} fill={material.isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/material/${material.id}`}
              className="btn btn-secondary text-xs px-3.5 py-1.5 font-bold"
            >
              Open
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-vault hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full relative">
      <div>
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            {getFileIcon(material.type)}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleBookmark(material.id)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                material.isBookmarked
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={material.isBookmarked ? 'Bookmarked' : 'Save to bookmarks'}
            >
              <Bookmark size={15} fill={material.isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Title & Subject */}
        <Link to={`/material/${material.id}`} className="block">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {material.title}
          </h4>
        </Link>
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
          {material.subject}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {material.unit} {material.topic && `• ${material.topic}`}
        </p>

        {/* Badges Pill Row */}
        <div className="flex items-center flex-wrap gap-1.5 mt-3.5">
          <VerificationBadge verified={material.isTeacherVerified} teacherName={material.teacherName} />
          <TypeBadge type={material.type} />
        </div>

        {/* Source metadata */}
        <div className="mt-3.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="truncate">Source: <strong className="text-slate-700 dark:text-slate-300 font-medium">{material.source}</strong></span>
          <span className="flex-shrink-0 text-slate-400">{formatFileSize(material.fileSize)}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <HealthBadge score={material.healthScore} />
        <Link
          to={`/material/${material.id}`}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Open Material <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};

export default MaterialCard;
