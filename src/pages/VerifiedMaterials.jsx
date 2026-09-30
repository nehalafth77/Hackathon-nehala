import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import MaterialCard from '../components/materials/MaterialCard';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, Eye, 
  ThumbsUp, ThumbsDown, BookOpen, AlertCircle, Sparkles, Filter 
} from 'lucide-react';

export default function VerifiedMaterials() {
  const navigate = useNavigate();
  const { 
    materials, 
    pendingVerifications, 
    approveMaterial, 
    rejectMaterial 
  } = useVault();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(user.role === 'teacher' ? 'queue' : 'verified');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const verifiedMaterials = materials.filter(m => m.isTeacherVerified || m.verificationStatus === 'verified');

  const filteredVerified = selectedSubject === 'All'
    ? verifiedMaterials
    : verifiedMaterials.filter(m => m.subject === selectedSubject);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-navy-950 to-vault-950 text-white rounded-3xl p-6 sm:p-8 shadow-vault-md border border-emerald-800/40 relative overflow-hidden">
        <div className="max-w-2xl z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Academic Integrity & Faculty Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Verified Materials
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Materials marked with the green verification badge have been scrutinized and validated by certified university faculty for 100% syllabus alignment and exam correctness.
          </p>
        </div>
      </div>

      {/* Tabs Bar: Student Verified Materials vs Faculty Verification Queue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-navy-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Materials ({verifiedMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-vault-600 text-white shadow-sm'
                : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Faculty Review Queue ({pendingVerifications.length})</span>
            {pendingVerifications.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>

        {activeTab === 'verified' && (
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Database Management Systems">DBMS</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: Verified Materials Display */}
      {activeTab === 'verified' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVerified.map((material) => (
              <MaterialCard key={material.id} material={material} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Faculty Verification Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Faculty Mode Active:</strong> You can inspect student uploads, verify conceptual accuracy against the university curriculum syllabus, and approve or request revision.
            </p>
          </div>

          {pendingVerifications.length > 0 ? (
            <div className="space-y-3">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-vault-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-vault-600 dark:text-vault-400">
                        {item.subject}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500">{item.unit}</span>
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Pending Verification
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Uploaded by: <strong className="text-slate-700 dark:text-slate-300">{item.uploadedBy}</strong></span>
                      <span>•</span>
                      <span>{item.uploadedAt || item.uploadedDate || 'Recent'}</span>
                      <span>•</span>
                      <span>{item.fileSize}</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-navy-950 p-2.5 rounded-xl border border-slate-100 dark:border-navy-800/80 mt-2">
                      <strong className="text-slate-800 dark:text-slate-200">AI Extraction Summary: </strong>
                      {item.summary || `${item.confidenceScore || '92% AI verified'}. Key concepts and lecture topics extracted and aligned with syllabus.`}
                    </div>
                  </div>

                  {/* Teacher Action Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => navigate(`/material/mat_01`)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => rejectMaterial(item.id)}
                      className="px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => approveMaterial(item.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Queue Clean & Up-to-Date
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                All submitted study materials for this semester have been verified and processed by faculty.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
