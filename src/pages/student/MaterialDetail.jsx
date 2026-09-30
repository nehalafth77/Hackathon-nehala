import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { materialsAPI, bookmarksAPI, aiAPI, reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, OfficialBadge, ImportantBadge, TypeBadge } from '../../components/Badge';
import { FileIcon } from '../../components/FileIcon';
import {
  ArrowLeft, Download, ExternalLink, Bookmark, Flag, ThumbsUp,
  Brain, Sparkles, BookOpen, Clock, FileText, CheckCircle,
  HelpCircle, Copy, Share2, AlertCircle, Loader2, Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [usefulCount, setUsefulCount] = useState(0);

  // AI features state
  const [activeAITab, setActiveAITab] = useState(null); // 'summary' | 'quiz' | 'explain' | null
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiQuiz, setAiQuiz] = useState(null);
  const [aiExplain, setAiExplain] = useState(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect information');
  const [reportNotes, setReportNotes] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [matRes, bkRes] = await Promise.all([
          materialsAPI.getById(id),
          bookmarksAPI.getAll().catch(() => ({ data: { bookmarks: [] } })),
        ]);
        const mat = matRes.data.material;
        setMaterial(mat);
        setUsefulCount(mat.usefulCount || 0);

        const isBk = (bkRes.data.bookmarks || []).some(
          b => (b.material?._id || b.material) === id
        );
        setIsBookmarked(isBk);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load material details');
        navigate('/student/materials');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await bookmarksAPI.remove(id);
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        await bookmarksAPI.add(id);
        setIsBookmarked(true);
        toast.success('Saved to bookmarks');
      }
    } catch {
      toast.error('Failed to update bookmark');
    }
  };

  const handleUseful = async () => {
    try {
      const res = await materialsAPI.markUseful(id);
      setUsefulCount(res.data.usefulCount);
      toast.success('Marked as helpful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already marked');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // AI Actions
  const handleGenerateSummary = async () => {
    setActiveAITab('summary');
    if (aiSummary) return;
    setAiLoading(true);
    try {
      const res = await aiAPI.summarize({
        title: material.title,
        content: material.description || material.topic || `${material.subject} material`,
        materialId: material._id,
      });
      setAiSummary(res.data.summary || res.data.content);
    } catch (err) {
      toast.error('Failed to generate AI summary');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setActiveAITab('quiz');
    if (aiQuiz) return;
    setAiLoading(true);
    try {
      const res = await aiAPI.quiz({
        subject: material.subject,
        title: material.title,
        content: material.description || material.topic,
      });
      setAiQuiz(res.data.quiz || res.data.questions || []);
      setSelectedQuizAnswers({});
      setShowQuizResults(false);
    } catch (err) {
      toast.error('Failed to generate practice quiz');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateExplain = async () => {
    setActiveAITab('explain');
    if (aiExplain) return;
    setAiLoading(true);
    try {
      const res = await aiAPI.explain({
        topic: `${material.subject}: ${material.title}`,
        text: material.description || material.topic,
      });
      setAiExplain(res.data.explanation || res.data.content);
    } catch (err) {
      toast.error('Failed to generate explanation');
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuizAnswer = (qIndex, optIndex) => {
    if (showQuizResults) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await reportsAPI.create({
        materialId: material._id,
        reason: reportReason,
        notes: reportNotes,
      });
      toast.success('Report submitted. A faculty moderator will review it.');
      setShowReportModal(false);
      setReportNotes('');
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Helper for file download/link
  const getFileUrl = () => {
    if (!material) return '#';
    if (material.fileUrl?.startsWith('http')) return material.fileUrl;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${base}${material.fileUrl}`;
  };

  const isYouTube = material?.fileUrl && (material.fileUrl.includes('youtube.com') || material.fileUrl.includes('youtu.be'));
  const getYouTubeEmbedUrl = (url) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 mt-4">Loading material...</p>
      </div>
    );
  }

  if (!material) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back link */}
      <div>
        <Link
          to="/student/materials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Materials
        </Link>
      </div>

      {/* Main Material Card Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <FileIcon type={material.type} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <StatusBadge status={material.status} />
                {material.isOfficial && <OfficialBadge />}
                {material.isImportant && <ImportantBadge />}
                <TypeBadge type={material.type} />
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-medium">
                  Semester {material.semester || 'All'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {material.title}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{material.subject}</span>
                {material.unit && <span> • Unit/Module: {material.unit}</span>}
                {material.topic && <span> • {material.topic}</span>}
              </p>

              <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-gray-400">
                <span>Uploaded by <strong className="text-gray-600 dark:text-gray-300">{material.uploadedBy?.name || 'Peer'}</strong></span>
                <span>• {formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}</span>
                {material.fileSize > 0 && (
                  <span>• {(material.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                )}
                <span>• {material.downloadsCount || 0} downloads</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            {material.fileUrl && (
              <a
                href={getFileUrl()}
                target="_blank"
                rel="noreferrer"
                download
                className="btn btn-primary inline-flex items-center gap-2 shadow-sm"
              >
                {material.type === 'link' || material.fileUrl.startsWith('http') ? (
                  <>
                    <ExternalLink size={16} />
                    <span>Open Resource</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download</span>
                  </>
                )}
              </a>
            )}

            <button
              onClick={handleBookmark}
              className={`btn border inline-flex items-center gap-1.5 ${
                isBookmarked
                  ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 border-primary-200 dark:border-primary-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleUseful}
              className="btn btn-secondary border border-gray-200 dark:border-gray-700 inline-flex items-center gap-1.5"
              title="Mark this material as helpful"
            >
              <ThumbsUp size={16} className="text-emerald-600" />
              <span>{usefulCount} Helpful</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Share Link"
            >
              <Share2 size={16} />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              title="Report issue with this material"
            >
              <Flag size={16} />
            </button>
          </div>
        </div>

        {/* Tags row */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400 mr-1">Tags:</span>
            {material.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description & Teacher Note Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview / Description */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Overview & Notes</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {material.description || 'No additional notes provided for this study resource.'}
            </p>

            {/* Embedded YouTube preview if applicable */}
            {isYouTube && getYouTubeEmbedUrl(material.fileUrl) && (
              <div className="mt-5 rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-700">
                <iframe
                  src={getYouTubeEmbedUrl(material.fileUrl)}
                  title={material.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* External Resource Card */}
            {material.fileUrl && !isYouTube && (material.fileUrl.startsWith('http')) && (
              <div className="mt-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">External Study Resource</p>
                    <p className="text-xs text-gray-500 truncate max-w-md">{material.fileUrl}</p>
                  </div>
                </div>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Visit</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {/* AI Study Assistant Suite Panel */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 rounded-2xl border border-violet-200/60 dark:border-violet-800/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-sm">
                  <Brain size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    StudySphere AI Tutor
                    <span className="text-[10px] bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-semibold px-2 py-0.5 rounded-full">
                      Instant Prep
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500">Accelerate your revision directly from this material</p>
                </div>
              </div>
            </div>

            {/* AI Action Trigger Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
              <button
                onClick={handleGenerateSummary}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeAITab === 'summary'
                    ? 'bg-white dark:bg-gray-900 border-violet-500 shadow-sm text-violet-700 dark:text-violet-300'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Key Summary</span>
                  <Sparkles size={14} className="text-violet-600" />
                </div>
                <p className="text-[11px] text-gray-500">Bullet points & formula highlights</p>
              </button>

              <button
                onClick={handleGenerateQuiz}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeAITab === 'quiz'
                    ? 'bg-white dark:bg-gray-900 border-violet-500 shadow-sm text-violet-700 dark:text-violet-300'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Self Quiz (5 Qs)</span>
                  <HelpCircle size={14} className="text-violet-600" />
                </div>
                <p className="text-[11px] text-gray-500">Test exam readiness</p>
              </button>

              <button
                onClick={handleGenerateExplain}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  activeAITab === 'explain'
                    ? 'bg-white dark:bg-gray-900 border-violet-500 shadow-sm text-violet-700 dark:text-violet-300'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Explain Like I'm 5</span>
                  <BookOpen size={14} className="text-violet-600" />
                </div>
                <p className="text-[11px] text-gray-500">Simple analogies for tough topics</p>
              </button>
            </div>

            {/* AI Result Card */}
            {aiLoading && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-violet-600" />
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  AI is analyzing {material.title}...
                </p>
              </div>
            )}

            {!aiLoading && activeAITab === 'summary' && aiSummary && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-violet-100 dark:border-violet-900/50 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600">Quick AI Summary</h4>
                  <button onClick={() => { navigator.clipboard.writeText(aiSummary); toast.success('Summary copied'); }} className="text-gray-400 hover:text-gray-600 text-xs inline-flex items-center gap-1">
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {aiSummary}
                </div>
              </div>
            )}

            {!aiLoading && activeAITab === 'quiz' && aiQuiz && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-violet-100 dark:border-violet-900/50 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600">Practice Quiz</h4>
                  {!showQuizResults ? (
                    <button
                      onClick={() => setShowQuizResults(true)}
                      className="btn btn-primary text-xs py-1 px-3"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => { setSelectedQuizAnswers({}); setShowQuizResults(false); }}
                      className="text-xs text-gray-500 hover:text-primary-600"
                    >
                      Retry Quiz
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {Array.isArray(aiQuiz) ? aiQuiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {qIdx + 1}. {q.question || q}
                      </p>
                      {q.options && (
                        <div className="space-y-1.5 pl-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizAnswers[qIdx] === oIdx;
                            const isCorrect = showQuizResults && (oIdx === q.correctAnswer || opt === q.answer);
                            const isWrong = showQuizResults && isSelected && !isCorrect;

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                                    : isWrong
                                    ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300'
                                    : isSelected
                                    ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-violet-900 dark:text-violet-200'
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span>{opt}</span>
                                {isCorrect && <CheckCircle size={14} className="text-emerald-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )) : (
                    <p className="text-xs text-gray-600">{JSON.stringify(aiQuiz)}</p>
                  )}
                </div>
              </div>
            )}

            {!aiLoading && activeAITab === 'explain' && aiExplain && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-violet-100 dark:border-violet-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600">Conceptual Explanation</h4>
                <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {aiExplain}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar info */}
        <div className="space-y-6">
          {/* Teacher Review / Verification Status */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Verification Status</h3>

            {material.isVerified ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>Verified by Faculty</span>
                </div>
                {material.verifiedBy && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Reviewed by Prof. {material.verifiedBy.name || 'Faculty Member'}
                  </p>
                )}
                {material.teacherNotes && (
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 italic">
                    "{material.teacherNotes}"
                  </div>
                )}
              </div>
            ) : material.status === 'pending' ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                  <Clock size={16} className="text-amber-600" />
                  <span>Pending Faculty Review</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  This peer-uploaded material is awaiting review by department teachers.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                Community resource.
              </div>
            )}

            {/* Quick metadata list */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Branch/Course:</span>
                <span className="font-medium text-gray-900 dark:text-white">{material.course || 'B.Tech CSE'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Semester:</span>
                <span className="font-medium text-gray-900 dark:text-white">Semester {material.semester || 'All'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Category:</span>
                <span className="font-medium text-gray-900 dark:text-white uppercase">{material.type}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>File Format:</span>
                <span className="font-medium text-gray-900 dark:text-white">{material.fileType || 'Link / Document'}</span>
              </div>
            </div>
          </div>

          {/* Quick links to AI Chat */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Need deeper doubts solved?</h3>
            <p className="text-xs text-gray-500">
              Open the dedicated AI Tutor chat with this material's context loaded.
            </p>
            <Link
              to={`/student/ai?context=${encodeURIComponent(material.title + ' ' + (material.subject || ''))}`}
              className="btn btn-secondary w-full text-xs inline-flex items-center justify-center gap-2"
            >
              <Brain size={14} className="text-primary-600" />
              <span>Ask AI in Full Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Report Material</h3>
                <p className="text-xs text-gray-500">Flag incorrect or inappropriate study content</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="label">Reason</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="input text-sm"
                >
                  <option value="Incorrect information">Incorrect / Outdated information</option>
                  <option value="Broken link / Missing file">Broken link / Unreadable file</option>
                  <option value="Wrong subject or semester">Wrong subject or semester classification</option>
                  <option value="Copyright or duplicate content">Duplicate content / Copyright violation</option>
                  <option value="Inappropriate content">Inappropriate / Spam content</option>
                </select>
              </div>

              <div>
                <label className="label">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Explain what is wrong so teachers can correct or remove it..."
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  className="input text-sm"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="btn btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="btn bg-red-600 hover:bg-red-700 text-white text-xs px-4"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;
