import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  subject: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
