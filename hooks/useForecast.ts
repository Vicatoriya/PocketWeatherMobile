import { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherApi'; // Импортируем сервис

export const useForecast = (latitude: number, longitude: number, startDate: string, endDate: string) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData(latitude, longitude, startDate, endDate);
        console.log('Полученные данные: ', data); // Логируем полученные данные
        setForecast(data);
      } catch (err) {
        setError('Ошибка при получении данных');
        console.error('Ошибка в useEffect:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

  }, [latitude, longitude, startDate, endDate]); // Зависимости для повторного вызова хука при изменении

  return { forecast, loading, error };
};
