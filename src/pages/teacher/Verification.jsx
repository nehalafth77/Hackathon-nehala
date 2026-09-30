import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { FileIcon } from '../../components/FileIcon';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  CheckSquare, CheckCircle, XCircle, ExternalLink, Download,
  Star, Shield, MessageSquare, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Verification = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Review state
  const [activeItem, setActiveItem] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [isOfficial, setIsOfficial] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('Incorrect or incomplete content');
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getPending();
      setPendingList(res.data.materials || []);
    } catch (err) {
      toast.error('Failed to load pending queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openApproveModal = (item) => {
    setActiveItem(item);
    setActionType('approve');
    setIsOfficial(false);
    setIsImportant(item.isImportant || false);
    setTeacherNotes('');
  };

  const openRejectModal = (item) => {
    setActiveItem(item);
    setActionType('reject');
    setRejectReason('Incorrect or incomplete content');
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!activeItem) return;
    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await teacherAPI.approve(activeItem._id, {
          isOfficial,
          isImportant,
          teacherNotes: teacherNotes.trim(),
        });
        toast.success(`"${activeItem.title}" verified and approved!`);
      } else {
        await teacherAPI.reject(activeItem._id, {
          reason: rejectReason,
        });
        toast.success(`Submission returned with feedback.`);
      }
      setActiveItem(null);
      setActionType(null);
      fetchPending();
    } catch {
      toast.error('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getFileUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${base}${url}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="text-primary-600" size={24} />
          Material Verification Queue
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review student contributions, ensure curriculum quality, and badge verified notes for the cohort
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : pendingList.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="Queue is completely clear!"
          message="No materials currently awaiting verification. Check back when students upload new resources."
        />
      ) : (
        <div className="space-y-4">
          {pendingList.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:border-primary-200 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <FileIcon type={item.type} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded">
                        Pending Review
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                        {item.subject}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                        Sem {item.semester}
                      </span>
                      <span className="text-xs uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                        {item.type}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {item.unit && <span>Unit/Module: {item.unit} • </span>}
                      {item.topic && <span>Topic: {item.topic} • </span>}
                      <span>Uploaded by <strong>{item.uploadedBy?.name || 'Student'}</strong> ({formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })})</span>
                    </p>

                    {item.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg max-w-2xl">
                        "{item.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right controls: View / Approve / Reject */}
                <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0 self-end lg:self-center">
                  {item.fileUrl && (
                    <a
                      href={getFileUrl(item.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      <span>View File</span>
                    </a>
                  )}

                  <button
                    onClick={() => openApproveModal(item)}
                    className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    <span>Approve & Verify</span>
                  </button>

                  <button
                    onClick={() => openRejectModal(item)}
                    className="btn bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs px-3 py-2 inline-flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal (Approve or Reject) */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {actionType === 'approve' ? 'Verify & Publish Material' : 'Reject Submission'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{activeItem.title}</p>
              </div>
              <button
                onClick={() => { setActiveItem(null); setActionType(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              {actionType === 'approve' ? (
                <>
                  <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOfficial}
                        onChange={e => setIsOfficial(e.target.checked)}
                        className="w-4 h-4 rounded text-primary-600"
                      />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Shield size={14} className="text-primary-600" /> Mark as Official Faculty Material
                      </span>
                    </label>
                    <p className="text-[11px] text-gray-400 ml-6">
                      Displays a golden "Official" badge and highlights it as authoritative course syllabus material.
                    </p>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={isImportant}
                        onChange={e => setIsImportant(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500"
                      />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" /> High Priority / Exam Prep
                      </span>
                    </label>
                    <p className="text-[11px] text-gray-400 ml-6">
                      Promotes this item directly into students' Exam Revision sections.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="label">Teacher Review Note (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Excellent summary of B-Trees and Normalization. Highly recommended for end-semester exams."
                      value={teacherNotes}
                      onChange={e => setTeacherNotes(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="label">Reason for Rejection</label>
                    <select
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="input text-xs"
                    >
                      <option value="Incorrect or incomplete content">Incorrect or incomplete content</option>
                      <option value="Illegible handwriting or blurry scan">Illegible handwriting or blurry scan</option>
                      <option value="Duplicate material already present">Duplicate material already present</option>
                      <option value="Wrong subject/semester selected">Wrong subject/semester selected</option>
                      <option value="Broken link or missing document">Broken link or missing document</option>
                      <option value="Copyright or policy violation">Copyright or policy violation</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveItem(null); setActionType(null); }}
                  className="btn btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn text-xs px-5 inline-flex items-center gap-1.5 ${
                    actionType === 'approve'
                      ? 'btn-primary'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>{actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
