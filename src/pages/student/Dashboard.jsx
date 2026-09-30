import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { materialsAPI, bookmarksAPI, announcementsAPI } from '../../services/api';
import { StatCard, LoadingSkeleton, EmptyState } from '../../components/UI';
import { FileIcon, SubjectIcon } from '../../components/FileIcon';
import { StatusBadge, TypeBadge } from '../../components/Badge';
import {
  FileText, Search, Upload, Brain, Bookmark, ChevronRight,
  ArrowUpRight, TrendingUp, Star, Clock, Zap, MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const SUBJECTS = [
  { name: 'DBMS', count: 0, color: 'from-violet-500 to-purple-600', emoji: '🗄️' },
  { name: 'Operating Systems', count: 0, color: 'from-blue-500 to-indigo-600', emoji: '💻' },
  { name: 'Computer Networks', count: 0, color: 'from-green-500 to-emerald-600', emoji: '🌐' },
  { name: 'Java', count: 0, color: 'from-orange-500 to-amber-600', emoji: '☕' },
  { name: 'Computer Graphics', count: 0, color: 'from-pink-500 to-rose-600', emoji: '🎨' },
  { name: 'Data Structures', count: 0, color: 'from-cyan-500 to-teal-600', emoji: '📊' },
];

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link to={to} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-card-md transition-all duration-200 flex flex-col items-center gap-2 text-center">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
      <Icon size={20} className="text-white" />
    </div>
    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </Link>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [subjects, setSubjects] = useState(SUBJECTS);
  const [stats, setStats] = useState({ total: 0, verified: 0, important: 0, newThisWeek: 0 });
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [matRes, bkRes, annRes] = await Promise.all([
          materialsAPI.getAll({ limit: 8 }),
          bookmarksAPI.getAll(),
          announcementsAPI.getAll(),
        ]);

        const mats = matRes.data.materials || [];
        setMaterials(mats);
        setBookmarks(bkRes.data.bookmarks || []);
        setAnnouncements(annRes.data.announcements || []);

        // Calculate stats
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        setStats({
          total: mats.length,
          verified: mats.filter(m => m.status === 'verified').length,
          important: mats.filter(m => m.isImportant).length,
          newThisWeek: mats.filter(m => new Date(m.createdAt) > weekAgo).length,
        });

        // Count subjects
        const subjectCounts = {};
        mats.forEach(m => {
          subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1;
        });
        setSubjects(SUBJECTS.map(s => ({ ...s, count: subjectCounts[s.name] || 0 })));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const bookmarkedIds = new Set(bookmarks.map(b => b.material?._id));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white">
        <h1 className="text-xl font-bold mb-1">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-white/70 text-sm">Continue learning and keep your study materials organized.</p>
        <div className="flex items-center gap-3 mt-4">
          <Link to="/student/search" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
            <Search size={14} />
            Search materials
          </Link>
          <Link to="/student/upload" className="flex items-center gap-2 bg-white text-primary-700 hover:bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Upload size={14} />
            Upload
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Resources" value={loading ? '...' : stats.total} icon={FileText} color="primary" />
        <StatCard label="Verified" value={loading ? '...' : stats.verified} icon={Star} color="green" change={stats.newThisWeek} />
        <StatCard label="Important" value={loading ? '...' : stats.important} icon={TrendingUp} color="orange" />
        <StatCard label="New This Week" value={loading ? '...' : stats.newThisWeek} icon={Clock} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <QuickAction icon={Upload} label="Upload" to="/student/upload" color="bg-primary-500" />
              <QuickAction icon={Search} label="Search" to="/student/search" color="bg-violet-500" />
              <QuickAction icon={Brain} label="Ask AI" to="/student/ai" color="bg-pink-500" />
              <QuickAction icon={Zap} label="Quiz" to="/student/ai?mode=quiz" color="bg-orange-500" />
              <QuickAction icon={Bookmark} label="Bookmarks" to="/student/bookmarks" color="bg-green-500" />
              <QuickAction icon={MessageSquare} label="WhatsApp" to="/student/upload?source=whatsapp" color="bg-emerald-500" />
            </div>
          </div>

          {/* Recent Materials */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Materials</h2>
              <Link to="/student/materials" className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton rows={4} />
            ) : materials.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No materials yet"
                description="Upload your first study material to get started."
                action={<Link to="/student/upload" className="btn-primary">Upload Material</Link>}
              />
            ) : (
              <div className="space-y-2">
                {materials.slice(0, 6).map(m => (
                  <Link key={m._id} to={`/student/material/${m._id}`} className="block group">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-card transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <FileIcon type={m.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            {m.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {m.subject} {m.unit && `• ${m.unit}`}
                            {' • by '}{m.uploadedBy?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={m.status} />
                          <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Subjects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">My Subjects</h2>
            </div>
            <div className="space-y-2">
              {subjects.map(sub => (
                <Link
                  key={sub.name}
                  to={`/student/materials?subject=${encodeURIComponent(sub.name)}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-card transition-all duration-200 group"
                >
                  <span className="text-xl">{sub.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sub.name}</p>
                    <p className="text-xs text-gray-400">{sub.count} materials</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Announcements</h2>
                <Link to="/student/announcements" className="text-xs text-primary-600">View all</Link>
              </div>
              <div className="space-y-2">
                {announcements.slice(0, 2).map(a => (
                  <div key={a._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1.5">by {a.teacher?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
