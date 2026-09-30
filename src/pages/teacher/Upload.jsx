import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { materialsAPI, aiAPI } from '../../services/api';
import {
  Upload as UploadIcon, FileText, Link as LinkIcon, Sparkles,
  Shield, Star, CheckCircle, Loader2, ArrowRight, X
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
  { value: 'notes', label: 'Faculty Official Lecture Notes' },
  { value: 'slides', label: 'Lecture Presentation Slides (PPT)' },
  { value: 'pyq', label: 'Model / Past Examination Papers' },
  { value: 'syllabus', label: 'Course Syllabus & Objectives' },
  { value: 'assignment', label: 'Official Assignment & Rubric' },
  { value: 'link', label: 'External Drive / Portal Link' },
];

const TeacherUpload = () => {
  const navigate = useNavigate();

  const [uploadMode, setUploadMode] = useState('file');
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
  const [tags, setTags] = useState(['official', 'faculty-notes']);
  const [tagInput, setTagInput] = useState('');
  const [isOfficial, setIsOfficial] = useState(true);
  const [isImportant, setIsImportant] = useState(true);

  const [loading, setLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
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
      toast.success(`Generated tags!`);
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
      toast.error('Please enter a title');
      return;
    }

    const finalSubject = subject === 'Other' ? customSubject.trim() : subject;
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
      formData.append('isOfficial', isOfficial);
      formData.append('isImportant', isImportant);

      if (uploadMode === 'file') {
        formData.append('file', file);
      } else {
        formData.append('linkUrl', linkUrl.trim());
      }

      const res = await materialsAPI.create(formData);
      toast.success('Official study material published successfully!');
      navigate(`/teacher/materials`);
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
        <div className="inline-flex items-center gap-1.5 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Shield size={14} /> Official Faculty Publication
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Faculty Study Material</h1>
        <p className="text-sm text-gray-500 mt-1">
          Materials uploaded by faculty are pre-verified, receive official badges, and are prioritized for students.
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
          Upload Document / PDF / PPT
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
          Link (Google Drive / Video Lectures / Portal)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {uploadMode === 'file' ? (
          <div>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white dark:bg-gray-900 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-gray-200 dark:border-gray-800 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mx-auto mb-3">
                  <UploadIcon size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Drop lecture notes or syllabus files here
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, PPTX, DOCX, Images up to 50MB</p>
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
                placeholder="https://drive.google.com/... or faculty portal URL"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="label">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Official Course Handout: Computer Networks Protocol Suite"
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
              <label className="label">Target Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="label">Resource Type</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label">Unit / Module</label>
              <input
                type="text"
                placeholder="e.g. Unit 1 or Full Syllabus"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">Topic / Key Concepts</label>
              <input
                type="text"
                placeholder="e.g. OSI Model, TCP/IP Stack"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label">Instructions / Exam Guidance for Students</label>
            <textarea
              rows={3}
              placeholder="Highlight critical exam topics, reference book page numbers, or guidelines..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input"
            />
          </div>

          {/* Badges Toggles */}
          <div className="p-4 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-200/60 dark:border-primary-800/40 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isOfficial}
                onChange={e => setIsOfficial(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600"
              />
              <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                <Shield size={14} className="text-primary-600" /> Mark as Official Course Material
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={e => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500"
              />
              <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" /> High Priority / Exam Prep Flag
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/teacher/materials')}
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
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Official Resource</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherUpload;
