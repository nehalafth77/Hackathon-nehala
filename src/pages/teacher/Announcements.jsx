import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  Megaphone, Plus, Pin, AlertCircle, Clock, Trash2,
  Calendar, CheckCircle, Send, Loader2
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [semester, setSemester] = useState('All');
  const [course, setCourse] = useState('B.Tech CSE');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementsAPI.getAll();
      setAnnouncements(res.data.announcements || []);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter title and content');
      return;
    }

    setSubmitting(true);
    try {
      await announcementsAPI.create({
        title: title.trim(),
        content: content.trim(),
        priority,
        semester: semester === 'All' ? undefined : Number(semester),
        course,
        isPinned,
      });
      toast.success('Notice published to student cohorts!');
      setTitle('');
      setContent('');
      setIsPinned(false);
      setShowCreateForm(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[11px] font-bold uppercase bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full inline-flex items-center gap-1"><AlertCircle size={12} /> Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">High Priority</span>;
      default:
        return <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">General</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="text-primary-600" size={24} />
            Department Announcements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Broadcast official notices, exam schedules, and academic updates directly to student cohorts
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(v => !v)}
          className="btn btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus size={16} />
          <span>{showCreateForm ? 'Close Form' : 'Broadcast New Notice'}</span>
        </button>
      </div>

      {/* Broadcast Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateAnnouncement} className="bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800/60 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            New Academic Broadcast
          </h2>

          <div className="space-y-1.5">
            <label className="label">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. End Semester Exam Timetable Released / Lab Manual Submission Deadline"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="label">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="input"
              >
                <option value="normal">Normal Notice</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Immediate Action</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="label">Target Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="input"
              >
                <option value="All">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="label">Target Cohort</label>
              <select
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="input"
              >
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech IT">B.Tech IT</option>
                <option value="All">All Branches</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label">Detailed Notice Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Provide complete instructions, room numbers, dates, or relevant links..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={e => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600"
              />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Pin size={13} /> Pin to top of student dashboards
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary text-xs px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary text-xs px-5 inline-flex items-center gap-1.5"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Publish Notice</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notices List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No notices published yet"
          message="Keep your students updated by creating your first broadcast announcement."
          action={
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary text-xs inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Publish Notice
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    {getPriorityBadge(item.priority)}
                    {item.isPinned && (
                      <span className="text-[11px] font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Pin size={11} /> Pinned
                      </span>
                    )}
                    <span className="text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                      {item.semester ? `Semester ${item.semester}` : 'All Semesters'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={13} />
                  <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <span>Published by {item.author?.name || 'Faculty Member'}</span>
                <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
