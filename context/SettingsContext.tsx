import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Settings = {
  ecoMode: boolean;
  dachaMode: boolean;
};

type SettingsContextType = {
  settings: Settings;
  toggleEcoMode: () => void;
  toggleDachaMode: () => void;
  loaded: boolean;
};

const defaultSettings: Settings = {
  ecoMode: false,
  dachaMode: false,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  toggleEcoMode: () => {},
  toggleDachaMode: () => {},
  loaded: false,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('appSettings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
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
      console.error('Error saving settings:', error);
    }
  };

  const toggleEcoMode = () => {
    const newSettings = { ...settings, ecoMode: !settings.ecoMode };
    saveSettings(newSettings);
  };

  const toggleDachaMode = () => {
    const newSettings = { ...settings, dachaMode: !settings.dachaMode };
    saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, toggleEcoMode, toggleDachaMode, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
};