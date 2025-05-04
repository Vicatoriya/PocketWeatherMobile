import { useState, useEffect } from 'react';
import {
  fetchCurrentWeather,
  CurrentWeatherResponse,
} from '../services/weatherApi';

export const useWeather = (city: string) => {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const current = await fetchCurrentWeather(city);
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
