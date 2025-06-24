import './globals.css';
import { I18nProvider } from '@/components/i18nProvider';
import { ThemeProvider, ToastProvider } from '@/context/index';

export const metadata = {
  title: 'Simple Tab Framework',
  description: 'A flexible tab management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
