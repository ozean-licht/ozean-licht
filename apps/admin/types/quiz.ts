/**
 * Quiz Types - Interactive Quiz Builder
 *
 * Defines comprehensive types for quiz authoring and execution:
 * - Quiz settings (passing score, retakes, timer, shuffle)
 * - Question types (multiple choice, true/false, fill-in-blank, matching)
 * - Question options and feedback
 * - Quiz results and attempts
 */

// === Quiz Builder Limits ===

/**
 * Quiz builder configuration limits
 *
 * These limits can be adjusted based on product requirements.
 * Consider making them configurable via environment variables for different deployments.
 */
export const QUIZ_LIMITS = {
  /** Maximum number of options per multiple choice question */
  MAX_OPTIONS: 10,
  /** Maximum number of questions per quiz */
  MAX_QUESTIONS: 100,
  /** Maximum number of blanks per fill-in-the-blank question */
  MAX_BLANKS: 10,
  /** Maximum number of pairs per matching question */
  MAX_PAIRS: 20,
  /** Minimum passing score percentage */
  MIN_PASSING_SCORE: 0,
  /** Maximum passing score percentage */
  MAX_PASSING_SCORE: 100,
  /** Maximum time limit in minutes */
  MAX_TIME_LIMIT_MINUTES: 180,
  /** Minimum number of options for multiple choice questions */
  MIN_OPTIONS: 2,
  /** Minimum number of blanks for fill-in-the-blank questions */
  MIN_BLANKS: 1,
  /** Minimum number of pairs for matching questions */
  MIN_PAIRS: 2,
} as const;

// === Question Types ===

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';

/**
 * Option for multiple choice questions
 */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

/**
 * Blank answer for fill-in-blank questions
 */
export interface BlankAnswer {
  id: string;
  acceptedAnswers: string[];  // Multiple accepted variations
  caseSensitive: boolean;
}

/**
 * Match pair for matching questions
 */
export interface MatchPair {
  id: string;
  left: string;   // Prompt
  right: string;  // Correct match
}

/**
 * Base question interface with common fields
 */
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  required: boolean;
  explanation?: string;
  hint?: string;
}

/**
 * Multiple choice question
 */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: QuizOption[];
  allowMultiple: boolean;  // True = multi-select, False = single select
}

/**
 * True/false question
 */
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

/**
 * Fill-in-the-blank question
 * Question text uses {{blank_id}} placeholders
 */
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  blanks: BlankAnswer[];
}

/**
 * Matching question
 */
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchPair[];
}

/**
 * Union type for all question types
 */
export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion;

// === Quiz Settings ===

/**
 * Quiz behavior settings
 */
export interface QuizSettings {
  /** Passing score percentage (0-100) */
  passingScore: number;
  /** Maximum attempts allowed (-1 = unlimited) */
  maxAttempts: number;
  /** Time limit in minutes (null = no limit) */
  timeLimitMinutes: number | null;
  /** Shuffle question order for each attempt */
  shuffleQuestions: boolean;
  /** Shuffle answer options for MC questions */
  shuffleAnswers: boolean;
  /** Show correct answers after submission */
  showCorrectAnswers: boolean;
  /** Show feedback for each question */
  showFeedback: boolean;
  /** Show results immediately after submission */
  showResultsImmediately: boolean;
  /** Allow review of submitted answers */
  allowReview: boolean;
}

/**
 * Default quiz settings
 */
export const defaultQuizSettings: QuizSettings = {
  passingScore: 70,
  maxAttempts: -1,  // Unlimited
  timeLimitMinutes: null,
  shuffleQuestions: false,
  shuffleAnswers: false,
  showCorrectAnswers: true,
  showFeedback: true,
  showResultsImmediately: true,
  allowReview: true,
};

// === Quiz Data Structure ===

/**
 * Complete quiz data stored in lesson.quiz_data JSONB field
 */
export interface QuizData {
  settings: QuizSettings;
  questions: QuizQuestion[];
  version: number;  // Schema version for migrations
}

/**
 * Default empty quiz data
 */
export const emptyQuizData: QuizData = {
  settings: defaultQuizSettings,
  questions: [],
  version: 1,
};

// === Quiz Attempt & Results ===

/**
 * User's answer to a single question
 */
export interface QuestionAnswer {
  questionId: string;
  /** Selected option IDs for MC, boolean for T/F, string[] for blanks */
  answer: string[] | boolean | Record<string, string>;
  /** Time spent on this question in seconds */
  timeSpent: number;
}

/**
 * Result for a single question
 */
export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  /** User's actual answer */
  userAnswer: QuestionAnswer['answer'];
  /** Correct answer for display */
  correctAnswer: QuestionAnswer['answer'];
  /** Feedback/explanation text */
  feedback?: string;
}

/**
 * Complete quiz attempt
 */
export interface QuizAttempt {
  id: string;
  lessonId: string;
  userId: string;
  attemptNumber: number;
  /** ISO timestamp */
  startedAt: string;
  /** ISO timestamp (null if in progress) */
  completedAt: string | null;
  /** User's answers */
  answers: QuestionAnswer[];
  /** Calculated results (null if in progress) */
  results: QuestionResult[] | null;
  /** Total score (percentage, null if in progress) */
  score: number | null;
  /** Whether the attempt passed */
  passed: boolean | null;
  /** Total time spent in seconds */
  totalTimeSeconds: number;
}

// === Input Types ===

/**
 * Input for creating a new question
 */
export interface CreateQuestionInput {
  type: QuestionType;
  question: string;
  points?: number;
  required?: boolean;
  explanation?: string;
  hint?: string;
  // Type-specific fields
  options?: Omit<QuizOption, 'id'>[];
  allowMultiple?: boolean;
  correctAnswer?: boolean;
  blanks?: Omit<BlankAnswer, 'id'>[];
  pairs?: Omit<MatchPair, 'id'>[];
}

/**
 * Input for updating a question
 */
export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {
  id: string;
}

/**
 * Input for submitting quiz answers
 */
export interface SubmitQuizInput {
  lessonId: string;
  answers: QuestionAnswer[];
}

// === Helper Types ===

/**
 * Question with computed display info
 */
export type QuestionWithIndex = QuizQuestion & {
  index: number;  // 1-based question number
  isAnswered?: boolean;
  userAnswer?: QuestionAnswer['answer'];
};

/**
 * Quiz state during taking
 */
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, QuestionAnswer>;
  startTime: number;  // Unix timestamp
  timeRemaining: number | null;  // Seconds, null if no limit
}

/**
 * Quiz summary for display
 */
export interface QuizSummary {
  totalQuestions: number;
  totalPoints: number;
  estimatedTime: number;  // Minutes
  questionTypes: QuestionType[];
  hasTimeLimit: boolean;
}

// === Validation Helpers ===

/**
 * Check if a question is valid for saving
 *
 * Validates that a quiz question has all required fields and meets minimum requirements:
 * - Non-empty question text
 * - Non-negative points
 * - Type-specific validation:
 *   - Multiple choice: At least 2 options, at least one correct, all options have text
 *   - True/false: Has a boolean correctAnswer
 *   - Fill blank: At least 1 blank with accepted answers
 *   - Matching: At least 2 pairs with non-empty left and right values
 *
 * @param question - The quiz question to validate
 * @returns true if the question is valid and can be saved, false otherwise
 *
 * @example
 * const question: MultipleChoiceQuestion = {
 *   id: '1',
 *   type: 'multiple_choice',
 *   question: 'What is 2+2?',
 *   points: 10,
 *   required: true,
 *   options: [
 *     { id: 'a', text: '3', isCorrect: false },
 *     { id: 'b', text: '4', isCorrect: true }
 *   ],
 *   allowMultiple: false
 * };
 * isValidQuestion(question); // returns true
 */
export function isValidQuestion(question: QuizQuestion): boolean {
  if (!question.question.trim()) return false;
  if (question.points < 0) return false;

  switch (question.type) {
    case 'multiple_choice':
      return (
        question.options.length >= 2 &&
        question.options.some(opt => opt.isCorrect) &&
        question.options.every(opt => opt.text.trim())
      );
    case 'true_false':
      return typeof question.correctAnswer === 'boolean';
    case 'fill_blank':
      return (
        question.blanks.length > 0 &&
        question.blanks.every(blank => blank.acceptedAnswers.length > 0)
      );
    case 'matching':
      return (
        question.pairs.length >= 2 &&
        question.pairs.every(pair => pair.left.trim() && pair.right.trim())
      );
    default:
      return false;
  }
}

/**
 * Calculate quiz summary from quiz data
 *
 * Computes summary statistics for display on quiz overview screens:
 * - Total number of questions
 * - Total possible points across all questions
 * - Estimated completion time (1.5 minutes per question)
 * - List of unique question types present in the quiz
 * - Whether the quiz has a time limit
 *
 * @param quiz - The quiz data to summarize
 * @returns Summary object with computed statistics
 *
 * @example
 * const quiz: QuizData = {
 *   settings: { ...defaultQuizSettings, timeLimitMinutes: 30 },
 *   questions: [
 *     { type: 'multiple_choice', points: 10, ... },
 *     { type: 'true_false', points: 5, ... }
 *   ],
 *   version: 1
 * };
 * const summary = calculateQuizSummary(quiz);
 * // {
 * //   totalQuestions: 2,
 * //   totalPoints: 15,
 * //   estimatedTime: 3,
 * //   questionTypes: ['multiple_choice', 'true_false'],
 * //   hasTimeLimit: true
 * // }
 */
export function calculateQuizSummary(quiz: QuizData): QuizSummary {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const questionTypes = [...new Set(quiz.questions.map(q => q.type))];

  // Estimate 1-2 minutes per question
  const estimatedTime = Math.ceil(quiz.questions.length * 1.5);

  return {
    totalQuestions: quiz.questions.length,
    totalPoints,
    estimatedTime,
    questionTypes,
    hasTimeLimit: quiz.settings.timeLimitMinutes !== null,
  };
}

/**
 * Generate a unique ID for quiz elements
 * Uses crypto.randomUUID() for cryptographically secure IDs
 */
export function generateQuizId(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `q_${crypto.randomUUID()}`;
  }

  // Fallback for older environments (should rarely happen)
  console.warn('crypto.randomUUID() not available, using fallback ID generation');
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Migrate quiz data to current schema version
 * Handles version upgrades and ensures data validity
 *
 * @param data - Unknown quiz data from database
 * @returns Valid QuizData with current schema version
 */
export function migrateQuizData(data: unknown): QuizData {
  // Handle null/undefined
  if (!data || typeof data !== 'object') {
    return emptyQuizData;
  }

  const rawData = data as Record<string, unknown>;

  // Check if it's already valid data with version
  const version = typeof rawData.version === 'number' ? rawData.version : 0;

  // Version 0 or missing version: legacy data or invalid
  if (version === 0) {
    // Try to extract what we can
    const settings = typeof rawData.settings === 'object' && rawData.settings
      ? { ...defaultQuizSettings, ...(rawData.settings as Record<string, unknown>) }
      : defaultQuizSettings;

    const questions = Array.isArray(rawData.questions) ? rawData.questions : [];

    return {
      settings,
      questions: questions.filter(q =>
        q && typeof q === 'object' && 'type' in q && 'question' in q
      ) as QuizQuestion[],
      version: 1,
    };
  }

  // Version 1 (current): validate and return
  if (version === 1) {
    const settings = typeof rawData.settings === 'object' && rawData.settings
      ? { ...defaultQuizSettings, ...(rawData.settings as Record<string, unknown>) }
      : defaultQuizSettings;

    const questions = Array.isArray(rawData.questions) ? rawData.questions : [];

    return {
      settings,
      questions: questions.filter(q =>
        q && typeof q === 'object' && 'type' in q && 'question' in q
      ) as QuizQuestion[],
      version: 1,
    };
  }

  // Future versions: for now, just return as-is
  // In the future, add migration logic here
  return rawData as QuizData;
}
