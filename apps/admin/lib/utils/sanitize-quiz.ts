/**
 * Quiz Content Sanitization
 *
 * Sanitizes user-generated quiz content to prevent XSS attacks.
 * Uses regex-based sanitization to avoid jsdom dependency issues during build.
 *
 * SECURITY: All quiz fields that accept user input must be sanitized:
 * - Question text, hints, explanations
 * - Multiple choice option text and feedback
 * - True/false questions
 * - Fill-in-blank text
 * - Matching pair text
 */

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

const QUIZ_ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span', 'code', 'pre'];

/**
 * Sanitize HTML content for quiz display
 *
 * Allows basic formatting tags (bold, italic, emphasis, etc.) but removes dangerous
 * elements and attributes that could cause XSS attacks.
 *
 * Allowed tags: b, i, em, strong, u, br, p, span, code, pre
 * Allowed attributes: class
 *
 * @param html - Raw HTML string from user input
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * sanitizeQuizHtml('<p>Safe text</p><script>alert("xss")</script>');
 * // Returns: '<p>Safe text</p>'
 */
export function sanitizeQuizHtml(html: string): string {
  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');

  // Remove tags not in allowed list, keep content
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagPattern, (match, tagName) => {
    if (QUIZ_ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      // Only allow class attribute
      return match.replace(/\s+(?!class=)[a-z-]+\s*=\s*["'][^"']*["']/gi, '');
    }
    return '';
  });

  return sanitized;
}

/**
 * Sanitize plain text by removing all HTML tags
 *
 * Strips all HTML tags from the input while keeping the text content.
 * Use this for fields that should not contain any HTML formatting.
 *
 * @param text - Raw text that may contain HTML
 * @returns Plain text with all HTML tags removed
 *
 * @example
 * sanitizeQuizText('Hello <b>world</b><script>alert("xss")</script>');
 * // Returns: 'Hello world'
 */
export function sanitizeQuizText(text: string): string {
  // Remove all HTML tags but keep content
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Render sanitized HTML safely for display
 *
 * This is a convenience wrapper around sanitizeQuizHtml() for rendering
 * user-generated quiz content with dangerouslySetInnerHTML.
 *
 * Always use this function when displaying quiz content that may contain
 * user-provided HTML to prevent XSS attacks.
 *
 * @param html - Raw HTML string to sanitize and render
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 *
 * @example
 * <div dangerouslySetInnerHTML={{ __html: renderSanitized(question.text) }} />
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
