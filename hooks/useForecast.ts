import { useState, useEffect } from 'react';
import {
  fetchForecast,
  ForecastDay,
} from '../services/weatherApi';

export const useForecast = (city: string) => {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoadingForecast(true);
      const forecast = await fetchForecast(city);
      setForecast(forecast);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingForecast(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [city]);

  return {forecast, loadingForecast, error, refresh: loadData };
};
