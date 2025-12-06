'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ContactEscalationProps {
  articleTitle?: string;
}

export function ContactEscalation({ articleTitle }: ContactEscalationProps) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleOpenWidget = () => {
    // Check if widget SDK is available
    if (typeof window !== 'undefined' && (window as any).ozeanSupport) {
      (window as any).ozeanSupport('open');
      // Pre-fill context if available
      if (articleTitle) {
        (window as any).ozeanSupport('setCustomAttributes', {
          lastViewedArticle: articleTitle,
          source: 'help_center',
        });
      }
    } else {
      // Fallback: show a contact modal or redirect
      setIsWidgetOpen(true);
    }
  };

  return (
    <>
      <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-medium text-white">
              Noch Fragen?
            </h3>
            <p className="text-[#C4C8D4] mt-1">
              Unser Support-Team hilft Ihnen gerne weiter.
            </p>
          </div>
          <button
            onClick={handleOpenWidget}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Kontakt aufnehmen</span>
          </button>
        </div>
      </div>

      {/* Fallback contact modal if widget not available */}
      {isWidgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#00111A] border border-[#0E282E] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Kontakt</h3>
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="text-[#C4C8D4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#C4C8D4] mb-4">
              Schreiben Sie uns eine E-Mail an:
            </p>
            <a
              href="mailto:support@ozean-licht.at"
              className="block text-primary hover:underline"
            >
              support@ozean-licht.at
            </a>
          </div>
        </div>
      )}
    </>
  );
}
