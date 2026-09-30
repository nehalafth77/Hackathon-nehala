import { aiChat, aiSummarize, aiExplain, aiGenerateQuiz, aiSuggestTags } from '../services/aiService.js';

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'Question is required' });

    const result = await aiChat(question, context);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/summarize
export const summarize = async (req, res) => {
  try {
    const { title, content, materialId } = req.body;
    const result = await aiSummarize(title || 'Study Material', content);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/explain
export const explain = async (req, res) => {
  try {
    const { text, topic } = req.body;
    const result = await aiExplain(text || topic || 'This concept');
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/quiz
export const generateQuiz = async (req, res) => {
  try {
    const { subject, content, title } = req.body;
    const result = await aiGenerateQuiz(subject || title, content);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/tags
export const suggestTags = async (req, res) => {
  try {
    const { title, subject } = req.body;
    const tags = await aiSuggestTags(title, subject);
    res.json({ success: true, tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
