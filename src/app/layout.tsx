import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { GlobalReminderHost } from '@/components/schedule/GlobalReminderHost';

export const metadata: Metadata = {
  title: 'MediNotify — Small reminders. Big courage.',
  description: 'Child-friendly medicine reminder system designed especially for children undergoing cancer treatment, with rotating motivational rhymes, double-dose safety locks, and IoT hardware companion integration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-200 selection:text-teal-900">
        <AppProvider>
          <Navbar />
          <GlobalReminderHost />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-amber-200/60 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                <strong>MediNotify</strong> — “Small reminders. Big courage.” Specially designed for pediatric cancer care.
              </p>
              <p className="text-slate-400">
                Safe Double-Dose Protection • Rotating Motivational Rhymes • IoT Companion Ready
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
