import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: {
    type: String,
    enum: ['incorrect-information', 'duplicate', 'irrelevant', 'inappropriate', 'other'],
    required: true
  },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
