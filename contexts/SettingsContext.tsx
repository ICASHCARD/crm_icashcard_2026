
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SystemSettings } from '../types';
import { mockSystemSettings } from '../data/mockData';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(mockSystemSettings);

  // Carregar configurações quando o usuário mudar
  useEffect(() => {
    if (user) {
      const storageKey = `nexus_settings_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSettings(JSON.parse(saved));
      } else {
        // Se não houver config específica do usuário, usa a padrão do sistema
        setSettings(mockSystemSettings);
      }
    } else {
      setSettings(mockSystemSettings);
    }
  }, [user]);

  // Aplicar efeitos visuais globais
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    if (settings.darkModeEnabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (user) {
        localStorage.setItem(`nexus_settings_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(mockSystemSettings);
    if (user) {
      localStorage.removeItem(`nexus_settings_${user.id}`);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
