import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Brain, HelpCircle, Calendar, ArrowRight,
  Sparkles, CheckCircle2, FileText, FolderOpen, ShieldCheck,
  TrendingUp, Clock, ChevronRight, Zap, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import { MaterialCard } from '../components/materials/MaterialCard';
import { KnowledgeMap } from '../components/materials/KnowledgeMap';

const SEARCH_SUGGESTIONS = [
  'Find my DBMS normalization notes',
  'Show Unit 4 Deadlock PDFs',
  'What did I save about TCP 3-Way Handshake?',
  'Find teacher-verified material',
];

export const Dashboard = () => {
  const { user } = useAuth();
  const { materials, revisionTasks, stats, setSearchQuery } = useVault();
  const navigate = useNavigate();

  const [heroSearchInput, setHeroSearchInput] = useState('');

  const handleHeroSearch = (queryText) => {
    const q = queryText || heroSearchInput;
    if (!q.trim()) return;
    setSearchQuery(q.trim());
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter recent materials
  const recentMaterials = materials.slice(0, 4);
  const pendingRevision = revisionTasks.filter(t => t.status === 'pending').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Personalized Greeting Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Active Study Session</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Arjun'} 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          You're <strong className="text-slate-700 dark:text-slate-300">68%</strong> through your weekly study goals. Your scattered notes are synchronized and organized.
        </p>
      </div>

      {/* Prominent AI Search Hero Box (Req #8 & #35) */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-vault-md relative overflow-hidden">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-blue-200 mb-4">
            <Sparkles size={12} className="text-blue-300" />
            <span>Natural Language Academic Retrieval</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
            Ask your study library anything.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mb-6 leading-relaxed">
            Search across your notes, PDFs, lecture transcripts, and teacher verified materials without opening individual folders.
          </p>

          {/* Large Functional Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleHeroSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg"
          >
            <div className="relative flex-1 flex items-center">
              <Search size={18} className="absolute left-4 text-blue-200" />
              <input
                type="text"
                placeholder="Search your notes, PDFs, links and resources..."
                value={heroSearchInput}
                onChange={(e) => setHeroSearchInput(e.target.value)}
                className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-white placeholder-blue-200/60 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary text-xs sm:text-sm px-6 py-3 font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
            >
              Search Vault
            </button>
          </form>

          {/* Quick Clickable Suggestions */}
          <div className="mt-4 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-blue-200/70 font-semibold">Try searching:</span>
            {SEARCH_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleHeroSearch(suggestion)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-blue-100 text-[11px] font-medium transition-colors"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions (Req #8) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/upload"
          className="card hover:border-blue-500/60 hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <Plus size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Upload Material</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Drop PDFs, notes, links</p>
          </div>
        </Link>

        <Link
          to="/ai"
          className="card hover:border-indigo-500/60 hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <Brain size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Ask AI Study</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Instant doubt solver</p>
          </div>
        </Link>

        <Link
          to="/quiz"
          className="card hover:border-amber-500/60 hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <HelpCircle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">Generate Quiz</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Self-test exam readiness</p>
          </div>
        </Link>

        <Link
          to="/revision"
          className="card hover:border-emerald-500/60 hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Start Revision</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{stats.revisionTasks} topics due today</p>
          </div>
        </Link>
      </div>

      {/* 4 Compact Dashboard Analytics (Req #9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Materials</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                {stats.totalMaterials}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 size={11} /> 100% indexed & searchable
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderOpen size={18} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Subjects</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                {stats.totalSubjects}
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                Semester 6 + Archives
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher Verified</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                {stats.teacherVerified}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <ShieldCheck size={11} /> High exam relevance
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revision Tasks</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                {stats.revisionTasks}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                Spaced repetition scheduled
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Unique Visual Knowledge Map (Req #36) */}
      <KnowledgeMap />

      {/* Main Grid: Recommended Revision + Recently Added Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Revision Tasks */}
        <div className="card p-5 lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recommended Revision</h3>
              <p className="text-xs text-slate-500">Based on your recent quizzes & exam syllabus</p>
            </div>
            <Link to="/revision" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRevision.map(task => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    task.difficulty === 'Hard'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{task.subject}</span>
                  <Link
                    to="/revision"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Review Now <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Materials */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recently Organized Materials</h3>
              <p className="text-xs text-slate-500">Auto-tagged and checked for duplicates</p>
            </div>
            <Link to="/vault" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Explore All Materials <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentMaterials.map(mat => (
              <MaterialCard key={mat.id} material={mat} viewMode="grid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
