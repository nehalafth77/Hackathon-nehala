import express from 'express';
import {
  getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial, markUseful, searchMaterials
} from '../controllers/materialController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchMaterials);
router.get('/', getMaterials);
router.get('/:id', getMaterialById);
router.post('/', upload.single('file'), createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);
router.post('/:id/useful', markUseful);

export default router;
