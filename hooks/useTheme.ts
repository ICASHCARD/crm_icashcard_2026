import { useSettings } from '@/contexts/SettingsContext';

export const useTheme = () => {
  const { settings, updateSettings } = useSettings();
  const toggleDarkMode = () => updateSettings({ darkModeEnabled: !settings.darkModeEnabled });
  return { isDarkMode: settings.darkModeEnabled, toggleDarkMode };
};
