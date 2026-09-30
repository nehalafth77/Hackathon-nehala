import Material from '../models/Material.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import Announcement from '../models/Announcement.js';

// GET /api/teacher/pending
export const getPendingMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ status: 'pending' })
      .populate('uploadedBy', 'name email college course semester')
      .sort({ createdAt: -1 });

    res.json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/teacher/approve/:id
export const approveMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    material.status = 'verified';
    material.verifiedBy = req.user._id;
    material.verifiedAt = new Date();
    material.isOfficial = req.body.isOfficial || false;
    await material.save();

    // Notify uploader
    await Notification.create({
      user: material.uploadedBy,
      title: 'Material Approved! 🎉',
      message: `Your material "${material.title}" has been approved by a teacher.`,
      type: 'verification',
      link: `/student/material/${material._id}`
    });

    res.json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/teacher/reject/:id
export const rejectMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    material.status = 'rejected';
    material.rejectionReason = req.body.reason || 'Does not meet quality standards';
    await material.save();

    // Notify uploader
    await Notification.create({
      user: material.uploadedBy,
      title: 'Material Rejected',
      message: `Your material "${material.title}" was rejected. Reason: ${material.rejectionReason}`,
      type: 'verification',
    });

    res.json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teacher/reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('material', 'title subject')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teacher/stats
export const getTeacherStats = async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();
    const pendingCount = await Material.countDocuments({ status: 'pending' });
    const verifiedCount = await Material.countDocuments({ status: 'verified' });
    const reportsCount = await Report.countDocuments({ status: 'pending' });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await Material.countDocuments({ createdAt: { $gte: weekAgo } });

    res.json({
      success: true,
      stats: { totalMaterials, pendingCount, verifiedCount, reportsCount, newThisWeek }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
