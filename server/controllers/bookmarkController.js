import Bookmark from '../models/Bookmark.js';
import Material from '../models/Material.js';

// GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'material',
        populate: { path: 'uploadedBy', select: 'name role' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/bookmarks/:materialId
export const addBookmark = async (req, res) => {
  try {
    const material = await Material.findById(req.params.materialId);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    const existing = await Bookmark.findOne({ user: req.user._id, material: req.params.materialId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already bookmarked' });
    }

    const bookmark = await Bookmark.create({ user: req.user._id, material: req.params.materialId });
    res.status(201).json({ success: true, bookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/bookmarks/:materialId
export const removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user._id, material: req.params.materialId });
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
