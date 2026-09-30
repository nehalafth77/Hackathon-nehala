import React from 'react';
import { CheckCircle, Clock, XCircle, Star, Shield } from 'lucide-react';

const statusConfig = {
  verified: {
    label: 'Teacher Verified',
    icon: CheckCircle,
    className: 'badge-verified',
  },
  pending: {
    label: 'Pending Verification',
    icon: Clock,
    className: 'badge-pending',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'badge-rejected',
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={config.className}>
      <Icon size={11} />
      {config.label}
    </span>
  );
};

export const OfficialBadge = () => (
  <span className="badge-official">
    <Shield size={11} />
    Official
  </span>
);

export const ImportantBadge = () => (
  <span className="badge-important">
    <Star size={11} />
    Important
  </span>
);

export const TypeBadge = ({ type }) => {
  const colors = {
    pdf: 'bg-red-50 text-red-700 border-red-200',
    doc: 'bg-blue-50 text-blue-700 border-blue-200',
    ppt: 'bg-orange-50 text-orange-700 border-orange-200',
    image: 'bg-purple-50 text-purple-700 border-purple-200',
    notes: 'bg-green-50 text-green-700 border-green-200',
    video: 'bg-pink-50 text-pink-700 border-pink-200',
    link: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'question-paper': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    assignment: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const labels = {
    pdf: 'PDF',
    doc: 'DOC',
    ppt: 'PPT',
    image: 'Image',
    notes: 'Notes',
    video: 'Video',
    link: 'Link',
    'question-paper': 'Q-Paper',
    assignment: 'Assignment',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[type] || colors.pdf}`}>
      {labels[type] || type.toUpperCase()}
    </span>
  );
};
