import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiAPI } from '../../services/api';
import {
  Brain, Send, Sparkles, BookOpen, HelpCircle, FileText,
  RotateCcw, Copy, Check, User, Bot, Loader2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const PROMPT_SUGGESTIONS = [
  'Explain Deadlock conditions and avoidance with Banker’s Algorithm',
  'What is 3NF vs BCNF? Explain with clear student example',
  'Compare TCP and UDP with header structure and real-world use cases',
  'Generate 5 practice MCQs for Computer Graphics pipeline',
  'Summarize Dijkstra’s shortest path algorithm step-by-step',
];

const AIAssistant = () => {
  const [searchParams] = useSearchParams();
  const initialContext = searchParams.get('context') || '';

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'quiz' | 'cheat-sheet'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: initialContext
        ? `Hello! I noticed you are studying "${initialContext}". How can I help you master this topic today? Ask me for practice questions, concept breakdowns, or quick summaries!`
        : `👋 Hi! I am your StudySphere AI Academic Tutor. You can ask me to explain any difficult topic, solve doubts, generate exam questions, or create revision summaries. What are we studying today?`,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Quiz Generator Tab state
  const [quizSubject, setQuizSubject] = useState('DBMS');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizEvaluated, setQuizEvaluated] = useState(false);

  // Cheat Sheet / Summarizer Tab state
  const [summaryTopic, setSummaryTopic] = useState('');
  const [summaryInputText, setSummaryInputText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (questionToSend = inputQuestion) => {
    const q = questionToSend.trim();
    if (!q || loading) return;

    const newMsgs = [...messages, { role: 'user', text: q }];
    setMessages(newMsgs);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        question: q,
        context: initialContext || 'Computer Science Engineering courses',
      });
      setMessages([...newMsgs, { role: 'assistant', text: res.data.answer || res.data.message }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'I encountered an issue processing that query. Please make sure the AI service is reachable and try again.',
        },
      ]);
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizEvaluated(false);
    try {
      const res = await aiAPI.quiz({
        subject: quizSubject,
        title: quizTopic || `${quizSubject} key exam questions`,
        content: quizTopic,
      });
      setQuizQuestions(res.data.quiz || res.data.questions || []);
    } catch {
      toast.error('Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  // Generate Summary / Cheat sheet
  const handleGenerateSummary = async () => {
    if (!summaryTopic.trim() && !summaryInputText.trim()) {
      toast.error('Please enter a topic or paste notes to summarize');
      return;
    }
    setSummaryLoading(true);
    setSummaryResult('');
    try {
      const res = await aiAPI.summarize({
        title: summaryTopic || 'Quick Cheat Sheet',
        content: summaryInputText || summaryTopic,
      });
      setSummaryResult(res.data.summary || res.data.content);
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Study Assistant
              <span className="text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full">
                Gemini Powered
              </span>
            </h1>
            <p className="text-sm text-gray-500">24/7 personalized academic tutor & exam preparation partner</p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-gray-900 text-violet-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Doubt Solver
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-gray-900 text-violet-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Quiz Generator
          </button>
          <button
            onClick={() => setActiveTab('cheat-sheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cheat-sheet'
                ? 'bg-white dark:bg-gray-900 text-violet-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Revision Notes
          </button>
        </div>
      </div>

      {/* TAB 1: Interactive Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat message stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                    m.role === 'user'
                      ? 'bg-primary-600'
                      : 'bg-gradient-to-tr from-violet-600 to-indigo-600'
                  }`}
                >
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed relative group ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-gray-50 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700/60 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}

                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(m.text, idx)}
                      className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-gray-500 border border-gray-100 dark:border-gray-700">
                  <Loader2 size={16} className="animate-spin text-violet-600" />
                  <span>StudySphere AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-5 py-2.5 bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="text-gray-400 font-medium flex items-center gap-1">
                <Sparkles size={12} className="text-violet-500" /> Suggestions:
              </span>
              {PROMPT_SUGGESTIONS.map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSendChat(suggestion)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-violet-400 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input box */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask any academic doubt (e.g. explain normal forms or prove Master theorem)..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={loading}
                className="input flex-1 h-12 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !inputQuestion.trim()}
                className="btn btn-primary h-12 px-5 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Quiz & Test Generator */}
      {activeTab === 'quiz' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="text-violet-600" size={20} />
              Instant Quiz & Exam Self-Assessment
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select your subject and topic to generate exam-standard practice questions with instant evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="label">Subject</label>
              <select
                value={quizSubject}
                onChange={e => setQuizSubject(e.target.value)}
                className="input"
              >
                <option value="DBMS">DBMS</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Java">Java Programming</option>
                <option value="Computer Graphics">Computer Graphics</option>
                <option value="Data Structures">Data Structures & Algorithms</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="label">Topic / Unit / Subtopic (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Concurrency Control, Deadlock, B-Trees..."
                  value={quizTopic}
                  onChange={e => setQuizTopic(e.target.value)}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                  className="btn btn-primary text-xs px-5 inline-flex items-center gap-2 whitespace-nowrap"
                >
                  {quizLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>Generate Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {quizLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="animate-spin text-violet-600" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Crafting targeted practice questions for {quizSubject}...
              </p>
            </div>
          )}

          {!quizLoading && quizQuestions.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Practice Questions ({quizQuestions.length})
                </h3>
                {!quizEvaluated ? (
                  <button
                    onClick={() => setQuizEvaluated(true)}
                    className="btn btn-primary text-xs py-1.5 px-4"
                  >
                    Submit & Evaluate
                  </button>
                ) : (
                  <button
                    onClick={() => { setUserAnswers({}); setQuizEvaluated(false); }}
                    className="btn btn-secondary text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Answers</span>
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {quizQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {qIdx + 1}. {q.question || q}
                    </p>

                    {q.options && (
                      <div className="space-y-2 pl-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[qIdx] === optIdx;
                          const isCorrect = quizEvaluated && (optIdx === q.correctAnswer || opt === q.answer);
                          const isWrong = quizEvaluated && isSelected && !isCorrect;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                if (!quizEvaluated) {
                                  setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                }
                              }}
                              className={`w-full text-left text-xs p-3 rounded-lg border transition-all flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium'
                                  : isWrong
                                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300'
                                  : isSelected
                                  ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-violet-900 dark:text-violet-200'
                                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCorrect && <Check size={14} className="text-emerald-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {quizEvaluated && q.explanation && (
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Cheat Sheet & Revision Notes */}
      {activeTab === 'cheat-sheet' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="text-violet-600" size={20} />
              AI Fast-Revision Sheet & Summarizer
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Condense entire units into key exam points, formulas, bullet points, and high-yield questions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="label">Topic Name</label>
              <input
                type="text"
                placeholder="e.g. Relational Algebra, BCNF Normalization, IP Addressing & Subnetting"
                value={summaryTopic}
                onChange={e => setSummaryTopic(e.target.value)}
                className="input"
              />
            </div>

            <div className="space-y-1">
              <label className="label">Or Paste Messy WhatsApp Notes / Text to Summarize</label>
              <textarea
                rows={4}
                placeholder="Paste unorganized text or lecture transcript here..."
                value={summaryInputText}
                onChange={e => setSummaryInputText(e.target.value)}
                className="input text-xs"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading}
              className="btn btn-primary inline-flex items-center gap-2 text-xs px-5"
            >
              {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Generate Revision Summary</span>
            </button>
          </div>

          {summaryResult && (
            <div className="p-5 rounded-2xl border border-violet-100 dark:border-violet-900/40 bg-violet-50/20 dark:bg-violet-950/10 space-y-3">
              <div className="flex items-center justify-between border-b border-violet-200/50 dark:border-violet-800/40 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Quick Revision Notes
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(summaryResult); toast.success('Copied!'); }}
                  className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>

              <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                {summaryResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
