import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI, materialsAPI } from '../../services/api';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  AlertTriangle, CheckCircle, Trash2, ExternalLink, Shield,
  FileText, Clock, User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TeacherReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getReports();
      setReports(res.data.reports || []);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteMaterial = async (materialId, reportId) => {
    if (!window.confirm('Are you sure you want to remove this reported material?')) return;
    try {
      await materialsAPI.delete(materialId);
      setReports(prev => prev.filter(r => r._id !== reportId));
      toast.success('Reported material removed from database');
    } catch {
      toast.error('Failed to remove material');
    }
  };

  const handleDismiss = (reportId) => {
    setReports(prev => prev.filter(r => r._id !== reportId));
    toast.success('Report dismissed');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="text-rose-500" size={24} />
          Flagged Study Materials & Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review community reports regarding inaccurate notes, copyright issues, or unreadable uploads
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No reported items"
          message="Great job! The study repository is clean and has no active student flags."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((item) => {
            const mat = item.material;
            return (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-950/60 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle size={12} /> {item.reason}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Resource: {mat?.title || 'Unknown Material'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Subject: {mat?.subject || 'N/A'} • Reported by {item.reportedBy?.name || 'A student'}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {item.notes && (
                  <div className="text-xs text-gray-700 dark:text-gray-300 bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <strong>Student comments:</strong> "{item.notes}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                  {mat ? (
                    <Link
                      to={`/student/material/${mat._id}`}
                      className="text-primary-600 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      Inspect Material
                    </Link>
                  ) : (
                    <span className="text-gray-400">Material removed</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(item._id)}
                      className="btn btn-secondary text-xs px-3 py-1.5"
                    >
                      Dismiss Report
                    </button>

                    {mat && (
                      <button
                        onClick={() => handleDeleteMaterial(mat._id, item._id)}
                        className="btn bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 inline-flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        Delete Material
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherReports;
