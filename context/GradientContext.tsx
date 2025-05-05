// context/GradientContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
import { LocationContext } from './LocationContext';

const gradients = {
  clear: ['#47b2ff', '#6c8ef5'],
  cloudy: ['#5d6d7e', '#839192'],
  rain: ['#2c3e50', '#3498db'],
  snow: ['#a8c0ff', '#3f2b96'],
  default: ['#1e3799', '#4a69bd'],
};

const getGradient = (condition: string = '') => {
  const lower = condition.toLowerCase();
  if (lower.includes('ясно')) return gradients.clear;
  if (lower.includes('дождь')) return gradients.rain;
  if (lower.includes('снег')) return gradients.snow;
  if (lower.includes('облач')) return gradients.cloudy;
  return gradients.default;
};

const GradientContext = createContext<string[]>(gradients.default);

export const useGradient = () => useContext(GradientContext);

export const GradientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { city } = useContext(LocationContext);
  const { weather } = useWeather(city);

  const gradient = useMemo(() => {
    const condition = weather?.condition?.text || '';
    return getGradient(condition);
  }, [weather]);

  return (
    <GradientContext.Provider value={gradient}>
      {children}
    </GradientContext.Provider>
  );
};
