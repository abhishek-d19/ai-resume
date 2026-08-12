import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { estimateTokenCount, calculateCostUsd } from '../utils';

export class MockProvider implements AIProvider {
  public readonly providerName: AiProviderName = 'mock';

  public isConfigured(): boolean {
    return true;
  }

  public async generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>> {
    const startTime = Date.now();
    const selectedModel = params.model || 'mock-evaluator';

    // Simulate ~250ms API latency
    await new Promise((resolve) => setTimeout(resolve, 250));

    const promptText = (params.prompt || '') + (params.systemPrompt || '');
    let mockPayload: any;

    if (promptText.includes('overallScore') || promptText.includes('Resume Analysis Engine') || promptText.includes('resumeAnalysisOutputSchema')) {
      mockPayload = {
        overallScore: 88,
        sectionScores: {
          personalInfo: 95,
          summary: 80,
          education: 90,
          experience: 88,
          projects: 85,
          skills: 92,
          certifications: 80,
          achievements: 85,
          languages: 100
        },
        strengths: [
          'High metric density across experience bullet points',
          'Clean ATS section hierarchy and standardized headers',
          'Diverse technical skill coverage aligned with target role'
        ],
        weaknesses: [
          'Summary statement could sharpen target role alignment',
          'Project descriptions could include more architectural impact metrics'
        ],
        criticalIssues: [],
        quickWins: [
          'Add target role title directly into the professional summary header',
          'Re-order skills section to feature high-demand frameworks at top'
        ],
        recommendations: [
          'Quantify project outcomes: Include latency reduction or scale numbers for secondary projects',
          'Optimize section headers using standard terms like Professional Experience',
          'Include GitHub / Portfolio URL in personal info'
        ],
        missingSections: [],
        atsWarnings: []
      };
    } else if (promptText.includes('Consensus Synthesis') || promptText.includes('hiringPanelConsensusSchema')) {
      mockPayload = {
        decision: 'Hire',
        confidence: 90,
        summary: 'Candidate profile demonstrates high technical alignment and strong engineering trajectory.',
        reviewers: [
          {
            persona: 'ATS Reviewer',
            verdict: 'Hire',
            score: 88,
            feedback: 'Resume structure conforms to modern ATS parser rules with clear section headers.',
            pros: ['Clean section hierarchy and standard bullet points', 'Strong keyword frequency matching target role'],
            cons: ['Could increase metric density in bullet points']
          },
          {
            persona: 'Technical Hiring Manager',
            verdict: 'Strong Hire',
            score: 92,
            feedback: 'Proven full-stack project execution and React/TypeScript mastery.',
            pros: ['Modern React and TypeScript proficiency', 'Clear ownership of feature deliverables'],
            cons: ['Specify team size and cross-functional leadership details']
          },
          {
            persona: 'HR Recruiter',
            verdict: 'Hire',
            score: 90,
            feedback: 'Strong alignment with senior staff requirements and professional communication.',
            pros: ['Strong alignment with senior staff requirements', 'Clear career trajectory'],
            cons: ['Add revenue or business outcome impact where applicable']
          }
        ]
      };
    } else if (promptText.includes('ATS Reviewer') || promptText.includes('Technical Hiring Manager') || promptText.includes('HR Recruiter') || promptText.includes('reviewerEvaluationSchema')) {
      const personaName = promptText.includes('ATS Reviewer')
        ? 'ATS Reviewer'
        : (promptText.includes('Technical Hiring Manager') ? 'Technical Hiring Manager' : 'HR Recruiter');

      mockPayload = {
        persona: personaName,
        verdict: 'Hire',
        score: 88,
        feedback: 'Resume structure conforms to modern ATS parser rules with clear section headers.',
        pros: ['Clean section hierarchy and standard bullet points', 'Strong keyword frequency matching target role'],
        cons: ['Could increase metric density in bullet points']
      };
    } else {
      mockPayload = {
        status: 'success',
        summary: 'Mock Lumina AI generation output',
        score: 95,
        feedback: ['Enrich metric impact density', 'Strong alignment with target role']
      };
    }

    const rawText = JSON.stringify(mockPayload);
    const promptTokens = estimateTokenCount(promptText);
    const completionTokens = estimateTokenCount(rawText);
    const totalTokens = promptTokens + completionTokens;

    return {
      success: true,
      data: mockPayload,
      rawText,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: calculateCostUsd(selectedModel as any, promptTokens, completionTokens)
      },
      provider: 'mock',
      model: selectedModel,
      latencyMs: Date.now() - startTime
    };
  }
}
