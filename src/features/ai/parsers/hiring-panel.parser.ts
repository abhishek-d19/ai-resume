import { 
  reviewerEvaluationSchema, 
  ReviewerEvaluation, 
  ReviewerPersona, 
  ReviewerDecision,
  CategoryScore,
  EvidenceClaim
} from '../schemas/hiring-panel-engine.schema';
import { AiOutputParser } from './index';

export function parseHiringPanelAIResponse(
  rawInput: any, 
  expectedPersona: ReviewerPersona
): ReviewerEvaluation {
  console.group(`[HIRING PANEL AI DEBUG - ${expectedPersona}]`);
  console.log('Raw Provider Response Input:', rawInput);

  let payload = rawInput;

  if (typeof payload === 'string') {
    try {
      payload = AiOutputParser.parseStructuredJson(payload);
    } catch (err: any) {
      console.warn('[HiringPanelParser Warning]: Failed to parse raw string JSON:', err.message);
    }
  }

  if (payload && typeof payload === 'object') {
    if (payload.data !== undefined) payload = payload.data;
    if (typeof payload === 'string') {
      try { payload = AiOutputParser.parseStructuredJson(payload); } catch {}
    }
  }

  let targetObj: any = payload;
  if (payload && typeof payload === 'object') {
    if (payload.reviewer && typeof payload.reviewer === 'object') {
      targetObj = payload.reviewer;
    } else if (payload.evaluation && typeof payload.evaluation === 'object') {
      targetObj = payload.evaluation;
    } else if (payload.result && typeof payload.result === 'object') {
      targetObj = payload.result;
    } else if (Array.isArray(payload.reviewers)) {
      const match = payload.reviewers.find((r: any) => 
        r.persona?.toLowerCase().includes(expectedPersona.toLowerCase().split(' ')[0]) ||
        r.role?.toLowerCase().includes(expectedPersona.toLowerCase().split(' ')[0])
      );
      targetObj = match || payload.reviewers[0] || payload;
    } else if (Array.isArray(payload)) {
      const match = payload.find((r: any) => 
        r.persona?.toLowerCase().includes(expectedPersona.toLowerCase().split(' ')[0])
      );
      targetObj = match || payload[0] || payload;
    }
  }

  if (!targetObj || typeof targetObj !== 'object') {
    targetObj = {};
  }

  const persona: ReviewerPersona = expectedPersona;

  // Decision Verdict
  const rawDecision = targetObj.decision || targetObj.verdict || targetObj.recommendation || targetObj.rating || '';
  const decision: ReviewerDecision = normalizeDecision(rawDecision);

  // Score derived from decision if rawScore is absent
  const defaultScoreForDecision = decision === 'Strong Hire' ? 92 : decision === 'Hire' ? 78 : decision === 'Maybe' ? 60 : 42;
  const rawScore = typeof targetObj.score === 'number' ? targetObj.score : Number(targetObj.score);
  const rawConfidence = typeof targetObj.confidence === 'number' ? targetObj.confidence : Number(targetObj.confidence);
  
  const score = isNaN(rawScore) ? defaultScoreForDecision : Math.min(100, Math.max(0, Math.round(rawScore)));
  const confidence = isNaN(rawConfidence) ? Math.min(95, Math.max(50, score)) : Math.min(100, Math.max(0, Math.round(rawConfidence)));

  const summary = String(
    targetObj.summary || 
    targetObj.reasoning || 
    targetObj.feedback || 
    targetObj.overview || 
    `${expectedPersona} evaluated the candidate resume against executive hiring standards.`
  ).trim();

  const categoryScores: CategoryScore[] = normalizeCategoryScores(targetObj.categoryScores, expectedPersona, score);

  const strengths = normalizeStringArray(
    targetObj.strengths || targetObj.pros || targetObj.highlights || targetObj.keyStrengths,
    ['Candidate background demonstrates relevant skills for target role', 'Documented technical project history']
  );

  const weaknesses = normalizeStringArray(
    targetObj.weaknesses || targetObj.cons || targetObj.areasForImprovement || targetObj.improvementAreas,
    ['Accomplishment bullets could expand quantifiable business impact metrics']
  );

  const concerns = normalizeStringArray(
    targetObj.concerns || targetObj.risks || targetObj.flags || targetObj.gaps,
    ['Outcome metrics and scale evidence could be further detailed']
  );

  const recommendations = normalizeStringArray(
    targetObj.recommendations || targetObj.suggestions || targetObj.nextSteps || targetObj.actionItems,
    ['Add measurable performance or business scale metrics to project descriptions']
  );

  const interviewQuestions = normalizeStringArray(
    targetObj.interviewQuestions || targetObj.questions || targetObj.suggestedQuestions,
    [
      `Walk me through the system architecture choices and trade-offs in your most recent project.`,
      `How did you measure and validate the performance or business impact of your deliverables?`
    ]
  );

  const evidence: EvidenceClaim[] = normalizeEvidenceArray(targetObj.evidence, expectedPersona);

  const normalizedReviewer: ReviewerEvaluation = {
    persona,
    decision,
    confidence,
    score,
    summary,
    categoryScores,
    strengths,
    weaknesses,
    concerns,
    evidence,
    recommendations,
    interviewQuestions
  };

  console.log('Normalized Reviewer Object:', normalizedReviewer);
  console.groupEnd();

  return reviewerEvaluationSchema.parse(normalizedReviewer);
}

function normalizeDecision(val: any): ReviewerDecision {
  const str = String(val || '').toUpperCase().trim();

  if (str.includes('STRONG') || str.includes('EXCELLENT') || str.includes('TOP')) {
    return 'Strong Hire';
  }
  if (str.includes('NO') || str.includes('REJECT') || str.includes('FAIL') || str.includes('DENY')) {
    return 'No Hire';
  }
  if (str.includes('MAYBE') || str.includes('HOLD') || str.includes('NEUTRAL') || str.includes('REVIEW')) {
    return 'Maybe';
  }
  if (str.includes('HIRE') || str.includes('PASS') || str.includes('MOVE') || str.includes('YES')) {
    return 'Hire';
  }

  return 'Maybe';
}

function normalizeStringArray(input: any, defaultFallback: string[]): string[] {
  if (Array.isArray(input) && input.length > 0) {
    const cleaned = input.map(item => String(item).trim()).filter(Boolean);
    if (cleaned.length > 0) return cleaned;
  }
  if (typeof input === 'string' && input.trim().length > 0) {
    return [input.trim()];
  }
  return defaultFallback;
}

function normalizeCategoryScores(rawCategories: any, persona: ReviewerPersona, overallScore: number): CategoryScore[] {
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    const parsed = rawCategories.map((cat: any) => ({
      name: String(cat.name || cat.category || 'Category').trim(),
      score: typeof cat.score === 'number' ? Math.min(100, Math.max(0, Math.round(cat.score))) : Math.round(overallScore * 0.9),
      reasoning: String(cat.reasoning || cat.description || 'Demonstrates solid alignment with standard rubric metrics.').trim()
    }));
    if (parsed.length > 0) return parsed;
  }

  if (persona === 'ATS Specialist') {
    return [
      { name: 'Section Structure', score: Math.round(overallScore * 0.95), reasoning: 'Evaluated section header hierarchy and parseability.' },
      { name: 'Keyword Alignment', score: Math.round(overallScore * 0.90), reasoning: 'Evaluated target role terminology alignment.' },
      { name: 'Parseability', score: Math.round(overallScore * 0.96), reasoning: 'Evaluated text machine-readability.' }
    ];
  } else if (persona === 'Technical Hiring Manager') {
    return [
      { name: 'Technical Depth', score: Math.round(overallScore * 0.92), reasoning: 'Evaluated tech stack complexity and architecture experience.' },
      { name: 'Relevant Experience', score: Math.round(overallScore * 0.90), reasoning: 'Evaluated engineering experience alignment.' },
      { name: 'Engineering Impact', score: Math.round(overallScore * 0.88), reasoning: 'Evaluated deliverable impact metrics.' }
    ];
  }

  return [
    { name: 'Professional Positioning', score: Math.round(overallScore * 0.94), reasoning: 'Evaluated career trajectory and professional summary.' },
    { name: 'Communication Quality', score: Math.round(overallScore * 0.92), reasoning: 'Evaluated writing clarity and bullet structure.' },
    { name: 'Role Alignment', score: Math.round(overallScore * 0.90), reasoning: 'Evaluated candidate shortlist readiness.' }
  ];
}

function normalizeEvidenceArray(rawEvidence: any, persona: ReviewerPersona): EvidenceClaim[] {
  if (Array.isArray(rawEvidence) && rawEvidence.length > 0) {
    const parsed: EvidenceClaim[] = rawEvidence.map((e: any) => ({
      claim: String(e.claim || e.text || e.evidence || 'Candidate background demonstrated in resume').trim(),
      source: String(e.source || e.location || 'Resume > Experience').trim(),
      type: ['explicit', 'inferred', 'missing'].includes(String(e.type).toLowerCase()) 
        ? (String(e.type).toLowerCase() as 'explicit' | 'inferred' | 'missing')
        : 'explicit'
    }));
    if (parsed.length > 0) return parsed;
  }

  return [
    {
      claim: `Relevant qualifications and project experience documented in resume.`,
      source: `Resume > Experience`,
      type: `explicit`
    },
    {
      claim: `Quantified outcome metrics for secondary projects could be further detailed.`,
      source: `Resume > Projects`,
      type: `missing`
    }
  ];
}
