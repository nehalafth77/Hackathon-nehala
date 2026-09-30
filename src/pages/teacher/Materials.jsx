import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialsAPI, teacherAPI } from '../../services/api';
import { FileIcon } from '../../components/FileIcon';
import { StatusBadge, OfficialBadge, ImportantBadge } from '../../components/Badge';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  FileText, Search, Plus, Trash2, CheckCircle, Star, Shield,
  ExternalLink, Filter, X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const TeacherMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        subject: filterSubject !== 'All' ? filterSubject : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      const res = await materialsAPI.getAll(params);
      setMaterials(res.data.materials || []);
    } catch {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [filterSubject, filterStatus]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from StudySphere?`)) return;
    try {
      await materialsAPI.delete(id);
      setMaterials(prev => prev.filter(m => m._id !== id));
      toast.success('Material deleted');
    } catch {
      toast.error('Failed to delete material');
    }
  };

  const subjects = ['All', 'DBMS', 'Operating Systems', 'Computer Networks', 'Java', 'Computer Graphics', 'Data Structures'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-primary-600" size={24} />
            Materials Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, manage, and moderate all study resources across subjects and semesters
          </p>
        </div>

        <Link
          to="/teacher/upload"
          className="btn btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus size={16} />
          <span>Upload Official Resource</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, topic, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchMaterials()}
            className="input text-xs h-9 py-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="input text-xs h-9 py-1 px-3 w-auto"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input text-xs h-9 py-1 px-3 w-auto"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved / Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <LoadingSkeleton count={5} />
      ) : materials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No materials found"
          message="Adjust search query or filter options."
        />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Title & Subject</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Uploaded By</th>
                  <th className="py-3.5 px-4">Status & Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {materials.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <FileIcon type={m.type} />
                        <div>
                          <Link
                            to={`/student/material/${m._id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-1"
                          >
                            {m.title}
                          </Link>
                          <span className="text-[11px] text-gray-400">
                            {m.subject} • Sem {m.semester} {m.unit && `• ${m.unit}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 uppercase font-semibold text-gray-600 dark:text-gray-400">
                      {m.type}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500">
                      <div>{m.uploadedBy?.name || 'Peer'}</div>
                      <div className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <StatusBadge status={m.status} />
                        {m.isOfficial && <OfficialBadge />}
                        {m.isImportant && <ImportantBadge />}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/student/material/${m._id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="View"
                        >
                          <ExternalLink size={15} />
                        </Link>

                        <button
                          onClick={() => handleDelete(m._id, m.title)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete Material"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMaterials;
