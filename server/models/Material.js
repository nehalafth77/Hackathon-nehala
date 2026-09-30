import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  subject: { type: String, required: true },
  topic: { type: String, default: '' },
  unit: { type: String, default: '' },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'ppt', 'image', 'notes', 'video', 'link', 'question-paper', 'assignment'],
    default: 'pdf'
  },
  fileUrl: { type: String, default: '' },
  externalUrl: { type: String, default: '' },
  publicId: { type: String, default: '' },
  tags: [{ type: String }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String, default: '' },
  isOfficial: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  usefulCount: { type: Number, default: 0 },
  usefulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  fileSize: { type: Number, default: 0 },
  fileHash: { type: String, default: '' },
  fileName: { type: String, default: '' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
}, { timestamps: true });

materialSchema.index({ title: 'text', description: 'text', subject: 'text', topic: 'text', tags: 'text' });

export default mongoose.model('Material', materialSchema);
