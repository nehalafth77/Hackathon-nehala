import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  Bell, Megaphone, AlertCircle, Calendar, User, Pin, Clock, CheckCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await announcementsAPI.getAll();
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        toast.error('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="text-[11px] font-bold uppercase bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <AlertCircle size={12} /> Urgent Notice
          </span>
        );
      case 'high':
        return (
          <span className="text-[11px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full">
            High Priority
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
            General
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone className="text-primary-600" size={24} />
          Department Notices & Announcements
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Official academic updates, exam schedules, deadlines, and verified announcements from faculty
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices at this time"
          message="Check back later for exam schedule updates, syllabus changes, and teacher notices."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border shadow-sm transition-all ${
                item.priority === 'urgent'
                  ? 'border-red-200 dark:border-red-900/60 ring-1 ring-red-500/20'
                  : 'border-gray-100 dark:border-gray-800 hover:border-primary-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    {getPriorityBadge(item.priority)}
                    {item.isPinned && (
                      <span className="text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Pin size={11} /> Pinned
                      </span>
                    )}
                    {item.semester && (
                      <span className="text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                        Sem {item.semester}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                  <Clock size={13} />
                  <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center font-bold text-[10px]">
                    {item.author?.name ? item.author.name[0] : 'F'}
                  </div>
                  <span>Posted by <strong className="text-gray-600 dark:text-gray-300">{item.author?.name || 'Department Faculty'}</strong></span>
                </div>

                <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
