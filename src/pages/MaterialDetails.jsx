import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { 
  VerificationBadge, TypeBadge, HealthBadge, ExamImportance 
} from '../components/ui/Badge';
import { 
  ArrowLeft, Download, Bookmark, Share2, Sparkles, Brain, 
  HelpCircle, CheckCircle2, AlertTriangle, FileText, Calendar, 
  User, HardDrive, MessageSquare, CheckSquare, Layers 
} from 'lucide-react';

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, toggleBookmark, isBookmarked, addRevisionTask, showToast } = useVault();

  const material = materials.find(m => m.id === id) || materials[0];
  const bookmarked = isBookmarked(material.id);

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'keyconcepts' | 'qa'

  const formatFileSize = (bytes) => {
    if (!bytes) return '1.8 MB';
    if (typeof bytes === 'string') return bytes;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleAddToRevision = () => {
    addRevisionTask({
      subject: material.subject,
      topic: material.topic || material.title,
      unit: material.unit,
      difficulty: 'Medium',
      materialId: material.id
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-vault-600 dark:text-vault-400">
                {material.subject}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500">{material.unit}</span>
              <VerificationBadge 
                verified={material.isTeacherVerified || material.verificationStatus === 'verified'} 
                teacherName={material.teacherName}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {material.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleBookmark(material.id)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              bookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400'
                : 'border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => showToast('Link copied to clipboard', 'info')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Share material"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast(`Downloading ${material.title}...`, 'success')}
            className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Viewer Simulation (Left) + AI Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Document Preview Window */}
        <div className="lg:col-span-7 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-vault-sm overflow-hidden flex flex-col">
          {/* Viewer Toolbar */}
          <div className="p-3 bg-slate-100 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-vault-600" />
              <span>Document Viewer Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Page 1 of 14</span>
              <span className="bg-slate-200 dark:bg-navy-800 px-2 py-0.5 rounded text-[11px] font-mono">
                100% Zoom
              </span>
            </div>
          </div>

          {/* Document Content Display (Academic Layout Simulation) */}
          <div className="p-8 sm:p-12 min-h-[550px] bg-slate-50 dark:bg-navy-950/40 font-serif leading-relaxed text-slate-800 dark:text-slate-200 overflow-y-auto space-y-6">
            <div className="border-b-2 border-slate-300 dark:border-navy-700 pb-4 text-center font-sans">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Department of Computer Science & Engineering
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {material.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                {material.subject} • {material.unit} • Verified Course Material
              </p>
            </div>

            {/* Document Body Text */}
            <div className="space-y-4 text-sm font-sans">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-vault-600 pl-3">
                1. Overview of Relational Schema Design
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-justify">
                A relational database schema is said to be well-designed if it reduces data redundancy to a minimum, prevents inconsistency during database modifications, and preserves functional dependencies without loss of information upon lossless join decomposition.
              </p>

              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 font-sans my-4">
                <strong>Crucial University Exam Theorem:</strong> Heath’s Theorem states that given a relation $R(A, B, C)$ where $A \rightarrow B$, the decomposition of $R$ into $R_1(A, B)$ and $R_2(A, C)$ is guaranteed to be a lossless join decomposition.
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-vault-600 pl-3 pt-2">
                2. Functional Dependencies and Closure Set
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-justify">
                Given relation $R$, a functional dependency $\alpha \rightarrow \beta$ holds if whenever two tuples $t_1$ and $t_2$ agree on attributes $\alpha$, they must also agree on attributes $\beta$. Armstrong’s Axioms (Reflexivity, Augmentation, Transitivity) form a sound and complete basis for deriving attribute closures.
              </p>

              <div className="p-4 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                Armstrong Axioms Checklist:<br/>
                1. Reflexivity: If B ⊆ A, then A → B<br/>
                2. Augmentation: If A → B, then AC → BC<br/>
                3. Transitivity: If A → B and B → C, then A → C
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Intelligent Features Panel */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Summary Box */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-navy-800 shadow-vault-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-vault-50 dark:bg-vault-950/60 text-vault-600 dark:text-vault-400 flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    StudyVault AI Summary
                  </h2>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Synthesized from document text
                  </span>
                </div>
              </div>
              <ExamImportance level={material.examImportance || material.examRelevance || 5} />
            </div>

            {/* AI Summary Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-navy-950 rounded-xl mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-navy-900 text-vault-600 dark:text-vault-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Executive Summary
              </button>
              <button
                onClick={() => setActiveTab('keyconcepts')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'keyconcepts'
                    ? 'bg-white dark:bg-navy-900 text-vault-600 dark:text-vault-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Key Concepts
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'summary' ? (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {material.summary}
                </p>
                <div className="p-3 bg-vault-50 dark:bg-vault-950/40 rounded-xl border border-vault-100 dark:border-vault-900 text-xs text-vault-800 dark:text-vault-200">
                  <strong>Exam Preparation Note:</strong> 3NF and BCNF definitions and anomaly identification questions appear in nearly every mid-semester and university final exam.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Fundamental Concepts Tested
                </span>
                {(material.keyConcepts || ['Functional Dependencies', 'Normal Forms', 'Decomposition Properties']).map((concept, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{concept}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => navigate(`/quiz?topic=${encodeURIComponent(material.topic)}&subject=${encodeURIComponent(material.subject)}`)}
                className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Generate Quiz</span>
              </button>

              <button
                onClick={() => navigate(`/ai?ask=${encodeURIComponent('Explain ' + material.topic + ' using ' + material.title)}`)}
                className="bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-vault-600" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={handleAddToRevision}
                className="col-span-2 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Add to Revision Center</span>
              </button>
            </div>
          </div>

          {/* Metadata Card & Health Status */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Material Metadata
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Uploaded By
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {material.uploadedBy}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date Added
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {material.uploadedDate}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" /> File Size & Type
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {material.type?.toUpperCase() || 'PDF'} • {formatFileSize(material.fileSize)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Original Source
                </span>
                <span className="font-medium bg-slate-100 dark:bg-navy-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  {material.source}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 block mb-1.5">Study Material Health</span>
                <HealthBadge score={material.healthScore} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
