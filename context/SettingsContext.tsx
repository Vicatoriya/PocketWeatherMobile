import i18n from '../i18n';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Settings = {
  ecoMode: boolean;
  dachaMode: boolean;
  language: 'ru' | 'en';
};

type SettingsContextType = {
  settings: Settings;
  toggleEcoMode: () => void;
  toggleDachaMode: () => void;
  setLanguage: (lang: 'ru' | 'en') => void;
  loaded: boolean;
};

const defaultSettings: Settings = {
  ecoMode: false,
  dachaMode: false,
  language: 'ru',
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  toggleEcoMode: () => {},
  toggleDachaMode: () => {},
  setLanguage: () => {},
  loaded: false,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem('appSettings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
          i18n.changeLanguage(parsed.language);
        }
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      } finally {
        setLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
    }
  };

  const toggleEcoMode = () => {
    saveSettings({ ...settings, ecoMode: !settings.ecoMode });
  };

  const toggleDachaMode = () => {
    saveSettings({ ...settings, dachaMode: !settings.dachaMode });
  };

  const setLanguage = (lang: 'ru' | 'en') => {
    i18n.changeLanguage(lang);
    saveSettings({ ...settings, language: lang });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, toggleEcoMode, toggleDachaMode, setLanguage, loaded }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
