import { useState, useEffect } from 'react';
import {
  fetchCurrentWeather,
  fetchForecast,
  CurrentWeatherResponse,
  ForecastDay,
} from '../services/weatherApi';

export const useWeather = (city: string) => {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);
      setWeather(current);
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

  return { weather, forecast, loading, error, refresh: loadData };
};
