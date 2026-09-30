import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialsAPI, bookmarksAPI } from '../../services/api';
import MaterialCard from '../../components/MaterialCard';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import { Search as SearchIcon, Filter, X, Sparkles, BookOpen, CheckCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = ['All', 'DBMS', 'Operating Systems', 'Computer Networks', 'Java', 'Computer Graphics', 'Data Structures'];
const TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'notes', label: 'Notes' },
  { id: 'pyq', label: 'Previous Year Papers' },
  { id: 'assignment', label: 'Assignments' },
  { id: 'slides', label: 'Slides / PPT' },
  { id: 'link', label: 'Links' },
];

const POPULAR_TAGS = ['b-tree', 'sql', 'process-scheduling', 'deadlock', 'osi-model', 'tcp-ip', 'inheritance', 'threads', 'exam-prep'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState('All');
  const [type, setType] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyImportant, setOnlyImportant] = useState(false);

  const [results, setResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = async (overrideQuery = query) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = {
        search: overrideQuery || undefined,
        subject: subject !== 'All' ? subject : undefined,
        type: type !== 'all' ? type : undefined,
        isVerified: onlyVerified ? true : undefined,
        isImportant: onlyImportant ? true : undefined,
      };

      const [res, bkRes] = await Promise.all([
        materialsAPI.getAll(params),
        bookmarksAPI.getAll().catch(() => ({ data: { bookmarks: [] } })),
      ]);

      setResults(res.data.materials || []);
      setBookmarks(bkRes.data.bookmarks || []);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    } else {
      executeSearch('');
    }
  }, [subject, type, onlyVerified, onlyImportant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    executeSearch(query);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    setSearchParams({ q: tag });
    executeSearch(tag);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Search</h1>
        <p className="text-sm text-gray-500 mt-1">
          Quickly discover lecture notes, question papers, code repos, and teacher-verified solutions
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search keywords, subjects, unit names, exam questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-12 pr-28 h-12 text-base w-full shadow-inner"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setSearchParams({}); executeSearch(''); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="btn btn-primary h-9 px-4 text-xs font-semibold">
              Search
            </button>
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 font-medium mr-1">Subject:</span>
          {SUBJECTS.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSubject(sub)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                subject === sub
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Type pills & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Format:</span>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  type === t.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyVerified(v => !v)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors ${
                onlyVerified
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              <CheckCircle size={13} className={onlyVerified ? 'text-emerald-600' : 'text-gray-400'} />
              Teacher Verified
            </button>

            <button
              type="button"
              onClick={() => setOnlyImportant(v => !v)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors ${
                onlyImportant
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              <Star size={13} className={onlyImportant ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
              Exam Prep
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
          <span className="text-gray-400 flex items-center gap-1 mr-1">
            <Sparkles size={12} className="text-amber-500" /> Trending Topics:
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {loading ? 'Searching...' : `Found ${results.length} resources`}
          {query && <span className="font-normal text-gray-400"> for "{query}"</span>}
        </p>
      </div>

      {/* Results Display */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources match your search"
          message="Try searching with a broader topic name, check spelling, or clear filters."
          action={
            <button
              onClick={() => { setQuery(''); setSubject('All'); setType('all'); setOnlyVerified(false); setOnlyImportant(false); executeSearch(''); }}
              className="btn btn-secondary text-xs"
            >
              Clear Search Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
              isBookmarked={bookmarks.some(b => (b.material?._id || b.material) === material._id)}
              onBookmarkToggle={() => executeSearch(query)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
