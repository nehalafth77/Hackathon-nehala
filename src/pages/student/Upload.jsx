import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { materialsAPI, aiAPI } from '../../services/api';
import {
  Upload as UploadIcon, FileText, Link as LinkIcon, Sparkles,
  CheckCircle, AlertCircle, X, Loader2, ArrowRight, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Java',
  'Computer Graphics',
  'Data Structures',
  'Software Engineering',
  'Mathematics',
  'Other',
];

const TYPES = [
  { value: 'notes', label: 'Lecture Notes / Handouts' },
  { value: 'pyq', label: 'Previous Year Question Paper (PYQ)' },
  { value: 'assignment', label: 'Assignment / Solution' },
  { value: 'syllabus', label: 'Syllabus / Course Plan' },
  { value: 'slides', label: 'Presentation Slides (PPT)' },
  { value: 'link', label: 'Drive / YouTube / Web Resource' },
];

const UploadPage = () => {
  const navigate = useNavigate();

  // Mode: 'file' | 'link'
  const [uploadMode, setUploadMode] = useState('file');

  // Form state
  const [file, setFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('DBMS');
  const [customSubject, setCustomSubject] = useState('');
  const [semester, setSemester] = useState('5');
  const [course, setCourse] = useState('B.Tech CSE');
  const [type, setType] = useState('notes');
  const [unit, setUnit] = useState('Unit 1');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['dbms', 'notes']);
  const [tagInput, setTagInput] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const [loading, setLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);

  // Dropzone setup
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      if (!title) {
        // Auto-set title from file name without extension
        const cleanName = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx', '.ppt'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // AI Tag suggestion
  const handleAISuggestTags = async () => {
    if (!title && !topic) {
      toast.error('Please enter a title or topic first');
      return;
    }
    setTagLoading(true);
    try {
      const activeSubject = subject === 'Other' ? customSubject : subject;
      const res = await aiAPI.suggestTags({
        title: `${title} ${topic}`,
        subject: activeSubject,
      });
      const suggested = res.data.tags || [];
      const merged = Array.from(new Set([...tags, ...suggested]));
      setTags(merged);
      toast.success(`Added ${suggested.length} smart tags!`);
    } catch {
      toast.error('Could not generate tags');
    } finally {
      setTagLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadMode === 'file' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (uploadMode === 'link' && !linkUrl.trim()) {
      toast.error('Please provide a valid link');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a resource title');
      return;
    }

    const finalSubject = subject === 'Other' ? customSubject.trim() : subject;
    if (!finalSubject) {
      toast.error('Please select or specify a subject');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subject', finalSubject);
      formData.append('semester', semester);
      formData.append('course', course);
      formData.append('type', uploadMode === 'link' ? 'link' : type);
      formData.append('unit', unit);
      formData.append('topic', topic.trim());
      formData.append('description', description.trim());
      formData.append('tags', JSON.stringify(tags));
      formData.append('isImportant', isImportant);

      if (uploadMode === 'file') {
        formData.append('file', file);
      } else {
        formData.append('linkUrl', linkUrl.trim());
      }

      const res = await materialsAPI.create(formData);
      toast.success('Study material uploaded successfully! Pending faculty verification.');
      navigate(`/student/material/${res.data.material._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Study Resource</h1>
        <p className="text-sm text-gray-500 mt-1">
          Share your notes, question papers, and helpful references to build a collaborative study sphere
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            uploadMode === 'file'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UploadIcon size={16} />
          Upload Document / PDF / Slides
        </button>

        <button
          type="button"
          onClick={() => setUploadMode('link')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            uploadMode === 'link'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon size={16} />
          Share Link (Google Drive / YouTube / Web)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Container */}
        {uploadMode === 'file' ? (
          <div>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white dark:bg-gray-900 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mx-auto mb-3">
                  <UploadIcon size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your file right here' : 'Drag & drop your file here, or browse'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF, DOCX, PPTX, PNG, JPG (up to 50MB)
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
            <label className="label">Resource URL</label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                required
                placeholder="https://drive.google.com/... or https://youtube.com/watch?v=..."
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="input pl-10"
              />
            </div>
            <p className="text-xs text-gray-400">
              Paste public Google Drive notes, YouTube lecture video links, GitHub repositories, or official syllabus PDFs.
            </p>
          </div>
        )}

        {/* Metadata Details Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Resource Details
          </h2>

          <div className="space-y-1.5">
            <label className="label">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Unit 3 DBMS Normalization & BCNF Notes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="label">Subject *</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="input"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="label">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="label">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="input"
                disabled={uploadMode === 'link'}
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {subject === 'Other' && (
            <div className="space-y-1.5">
              <label className="label">Enter Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Cloud Computing"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                className="input"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label">Unit / Module</label>
              <input
                type="text"
                placeholder="e.g. Unit 2 or Module 4"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">Topic / Key Concepts</label>
              <input
                type="text"
                placeholder="e.g. Transactions, ACID properties"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label">Description / Study Tips</label>
            <textarea
              rows={3}
              placeholder="Provide a quick summary or pointers for your classmates..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input"
            />
          </div>

          {/* Tags with AI Assistance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="label mb-0">Tags / Keywords</label>
              <button
                type="button"
                onClick={handleAISuggestTags}
                disabled={tagLoading}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                {tagLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Auto-suggest tags with AI
              </button>
            </div>

            <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 min-h-[44px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 text-gray-700 dark:text-gray-300 shadow-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type and press Enter to add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent border-none text-xs focus:outline-none flex-1 min-w-[140px] px-1"
              />
            </div>
          </div>

          {/* High Priority / Exam Prep Flag */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={e => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mark as High Priority / Exam Preparation Material
              </span>
            </label>
            <p className="text-xs text-gray-400 ml-6 mt-0.5">
              Helps classmates quickly discover high-yield questions, formulas, and verified solutions.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary px-5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-7 inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Publish Study Material</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
