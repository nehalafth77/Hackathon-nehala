import React, { useState, useEffect } from 'react';
import { Bookmark, ThumbsUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FileIcon } from './FileIcon';
import { StatusBadge, OfficialBadge, ImportantBadge, TypeBadge } from './Badge';
import { bookmarksAPI, materialsAPI } from '../services/api';
import toast from 'react-hot-toast';

const MaterialCard = ({ material, isBookmarked: initialBookmarked = false, onBookmarkToggle, onMarkUseful, showActions = true }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [useful, setUseful] = useState(material.usefulCount || 0);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isBookmarked) {
        await bookmarksAPI.remove(material._id);
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await bookmarksAPI.add(material._id);
        setIsBookmarked(true);
        toast.success('Saved to Bookmarks!');
      }
      onBookmarkToggle?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleUseful = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await materialsAPI.markUseful(material._id);
      setUseful(res.data.usefulCount);
      onMarkUseful?.();
      toast.success('Marked as helpful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already marked');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Link to={`/student/material/${material._id}`} className="block group h-full">
      <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-card-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden">
        {/* Subtle accent corner highlight */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 via-violet-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <div>
          <div className="flex items-start gap-3.5">
            <FileIcon type={material.type} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {material.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {material.subject} {material.unit && `• ${material.unit}`} {material.topic && `• ${material.topic}`}
                  </p>
                </div>

                {showActions && (
                  <button
                    type="button"
                    onClick={handleBookmark}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      isBookmarked
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm'
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
                  >
                    <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center flex-wrap gap-1.5 mt-3">
                <StatusBadge status={material.status} />
                {material.isOfficial && <OfficialBadge />}
                {material.isImportant && <ImportantBadge />}
                <TypeBadge type={material.type} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">
              {material.uploadedBy?.name ? material.uploadedBy.name[0].toUpperCase() : 'P'}
            </div>
            <span className="truncate">{material.uploadedBy?.name || 'Peer Student'}</span>
            {material.fileSize > 0 && <span className="text-slate-400">• {formatSize(material.fileSize)}</span>}
          </div>

          <button
            type="button"
            onClick={handleUseful}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-100/70 dark:bg-dark-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
            title="Mark as helpful"
          >
            <ThumbsUp size={12} className="text-emerald-500" />
            <span>{useful}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MaterialCard;

