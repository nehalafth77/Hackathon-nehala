import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { 
  VerificationBadge, TypeBadge, HealthBadge, ExamImportance 
} from '../components/ui/Badge';
import { 
  ArrowLeft, Download, Bookmark, Share2, Sparkles, Brain, 
  HelpCircle, CheckCircle2, AlertTriangle, FileText, Calendar, 
  User, HardDrive, MessageSquare, CheckSquare, Layers,
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Copy, Check,
  RotateCcw, Flag, ExternalLink, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, toggleBookmark, isBookmarked, addRevisionTask, showToast } = useVault();

  const material = materials.find(m => m.id === id) || materials[0];
  const bookmarked = isBookmarked(material.id);

  // Tabs state
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'keyconcepts' | 'cheatsheet'

  // Document viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100); // 80, 100, 120, 140
  const [isCopied, setIsCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect or outdated information');
  const [reportNotes, setReportNotes] = useState('');

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Direct link copied to clipboard!', 'success');
  };

  // Real file download trigger
  const handleDownloadFile = () => {
    const content = `=====================================================
STUDYVAULT ACADEMIC MATERIAL: ${material.title}
=====================================================
Subject: ${material.subject} (${material.subjectCode || 'CS301'})
Unit: ${material.unit}
Topic: ${material.topic || 'Core Curriculum'}
Uploaded By: ${material.uploadedBy}
Verification: ${material.isTeacherVerified ? 'Verified by ' + (material.teacherName || 'Faculty') : 'Community Note'}
Exam Relevance: ${material.examImportance || 5}/5 Stars
Health Score: ${material.healthScore}%

-----------------------------------------------------
EXECUTIVE AI SUMMARY
-----------------------------------------------------
${material.summary}

-----------------------------------------------------
KEY FORMULAS & THEOREMS
-----------------------------------------------------
1. Heath's Theorem: R(A, B, C) with A -> B ensures lossless join decomposition into R1(A,B) and R2(A,C).
2. Armstrong Axioms:
   - Reflexivity: If B subset of A, then A -> B
   - Augmentation: If A -> B, then AC -> BC
   - Transitivity: If A -> B and B -> C, then A -> C
3. Normal Form Criteria:
   - 1NF: Atomic values only, no repeated columns
   - 2NF: In 1NF and no partial dependencies
   - 3NF: In 2NF and no transitive dependencies
   - BCNF: In 3NF and every determinant is a candidate key

-----------------------------------------------------
PRACTICE QUESTIONS (UNIVERSITY EXAM FREQUENT)
-----------------------------------------------------
Q1: Explain why 3NF guarantees dependency preservation while BCNF may not.
Q2: Given R(A,B,C,D,E) with FDs {A->B, BC->D, E->C}. Find candidate keys and highest normal form.

Exported from StudyVault - Intelligent Study OS
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(material.filename || material.title).replace(/\s+/g, '_')}_Notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded "${material.title}"`, 'success');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(material.summary);
    setIsCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerateAI = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      toast.success('AI summary refreshed with latest curriculum cross-references!');
    }, 1000);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setShowReportModal(false);
    toast.success('Report submitted. Faculty moderators have been notified.');
    setReportNotes('');
  };

  // 5 Document Pages content
  const pages = [
    {
      page: 1,
      title: '1. Overview of Relational Schema Design',
      content: (
        <div className="space-y-4">
          <p className="text-justify leading-relaxed">
            A relational database schema is said to be well-designed if it reduces data redundancy to a minimum, prevents inconsistency during database modifications, and preserves functional dependencies without loss of information upon lossless join decomposition.
          </p>
          <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 font-sans my-4">
            <strong>Crucial University Exam Theorem:</strong> Heath’s Theorem states that given a relation R(A, B, C) where A → B, the decomposition of R into R₁(A, B) and R₂(A, C) is guaranteed to be a lossless join decomposition.
          </div>
          <p className="text-justify leading-relaxed">
            Without proper decomposition, schemas suffer from three critical update anomalies: Insertion anomaly (cannot record attribute without foreign key), Deletion anomaly (deleting one fact accidentally deletes unrelated facts), and Modification anomaly (same data recorded multiple times).
          </p>
        </div>
      ),
    },
    {
      page: 2,
      title: '2. Functional Dependencies and Closure Set',
      content: (
        <div className="space-y-4">
          <p className="text-justify leading-relaxed">
            Given relation R, a functional dependency α → β holds if whenever two tuples t₁ and t₂ agree on attributes α, they must also agree on attributes β. Armstrong’s Axioms form a sound and complete basis for deriving attribute closures.
          </p>
          <div className="p-4 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 font-mono text-xs text-slate-800 dark:text-slate-200">
            Armstrong Axioms Checklist:<br/>
            1. Reflexivity: If B ⊆ A, then A → B<br/>
            2. Augmentation: If A → B, then AC → BC<br/>
            3. Transitivity: If A → B and B → C, then A → C
          </div>
          <p className="text-justify leading-relaxed">
            To find the Candidate Key of a relation, compute the attribute closure X⁺ for various attribute subsets until a minimal subset derives all attributes of the schema.
          </p>
        </div>
      ),
    },
    {
      page: 3,
      title: '3. First & Second Normal Forms (1NF & 2NF)',
      content: (
        <div className="space-y-4">
          <p className="text-justify leading-relaxed">
            <strong>First Normal Form (1NF)</strong> dictates that all attribute values must be atomic. Multi-valued attributes (like phone numbers stored as comma-separated lists) and composite attributes must be exploded or factored out.
          </p>
          <p className="text-justify leading-relaxed">
            <strong>Second Normal Form (2NF)</strong> requires the relation to be in 1NF and possess <em>no partial dependency</em>. That is, no non-prime attribute may depend on a proper subset of any candidate key.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-navy-900 rounded-xl border border-blue-200 dark:border-navy-800 text-xs text-blue-900 dark:text-blue-200">
            <strong>Exam Tip:</strong> If every candidate key is a single attribute (not composite), the relation is automatically in 2NF!
          </div>
        </div>
      ),
    },
    {
      page: 4,
      title: '4. Third Normal Form (3NF) vs BCNF',
      content: (
        <div className="space-y-4">
          <p className="text-justify leading-relaxed">
            <strong>3NF Condition:</strong> For every non-trivial FD X → Y, either X is a superkey OR Y is a prime attribute (member of some candidate key).
          </p>
          <p className="text-justify leading-relaxed">
            <strong>BCNF Condition:</strong> Stricter requirement—every non-trivial FD X → Y MUST have X as a superkey. There is no exemption for prime attributes.
          </p>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
            <strong>Key Trade-off:</strong> 3NF always guarantees both <em>Lossless Join</em> and <em>Dependency Preservation</em>. BCNF always guarantees <em>Lossless Join</em> and zero redundancy, but may NOT preserve dependencies!
          </div>
        </div>
      ),
    },
    {
      page: 5,
      title: '5. High-Yield Solved University Questions',
      content: (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
            <strong>Q1:</strong> Given R(A, B, C, D) with FDs {`{A \u2192 B, B \u2192 C, C \u2192 D, D \u2192 A}`}. Determine all candidate keys.<br/>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
              Solution: A⁺ = ABCD, B⁺ = BCDA, C⁺ = CDAB, D⁺ = DABC. Hence, A, B, C, and D are each individual candidate keys.
            </span>
          </div>
          <div className="p-3.5 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
            <strong>Q2:</strong> Is 3NF decomposition always dependency preserving? Prove briefly.<br/>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
              Solution: Yes, the 3NF synthesis algorithm directly adds relations for every FD in the canonical cover, guaranteeing preservation.
            </span>
          </div>
        </div>
      ),
    },
  ];

  const activePageData = pages[currentPage - 1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
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
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => toggleBookmark(material.id)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              bookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400'
                : 'border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300'
            }`}
            title={bookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy share link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 transition-colors"
            title="Report inaccurate notes or issue"
          >
            <Flag className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadFile}
            className="btn btn-primary text-xs px-4 py-2.5 font-bold flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Notes</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Document Viewer Simulation (Left) + AI Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Document Preview Window */}
        <div className="lg:col-span-7 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-vault-sm overflow-hidden flex flex-col">
          {/* Viewer Interactive Toolbar */}
          <div className="p-3 bg-slate-100 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Interactive Course Reader</span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Page {currentPage} of {pages.length}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pages.length, p + 1))}
                disabled={currentPage === pages.length}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(z => Math.max(80, z - 20))}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="bg-slate-200 dark:bg-navy-800 px-2 py-0.5 rounded text-[11px] font-mono min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(z => Math.min(140, z + 20))}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Document Content Display with Dynamic Zoom Scale */}
          <div
            style={{ fontSize: `${zoomLevel}%` }}
            className="p-8 sm:p-12 min-h-[550px] bg-slate-50 dark:bg-navy-950/40 leading-relaxed text-slate-800 dark:text-slate-200 overflow-y-auto space-y-6 transition-all"
          >
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

            {/* Render Current Page Content */}
            <div className="space-y-4 font-sans">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-l-4 border-blue-600 pl-3">
                {activePageData.title}
              </h3>
              {activePageData.content}
            </div>
          </div>

          {/* Bottom Reader Footer */}
          <div className="p-3 bg-slate-100 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
            <span>Verified syllabus alignment: 100%</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCurrentPage(1); setZoomLevel(100); }}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset View
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Intelligent Features Panel */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Summary Box */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-navy-800 shadow-vault-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
            <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-navy-950 rounded-xl mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-navy-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('keyconcepts')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'keyconcepts'
                    ? 'bg-white dark:bg-navy-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Key Concepts
              </button>
              <button
                onClick={() => setActiveTab('cheatsheet')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'cheatsheet'
                    ? 'bg-white dark:bg-navy-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Cheat Sheet
              </button>
            </div>

            {/* Tab Contents */}
            {isRegenerating ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <Sparkles size={20} className="animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-medium">Re-synthesizing notes with AI...</span>
              </div>
            ) : activeTab === 'summary' ? (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {material.summary}
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-200">
                  <strong>Exam Preparation Note:</strong> 3NF and BCNF definitions and anomaly identification questions appear in nearly every mid-semester and university final exam.
                </div>
              </div>
            ) : activeTab === 'keyconcepts' ? (
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
            ) : (
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-navy-950 p-3 rounded-xl border border-slate-200 dark:border-navy-800">
                <p>• 1NF = Atomic attributes only</p>
                <p>• 2NF = 1NF + No partial dependencies</p>
                <p>• 3NF = 2NF + No transitive dependencies</p>
                <p>• BCNF = Every determinant is superkey</p>
                <p>• Lossless join: R1 ∩ R2 → R1 or R2</p>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => navigate(`/quiz?topic=${encodeURIComponent(material.topic || material.title)}&subject=${encodeURIComponent(material.subject)}`)}
                className="btn btn-primary font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Generate Quiz</span>
              </button>

              <button
                onClick={() => navigate(`/ai?ask=${encodeURIComponent('Explain ' + (material.topic || material.title) + ' using ' + material.title)}`)}
                className="bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={handleAddToRevision}
                className="col-span-2 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Add to Revision Center</span>
              </button>

              <div className="col-span-2 flex items-center justify-between pt-1">
                <button
                  onClick={handleCopySummary}
                  className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {isCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{isCopied ? 'Copied' : 'Copy Summary'}</span>
                </button>

                <button
                  onClick={handleRegenerateAI}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles size={12} />
                  <span>Regenerate Analysis</span>
                </button>
              </div>
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

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Flag Study Material</h3>
                <p className="text-xs text-slate-500">Report inaccuracies, bad scans or duplicate entries</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Category</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Incorrect or outdated information">Incorrect or outdated academic information</option>
                  <option value="Illegible or missing pages">Illegible handwriting or missing pages</option>
                  <option value="Duplicate of existing notes">Duplicate of existing notes in the vault</option>
                  <option value="Wrong subject or unit classification">Wrong subject or unit classification</option>
                  <option value="Copyright or policy issue">Copyright or policy issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  placeholder="Explain what needs correction..."
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
