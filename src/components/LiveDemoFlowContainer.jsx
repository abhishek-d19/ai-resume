import React, { useState } from 'react';
import { 
  LogIn, 
  LayoutDashboard, 
  FileEdit, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Users, 
  HelpCircle, 
  Zap, 
  Download,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play
} from 'lucide-react';

import ResumeDashboardView from './ResumeDashboardView';
import ResumeAnalysisDashboardView from './ResumeAnalysisDashboardView';
import JdMatchDashboardView from './JdMatchDashboardView';
import HiringCommitteeDashboardView from './HiringCommitteeDashboardView';

export default function LiveDemoFlowContainer() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeResumeId, setActiveResumeId] = useState('demo-resume-1');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const steps = [
    { id: 'login', label: '1. Authentication', icon: LogIn },
    { id: 'dashboard', label: '2. Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: '3. Resume Studio', icon: FileEdit },
    { id: 'analysis', label: '4. Resume Audit', icon: Sparkles },
    { id: 'ats', label: '5. ATS Compliance', icon: ShieldCheck },
    { id: 'jd-match', label: '6. JD Match Engine', icon: Target },
    { id: 'committee', label: '7. Hiring Committee', icon: Users },
    { id: 'interview', label: '8. Interview Prep', icon: HelpCircle },
    { id: 'improvements', label: '9. AI Improvements', icon: Zap },
    { id: 'export', label: '10. Export PDF', icon: Download }
  ];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-[#032D30] text-slate-100 font-sans selection:bg-[#38E8F5] selection:text-[#032D30] flex flex-col">
      
      {/* Top Demo Navigation Stepper Bar */}
      <header className="bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 p-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38E8F5]/10 border border-[#38E8F5]/30 text-[#38E8F5] text-xs font-extrabold uppercase tracking-wider">
              <Play className="w-3 h-3 fill-[#38E8F5]" /> 5-Min Live Executive Demo
            </span>
            <span className="text-xs text-slate-400 font-medium hidden lg:inline">
              Lumina AI Resume Platform • Flow Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          {/* Stepper Dots / Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#38E8F5] text-[#032D30] shadow-lg shadow-[#38E8F5]/20 font-bold scale-105' 
                      : isCompleted 
                        ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label.split('. ')[1]}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {currentStep.id === 'login' && (
          <DemoLoginView onLoginSuccess={() => setCurrentStepIndex(1)} />
        )}

        {currentStep.id === 'dashboard' && (
          <ResumeDashboardView 
            onOpenResume={(id) => {
              setActiveResumeId(id || 'demo-resume-1');
              setCurrentStepIndex(2);
            }} 
          />
        )}

        {currentStep.id === 'editor' && (
          <DemoEditorView 
            resumeId={activeResumeId} 
            onAnalyze={() => setCurrentStepIndex(3)} 
          />
        )}

        {currentStep.id === 'analysis' && (
          <ResumeAnalysisDashboardView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(4)} 
          />
        )}

        {currentStep.id === 'ats' && (
          <DemoAtsView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(5)} 
          />
        )}

        {currentStep.id === 'jd-match' && (
          <JdMatchDashboardView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(6)} 
          />
        )}

        {currentStep.id === 'committee' && (
          <HiringCommitteeDashboardView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(7)} 
          />
        )}

        {currentStep.id === 'interview' && (
          <DemoInterviewView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(8)} 
          />
        )}

        {currentStep.id === 'improvements' && (
          <DemoImprovementsView 
            resumeId={activeResumeId} 
            onNext={() => setCurrentStepIndex(9)} 
          />
        )}

        {currentStep.id === 'export' && (
          <DemoExportView resumeId={activeResumeId} />
        )}
      </main>

      {/* Floating Bottom Flow Controller Bar */}
      <footer className="bg-slate-950/90 border-t border-slate-800 p-4 sticky bottom-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-5 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:text-white disabled:opacity-40 transition"
          >
            ← Previous Step
          </button>

          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Step {currentStepIndex + 1}: <strong className="text-white">{currentStep.label}</strong>
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs hover:shadow-lg hover:shadow-[#38E8F5]/20 disabled:opacity-40 transition"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
}

// 1. DEMO LOGIN VIEW
function DemoLoginView({ onLoginSuccess }) {
  return (
    <div className="p-8 max-w-md mx-auto my-12 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#38E8F5]/10 border border-[#38E8F5]/30 text-[#38E8F5] flex items-center justify-center mx-auto">
        <Sparkles className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Lumina AI Platform</h2>
        <p className="text-xs text-slate-400 mt-1">Executive Career Copilot & Resume Intelligence</p>
      </div>
      <div className="space-y-3">
        <input 
          type="email" 
          defaultValue="abhishek@lumina.ai" 
          className="w-full p-3.5 rounded-full bg-slate-950/60 border border-slate-800 text-xs text-white text-center focus:outline-none"
        />
        <button
          onClick={onLoginSuccess}
          className="w-full py-3 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs hover:shadow-lg hover:shadow-[#38E8F5]/20 transition flex items-center justify-center gap-2"
        >
          <span>Sign In to Lumina AI OS</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 3. DEMO EDITOR VIEW
function DemoEditorView({ resumeId, onAnalyze }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Resume Studio — Senior Staff Engineer</h2>
          <p className="text-xs text-slate-400">Canonical Resume Editor • Autosave Saved ✓</p>
        </div>
        <button
          onClick={onAnalyze}
          className="px-6 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs flex items-center gap-2 hover:shadow-lg transition"
        >
          <Sparkles className="w-4 h-4" /> Run AI Audit
        </button>
      </div>
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-[#38E8F5]">Professional Summary</h3>
        <textarea 
          rows={3}
          defaultValue="Senior Staff Engineer specializing in high-throughput microservices, React UI design systems, and distributed AI platforms."
          className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 focus:outline-none"
        />
      </div>
    </div>
  );
}

// 5. DEMO ATS VIEW
function DemoAtsView({ onNext }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" /> ATS Parseability Audit
          </h2>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">94% Compliant</span>
        </div>
        <p className="text-xs text-slate-300">Audited against Greenhouse, Lever, and Workday parsing algorithms.</p>
        <button onClick={onNext} className="px-6 py-2 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs">
          Continue to JD Match →
        </button>
      </div>
    </div>
  );
}

// 8. DEMO INTERVIEW VIEW
function DemoInterviewView({ onNext }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#38E8F5]" /> Interview Prep Generator
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-[#38E8F5] uppercase">Technical • Hard</span>
            <p className="text-xs text-white font-semibold mt-1">Explain how you optimized GraphQL API latency by 35% under peak traffic.</p>
          </div>
        </div>
        <button onClick={onNext} className="px-6 py-2 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs">
          Continue to AI Improvements →
        </button>
      </div>
    </div>
  );
}

// 9. DEMO IMPROVEMENTS VIEW
function DemoImprovementsView({ onNext }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> AI Resume Rewrite Suggestions
        </h2>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="text-rose-400 line-through">Worked on backend microservices.</div>
          <div className="text-emerald-400 font-medium">Architected high-throughput microservices using Node.js, reducing API latency by 35%.</div>
        </div>
        <button onClick={onNext} className="px-6 py-2 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs">
          Proceed to PDF Export →
        </button>
      </div>
    </div>
  );
}

// 10. DEMO EXPORT VIEW
function DemoExportView({ resumeId }) {
  return (
    <div className="p-8 max-w-4xl mx-auto text-center space-y-6">
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <Download className="w-12 h-12 text-[#38E8F5] mx-auto" />
        <h2 className="text-2xl font-bold text-white">Export PDF Resume</h2>
        <p className="text-xs text-slate-400">Select export template for print & download</p>
        <div className="flex justify-center gap-3 pt-2">
          <a 
            href={`/api/resumes/${resumeId || 'demo'}/export?template=ats&format=html`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-bold text-xs hover:shadow-lg transition"
          >
            Export ATS PDF
          </a>
          <a 
            href={`/api/resumes/${resumeId || 'demo'}/export?template=modern&format=html`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 rounded-full bg-slate-800 text-white font-bold text-xs border border-slate-700 hover:border-[#38E8F5]/40 transition"
          >
            Export Modern PDF
          </a>
        </div>
      </div>
    </div>
  );
}
