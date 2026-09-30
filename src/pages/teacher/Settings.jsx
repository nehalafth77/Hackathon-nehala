import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Mail, Shield, BookOpen, Moon, Sun, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherSettings = () => {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, name, department, designation };
    localStorage.setItem('studysphere_user', JSON.stringify(updated));
    setSaved(true);
    toast.success('Faculty profile updated!');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your academic credentials, department affiliation, and interface preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Faculty Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="label">Full Name with Title</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label">Official Faculty Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="input pl-9 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="label">Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="label">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center gap-2 text-xs px-5"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Saved!' : 'Save Details'}</span>
          </button>
        </div>
      </form>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </p>
            <p className="text-xs text-gray-500">
              Customize portal appearance for grading and review sessions
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          className="btn btn-secondary text-xs px-4 py-2"
        >
          Switch to {isDark ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
};

export default TeacherSettings;
