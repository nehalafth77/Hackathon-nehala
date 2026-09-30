import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { materialsAPI, bookmarksAPI, announcementsAPI } from '../../services/api';
import { StatCard, LoadingSkeleton, EmptyState } from '../../components/UI';
import { FileIcon } from '../../components/FileIcon';
import { StatusBadge } from '../../components/Badge';
import {
  FileText, Search, Upload, Brain, Bookmark, ChevronRight,
  ArrowUpRight, TrendingUp, Star, Clock, Zap, MessageSquare, Sparkles, BookOpen
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const SUBJECTS = [
  { name: 'DBMS', count: 0, color: 'from-violet-500 to-purple-600', emoji: '🗄️' },
  { name: 'Operating Systems', count: 0, color: 'from-blue-500 to-indigo-600', emoji: '💻' },
  { name: 'Computer Networks', count: 0, color: 'from-emerald-500 to-teal-600', emoji: '🌐' },
  { name: 'Java', count: 0, color: 'from-amber-500 to-orange-600', emoji: '☕' },
  { name: 'Computer Graphics', count: 0, color: 'from-pink-500 to-rose-600', emoji: '🎨' },
  { name: 'Data Structures', count: 0, color: 'from-cyan-500 to-blue-600', emoji: '📊' },
];

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link to={to} className="group bg-white/80 dark:bg-dark-900/80 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-slate-800/80 p-4 hover:border-indigo-500/50 hover:shadow-card-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center gap-2.5 text-center">
    <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
      <Icon size={20} />
    </div>
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
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

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        setStats({
          total: mats.length,
          verified: mats.filter(m => m.status === 'verified').length,
          important: mats.filter(m => m.isImportant).length,
          newThisWeek: mats.filter(m => new Date(m.createdAt) > weekAgo).length,
        });

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting Banner */}
      <div className="relative rounded-3xl p-7 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white overflow-hidden shadow-card-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wide uppercase text-white/90 mb-2">
              <Sparkles size={12} /> Student Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-lg">All your semester notes, PYQs, and AI tutor features in one centralized dashboard.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link to="/student/search" className="btn-secondary text-xs px-4 py-2.5 font-bold bg-white/15 text-white border-white/20 hover:bg-white/25">
              <Search size={14} /> Search Notes
            </Link>
            <Link to="/student/upload" className="btn-secondary text-xs px-4 py-2.5 font-bold bg-white text-indigo-700 hover:bg-white/90 shadow-md">
              <Upload size={14} /> Upload Note
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Resources" value={loading ? '...' : stats.total} icon={FileText} color="indigo" />
        <StatCard label="Teacher Verified" value={loading ? '...' : stats.verified} icon={Star} color="green" change={stats.newThisWeek} />
        <StatCard label="High Yield Notes" value={loading ? '...' : stats.important} icon={TrendingUp} color="orange" />
        <StatCard label="New This Week" value={loading ? '...' : stats.newThisWeek} icon={Clock} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Launcher */}
          <div>
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Quick Workflows</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <QuickAction icon={Upload} label="Upload" to="/student/upload" color="bg-indigo-600" />
              <QuickAction icon={Search} label="Search" to="/student/search" color="bg-violet-600" />
              <QuickAction icon={Brain} label="Ask AI" to="/student/ai" color="bg-pink-600" />
              <QuickAction icon={Zap} label="Quiz" to="/student/ai?mode=quiz" color="bg-amber-600" />
              <QuickAction icon={Bookmark} label="Bookmarks" to="/student/bookmarks" color="bg-emerald-600" />
              <QuickAction icon={MessageSquare} label="Import" to="/student/upload?source=whatsapp" color="bg-cyan-600" />
            </div>
          </div>

          {/* Recent Materials */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recently Added Materials</h2>
              <Link to="/student/materials" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={13} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton rows={4} />
            ) : materials.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No study materials yet"
                description="Upload notes, assignments, or previous year question papers to get started."
                action={<Link to="/student/upload" className="btn-primary">Upload First Resource</Link>}
              />
            ) : (
              <div className="space-y-2.5">
                {materials.slice(0, 6).map(m => (
                  <Link key={m._id} to={`/student/material/${m._id}`} className="block group">
                    <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-4 hover:border-indigo-500/50 hover:shadow-card transition-all duration-200">
                      <div className="flex items-center gap-3.5">
                        <FileIcon type={m.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {m.title}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {m.subject} {m.unit && `• ${m.unit}`}
                            {' • by '}{m.uploadedBy?.name || 'Peer'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={m.status} />
                          <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                            {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* My Subjects */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Semester Subjects</h2>
            </div>
            <div className="space-y-2">
              {subjects.map(sub => (
                <Link
                  key={sub.name}
                  to={`/student/materials?subject=${encodeURIComponent(sub.name)}`}
                  className="flex items-center gap-3.5 p-3.5 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 rounded-2xl hover:border-indigo-500/50 hover:shadow-card transition-all duration-200 group"
                >
                  <span className="text-xl">{sub.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{sub.name}</p>
                    <p className="text-[11px] font-medium text-slate-400">{sub.count} resources</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements Ticker */}
          {announcements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Announcements</h2>
                <Link to="/student/announcements" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
              </div>
              <div className="space-y-2.5">
                {announcements.slice(0, 2).map(a => (
                  <div key={a._id} className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{a.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{a.message}</p>
                    <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-2">by Prof. {a.teacher?.name}</p>
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

