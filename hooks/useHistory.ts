import { useState, useEffect } from 'react';
import { getForecast } from '../services/weatherApi'; // Импорт функции прогноза

type WeatherDay = {
  date: string;
  maxTemp: string;
};

export const useHistory = (latitude: number, longitude: number) => {
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        const today = new Date();

        const start = new Date(today);
        start.setDate(today.getDate() - 3);

        const end = new Date(today);
        end.setDate(today.getDate() - 1);

        const format = (d: Date) => d.toISOString().split('T')[0];

        const params = {
          latitude,
          longitude,
          start_date: format(start),
          end_date: format(end),
          daily: ['temperature_2m_min', 'temperature_2m_max'],
          timezone: 'auto',
        };

        const data = await getForecast(params);
        setHistory(data);
      } catch (err) {
        setError('Ошибка при получении данных');
        console.error('Ошибка в useForecast:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { history, loading, error };
};
