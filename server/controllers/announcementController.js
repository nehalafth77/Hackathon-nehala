import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

// GET /api/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('teacher', 'name')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(20);

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/announcements
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, subject, priority, isPinned } = req.body;

    const announcement = await Announcement.create({
      teacher: req.user._id,
      title,
      message,
      subject: subject || '',
      priority: priority || 'medium',
      isPinned: isPinned || false,
    });

    // Notify all students
    const students = await User.find({ role: 'student' }, '_id');
    const notifDocs = students.map(s => ({
      user: s._id,
      title: `📢 ${title}`,
      message: message.substring(0, 100),
      type: 'announcement',
    }));
    if (notifDocs.length > 0) {
      await Notification.insertMany(notifDocs);
    }

    await announcement.populate('teacher', 'name');
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/read
export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reports
export const createReport = async (req, res) => {
  try {
    const { materialId, reason, description } = req.body;

    const report = await Report.create({
      material: materialId,
      reportedBy: req.user._id,
      reason,
      description: description || '',
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
