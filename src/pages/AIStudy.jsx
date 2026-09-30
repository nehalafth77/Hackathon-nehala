import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { 
  Sparkles, Send, BookOpen, HelpCircle, FileText, 
  ExternalLink, RefreshCw, CheckCircle2, ChevronRight, 
  Lightbulb, AlertCircle, Bot, User, ArrowRight,
  Copy, Check, Download, Calendar, Volume2, VolumeX
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIStudy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { materials, addRevisionTask } = useVault();

  const initialPrompt = searchParams.get('ask') || 'Explain normalization in simple words.';

  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'user',
      text: initialPrompt,
      timestamp: '10:42 AM'
    },
    {
      id: 'm2',
      sender: 'ai',
      text: `**Normalization** is a systematic database design technique used to organize tables to **reduce data redundancy** and avoid update, insert, and delete anomalies.

Think of it like organizing your desk: instead of dumping all files, textbooks, and pens into one messy drawer, you place each item in a dedicated folder with clear labels.

### Key Normal Forms in Your Curriculum:
1. **1NF (First Normal Form)**: Eliminates duplicate columns and ensures every attribute contains **atomic** (single, indivisible) values.
2. **2NF (Second Normal Form)**: Must be in 1NF + removes **partial dependency** (no non-prime attribute should depend on only a subset of candidate keys).
3. **3NF (Third Normal Form)**: Must be in 2NF + removes **transitive dependencies** (if A → B and B → C, then A → C must be factored into separate tables).
4. **BCNF (Boyce-Codd Normal Form)**: Stricter version where for every functional dependency $X \\rightarrow Y$, $X$ must be a super key.`,
      timestamp: '10:42 AM',
      sources: [
        {
          id: 'mat-1',
          title: 'DBMS Normalization Complete Notes (Unit 3)',
          subject: 'Database Management Systems',
          page: 'Pages 4–12',
          verified: true
        },
        {
          id: 'mat-4',
          title: 'Database Systems Question Bank 2024 (Solved)',
          subject: 'Database Management Systems',
          page: 'Question 14 (3NF vs BCNF)',
          verified: true
        }
      ]
    }
  ]);

  const [activeSources, setActiveSources] = useState(messages[1].sources || []);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let replySources = [];

      const q = query.toLowerCase();

      if (q.includes('simpler') || q.includes('simple') || q.includes('eli5')) {
        replyText = `### Simplified Analogy 🍕

Imagine you have a single spreadsheet for a **Pizza Store**. 
Every time a customer orders, you write down:
- Customer Name
- Customer Phone
- Pizza Topping
- Delivery Address

If Rahul orders 10 times, his phone and address get typed 10 times!
- If he changes phone numbers, you have to update 10 different rows (**Update Anomaly**).
- If you delete his last order, you lose his phone number forever (**Delete Anomaly**).

**Normalization** simply splits this into two neat tables:
1. \`Customers\` (ID, Name, Phone, Address)
2. \`Orders\` (Order ID, Customer ID, Pizza Topping)

Now Rahul's address is stored **only once**. That's 3NF in action!`;
        replySources = [
          {
            id: 'mat-1',
            title: 'DBMS Normalization Complete Notes (Unit 3)',
            subject: 'Database Management Systems',
            page: 'Page 3 (Anomalies Demonstration)',
            verified: true
          }
        ];
      } else if (q.includes('example') || q.includes('real world')) {
        replyText = `### Real-World Example: Student Course Registration

Consider an unnormalized table:
\`\`\`text
[StudentID, StudentName, CourseID, CourseName, Instructor]
\`\`\`

**Dependency Analysis**:
- \`StudentID\` → \`StudentName\` (Partial Dependency on primary key composite)
- \`CourseID\` → \`CourseName, Instructor\`

**Normalized into 3NF Tables**:
1. \`Students\` (\`StudentID\`, \`StudentName\`)
2. \`Courses\` (\`CourseID\`, \`CourseName\`, \`Instructor\`)
3. \`Enrollment\` (\`StudentID\`, \`CourseID\`, \`Semester\`)

Zero data duplication, 100% data integrity.`;
        replySources = [
          {
            id: 'mat-1',
            title: 'DBMS Normalization Complete Notes (Unit 3)',
            subject: 'Database Management Systems',
            page: 'Page 7 (Schema Decomposition)',
            verified: true
          }
        ];
      } else if (q.includes('deadlock') || q.includes('os')) {
        replyText = `A **deadlock** in Operating Systems occurs when a set of concurrent processes are permanently blocked because each process is holding a resource and waiting for another resource acquired by another process in the cycle.

### Coffman 4 Conditions for Deadlock:
1. **Mutual Exclusion**: Non-shareable resource.
2. **Hold and Wait**: Process holding $\\ge 1$ resource and requesting more.
3. **No Preemption**: Resources cannot be forcibly revoked.
4. **Circular Wait**: Cycle in Resource Allocation Graph (P1 waits for P2... Pn waits for P1).

StudyVault Vault source verified: see Unit 4 Notes on **Banker's Algorithm** for safety state verification.`;
        replySources = [
          {
            id: 'mat-2',
            title: 'OS Process Synchronization & Deadlocks Guide',
            subject: 'Operating Systems',
            page: 'Pages 18–26',
            verified: true
          }
        ];
      } else {
        replyText = `Based on your uploaded course library, here is the synthesis for **"${query}"**:

We cross-referenced your **Database Management Systems** and **Operating Systems** notes. Key formulas, university question trends, and teacher annotations highlight that this topic is frequently tested in midterms and end-semesters.

Feel free to click **[Generate Quiz]** below to test yourself on this exact concept right now!`;
        replySources = [
          {
            id: 'mat-1',
            title: 'DBMS Normalization Complete Notes (Unit 3)',
            subject: 'Database Management Systems',
            page: 'Page 5',
            verified: true
          }
        ];
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: replySources
      };

      setMessages(prev => [...prev, aiMsg]);
      setActiveSources(replySources);
      setIsTyping(false);
    }, 700);
  };

  const handleCopyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddResponseToRevision = (msg) => {
    addRevisionTask({
      subject: 'AI Study Notes',
      topic: msg.text.slice(0, 35).replace(/[*#]/g, '').trim(),
      unit: 'AI Workspace',
      difficulty: 'Medium',
      materialId: msg.sources?.[0]?.id || 'mat-1'
    });
  };

  const handleExportChat = () => {
    const formatted = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n\n`).join('-------------------------\n');
    const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyVault_AI_Session_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Study session exported as markdown file!');
  };

  const handleSpeakText = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#$`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left Chat Pane */}
      <div className="flex-1 flex flex-col bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-vault-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 px-5 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between bg-slate-50/70 dark:bg-navy-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  StudyVault AI Assistant
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Grounded in your Vault
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Answers cite exclusively from your verified PDFs, notes, and course files
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportChat}
              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Export Conversation as Notes"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setMessages([
                  {
                    id: 'reset',
                    sender: 'ai',
                    text: 'Chat history cleared. What would you like to review from your study materials?',
                    timestamp: 'Just now',
                    sources: []
                  }
                ]);
                setActiveSources([]);
                toast.success('Conversation reset');
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Clear Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-sm text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-50 dark:bg-navy-950/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-navy-800 rounded-bl-none'
                }`}
              >
                {/* Markdown-style content */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-line">
                  {m.text}
                </div>

                {/* Sources Footnote inside AI Message */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-navy-800 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider block mb-2">
                      Sources from your vault:
                    </span>
                    <div className="space-y-1.5">
                      {m.sources.map((src, i) => (
                        <div
                          key={i}
                          onClick={() => navigate(`/material/${src.id}`)}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-blue-400 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {src.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold shrink-0 ml-2">
                            {src.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Controls for AI message */}
                {m.sender === 'ai' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopyMessage(m.text, m.id)}
                        className="hover:text-blue-600 flex items-center gap-1 text-[11px] transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === m.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleAddResponseToRevision(m)}
                        className="hover:text-blue-600 flex items-center gap-1 text-[11px] transition-colors"
                        title="Save to Revision Tasks"
                      >
                        <Calendar size={12} />
                        <span>Add to Revision</span>
                      </button>

                      <button
                        onClick={() => handleSpeakText(m.text)}
                        className="hover:text-blue-600 flex items-center gap-1 text-[11px] transition-colors"
                        title="Read aloud"
                      >
                        {isSpeaking ? <VolumeX size={12} className="text-rose-500" /> : <Volume2 size={12} />}
                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                  </div>
                )}

                {m.sender === 'user' && (
                  <div className="text-[10px] mt-2 text-blue-200 text-right">
                    {m.timestamp}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1 font-semibold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-11">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span>Analyzing notes & synthesizing verified explanation...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Prompt Chips */}
        <div className="p-3 border-t border-slate-100 dark:border-navy-800/80 bg-slate-50/50 dark:bg-navy-950/40 flex flex-wrap gap-2">
          <button
            onClick={() => handleSendMessage('Explain simpler with an intuitive analogy')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs"
          >
            💡 Explain simpler (ELI5)
          </button>
          <button
            onClick={() => handleSendMessage('Give a real world engineering example of 3NF vs BCNF')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs"
          >
            🔍 Give example
          </button>
          <button
            onClick={() => handleSendMessage('Explain Banker’s algorithm and Deadlock recovery in OS')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs"
          >
            ⚙️ OS Deadlock conditions
          </button>
          <button
            onClick={() => navigate('/quiz?topic=Normalization&subject=Database Management Systems')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors shadow-2xs flex items-center gap-1 font-semibold"
          >
            📝 Quiz me on this
          </button>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your study notes, formulas, or exams..."
              className="flex-1 bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="btn btn-primary disabled:opacity-50 p-2.5 rounded-xl shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: "Sources from your vault" Inspector */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-vault-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Sources from your Vault
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            These documents were automatically retrieved based on semantic similarity to your query.
          </p>

          <div className="space-y-3">
            {activeSources.length > 0 ? (
              activeSources.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/material/${src.id}`)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 hover:border-blue-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {src.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-blue-600" />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{src.subject}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{src.page}</span>
                  </div>

                  {src.verified && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-navy-800/80 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Teacher Verified
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Ask a question to see retrieved course sources here.
              </div>
            )}
          </div>
        </div>

        {/* AI Confidence & Exam Relevancy Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-navy-950 dark:to-blue-950/40 p-5 rounded-2xl border border-blue-100 dark:border-navy-800 shadow-vault-sm">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Exam Relevancy Note
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Normalization is tagged with <strong>5-star exam priority</strong>. 3NF and BCNF questions account for ~15 marks in standard university semester papers.
          </p>
          <button
            onClick={() => navigate('/quiz?topic=Normalization&subject=Database Management Systems')}
            className="w-full btn btn-primary font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Test Your Knowledge (Quiz)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
