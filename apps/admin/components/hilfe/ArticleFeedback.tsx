'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface ArticleFeedbackProps {
  articleSlug: string;
}

export function ArticleFeedback({ articleSlug }: ArticleFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHelpful, setSelectedHelpful] = useState<boolean | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    if (submitted) return;

    setSelectedHelpful(helpful);

    if (!helpful) {
      // If not helpful, show the feedback form
      setShowFeedbackForm(true);
      return;
    }

    // If helpful, submit immediately
    await submitFeedback(helpful, '');
  };

  const submitFeedback = async (helpful: boolean, feedback: string) => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/public/hilfe/articles/${articleSlug}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful, feedback }),
      });
      setSubmitted(true);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDetailedFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback(selectedHelpful ?? false, feedbackText);
  };

  if (submitted) {
    return (
      <div className="mt-12 p-6 bg-[#00111A]/70 border border-[#0E282E] rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Check className="w-5 h-5" />
          <span className="font-medium">Vielen Dank für Ihr Feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 p-6 bg-[#00111A]/70 border border-[#0E282E] rounded-xl">
      <h3 className="text-lg font-medium text-white text-center mb-4">
        War dieser Artikel hilfreich?
      </h3>

      {!showFeedbackForm ? (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="w-5 h-5" />
            <span>Ja</span>
          </button>
          <button
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-[#001e1f] text-[#C4C8D4] border border-[#0E282E] rounded-lg hover:border-primary/30 hover:text-white transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="w-5 h-5" />
            <span>Nein</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitDetailedFeedback} className="space-y-4">
          <p className="text-[#C4C8D4] text-sm text-center">
            Es tut uns leid, dass dieser Artikel nicht hilfreich war. Wie können wir ihn verbessern?
          </p>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Ihr Feedback..."
            className="w-full p-4 bg-[#00070F] border border-[#0E282E] rounded-lg text-white placeholder-[#C4C8D4] focus:outline-none focus:border-primary/40 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => submitFeedback(false, '')}
              className="px-6 py-2 text-[#C4C8D4] hover:text-white transition-colors"
            >
              Überspringen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !feedbackText.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Absenden
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
