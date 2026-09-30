import React, { useState, useMemo } from 'react';
import {
  FolderOpen, Search, Filter, Grid, List, Plus, Sparkles, CheckCircle2,
  SlidersHorizontal, ArrowUpDown, X, Tag
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { MaterialCard } from '../components/materials/MaterialCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export const MyVault = () => {
  const { materials, subjects } = useVault();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All'); // 'All' | 'verified' | 'community'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'health' | 'importance'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showAutoOrganizeCard, setShowAutoOrganizeCard] = useState(true);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    return materials
      .filter(m => {
        // Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchSubject = m.subject.toLowerCase().includes(q);
          const matchTopic = (m.topic || '').toLowerCase().includes(q);
          const matchTag = (m.tags || []).some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchSubject && !matchTopic && !matchTag) return false;
        }

        // Subject filter
        if (selectedSubject !== 'All' && m.subject !== selectedSubject) {
          return false;
        }

        // Type filter
        if (selectedType !== 'All' && m.type !== selectedType) {
          return false;
        }

        // Verification filter
        if (verificationFilter === 'verified' && !m.isTeacherVerified) {
          return false;
        }
        if (verificationFilter === 'community' && m.isTeacherVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.uploadedDate) - new Date(a.uploadedDate);
        if (sortBy === 'oldest') return new Date(a.uploadedDate) - new Date(b.uploadedDate);
        if (sortBy === 'health') return b.healthScore - a.healthScore;
        if (sortBy === 'importance') return b.examImportance - a.examImportance;
        return 0;
      });
  }, [materials, searchTerm, selectedSubject, selectedType, verificationFilter, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('All');
    setSelectedType('All');
    setVerificationFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Study Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {materials.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Everything you save from WhatsApp, classes and Telegram, organized automatically.
          </p>
        </div>

        <Link to="/upload" className="btn btn-primary text-xs font-bold self-start sm:self-auto">
          <Plus size={15} /> Upload Material
        </Link>
      </div>

      {/* Smart Auto-Organization Showcase Banner (Req #11) */}
      {showAutoOrganizeCard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 shadow-sm relative overflow-hidden">
          <button
            onClick={() => setShowAutoOrganizeCard(false)}
            className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Dismiss showcase card"
          >
            <X size={15} />
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-5xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                  AI Auto-Organization Active
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Uploaded: <span className="font-mono text-blue-600 dark:text-blue-400">"IMG_2026_09_23.jpg"</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  AI automatically scanned the handwritten contents and detected subject, topic, and unit with <strong className="text-emerald-600">94% confidence</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-blue-200/60 dark:border-slate-800 self-start lg:self-auto">
              <span className="font-semibold text-slate-500">Subject: <strong className="text-slate-800 dark:text-slate-200 font-bold">DBMS</strong></span>
              <span>•</span>
              <span className="font-semibold text-slate-500">Topic: <strong className="text-slate-800 dark:text-slate-200 font-bold">Normalization (Unit 3)</strong></span>
              <span>•</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> Auto-Organized
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter and Search Bar Controls (Req #10) */}
      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in vault..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input pl-9 h-10 text-xs"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="input h-10 text-xs font-medium cursor-pointer"
            >
              <option value="All">All Subjects ({materials.length})</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>
                  {s.shortName} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Material Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="input h-10 text-xs font-medium cursor-pointer"
            >
              <option value="All">All Material Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="notes">Lecture Notes</option>
              <option value="question-paper">Solved Question Papers (PYQ)</option>
              <option value="ppt">Slide Presentations</option>
              <option value="image">Handwritten Images</option>
              <option value="video">Curated Video Links</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={e => setVerificationFilter(e.target.value)}
              className="input h-10 text-xs font-medium cursor-pointer"
            >
              <option value="All">All Verification Statuses</option>
              <option value="verified">✓ Teacher Verified Only</option>
              <option value="community">Community Uploads</option>
            </select>
          </div>
        </div>

        {/* Secondary Bar: Sort & View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="health">Highest Health Score</option>
              <option value="importance">Exam High Yield</option>
            </select>
            {(selectedSubject !== 'All' || selectedType !== 'All' || verificationFilter !== 'All' || searchTerm) && (
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 font-bold hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Materials List/Grid */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No matching materials in your vault"
          description="Try clearing your filters or upload a new study document to get started."
          action={
            <button onClick={resetFilters} className="btn btn-secondary text-xs">
              Clear All Filters
            </button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map(m => (
            <MaterialCard key={m.id} material={m} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMaterials.map(m => (
            <MaterialCard key={m.id} material={m} viewMode="list" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVault;
