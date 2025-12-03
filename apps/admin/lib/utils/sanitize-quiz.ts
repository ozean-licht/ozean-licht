/**
 * Quiz Content Sanitization
 *
 * Sanitizes user-generated quiz content to prevent XSS attacks.
 * Uses isomorphic-dompurify for consistent sanitization on client and server.
 *
 * SECURITY: All quiz fields that accept user input must be sanitized:
 * - Question text, hints, explanations
 * - Multiple choice option text and feedback
 * - True/false questions
 * - Fill-in-blank text
 * - Matching pair text
 */

import DOMPurify from 'isomorphic-dompurify';
import type {
  QuizData,
  QuizQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  FillBlankQuestion,
  MatchingQuestion,
  QuizOption,
  BlankAnswer,
  MatchPair,
} from '@/types/quiz';

/**
 * Sanitize HTML content
 * Allows basic formatting but removes dangerous elements and attributes
 */
export function sanitizeQuizHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span', 'code', 'pre'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize plain text (removes all HTML)
 */
export function sanitizeQuizText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Render sanitized HTML safely
 * Use this for rendering user-generated quiz content
 */
export function renderSanitized(html: string): string {
  return sanitizeQuizHtml(html);
}

/**
 * Sanitize a quiz option (multiple choice)
 */
function sanitizeQuizOption(option: QuizOption): QuizOption {
  return {
    ...option,
    text: sanitizeQuizText(option.text),
    feedback: option.feedback ? sanitizeQuizText(option.feedback) : undefined,
  };
}

/**
 * Sanitize a blank answer (fill-in-blank)
 */
function sanitizeBlankAnswer(blank: BlankAnswer): BlankAnswer {
  return {
    ...blank,
    acceptedAnswers: blank.acceptedAnswers.map(sanitizeQuizText),
  };
}

/**
 * Sanitize a match pair (matching question)
 */
function sanitizeMatchPair(pair: MatchPair): MatchPair {
  return {
    ...pair,
    left: sanitizeQuizText(pair.left),
    right: sanitizeQuizText(pair.right),
  };
}

/**
 * Sanitize a multiple choice question
 */
function sanitizeMultipleChoiceQuestion(
  question: MultipleChoiceQuestion
): MultipleChoiceQuestion {
  return {
    ...question,
    question: sanitizeQuizText(question.question),
    explanation: question.explanation ? sanitizeQuizText(question.explanation) : undefined,
    hint: question.hint ? sanitizeQuizText(question.hint) : undefined,
    options: question.options.map(sanitizeQuizOption),
  };
}

/**
 * Sanitize a true/false question
 */
function sanitizeTrueFalseQuestion(
  question: TrueFalseQuestion
): TrueFalseQuestion {
  return {
    ...question,
    question: sanitizeQuizText(question.question),
    explanation: question.explanation ? sanitizeQuizText(question.explanation) : undefined,
    hint: question.hint ? sanitizeQuizText(question.hint) : undefined,
  };
}

/**
 * Sanitize a fill-in-blank question
 */
function sanitizeFillBlankQuestion(
  question: FillBlankQuestion
): FillBlankQuestion {
  return {
    ...question,
    question: sanitizeQuizText(question.question),
    explanation: question.explanation ? sanitizeQuizText(question.explanation) : undefined,
    hint: question.hint ? sanitizeQuizText(question.hint) : undefined,
    blanks: question.blanks.map(sanitizeBlankAnswer),
  };
}

/**
 * Sanitize a matching question
 */
function sanitizeMatchingQuestion(
  question: MatchingQuestion
): MatchingQuestion {
  return {
    ...question,
    question: sanitizeQuizText(question.question),
    explanation: question.explanation ? sanitizeQuizText(question.explanation) : undefined,
    hint: question.hint ? sanitizeQuizText(question.hint) : undefined,
    pairs: question.pairs.map(sanitizeMatchPair),
  };
}

/**
 * Sanitize a single quiz question based on its type
 */
function sanitizeQuestion(question: QuizQuestion): QuizQuestion {
  switch (question.type) {
    case 'multiple_choice':
      return sanitizeMultipleChoiceQuestion(question);
    case 'true_false':
      return sanitizeTrueFalseQuestion(question);
    case 'fill_blank':
      return sanitizeFillBlankQuestion(question);
    case 'matching':
      return sanitizeMatchingQuestion(question);
    default:
      // Type guard - should never reach here with proper TypeScript
      return question;
  }
}

/**
 * Sanitize complete quiz data
 * Removes any malicious HTML/JavaScript from user-generated quiz content
 *
 * @param quizData - Raw quiz data from user input
 * @returns Sanitized quiz data safe for storage and rendering
 *
 * @example
 * const userInput = {
 *   settings: defaultQuizSettings,
 *   questions: [{
 *     id: '1',
 *     type: 'multiple_choice',
 *     question: 'What is 2+2? <script>alert("xss")</script>',
 *     options: [...]
 *   }],
 *   version: 1
 * };
 *
 * const safe = sanitizeQuizData(userInput);
 * // safe.questions[0].question === 'What is 2+2? '
 */
export function sanitizeQuizData(quizData: QuizData): QuizData {
  return {
    ...quizData,
    // Settings don't need sanitization (all numbers/booleans)
    questions: quizData.questions.map(sanitizeQuestion),
  };
}
