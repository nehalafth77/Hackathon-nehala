import React, { useState } from 'react';
import { Network, Sparkles, BookOpen, ChevronRight, Layers } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const KnowledgeMap = () => {
  const { knowledgeMap } = useVault();
  const [selectedSubject, setSelectedSubject] = useState('dbms');

  const currentMap = knowledgeMap[selectedSubject] || knowledgeMap.dbms;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Network size={16} />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Intelligent Knowledge Graph
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualizing semantic links and prerequisite hierarchies across your notes
          </p>
        </div>

        {/* Subject Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setSelectedSubject('dbms')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedSubject === 'dbms'
                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            DBMS
          </button>
          <button
            onClick={() => setSelectedSubject('os')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedSubject === 'os'
                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Operating Systems
          </button>
        </div>
      </div>

      {/* Visual Node Tree */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Root: {currentMap.root}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentMap.nodes.map(node => (
            <div
              key={node.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                node.highlight
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400/80 text-blue-900 dark:text-blue-200 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${node.highlight ? 'bg-blue-600' : 'bg-slate-400'}`} />
                  {node.title}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  L{node.level}
                </span>
              </div>
              {node.highlight && (
                <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-semibold flex items-center gap-1">
                  <Sparkles size={10} /> Active High-Yield Topic
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
