import React from 'react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/store/contexts/AuthContext';
import { ThemeProvider } from '@/store/contexts/ThemeContext';
import { SalesProvider } from '@/store/contexts/SalesContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <SettingsProvider>
      <ThemeProvider>
        <SalesProvider>{children}</SalesProvider>
      </ThemeProvider>
    </SettingsProvider>
  </AuthProvider>
);
