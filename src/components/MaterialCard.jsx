import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FileIcon } from './FileIcon';
import { StatusBadge, OfficialBadge, ImportantBadge, TypeBadge } from './Badge';
import { bookmarksAPI, materialsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

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
        toast.success('Bookmarked!');
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
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-card-md transition-all duration-200 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3">
            <FileIcon type={material.type} />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                    {material.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {material.subject} {material.unit && `• ${material.unit}`} {material.topic && `• ${material.topic}`}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {showActions && (
                    <button
                      type="button"
                      onClick={handleBookmark}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isBookmarked
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                      <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-1.5 mt-2">
                <StatusBadge status={material.status} />
                {material.isOfficial && <OfficialBadge />}
                {material.isImportant && <ImportantBadge />}
                <TypeBadge type={material.type} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          <div className="truncate">
            <span>by {material.uploadedBy?.name || 'Peer'}</span>
            {material.fileSize > 0 && <span> • {formatSize(material.fileSize)}</span>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleUseful}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-600 transition-colors font-medium bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded"
              title="Mark as helpful"
            >
              👍 <span>{useful}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MaterialCard;
