import { useEffect, useState } from 'react';
import { getRecentWeather } from '../services/weatherApi';
import { getArchivedWeather } from '../services/weatherApi';

type WeatherDay = {
  date: string;
  maxTemp: string;
};

export const useHistory = (lat: number | null, lon: number | null) => {
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lon == null) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [recent, archived] = await Promise.all([
          getRecentWeather(lat, lon),
          getArchivedWeather(lat, lon),
        ]);

        const combined = [...archived, recent[0]];
        setHistory(combined);
      } catch (err) {
        setError('Ошибка при загрузке данных о погоде');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]);

  return { history, loading, error };
};
