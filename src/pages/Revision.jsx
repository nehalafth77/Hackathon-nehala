import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { 
  RotateCcw, Calendar, CheckCircle2, Clock, Sparkles, 
  ArrowRight, Award, BarChart2, BookOpen, Layers, Flame,
  Plus, Trash2, CheckSquare, Brain, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Revision() {
  const navigate = useNavigate();
  const { revisionTasks, markTaskComplete, deleteRevisionTask, addCustomRevisionTask, showToast } = useVault();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'due' | 'completed'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Database Management Systems');
  const [newUnit, setNewUnit] = useState('Unit 3');
  const [newDifficulty, setNewDifficulty] = useState('Medium');

  const isCompleted = (t) => t.status === 'completed' || !!t.completed;

  const dueTasks = revisionTasks.filter(t => !isCompleted(t));
  const completedTasks = revisionTasks.filter(t => isCompleted(t));

  const displayedTasks = activeTab === 'all' 
    ? revisionTasks 
    : activeTab === 'due' 
    ? dueTasks 
    : completedTasks;

  const handleReviewClick = (task) => {
    markTaskComplete(task.id);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a topic title');
      return;
    }
    addCustomRevisionTask({
      title: newTitle.trim(),
      subject: newSubject,
      unit: newUnit,
      difficulty: newDifficulty,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-vault-md border border-blue-700/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Spaced Repetition Engine Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Revision Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Never forget exam concepts. StudyVault automatically schedules intelligent review intervals based on difficulty and time decay.
          </p>
        </div>

        {/* Quick Streak Stats & Add Task Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 z-10">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div className="text-center px-3">
              <span className="text-2xl font-bold text-white block">5 Days</span>
              <span className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">Streak</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center px-3">
              <span className="text-2xl font-bold text-emerald-400 block">{completedTasks.length}</span>
              <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Mastered</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary text-xs px-4 py-3 font-bold flex items-center gap-1.5 shadow-md w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add Custom Topic</span>
          </button>
        </div>
      </div>

      {/* Grid: Tasks List (Left) + Weekly Progress Visualization (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Revision Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800 hover:bg-slate-50'
                }`}
              >
                All Tasks ({revisionTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('due')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'due'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800 hover:bg-slate-50'
                }`}
              >
                Due Today ({dueTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800 hover:bg-slate-50'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {displayedTasks.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 border border-slate-200 dark:border-navy-800 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No revision tasks in this view</h4>
                <p className="text-xs text-slate-500">All due topics are revised or you can add new topics from your study materials!</p>
              </div>
            ) : (
              displayedTasks.map((task) => {
                const completed = isCompleted(task);
                const title = task.title || task.topic || 'Untitled Topic';
                const due = task.scheduledFor || task.dueStatus || 'Today';
                const mastery = task.masteryPercentage ?? task.mastery ?? 65;

                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-navy-900 rounded-2xl p-5 border transition-all shadow-vault-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      completed
                        ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 opacity-80'
                        : 'border-slate-200 dark:border-navy-800 hover:border-blue-300'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {task.subject}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500">{task.unit}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.difficulty === 'Hard'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : task.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          }`}
                        >
                          {task.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Due: <strong className="text-slate-700 dark:text-slate-300">{due}</strong>
                        </span>
                        <span>•</span>
                        <span>Last studied: {task.lastStudied}</span>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => navigate(`/quiz?topic=${encodeURIComponent(title)}&subject=${encodeURIComponent(task.subject)}`)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-slate-500 transition-colors"
                        title="Generate Quiz on this topic"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate(`/ai?ask=${encodeURIComponent('Explain ' + title + ' with key formulas')}`)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-slate-500 transition-colors"
                        title="Ask AI Study Tutor"
                      >
                        <Brain className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteRevisionTask(task.id)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-slate-400 transition-colors"
                        title="Delete from revision queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {completed ? (
                        <button
                          onClick={() => handleReviewClick(task)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                          title="Click to mark pending"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Reviewed
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReviewClick(task)}
                          className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 font-bold"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Done</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Weekly Progress Visualization & Study Advice */}
        <div className="lg:col-span-4 space-y-5">
          {/* Weekly Bar Visualization */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Weekly Retention Progress
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Goal: 20 topics</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Consistently reviewing topics within 72 hours boosts long-term retention by <strong>84%</strong>.
            </p>

            {/* Visual Bars for Mon-Sun */}
            <div className="flex items-end justify-between h-32 pt-4 px-2">
              {[
                { day: 'Mon', count: 3, h: '60%' },
                { day: 'Tue', count: 5, h: '90%' },
                { day: 'Wed', count: 4, h: '75%' },
                { day: 'Thu', count: 2, h: '40%' },
                { day: 'Fri', count: 4, h: '75%' },
                { day: 'Sat', count: 1, h: '25%' },
                { day: 'Sun', count: 3, h: '60%' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex justify-center h-24 items-end">
                    <div
                      style={{ height: item.h }}
                      className="w-5 bg-blue-500/80 hover:bg-blue-600 rounded-t-md transition-all cursor-pointer relative group"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.count} topics
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Revision Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-navy-950 dark:to-blue-950/40 p-5 rounded-2xl border border-blue-100 dark:border-navy-800 shadow-vault-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Exam Recall Strategy
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use active recall: before looking at solutions, try writing down Armstrong's axioms or Banker's safety state equation on scrap paper.
            </p>
          </div>
        </div>
      </div>

      {/* Add Custom Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Add Revision Topic
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-Tree Insertion & Deletion"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Database Management Systems">DBMS</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Data Structures & Algorithms">DSA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit / Module
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-2.5 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        newDifficulty === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-navy-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-5 py-2 font-bold shadow-sm"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
