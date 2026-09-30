import express from 'express';
import { chat, summarize, explain, generateQuiz, suggestTags } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/chat', chat);
router.post('/summarize', summarize);
router.post('/explain', explain);
router.post('/quiz', generateQuiz);
router.post('/tags', suggestTags);

export default router;
