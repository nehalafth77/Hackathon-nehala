import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Lock, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') setForm({ email: 'student@studysphere.com', password: 'student123' });
    else setForm({ email: 'teacher@studysphere.com', password: 'teacher123' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap size={26} className="text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">StudySphere</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Sign in to access your study resources and AI tutor</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-glass p-8">
          {/* Quick Demo Access Bar */}
          <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-dark-850/70 border border-slate-200/50 dark:border-slate-800/50 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2 flex items-center justify-center gap-1">
              <Sparkles size={11} className="text-indigo-500" /> 1-Click Demo Evaluation Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="py-2 px-3 bg-white dark:bg-dark-900 border border-indigo-500/30 hover:border-indigo-500 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                📚 Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('teacher')}
                className="py-2 px-3 bg-white dark:bg-dark-900 border border-violet-500/30 hover:border-violet-500 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                🎓 Teacher Demo
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/70 dark:border-slate-800/70" />
            </div>
            <div className="relative flex justify-center text-[11px] font-semibold">
              <span className="bg-white dark:bg-dark-900 px-3 text-slate-400 uppercase tracking-wider">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input pl-10"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 justify-center text-sm font-bold shadow-indigo-500/25 mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Create student / teacher account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

