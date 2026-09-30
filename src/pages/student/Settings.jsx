import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Mail, GraduationCap, Moon, Sun, Shield, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentSettings = () => {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [semester, setSemester] = useState(user?.semester || 5);
  const [course, setCourse] = useState(user?.course || 'B.Tech CSE');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update local stored user info
    const updated = { ...user, name, semester, course };
    localStorage.setItem('studysphere_user', JSON.stringify(updated));
    setSaved(true);
    toast.success('Profile preferences updated!');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account & Preferences</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal details, academic cohort, and interface settings
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Academic Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="label">Full Name</label>
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
            <label className="label">Email Address</label>
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
            <label className="label">Course / Branch</label>
            <select
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="input"
            >
              <option value="B.Tech CSE">B.Tech Computer Science & Eng</option>
              <option value="B.Tech IT">B.Tech Information Technology</option>
              <option value="B.Tech ECE">B.Tech Electronics & Comm</option>
              <option value="BCA">Bachelor of Computer Applications</option>
              <option value="MCA">Master of Computer Applications</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="label">Current Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(Number(e.target.value))}
              className="input"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center gap-2 text-xs px-5"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Saved!' : 'Save Profile'}</span>
          </button>
        </div>
      </form>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          App Theme
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {isDark ? 'Dark Theme' : 'Light Theme'}
              </p>
              <p className="text-xs text-gray-500">
                Switch between high-contrast dark mode and crisp light theme
              </p>
            </div>
          </div>

          <button
            onClick={toggle}
            className="btn btn-secondary text-xs px-4 py-2"
          >
            Toggle to {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
