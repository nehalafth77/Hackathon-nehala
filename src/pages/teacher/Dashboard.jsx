import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI, materialsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatCard, LoadingSkeleton, EmptyState } from '../../components/UI';
import { StatusBadge, TypeBadge } from '../../components/Badge';
import { FileIcon } from '../../components/FileIcon';
import {
  CheckSquare, FileText, AlertTriangle, Upload, Megaphone,
  CheckCircle, XCircle, ArrowRight, Clock, Star, Users, Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingCount: 0,
    totalVerified: 0,
    totalMaterials: 0,
    reportedCount: 0,
  });
  const [pendingList, setPendingList] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, recentRes] = await Promise.all([
        teacherAPI.getStats().catch(() => ({ data: { stats: {} } })),
        teacherAPI.getPending().catch(() => ({ data: { materials: [] } })),
        materialsAPI.getAll({ limit: 5 }).catch(() => ({ data: { materials: [] } })),
      ]);

      const pList = pendingRes.data.materials || [];
      setPendingList(pList.slice(0, 5));
      setRecentUploads(recentRes.data.materials || []);

      const s = statsRes.data.stats || {};
      setStats({
        pendingCount: pList.length,
        totalVerified: s.totalVerified || 0,
        totalMaterials: s.totalMaterials || 0,
        reportedCount: s.reportedCount || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load teacher dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickApprove = async (id, e) => {
    e.preventDefault();
    try {
      await teacherAPI.approve(id, { isOfficial: false, isImportant: false });
      toast.success('Material approved!');
      fetchDashboardData();
    } catch {
      toast.error('Failed to approve');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white mb-1">
            <Shield size={14} /> Faculty Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Prof. {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-sm text-primary-100 leading-relaxed">
            Review peer-uploaded notes, broadcast official department notifications, and curate exam-standard academic resources.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              to="/teacher/verification"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CheckSquare size={16} />
              <span>Review Pending Queue ({stats.pendingCount})</span>
            </Link>
            <Link
              to="/teacher/upload"
              className="bg-primary-800/80 hover:bg-primary-800 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 border border-primary-400/30 transition-all"
            >
              <Upload size={16} />
              <span>Upload Official Notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckSquare}
          label="Pending Verification"
          value={stats.pendingCount}
          color="from-amber-500 to-orange-500"
          change={stats.pendingCount > 0 ? "Requires review" : "All cleared"}
        />
        <StatCard
          icon={CheckCircle}
          label="Verified Materials"
          value={stats.totalVerified}
          color="from-emerald-500 to-teal-500"
          change="Quality checked"
        />
        <StatCard
          icon={FileText}
          label="Total Database"
          value={stats.totalMaterials}
          color="from-blue-500 to-indigo-500"
          change="Campus-wide"
        />
        <StatCard
          icon={AlertTriangle}
          label="Reported Items"
          value={stats.reportedCount}
          color="from-rose-500 to-red-500"
          change={stats.reportedCount > 0 ? "Attention required" : "No reports"}
        />
      </div>

      {/* Main Grid: Pending Approvals & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verification Queue */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckSquare size={18} className="text-amber-500" />
                Pending Verification Queue
              </h2>
              <p className="text-xs text-gray-500">Student submissions waiting for teacher approval</p>
            </div>
            <Link
              to="/teacher/verification"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : pendingList.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">No pending submissions!</p>
              <p className="text-xs text-gray-400">All student uploads have been moderated.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingList.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <FileIcon type={item.type} />
                    <div className="min-w-0">
                      <Link
                        to={`/student/material/${item._id}`}
                        className="text-sm font-bold text-gray-900 dark:text-white hover:text-primary-600 truncate block"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.subject} • Sem {item.semester} • Uploaded by {item.uploadedBy?.name || 'Student'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => handleQuickApprove(item._id, e)}
                      className="btn btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>
                    <Link
                      to={`/teacher/verification`}
                      className="btn btn-secondary text-xs py-1.5 px-3"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Materials */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quick Tasks</h3>
            <div className="space-y-2">
              <Link
                to="/teacher/upload"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-300 hover:bg-primary-50/30 dark:hover:bg-primary-950/20 transition-all text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center">
                  <Upload size={16} />
                </div>
                <div>
                  <p>Upload Official Notes</p>
                  <p className="text-[11px] text-gray-400 font-normal">Publish lecture slides & syllabus</p>
                </div>
              </Link>

              <Link
                to="/teacher/announcements"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-300 hover:bg-primary-50/30 dark:hover:bg-primary-950/20 transition-all text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center">
                  <Megaphone size={16} />
                </div>
                <div>
                  <p>Broadcast Notice</p>
                  <p className="text-[11px] text-gray-400 font-normal">Post deadline or exam alert</p>
                </div>
              </Link>

              <Link
                to="/teacher/reports"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-300 hover:bg-primary-50/30 dark:hover:bg-primary-950/20 transition-all text-xs font-semibold text-gray-700 dark:text-gray-300"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p>Flagged Reports</p>
                  <p className="text-[11px] text-gray-400 font-normal">Check student-flagged items</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Department Guidelines */}
          <div className="bg-gradient-to-br from-indigo-50 to-primary-50 dark:from-indigo-950/20 dark:to-primary-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 p-5 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
              <Shield size={16} /> Faculty Moderation Tips
            </div>
            <ul className="space-y-1.5 text-indigo-800 dark:text-indigo-300 list-disc pl-4 leading-relaxed">
              <li>Approve only legible notes with accurate subject & unit labeling.</li>
              <li>Mark trusted materials as <strong>"Official"</strong> to rank them at the top.</li>
              <li>Tag high-yield questions as <strong>"Exam Prep"</strong> for students during exams.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
