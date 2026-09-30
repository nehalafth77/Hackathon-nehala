import express from 'express';
import {
  getAnnouncements, createAnnouncement, getNotifications, markNotificationsRead, createReport
} from '../controllers/announcementController.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/announcements', getAnnouncements);
router.post('/announcements', teacherOnly, createAnnouncement);
router.get('/notifications', getNotifications);
router.put('/notifications/read', markNotificationsRead);
router.post('/reports', createReport);

export default router;
