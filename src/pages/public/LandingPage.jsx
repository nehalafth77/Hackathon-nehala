import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ArrowRight, Search, Upload, Brain, BookOpen,
  CheckCircle2, ShieldCheck, Zap, Users, Star, ChevronRight,
  FileText, Sparkles, Lock, Layers, Check, MessageSquare, Flame
} from 'lucide-react';

const FloatingBadge = ({ icon: Icon, label, color, position }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-5, 5, -5] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className={`absolute bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-glass rounded-2xl px-4 py-2.5 flex items-center gap-3 z-20 ${position}`}
  >
    <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center text-white shadow-md`}>
      <Icon size={16} />
    </div>
    <div>
      <span className="block text-xs font-extrabold text-slate-900 dark:text-white">{label}</span>
      <span className="block text-[10px] font-semibold text-emerald-500">Live Active</span>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, badgeColor, badgeText }) => (
  <div className="group bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl rounded-3xl p-7 border border-slate-200/70 dark:border-slate-800/80 shadow-card hover:shadow-card-lg hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
    <div className={`w-14 h-14 rounded-2xl ${badgeColor} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={26} />
    </div>
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-500/20 mb-3 inline-block">
      {badgeText}
    </span>
    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  const [count, setCount] = useState({ students: 0, materials: 0, colleges: 0 });

  useEffect(() => {
    const targets = { students: 12500, materials: 48000, colleges: 120 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        students: Math.floor(targets.students * progress),
        materials: Math.floor(targets.materials * progress),
        colleges: Math.floor(targets.colleges * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Top Floating Glass Header */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-dark-900/70 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none">
                StudySphere
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                Academic Hub
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why StudySphere</a>
            <a href="#ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Tutor</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-xs py-2 px-4 font-semibold">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-xs py-2.5 px-5 font-bold shadow-indigo-500/25">
              Get Started Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-28 overflow-hidden">
        {/* Background Mesh Glow Blobs */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/20 via-violet-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
                <Sparkles size={13} className="text-violet-500" />
                <span>Next-Gen MERN Academic Workspace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-6">
                From scattered chats to a{' '}
                <span className="gradient-text">smarter study space.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
                StudySphere consolidates notes, PYQs, lecture slides, and AIdoubt solving into one faculty-verified hub. Stop hunting through WhatsApp groups.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link to="/register" className="btn-primary text-sm px-7 py-3.5 font-bold shadow-lg shadow-indigo-500/25">
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary text-sm px-6 py-3.5 font-bold">
                  ⚡ Try Demo Login
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-white/50 dark:bg-dark-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60">
                {[
                  { num: `${(count.students / 1000).toFixed(1)}k+`, label: 'Active Students' },
                  { num: `${(count.materials / 1000).toFixed(0)}k+`, label: 'Verified Notes' },
                  { num: `${count.colleges}+`, label: 'Colleges' },
                  { num: '4.9/5', label: 'Satisfaction' },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{num}</p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Glass Preview Card */}
              <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-card-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <GraduationCap size={16} />
                      </div>
                      <span className="font-extrabold text-sm">StudySphere Student Hub</span>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase">CS & Engg</span>
                  </div>
                  <p className="text-xs text-white/80 font-medium">Semester 6 • Computer Science & Engineering</p>
                </div>

                <div className="p-5 space-y-3">
                  {[
                    { title: 'OS_Deadlock_Avoidance_Notes.pdf', sub: 'Operating Systems • Unit 3', badge: '✓ Teacher Verified', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                    { title: 'DBMS_Normalization_3NF_BCNF.pdf', sub: 'DBMS • Unit 2', badge: '★ High Yield PYQ', color: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
                    { title: 'CN_TCP_vs_UDP_Header_Diagrams.pdf', sub: 'Networks • Unit 4', badge: '✓ Official Handout', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/40 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.color}`}>
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Live Badges */}
              <FloatingBadge icon={Upload} label="Resource Verified" color="bg-emerald-500" position="-top-4 -left-6" />
              <FloatingBadge icon={Brain} label="AI Doubt Solved" color="bg-violet-600" position="top-1/2 -right-8" />
              <FloatingBadge icon={ShieldCheck} label="Faculty Verified" color="bg-indigo-600" position="-bottom-4 -left-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before vs After Comparison */}
      <section id="comparison" className="py-20 bg-white dark:bg-dark-900/60 border-y border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/20">
              The Academic Upgrade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-3 tracking-tight">
              From Chaos to Total Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              See why thousands of students switched from messy group chats to StudySphere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before */}
            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm">
                  ✕
                </div>
                <h3 className="font-extrabold text-rose-900 dark:text-rose-300 text-lg">Before StudySphere</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Unit-3-notes.pdf', source: '💬 WhatsApp Group 1 (300+ unread)' },
                  { title: 'Important_PYQ_link.url', source: '💬 Random Chat (Lost in scroll)' },
                  { title: 'Assignment_Doc_v2.pdf', source: '💬 Expired link download' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{item.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                  ✓
                </div>
                <h3 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-lg">With StudySphere</h3>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Operating Systems', count: '18 Verified Resources • PYQs Included', icon: '💻' },
                  { title: 'Database Systems', count: '14 Faculty Handouts • Revision Sheets', icon: '🗄️' },
                  { title: 'Computer Networks', count: '12 Curated Video Links & PPTs', icon: '🌐' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-dark-900 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{item.count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/20">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-3 tracking-tight">
              Engineered for Modern Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything required to collect, organize, verify, and master academic materials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            <FeatureCard
              icon={Upload}
              title="Organized Material Vault"
              description="Upload PDFs, notes, PPTs, images, and links cleanly tagged by branch, semester, and unit."
              badgeColor="bg-indigo-600"
              badgeText="STORAGE & HUB"
            />
            <FeatureCard
              icon={Search}
              title="Instant Subject Filter"
              description="Find any note or PYQ in milliseconds by topic chips, keywords, or exam difficulty tags."
              badgeColor="bg-violet-600"
              badgeText="FAST SEARCH"
            />
            <FeatureCard
              icon={Brain}
              title="AI Academic Tutor"
              description="Ask complex technical questions, generate practice MCQs, and condense long units into bullet points."
              badgeColor="bg-pink-600"
              badgeText="GEMINI AI"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Faculty Verification"
              description="Teachers review student uploads, adding Official Handout and High Yield badges."
              badgeColor="bg-emerald-600"
              badgeText="VERIFICATION"
            />
            <FeatureCard
              icon={Zap}
              title="Instant Quiz Generator"
              description="Generate 5-question multiple choice quizzes based on specific subjects with instant grading."
              badgeColor="bg-amber-600"
              badgeText="SELF TEST"
            />
            <FeatureCard
              icon={MessageSquare}
              title="1-Click WhatsApp Upload"
              description="Import messy group chat notes directly into organized StudySphere subjects without clutter."
              badgeColor="bg-cyan-600"
              badgeText="EASY IMPORT"
            />
          </div>
        </div>
      </section>

      {/* AI Spotlight Section */}
      <section id="ai" className="py-20 bg-gradient-to-br from-indigo-950 via-dark-900 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full text-xs font-bold text-violet-300 mb-6">
                <Brain size={14} /> 24/7 AI Tutor
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
                Supercharge Your Revision with AI
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Struggling with deadlocks or database normalization? Ask StudySphere AI to break down complex topics with real-world analogies, code snippets, and self-assessment quizzes.
              </p>
              <div className="space-y-3">
                {[
                  'Doubt solver with analogies and step-by-step math/code explanations',
                  'Auto-generate practice MCQ tests with instant evaluation',
                  'Condense 80-page slides into bullet point revision sheets',
                  'Offline evaluation fallback guarantees zero downtime during hackathons',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Console Mockup */}
            <div className="bg-dark-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center">
                    <Brain size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold">StudySphere AI Workspace</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Online
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-indigo-600/30 border border-indigo-500/30 rounded-2xl p-3.5 ml-auto max-w-xs text-right">
                  <p className="font-medium">Explain Deadlock condition in Operating Systems</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md space-y-2">
                  <p className="font-bold text-violet-300 flex items-center gap-1.5">
                    <Sparkles size={12} /> AI Tutor Explanation:
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Deadlock occurs when 4 necessary conditions hold simultaneously: <strong>Mutual Exclusion, Hold and Wait, No Preemption,</strong> and <strong>Circular Wait</strong>. Imagine 4 cars arriving at a 4-way stop sign at the exact same moment...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to upgrade your academic experience?
          </h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of engineering and university students who keep their study materials organized with StudySphere.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-secondary bg-white text-indigo-700 hover:bg-slate-100 text-sm px-8 py-3.5 font-bold shadow-lg">
              Get Started for Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost text-white hover:bg-white/10 text-sm px-6 py-3.5 font-bold border border-white/30">
              Login to Demo Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

