import React from 'react';
import { FileText, FileImage, Link, FileSpreadsheet, File, Video, BookOpen } from 'lucide-react';

const iconMap = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  doc: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  ppt: { icon: FileSpreadsheet, color: 'text-orange-500', bg: 'bg-orange-50' },
  image: { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-50' },
  notes: { icon: BookOpen, color: 'text-green-500', bg: 'bg-green-50' },
  video: { icon: Video, color: 'text-pink-500', bg: 'bg-pink-50' },
  link: { icon: Link, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  'question-paper': { icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  assignment: { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
};

export const FileIcon = ({ type, size = 20 }) => {
  const config = iconMap[type] || iconMap.pdf;
  const Icon = config.icon;
  return (
    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={size} className={config.color} />
    </div>
  );
};

export const SubjectIcon = ({ subject, size = 24 }) => {
  const subjectColors = {
    'DBMS': { bg: 'bg-violet-100', text: 'text-violet-700', emoji: '🗄️' },
    'Operating Systems': { bg: 'bg-blue-100', text: 'text-blue-700', emoji: '💻' },
    'Computer Networks': { bg: 'bg-green-100', text: 'text-green-700', emoji: '🌐' },
    'Java': { bg: 'bg-orange-100', text: 'text-orange-700', emoji: '☕' },
    'Computer Graphics': { bg: 'bg-pink-100', text: 'text-pink-700', emoji: '🎨' },
    'Data Structures': { bg: 'bg-cyan-100', text: 'text-cyan-700', emoji: '📊' },
  };

  const config = subjectColors[subject] || { bg: 'bg-gray-100', text: 'text-gray-700', emoji: '📚' };

  return (
    <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
      {config.emoji}
    </div>
  );
};
