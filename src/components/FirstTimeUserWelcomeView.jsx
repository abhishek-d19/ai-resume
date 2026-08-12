import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Users, 
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { resumeServiceInstance } from '../services/ResumeService';

export default function FirstTimeUserWelcomeView({ userId, userName = 'Candidate', onCreateResume, onUploadResume }) {
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await onCreateResume();
    } finally {
      setCreating(false);
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const buffer = await file.arrayBuffer();
      const createdResume = await resumeServiceInstance.uploadAndConvertResume(userId, {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        buffer
      });

      if (onUploadResume) {
        onUploadResume(createdResume.id);
      } else if (onCreateResume) {
        onCreateResume(createdResume.id);
      }
    } catch (err) {
      console.error('[ResumeUpload Error]:', err.message);
      setUploadError(err.message || 'PDF upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Hidden File Input for PDF Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      <div className="max-w-3xl w-full space-y-10 text-center">
        
        {/* Header Badge & Title */}
        <div className="space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38E8F5]/10 border border-[#38E8F5]/30 text-[#38E8F5] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#38E8F5]" /> Welcome to Lumina AI OS
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Elevate Your Career with <br />
            <span className="text-[#38E8F5]">AI Resume Intelligence</span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Welcome, <strong className="text-white font-semibold">{userName}</strong>! Build ATS-optimized resumes, run competency match audits, and simulate executive hiring committee feedback for your target tech roles.
          </p>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Two Large Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          
          {/* CTA 1: Create Resume */}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#032D30] to-slate-900 border border-[#38E8F5]/40 hover:border-[#38E8F5] text-left transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-[#38E8F5]/20 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#38E8F5] text-[#032D30] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#38E8F5] transition-colors">
                  Create New Resume
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Start fresh with our structured canonical schema and real-time AI bullet points builder.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-[#38E8F5] uppercase tracking-wider">
              <span>{creating ? 'Initializing Studio...' : 'Start Building'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* CTA 2: Upload Existing Resume */}
          <button
            onClick={handleTriggerUpload}
            disabled={uploading}
            className="group relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-left transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-[#38E8F5] border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#38E8F5] transition-colors">
                  Upload PDF Resume
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Import your current PDF file (up to 10MB) to extract skills, experience, & metric bullet points.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-slate-300 group-hover:text-[#38E8F5] uppercase tracking-wider transition-colors">
              <span>{uploading ? 'Processing PDF...' : 'Select PDF File'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* "What Happens Next" Roadmap Section */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38E8F5]" /> What Happens Next
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="text-[#38E8F5] font-bold text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> 1. Studio Draft
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Edit canonical JSON structure with autosave protection.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 2. AI Audit
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Audit ATS parseability, keywords, and action verb strength.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> 3. JD Match
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Match requirements against target job posting specifications.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> 4. Hiring Panel
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Simulate ATS, Technical Manager, and HR recruiter consensus.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
