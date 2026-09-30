import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialsAPI, bookmarksAPI } from '../../services/api';
import MaterialCard from '../../components/MaterialCard';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import {
  Search, Filter, LayoutGrid, List, SlidersHorizontal,
  Plus, CheckCircle, Star, Sparkles, BookOpen, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'All Subjects',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Java',
  'Computer Graphics',
  'Data Structures',
  'Software Engineering',
  'Mathematics',
];

const TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'notes', label: 'Notes' },
  { value: 'pyq', label: 'PYQ & Papers' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'slides', label: 'Slides & PPT' },
  { value: 'link', label: 'Web & Drive Links' },
];

const SEMESTERS = ['All Semesters', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];

const Materials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'All Subjects');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedSem, setSelectedSem] = useState(searchParams.get('semester') || 'All Semesters');
  const [onlyVerified, setOnlyVerified] = useState(searchParams.get('verified') === 'true');
  const [onlyImportant, setOnlyImportant] = useState(searchParams.get('important') === 'true');
  const [sortBy, setSortBy] = useState('newest');

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery || undefined,
        subject: selectedSubject !== 'All Subjects' ? selectedSubject : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        semester: selectedSem !== 'All Semesters' ? selectedSem.replace('Sem ', '') : undefined,
        isVerified: onlyVerified ? true : undefined,
        isImportant: onlyImportant ? true : undefined,
        sortBy,
      };

      const [matRes, bkRes] = await Promise.all([
        materialsAPI.getAll(params),
        bookmarksAPI.getAll(),
      ]);

      setMaterials(matRes.data.materials || []);
      setBookmarks(bkRes.data.bookmarks || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [selectedSubject, selectedType, selectedSem, onlyVerified, onlyImportant, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMaterials();
  };

  const handleBookmarkToggle = async (materialId) => {
    const isBookmarked = bookmarks.some(b => (b.material?._id || b.material) === materialId);
    try {
      if (isBookmarked) {
        await bookmarksAPI.remove(materialId);
        setBookmarks(prev => prev.filter(b => (b.material?._id || b.material) !== materialId));
        toast.success('Removed from bookmarks');
      } else {
        await bookmarksAPI.add(materialId);
        setBookmarks(prev => [...prev, { material: { _id: materialId } }]);
        toast.success('Saved to bookmarks');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleUseful = async (materialId) => {
    try {
      const res = await materialsAPI.markUseful(materialId);
      setMaterials(prev => prev.map(m => m._id === materialId ? { ...m, usefulCount: res.data.usefulCount } : m));
      toast.success('Marked as helpful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All Subjects');
    setSelectedType('all');
    setSelectedSem('All Semesters');
    setOnlyVerified(false);
    setOnlyImportant(false);
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedSubject !== 'All Subjects' || selectedType !== 'all' || selectedSem !== 'All Semesters' || onlyVerified || onlyImportant;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse verified lecture notes, question papers, syllabus, and curated links
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/student/upload"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Upload Material</span>
          </Link>
        </div>
      </div>

      {/* Search & Quick Filters Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, subject, topic, unit, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 h-11 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); fetchMaterials(); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary h-11 px-5">
            Search
          </button>
        </form>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Dropdown */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input text-xs h-9 py-1 px-3 w-auto min-w-[130px]"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input text-xs h-9 py-1 px-3 w-auto"
            >
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            {/* Semester Dropdown */}
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="input text-xs h-9 py-1 px-3 w-auto"
            >
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Teacher Verified toggle */}
            <button
              type="button"
              onClick={() => setOnlyVerified(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors inline-flex items-center gap-1.5 ${
                onlyVerified
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              <CheckCircle size={14} className={onlyVerified ? 'text-emerald-600' : 'text-gray-400'} />
              Teacher Verified
            </button>

            {/* Important / Exam Prep toggle */}
            <button
              type="button"
              onClick={() => setOnlyImportant(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors inline-flex items-center gap-1.5 ${
                onlyImportant
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star size={14} className={onlyImportant ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
              High Priority / Exam Prep
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline px-2 py-1"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right controls: Sort & View Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input text-xs h-9 py-1 px-3 w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="useful">Most Helpful</option>
              <option value="downloads">Most Downloaded</option>
            </select>

            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'}`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Materials List / Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : materials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No materials found"
          message={hasActiveFilters ? "Try adjusting your filters or search keywords." : "No study materials uploaded yet. Be the first to contribute!"}
          action={
            <Link to="/student/upload" className="btn btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Upload Now
            </Link>
          }
        />
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'space-y-4'
        }>
          {materials.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
              isBookmarked={bookmarks.some(b => (b.material?._id || b.material) === material._id)}
              onBookmarkToggle={() => handleBookmarkToggle(material._id)}
              onMarkUseful={() => handleUseful(material._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Materials;
