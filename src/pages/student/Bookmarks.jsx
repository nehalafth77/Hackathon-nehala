import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookmarksAPI } from '../../services/api';
import MaterialCard from '../../components/MaterialCard';
import { LoadingSkeleton, EmptyState } from '../../components/UI';
import { Bookmark, BookOpen, ArrowRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('All');

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await bookmarksAPI.getAll();
      setBookmarks(res.data.bookmarks || []);
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (materialId) => {
    try {
      await bookmarksAPI.remove(materialId);
      setBookmarks(prev => prev.filter(b => (b.material?._id || b.material) !== materialId));
      toast.success('Bookmark removed');
    } catch {
      toast.error('Failed to remove bookmark');
    }
  };

  // Extract unique subjects
  const subjects = ['All', ...new Set(bookmarks.map(b => b.material?.subject).filter(Boolean))];

  const filteredBookmarks = selectedSubject === 'All'
    ? bookmarks
    : bookmarks.filter(b => b.material?.subject === selectedSubject);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bookmark className="text-primary-600 fill-primary-600" size={24} />
            Saved Bookmarks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your personal collection of important notes, question papers, and quick reference materials
          </p>
        </div>

        <Link
          to="/student/materials"
          className="btn btn-secondary inline-flex items-center gap-1.5 text-xs"
        >
          <span>Browse More Materials</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Filter by subject if bookmarks exist */}
      {bookmarks.length > 0 && subjects.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-gray-400 font-medium">Filter:</span>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                selectedSubject === s
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Bookmarks Grid */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked resources yet"
          message="Keep your important exam revision materials organized in one place by bookmarking them from the materials catalog."
          action={
            <Link to="/student/materials" className="btn btn-primary inline-flex items-center gap-2">
              <BookOpen size={16} />
              Explore Study Materials
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookmarks.map((b) => {
            const mat = b.material;
            if (!mat) return null;
            return (
              <MaterialCard
                key={mat._id}
                material={mat}
                isBookmarked={true}
                onBookmarkToggle={() => handleRemove(mat._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
