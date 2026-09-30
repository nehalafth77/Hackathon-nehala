import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import MaterialCard from '../components/materials/MaterialCard';
import EmptyState from '../components/ui/EmptyState';
import { 
  Search, Sparkles, Brain, ArrowRight, BookOpen, 
  Layers, Clock, Filter, CheckCircle2, ChevronRight, Hash 
} from 'lucide-react';

export default function SmartSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, searchMaterials } = useVault();

  const [inputVal, setInputVal] = useState(searchParams.get('q') || searchQuery || '');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');

  // Sync query from URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputVal(q);
      setSearchQuery(q);
    }
  }, [searchParams, setSearchQuery]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    setSearchQuery(inputVal);
    setSearchParams({ q: inputVal });
  };

  const handleSuggestionClick = (query) => {
    setInputVal(query);
    setSearchQuery(query);
    setSearchParams({ q: query });
  };

  const currentQuery = inputVal.trim() || searchQuery;
  const results = searchMaterials(currentQuery);

  const filteredResults = activeSubjectFilter === 'All' 
    ? results 
    : results.filter(m => m.subject === activeSubjectFilter);

  // Compute AI Intent interpretation dynamically based on query
  const getAIInterpretation = (query) => {
    const q = query.toLowerCase();
    if (q.includes('deadlock') || q.includes('os') || q.includes('operating')) {
      return {
        subject: 'Operating Systems',
        topic: 'Deadlocks & Process Synchronization',
        intent: 'Exam Study Material & Conceptual Notes',
        confidence: 96,
        reasoning: 'Interpreted as core CS Operating Systems concepts. Prioritizing Unit 4 lecture notes, algorithms (Banker’s algorithm), and previous university exam question papers.'
      };
    } else if (q.includes('normal') || q.includes('dbms') || q.includes('database') || q.includes('sql') || q.includes('nf')) {
      return {
        subject: 'Database Management Systems',
        topic: 'Relational Normalization (1NF, 2NF, 3NF, BCNF)',
        intent: 'Theory & Problem Solving Exercises',
        confidence: 98,
        reasoning: 'Identified relational database schema design topic. Prioritizing verified professor lecture slides, functional dependency proofs, and solved question sets.'
      };
    } else if (q.includes('network') || q.includes('tcp') || q.includes('ip') || q.includes('osi')) {
      return {
        subject: 'Computer Networks',
        topic: 'Transport Layer Protocols & Congestion Control',
        intent: 'Protocol Architecture & High-yield Notes',
        confidence: 92,
        reasoning: 'Matching ISO-OSI layer models and RFC specifications. Cross-referencing semester 5 syllabus requirements.'
      };
    } else if (q.includes('tree') || q.includes('graph') || q.includes('dsa') || q.includes('algo')) {
      return {
        subject: 'Data Structures & Algorithms',
        topic: 'Non-linear Data Structures',
        intent: 'Implementation & Time Complexity',
        confidence: 94,
        reasoning: 'Detecting data structures query. Highlighting visualized code implementations and traversal problem sets.'
      };
    } else if (query) {
      return {
        subject: 'Cross-Disciplinary Library',
        topic: query,
        intent: 'Full Semantic & Text Search across All Saved Materials',
        confidence: 89,
        reasoning: `Matched ${results.length} resources referencing terms related to "${query}" across class WhatsApp imports, uploaded PDFs, and teacher notes.`
      };
    }
    return null;
  };

  const interpretation = getAIInterpretation(currentQuery);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-vault-900 via-navy-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-vault-lg border border-vault-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vault-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-500/20 text-vault-300 text-xs font-semibold mb-3 border border-vault-400/30">
            <Sparkles className="w-3.5 h-3.5 text-vault-400" />
            AI Semantic Search Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Smart Search
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Search naturally by topic, concept, question, or filename. StudyVault understands academic context, not just keywords.
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white dark:bg-navy-900/90 rounded-xl p-1.5 shadow-2xl border-2 border-vault-500/40 focus-within:border-vault-500 transition-all">
              <Search className="w-5 h-5 text-vault-500 ml-3 shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Try 'Find everything related to deadlock prevention' or 'normalization'..."
                className="w-full px-3 py-2.5 text-slate-800 dark:text-slate-100 bg-transparent text-sm sm:text-base focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-vault-600 hover:bg-vault-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Sample quick queries */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Quick queries:
            </span>
            {[
              'normalization',
              'deadlock prevention',
              'Unit 3 DBMS',
              'TCP 3-way handshake',
              'Binary Search Trees'
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition-colors border border-white/10"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Query Interpretation Banner */}
      {interpretation && currentQuery && (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-vault-100 dark:border-navy-800 shadow-vault-sm transition-all animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-vault-50 dark:bg-vault-950/60 border border-vault-200 dark:border-vault-800 flex items-center justify-center text-vault-600 dark:text-vault-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  AI Interpreted Query
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {interpretation.confidence}% Confidence
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Natural language parser extracted structured curriculum entities
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/ai?ask=${encodeURIComponent('Explain ' + currentQuery + ' using my notes')}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vault-50 dark:bg-vault-900/50 hover:bg-vault-100 text-vault-700 dark:text-vault-300 text-xs font-semibold border border-vault-200 dark:border-vault-800 transition-colors self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-vault-600" />
              <span>Ask AI Study Assistant about this</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
            <div className="bg-slate-50 dark:bg-navy-950/60 p-3 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Subject Entity</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-vault-600" />
                {interpretation.subject}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-navy-950/60 p-3 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Detected Topic</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                {interpretation.topic}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-navy-950/60 p-3 rounded-xl border border-slate-100 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Intent Category</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                {interpretation.intent}
              </span>
            </div>
          </div>

          <div className="bg-vault-50/60 dark:bg-vault-950/30 border border-vault-100 dark:border-vault-900/60 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-vault-600 dark:text-vault-400 shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-slate-900 dark:text-white">Why these results? </strong>
              {interpretation.reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Results Header & Subject Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Search Results
          </h2>
          <span className="bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
            {filteredResults.length} {filteredResults.length === 1 ? 'material' : 'materials'}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {['All', 'Database Management Systems', 'Operating Systems', 'Computer Networks'].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeSubjectFilter === sub
                  ? 'bg-vault-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-800'
              }`}
            >
              {sub === 'Database Management Systems' ? 'DBMS' : sub === 'Operating Systems' ? 'OS' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((material) => (
            <div key={material.id} className="relative group">
              <MaterialCard material={material} viewMode="list" />
              {/* Highlight Why Matched beneath or in list */}
              {(material.matchReasons || material.matchReason) && (
                <div className="mx-4 -mt-1 mb-2 px-3 py-1.5 bg-vault-50/80 dark:bg-vault-950/40 rounded-b-xl border-x border-b border-vault-200/50 dark:border-vault-900/50 text-[11px] text-vault-700 dark:text-vault-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-vault-500 shrink-0" />
                  <span><strong>AI Match Reason:</strong> {material.matchReasons || material.matchReason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="search"
          title={`No results found for "${currentQuery}"`}
          description="Try broadening your search term or exploring subjects like DBMS, Operating Systems, or Normalization."
          actionText="Clear Search"
          onAction={() => {
            setInputVal('');
            setSearchQuery('');
            setSearchParams({});
          }}
        />
      )}
    </div>
  );
}
