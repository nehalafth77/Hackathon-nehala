import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, BookOpen, Bell, Moon, Sun, Monitor, 
  ShieldCheck, HardDrive, Check, Sparkles, Download, 
  RefreshCw, RotateCcw, Cloud, CheckCircle2 
} from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { materials, revisionTasks, resetToDefaults, showToast } = useVault();
  const { isDark, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || 'Arjun Sharma');
  const [email, setEmail] = useState(user?.email || 'arjun.sharma@college.edu');
  const [semester, setSemester] = useState(user?.semester || 'Semester 6');
  const [branch, setBranch] = useState(user?.department || 'Computer Science & Engineering');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || 'CS21B1042');

  // AI settings
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoDeduplicate, setAutoDeduplicate] = useState(true);
  const [ocrHandwritten, setOcrHandwritten] = useState(true);
  const [autoTagSyllabus, setAutoTagSyllabus] = useState(true);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      department: branch,
      semester,
      rollNumber,
    });
    showToast('Academic profile updated successfully!', 'success');
  };

  const handleSaveAISettings = () => {
    showToast('AI Intelligence preferences saved!', 'success');
  };

  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      user: { name, email, branch, semester, rollNumber },
      materialsCount: materials.length,
      materials,
      revisionTasks,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyVault_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Vault data exported as JSON!', 'success');
  };

  const handleCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Cloud sync complete: Google Drive & Portal up to date', 'success');
    }, 1200);
  };

  const currentThemeMode = isDark ? 'dark' : 'light';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Account & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your university academic profile, AI organization preferences, notifications, and storage.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-navy-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'profile', label: 'Profile & Academic' },
          { id: 'ai', label: 'AI Intelligence' },
          { id: 'appearance', label: 'Appearance' },
          { id: 'storage', label: 'Storage & Sync' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-vault-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-navy-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-vault-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user?.avatarInitials || user?.avatar || name.slice(0, 2).toUpperCase() || 'AS'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {name}
              </h3>
              <p className="text-xs text-slate-500">{email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-vault-600 dark:text-vault-400 bg-vault-50 dark:bg-vault-950/60 px-2 py-0.5 rounded-md border border-vault-200 dark:border-vault-800">
                {user?.role === 'teacher' ? 'Faculty Member' : 'Undergraduate Student'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                University Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Enrolled Department / Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Student ID / Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Active Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
              >
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex justify-end">
            <button
              type="submit"
              className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: AI Intelligence Preferences */}
      {activeTab === 'ai' && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
              <div className="space-y-1 pr-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Automatic Duplicate Detection
                </h4>
                <p className="text-xs text-slate-500">
                  Detect overlapping notes or textbook chapters when uploading files (similarity threshold: 85%).
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoDeduplicate}
                onChange={(e) => setAutoDeduplicate(e.target.checked)}
                className="w-5 h-5 accent-vault-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
              <div className="space-y-1 pr-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Auto-Classification into Course Tree
                </h4>
                <p className="text-xs text-slate-500">
                  Automatically categorize files into syllabus Unit 1 through Unit 5 using natural language parsing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="w-5 h-5 accent-vault-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
              <div className="space-y-1 pr-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  OCR for Handwritten Notes & Diagrams
                </h4>
                <p className="text-xs text-slate-500">
                  Transcribe handwritten WhatsApp camera snaps into searchable text and diagrams.
                </p>
              </div>
              <input
                type="checkbox"
                checked={ocrHandwritten}
                onChange={(e) => setOcrHandwritten(e.target.checked)}
                className="w-5 h-5 accent-vault-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
              <div className="space-y-1 pr-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Auto-Tag University Syllabus Units
                </h4>
                <p className="text-xs text-slate-500">
                  Cross-reference university APJ/KTU syllabus guidelines to rate exam importance score (1–5).
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoTagSyllabus}
                onChange={(e) => setAutoTagSyllabus(e.target.checked)}
                className="w-5 h-5 accent-vault-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAISettings}
              className="bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Save AI Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Theme Mode
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light Theme', icon: Sun },
              { id: 'dark', label: 'Deep Navy Dark', icon: Moon },
              { id: 'system', label: 'System Default', icon: Monitor },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = th.id === 'system' ? false : currentThemeMode === th.id;

              return (
                <div
                  key={th.id}
                  onClick={() => {
                    if (th.id === 'dark') {
                      setTheme(true);
                    } else {
                      setTheme(false);
                    }
                    showToast(`Theme switched to ${th.label}`, 'info');
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer text-center space-y-2 transition-all ${
                    isSelected
                      ? 'border-vault-600 bg-vault-50/50 dark:bg-vault-950/60 font-bold'
                      : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto text-vault-600 dark:text-vault-400" />
                  <span className="text-xs block">{th.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Storage & Sync */}
      {activeTab === 'storage' && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-vault-sm space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-white">Vault Storage Usage</span>
              <span className="text-vault-600 dark:text-vault-400">1.8 GB of 15 GB Used (12%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-navy-950 h-3 rounded-full overflow-hidden">
              <div className="bg-vault-600 h-full rounded-full w-[12%]" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <strong className="text-slate-900 dark:text-white">Connected Cloud Sources:</strong>
            <p>• Google Drive (Class Shared Folders): Synced 2 hours ago</p>
            <p>• College Portal (KTU/APJ Syllabus): Auto-mapped</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="p-4 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 hover:bg-slate-100 dark:hover:bg-navy-800 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Sync Cloud</span>
                <RefreshCw className={`w-4 h-4 text-vault-600 ${isSyncing ? 'animate-spin' : ''}`} />
              </div>
              <p className="text-[11px] text-slate-500">Refresh external links and Google Drive class drops.</p>
            </button>

            <button
              type="button"
              onClick={handleExportData}
              className="p-4 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 hover:bg-slate-100 dark:hover:bg-navy-800 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Export Vault</span>
                <Download className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500">Download complete study notes & revision tasks as JSON.</p>
            </button>

            <button
              type="button"
              onClick={resetToDefaults}
              className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 text-left transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Reset Demo Data</span>
                <RotateCcw className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400">Restore factory sample subjects and verified notes.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
