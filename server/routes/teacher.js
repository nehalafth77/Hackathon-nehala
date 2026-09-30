import express from 'express';
import { getPendingMaterials, approveMaterial, rejectMaterial, getReports, getTeacherStats } from '../controllers/teacherController.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, teacherOnly);

router.get('/pending', getPendingMaterials);
router.post('/approve/:id', approveMaterial);
router.post('/reject/:id', rejectMaterial);
router.get('/reports', getReports);
router.get('/stats', getTeacherStats);

export default router;
