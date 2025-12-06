import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Kalender | Ozean Licht Admin',
  description: 'Team-Kalender zur Verwaltung von Events und Terminen',
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {children}
    </div>
  );
}
