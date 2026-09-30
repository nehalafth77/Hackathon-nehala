import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, BookOpen, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, Mail, User, GraduationCap 
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs, loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    loginWithCredentials(email || 'student@university.edu', password);
    navigate('/dashboard');
  };

  const handleStudentDemo = () => {
    loginAs('student');
    navigate('/dashboard');
  };

  const handleTeacherDemo = () => {
    loginAs('teacher');
    navigate('/verified');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
          
          {/* Left Column: StudyVault Product Value & Branding */}
          <div className="md:col-span-6 bg-gradient-to-br from-vault-900 via-navy-900 to-indigo-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-vault-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Brand Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-vault-600 flex items-center justify-center text-white shadow-md">
                  <div className="relative">
                    <BookOpen className="w-5 h-5 text-white" />
                    <Lock className="w-2.5 h-2.5 text-vault-200 absolute -bottom-0.5 -right-0.5" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight">Study<span className="text-vault-400">Vault</span></span>
                  <span className="block text-[10px] text-vault-300 font-medium tracking-wider">AI PERSONAL STUDY WORKSPACE</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white mb-4">
                Stop searching through chats.<br />
                Start studying.
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Bring your scattered PDFs, WhatsApp class notes, lecture slides, and question papers into one intelligent, searchable workspace.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automatic AI subject & unit classification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Duplicate detection (no more 10 versions of Unit 3)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faculty-verified materials for exams</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-vault-700/50 text-[11px] text-slate-400">
              "Built for students who have too many study groups."
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-navy-900">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Welcome to StudyVault
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter with your college ID or test with a 1-click demo role.
              </p>
            </div>

            {/* 1-Click Hackathon Demo Buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleStudentDemo}
                className="w-full bg-vault-600 hover:bg-vault-700 text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-between shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <GraduationCap className="w-4 h-4" />
                  <div>
                    <span className="block font-bold">1-Click Demo: Arjun (Student)</span>
                    <span className="block text-[10px] text-vault-200 font-normal">Full student vault, AI study & quizzes</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTeacherDemo}
                className="w-full bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-between border border-slate-200 dark:border-navy-700 transition-all"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="block font-bold">1-Click Demo: Dr. Sarah (Faculty)</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Verification queue & material approval</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-navy-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-navy-900 px-3 text-slate-400">or sign in with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  University / College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-50 dark:bg-navy-950 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-navy-950 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-vault-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm py-2.5 rounded-xl transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
              >
                Sign In to Workspace
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
