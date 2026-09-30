import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { 
  RotateCcw, Calendar, CheckCircle2, Clock, Sparkles, 
  ArrowRight, Award, BarChart2, BookOpen, Layers, Flame 
} from 'lucide-react';

export default function Revision() {
  const navigate = useNavigate();
  const { revisionTasks, markTaskComplete, showToast } = useVault();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'due' | 'completed'

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-vault-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-vault-md border border-vault-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-500/20 text-vault-300 text-xs font-semibold mb-3 border border-vault-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Spaced Repetition Algorithm Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Revision Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Never forget exam concepts. StudyVault schedules intelligent review intervals based on difficulty and time decay.
          </p>
        </div>

        {/* Quick Streak Stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 z-10">
          <div className="text-center px-3">
            <span className="text-2xl font-bold text-white block">5 Days</span>
            <span className="text-[11px] text-vault-300 uppercase tracking-wider font-semibold">Current Streak</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center px-3">
            <span className="text-2xl font-bold text-emerald-400 block">{completedTasks.length}</span>
            <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Mastered</span>
          </div>
        </div>
      </div>

      {/* Grid: Tasks List (Left) + Weekly Progress Visualization (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Revision Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-vault-600 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800'
                }`}
              >
                All Tasks ({revisionTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('due')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'due'
                    ? 'bg-vault-600 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800'
                }`}
              >
                Due Today ({dueTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-vault-600 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {displayedTasks.map((task) => {
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
                      : 'border-slate-200 dark:border-navy-800 hover:border-vault-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-vault-600 dark:text-vault-400">
                        {task.subject}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500">{task.unit}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.difficulty === 'Hard'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                            : task.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {task.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Due: <strong className="text-slate-700 dark:text-slate-300">{due}</strong>
                      </span>
                      <span>•</span>
                      <span>Last studied: {task.lastStudied}</span>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-slate-400 block">Mastery</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {mastery}%
                      </span>
                    </div>

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
                        className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Review Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Weekly Progress Visualization & Study Advice */}
        <div className="lg:col-span-4 space-y-5">
          {/* Weekly Bar Visualization */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-vault-600" />
                Your Weekly Revision
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Goal: 20 topics</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Consistently reviewing topics within 72 hours boosts long-term retention by <strong>84%</strong>.
            </p>

            {/* Visual Bars */}
            <div className="space-y-2.5 pt-2">
              {[
                { day: 'Mon', count: 7, max: 10, percent: '70%' },
                { day: 'Tue', count: 5, max: 10, percent: '50%' },
                { day: 'Wed', count: 8, max: 10, percent: '80%' },
                { day: 'Thu', count: 4, max: 10, percent: '40%' },
                { day: 'Fri (Today)', count: 9, max: 10, percent: '90%', active: true },
              ].map((item) => (
                <div key={item.day} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${item.active ? 'text-vault-600 dark:text-vault-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.day}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.count} reviewed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-navy-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.active ? 'bg-vault-600' : 'bg-slate-300 dark:bg-navy-700'
                      }`}
                      style={{ width: item.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Shortcut Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-vault-50 dark:from-navy-950 dark:to-indigo-950/40 p-5 rounded-2xl border border-indigo-100 dark:border-navy-800 shadow-vault-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Recall Drill
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Generate an instant 5-question multiple choice drill on your pending revision topics to test your memory retention before exams.
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Launch Drill Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
