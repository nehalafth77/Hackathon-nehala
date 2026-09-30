import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiAPI } from '../../services/api';
import {
  Brain, Send, Sparkles, BookOpen, HelpCircle, FileText,
  RotateCcw, Copy, Check, User, Bot, Loader2, ArrowRight, Zap, CheckCircle2
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight">
              AI Academic Workspace
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full">
                Gemini Powered
              </span>
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">24/7 Academic doubt solver, MCQ test generator, and revision summarizer</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-100 dark:bg-dark-850 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-dark-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Doubt Solver
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-dark-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quiz Generator
          </button>
          <button
            onClick={() => setActiveTab('cheat-sheet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cheat-sheet'
                ? 'bg-white dark:bg-dark-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Revision Notes
          </button>
        </div>
      </div>

      {/* TAB 1: Interactive Chat Doubt Solver */}
      {activeTab === 'chat' && (
        <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-card flex flex-col h-[650px] overflow-hidden">
          {/* Chat message stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm ${
                    m.role === 'user'
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-tr from-violet-600 to-indigo-600'
                  }`}
                >
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-100/80 dark:bg-dark-850/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800/80 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}

                  {m.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(m.text, idx)}
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-white/50 dark:bg-dark-900/50"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-100/80 dark:bg-dark-850/90 rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-xs font-semibold text-slate-500 border border-slate-200/60 dark:border-slate-800/80">
                  <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>StudySphere AI is analyzing academic query...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions Ticker */}
          <div className="px-6 py-3 bg-slate-50/80 dark:bg-dark-850/50 border-t border-slate-200/70 dark:border-slate-800/70 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Sparkles size={12} className="text-violet-500" /> Exam Prompts:
              </span>
              {PROMPT_SUGGESTIONS.map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSendChat(suggestion)}
                  className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium transition-colors text-[11px]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-dark-900 border-t border-slate-200/70 dark:border-slate-800/70">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask any academic doubt (e.g. explain 3NF vs BCNF or prove Master Theorem)..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={loading}
                className="input flex-1 h-12 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={loading || !inputQuestion.trim()}
                className="btn-primary h-12 px-6 font-bold flex items-center justify-center gap-2 shadow-indigo-500/20"
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
        <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-card space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={20} />
              Instant Quiz & Exam Self-Assessment
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
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
                  className="btn-primary text-xs px-5 inline-flex items-center gap-2 whitespace-nowrap font-bold"
                >
                  {quizLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>Generate Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {quizLoading && (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Crafting targeted practice questions for {quizSubject}...
              </p>
            </div>
          )}

          {!quizLoading && quizQuestions.length > 0 && (
            <div className="space-y-6 pt-5 border-t border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Practice Questions ({quizQuestions.length})
                </h3>
                {!quizEvaluated ? (
                  <button
                    onClick={() => setQuizEvaluated(true)}
                    className="btn-primary text-xs py-2 px-5 font-bold"
                  >
                    Submit & Evaluate
                  </button>
                ) : (
                  <button
                    onClick={() => { setUserAnswers({}); setQuizEvaluated(false); }}
                    className="btn-secondary text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Quiz</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-dark-850/50 space-y-3"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
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
                              className={`w-full text-left text-xs p-3.5 rounded-xl border transition-all flex items-center justify-between font-medium ${
                                isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                  : isWrong
                                  ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300'
                                  : isSelected
                                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                                  : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-dark-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCorrect && <Check size={14} className="text-emerald-500" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {quizEvaluated && q.explanation && (
                      <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed">
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
        <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-card space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
              AI Fast-Revision Sheet Generator
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
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
              className="btn-primary inline-flex items-center gap-2 text-xs px-6 font-bold"
            >
              {summaryLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Generate Revision Summary</span>
            </button>
          </div>

          {summaryResult && (
            <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Quick Revision Notes Output
                </span>
                <button
                  onClick={() => { navigator.clipboard.writeText(summaryResult); toast.success('Copied!'); }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-bold"
                >
                  <Copy size={13} /> Copy All
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
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

