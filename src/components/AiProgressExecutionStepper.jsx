import React from 'react';
import { Sparkles, CheckCircle2, Loader2, Bot, Code, UserCheck } from 'lucide-react';

export default function AiProgressExecutionStepper({ steps = [], currentStepIndex = 0 }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#38E8F5] selection:text-[#032D30]">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#38E8F5]/10 border border-[#38E8F5]/30 text-[#38E8F5] flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 text-[#38E8F5]" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">AI Multi-Agent Inference Running</h3>
          <p className="text-xs text-slate-400">Executing independent LLM reasoning pipelines...</p>
        </div>

        {/* Step Items Stack */}
        <div className="space-y-3.5 pt-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                    : isCurrent 
                      ? 'bg-slate-950/80 border-[#38E8F5]/50 text-white shadow-lg shadow-[#38E8F5]/10 scale-[1.02]' 
                      : 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {step.icon ? (
                    <step.icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-[#38E8F5]' : 'text-slate-500'}`} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                  <span className="text-xs font-semibold">{step.label}</span>
                </div>

                <div>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#38E8F5] uppercase tracking-wider">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38E8F5]" /> Running
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] text-slate-600 font-mono">Queued</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Progress Bar */}
        <div className="pt-2">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#38E8F5] to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Progress: {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
            <span>{currentStepIndex + 1} of {steps.length} Steps</span>
          </div>
        </div>

      </div>
    </div>
  );
}
