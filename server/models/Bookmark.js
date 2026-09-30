import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
}, { timestamps: true });

bookmarkSchema.index({ user: 1, material: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
