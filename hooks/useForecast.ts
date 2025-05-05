import { useState, useEffect } from 'react';
import {
  fetchForecast,
  fetchHourlyForecast,
  ForecastDay,
  HourlyForecastItem,
} from '../services/weatherApi';

export const useForecast = (city: string) => {
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<
    HourlyForecastItem[] | null
  >(null);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoadingForecast(true);
      console.log('s');
      const [forecastData, hourlyData] = await Promise.all([
        fetchForecast(city),
        fetchHourlyForecast(city),
      ]);
      console.log(forecastData);
      setForecast(forecastData);
      setHourlyForecast(hourlyData);
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

  return {
    forecast,
    hourlyForecast,
    loadingForecast,
    error,
    refresh: loadData,
  };
};
