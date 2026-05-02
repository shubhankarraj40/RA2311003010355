import React from 'react';
import { NotificationProvider } from '../contexts/NotificationContextClean';
import { AppThemeProvider } from '../components/ThemeProvider';
import './globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
