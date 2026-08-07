import { resumeServiceInstance, ValidationError } from './ResumeService';
import { hiringCommitteeServiceInstance } from './HiringCommitteeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { interviewQuestionsOutputSchema, InterviewQuestionsOutput } from '../features/ai/schemas/interview-question-generation.schema';
import { 
  INTERVIEW_QUESTIONS_SYSTEM_PROMPT, 
  buildInterviewQuestionsUserPrompt 
} from '../features/ai/prompts/interview-question-generation';

export class InterviewQuestionService {
  /**
   * Generates targeted Technical, Behavioral, HR, and Project Interview Questions
   */
  public async generateQuestions(
    userId: string,
    resumeId: string,
    jobDescriptionText?: string
  ): Promise<InterviewQuestionsOutput> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for interview question generation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Fetch optional Hiring Committee Feedback if available
    let committeeFeedback: any = null;
    try {
      committeeFeedback = await hiringCommitteeServiceInstance.evaluateCommittee(userId, resumeId);
    } catch {
      committeeFeedback = null;
    }

    // 3. Build User Prompt
    const userPrompt = buildInterviewQuestionsUserPrompt({
      title: resume.title,
      jobDescriptionText,
      committeeFeedback,
      resumeContent: resume.content || {}
    });

    // 4. Execute AI Request with Zod Schema Validation
    const aiResult = await aiRequestServiceInstance.execute<InterviewQuestionsOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: interviewQuestionsOutputSchema,
        temperature: 0.1
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    return aiResult.data;
  }
}

export const interviewQuestionServiceInstance = new InterviewQuestionService();
