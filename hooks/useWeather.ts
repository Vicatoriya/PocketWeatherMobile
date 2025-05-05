import { useState, useEffect } from 'react';
import {
  fetchCurrentWeather,
  CurrentWeatherResponse,
} from '../services/weatherApi';
import { useTranslation } from 'react-i18next';

export const useWeather = (city: string) => {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const loadData = async () => {
    try {
      setLoading(true);
      const current = await fetchCurrentWeather(city, lang);
      setWeather(current);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [city]);

  return { weather, loading, error, refresh: loadData };
};
