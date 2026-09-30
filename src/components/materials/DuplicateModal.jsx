import React from 'react';
import { AlertCircle, CheckCircle2, Copy, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Link } from 'react-router-dom';

export const DuplicateModal = ({
  isOpen,
  onClose,
  uploadedFile,
  existingMaterial,
  similarityPercentage = 92,
  onKeepBoth,
  onReplace,
  duplicateInfo,
  onResolve,
}) => {
  const currentExisting = existingMaterial || duplicateInfo?.matchedMaterial || duplicateInfo?.existingMaterial;
  const currentUploaded = uploadedFile || duplicateInfo?.uploadedFile || { name: 'DBMS_Unit3_Notes.pdf' };
  const currentSimilarity = similarityPercentage || duplicateInfo?.similarityPercentage || 92;

  const handleKeepBoth = onKeepBoth || (() => onResolve && onResolve('keep_both'));
  const handleReplace = onReplace || (() => onResolve && onResolve('replace'));

  if (!currentExisting) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligent Duplicate Detection"
      subtitle="StudyVault analyzed your file contents to keep your library clean and uncluttered"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Similarity Score Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-sm">
              {currentSimilarity}%
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">High Content Overlap Detected</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                The content matches existing notes already stored in your subject folder.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
            Semantic Match
          </span>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Upload */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Your New Upload
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUploaded?.name || 'DBMS_Unit3_Notes.pdf'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Size: 2.4 MB • New Upload</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
              Detected topics: Database Normalization, Functional Dependencies, 3NF & BCNF criteria.
            </div>
          </div>

          {/* Existing Material in Vault */}
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} /> Already in Your Vault
              </div>
              {(currentExisting.isTeacherVerified || currentExisting.verificationStatus === 'verified') && (
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentExisting.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentExisting.subject} • {currentExisting.unit}
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
              Uploaded by {currentExisting.uploadedBy} on {currentExisting.uploadedDate}. Health: {currentExisting.healthScore}%.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={`/material/${currentExisting.id}`}
            onClick={onClose}
            className="btn btn-ghost text-xs w-full sm:w-auto"
          >
            View Existing Notes
          </Link>
          <button
            type="button"
            onClick={handleKeepBoth}
            className="btn btn-secondary text-xs w-full sm:w-auto font-bold"
          >
            Keep Both Files
          </button>
          <button
            type="button"
            onClick={handleReplace}
            className="btn btn-primary text-xs w-full sm:w-auto font-bold"
          >
            Replace with New File
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DuplicateModal;
