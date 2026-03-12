import React, { createContext, useContext } from 'react';
import { useSales } from '@/hooks/useSales';

type SalesContextValue = ReturnType<typeof useSales>;

const SalesContext = createContext<SalesContextValue | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useSales();
  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error('useSalesContext must be used within SalesProvider');
  return context;
};
