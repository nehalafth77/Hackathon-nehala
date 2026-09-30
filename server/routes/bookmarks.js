import express from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getBookmarks);
router.post('/:materialId', addBookmark);
router.delete('/:materialId', removeBookmark);

export default router;
