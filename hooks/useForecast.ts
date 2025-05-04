import { useState, useEffect } from 'react';
import {
  fetchForecast,
  ForecastDay,
} from '../services/weatherApi';

export const useWeather = (city: string) => {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const forecast = await fetchForecast(city);
      setForecast(forecast);
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

  return {forecast, loading, error, refresh: loadData };
};
