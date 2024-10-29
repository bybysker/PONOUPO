// components/common/providers.tsx
"use client"

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/theme-context';


interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
