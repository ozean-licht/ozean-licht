import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Hilfe Center | Ozean Licht',
    template: '%s | Hilfe Center | Ozean Licht',
  },
  description: 'Finden Sie Antworten auf häufig gestellte Fragen und hilfreiche Anleitungen.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function HilfeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#00070F]">
      {/* Simple header for public pages */}
      <header className="border-b border-[#0E282E] bg-[#00111A]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-decorative text-xl">O</span>
            </div>
            <div>
              <span className="text-white font-medium">Ozean Licht</span>
              <span className="text-[#C4C8D4] text-sm ml-2">Hilfe Center</span>
            </div>
          </a>
        </div>
      </header>

      <main>{children}</main>

      {/* Simple footer */}
      <footer className="border-t border-[#0E282E] py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-[#C4C8D4] text-sm">
          <p>&copy; {new Date().getFullYear()} Ozean Licht Akademie. Alle Rechte vorbehalten.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <a href="/" className="hover:text-primary transition-colors">Startseite</a>
            <a href="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</a>
            <a href="/impressum" className="hover:text-primary transition-colors">Impressum</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
