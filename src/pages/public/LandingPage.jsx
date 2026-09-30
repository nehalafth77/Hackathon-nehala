import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ArrowRight, Search, Upload, Brain, BookOpen,
  CheckCircle, Shield, Zap, Users, Star, ChevronRight,
  FileText, Image, Link as LinkIcon, MessageSquare, Database,
  LayoutDashboard, Bookmark, Bell
} from 'lucide-react';

const FloatingCard = ({ icon: Icon, label, color, className }) => (
  <div className={`absolute bg-white rounded-xl border border-gray-100 shadow-card-md px-3 py-2 flex items-center gap-2 animate-pulse-soft ${className}`}>
    <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
      <Icon size={14} className="text-white" />
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-md transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ num, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm">
      {num}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const [count, setCount] = useState({ students: 0, materials: 0, colleges: 0 });

  useEffect(() => {
    const targets = { students: 10000, materials: 50000, colleges: 100 };
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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">StudySphere</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#ai" className="hover:text-gray-900 transition-colors">AI</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm py-1.5 px-3">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50/40 to-violet-50/40 pt-20 pb-32">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200/30 to-primary-200/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-200/20 to-violet-200/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700 mb-6">
                <Zap size={12} />
                Hackathon-Ready Academic Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Stop searching through{' '}
                <span className="text-green-500">WhatsApp</span>{' '}
                for your{' '}
                <span className="gradient-text">notes.</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Collect, organize, search and understand all your study materials from one intelligent academic space. From scattered chats to a smarter study space.
              </p>

              <div className="flex items-center gap-3 mb-10">
                <Link to="/register" className="btn-primary text-base px-6 py-3">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-6 py-3">
                  Explore Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                {[
                  { num: `${(count.students / 1000).toFixed(0)}K+`, label: 'Students' },
                  { num: `${(count.materials / 1000).toFixed(0)}K+`, label: 'Study Materials' },
                  { num: `${count.colleges}+`, label: 'Colleges' },
                  { num: '4.9/5', label: 'Rating' },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-black text-gray-900">{num}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Main dashboard mockup */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-card-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-violet-600 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                      <GraduationCap size={14} className="text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">StudySphere</span>
                  </div>
                  <p className="text-white/80 text-xs">Good morning, Student 👋</p>
                  <p className="text-white font-bold">Continue learning and stay organized</p>
                </div>

                <div className="p-4 space-y-2">
                  {[
                    { title: 'OS_Deadlock_Notes.pdf', subject: 'Operating Systems • Unit 3', status: 'verified', color: 'text-red-500 bg-red-50' },
                    { title: 'DBMS_Normalization.pdf', subject: 'DBMS • Unit 3', status: 'verified', color: 'text-blue-500 bg-blue-50' },
                    { title: 'Java_OOP_Notes.pdf', subject: 'Java • Unit 2', status: 'pending', color: 'text-orange-500 bg-orange-50' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${m.color.split(' ')[1]} flex items-center justify-center`}>
                        <FileText size={14} className={m.color.split(' ')[0]} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{m.title}</p>
                        <p className="text-[10px] text-gray-400">{m.subject}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        m.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {m.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard icon={Upload} label="Material Uploaded" color="bg-green-500" className="-top-4 -left-6 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <FloatingCard icon={CheckCircle} label="Teacher Verified!" color="bg-primary-500" className="-bottom-4 -right-4" />
              <FloatingCard icon={Brain} label="AI Assistant" color="bg-violet-500" className="top-1/2 -right-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">From Chaos to Clarity</h2>
            <p className="text-gray-500">StudySphere helps you organize all your study materials in one place.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✕</span>
                </div>
                <h3 className="font-bold text-red-800">Before StudySphere</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Module-2-notes.pdf', time: '2:14 PM', platform: '💬 WhatsApp Group 1' },
                  { name: 'Important link.url', time: '2:30 PM', platform: '💬 WhatsApp Group 2' },
                  { name: 'Question paper.pdf', time: 'Yesterday', platform: '💬 WhatsApp Group 3' },
                  { name: 'Assignment details...', time: 'Yesterday', platform: '💬 WhatsApp Group 4' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-red-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.platform}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
                <p className="text-xs text-red-600 font-medium text-center mt-3">😩 Scattered across multiple WhatsApp groups</p>
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <h3 className="font-bold text-green-800">After StudySphere</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Computer Design', materials: '12 materials', icon: '💻' },
                  { name: 'Computer Graphics', materials: '8 materials', icon: '🎨' },
                  { name: 'Operating Systems', materials: '15 materials', icon: '⚙️' },
                  { name: 'Java Programming', materials: '10 materials', icon: '☕' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-green-100 flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-green-600">{s.materials}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                  </div>
                ))}
                <p className="text-xs text-green-600 font-medium text-center mt-3">✨ Organized, searchable and easily accessible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Powerful Features for Smarter Learning</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to collect, organize, verify and understand your study materials.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Upload}
              title="Organize & Store"
              description="Upload PDFs, notes, PPTs, images and links. All study materials in one intelligent space."
              color="bg-primary-500"
            />
            <FeatureCard
              icon={Search}
              title="Smart Search"
              description="Find any material instantly. Search by subject, topic, unit, tags or description."
              color="bg-violet-500"
            />
            <FeatureCard
              icon={Brain}
              title="AI Assistant"
              description="Ask questions, get explanations, generate quizzes and summaries powered by AI."
              color="bg-pink-500"
            />
            <FeatureCard
              icon={BookOpen}
              title="Subject Management"
              description="Keep everything organized by subject, topic and unit. Never lose a note again."
              color="bg-green-500"
            />
            <FeatureCard
              icon={Bookmark}
              title="Bookmarks & Pins"
              description="Save important materials to your bookmarks. Pin critical resources to the top."
              color="bg-orange-500"
            />
            <FeatureCard
              icon={Shield}
              title="Teacher Verification"
              description="Teachers verify student uploads. Trust only quality, verified academic content."
              color="bg-blue-500"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">How StudySphere Works</h2>
              <p className="text-gray-500 mb-8">A simple 5-step process to transform how you study.</p>

              <div className="space-y-6">
                <StepCard num={1} title="Collect" description="Upload all your study materials from WhatsApp, Drive, or directly to StudySphere." />
                <StepCard num={2} title="Organize" description="Materials are automatically sorted by subject, topic, and unit." />
                <StepCard num={3} title="Verify" description="Teachers review and verify uploaded materials for quality and accuracy." />
                <StepCard num={4} title="Search" description="Find any material instantly with our powerful search engine." />
                <StepCard num={5} title="Learn" description="Use our AI assistant to understand, summarize, and quiz yourself." />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-violet-50 rounded-2xl p-8 border border-primary-100">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-bold text-gray-900 text-lg">The StudySphere Flow</h3>
              </div>
              <div className="space-y-3">
                {['COLLECT', 'ORGANIZE', 'VERIFY', 'SEARCH', 'UNDERSTAND', 'REVISE'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-3 border border-primary-100 font-semibold text-sm text-gray-800">
                      {step}
                    </div>
                    {i < 5 && <div className="text-primary-300 rotate-90">↓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-20 bg-gradient-to-br from-primary-900 via-violet-900 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 mb-6">
                <Brain size={12} />
                Powered by AI
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Personal AI Study Assistant</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Struggling with a tough concept? Ask our AI. Need a summary of a 100-page PDF? Done in seconds. Want practice MCQs? Generate them instantly.
              </p>
              <div className="space-y-3">
                {[
                  'Summarize any PDF in seconds',
                  'Explain complex concepts simply',
                  'Generate MCQ quizzes automatically',
                  'Get key revision points',
                  'Works even without internet AI keys (mock fallback)',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat mockup */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold">AI Assistant</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary-600 rounded-xl rounded-br-sm px-3 py-2 max-w-xs">
                    <p className="text-sm">Explain deadlock in simple words</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <Brain size={14} className="text-white" />
                  </div>
                  <div className="bg-white/10 rounded-xl rounded-bl-sm px-3 py-2 max-w-xs">
                    <p className="text-sm text-white/90">🔒 <strong>Deadlock</strong> is like a traffic jam where no car can move...</p>
                    <p className="text-xs text-white/50 mt-1">Explained simply • Key points • Examples</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {['Summarize PDF', 'Generate Quiz', 'Explain Simply'].map(btn => (
                    <button key={btn} className="text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors">
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-violet-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to organize your study materials?</h2>
          <p className="text-gray-500 mb-8">Join thousands of students who are already using StudySphere to learn smarter.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-6 py-3">
              Sign In
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">10K+ students already joined</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="font-bold">StudySphere</span>
              </div>
              <p className="text-sm text-gray-400">All your study materials. One intelligent platform.</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Features</p><p>Pricing</p><p>Roadmap</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>About</p><p>Blog</p><p>Contact</p><p>Privacy Policy</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {['𝕏', '📸', '💼', '🐙'].map((icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 StudySphere. Built with ❤️ for students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
