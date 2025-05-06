import { useState, useEffect, useContext } from 'react';
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  CurrentWeatherResponse,
} from '../services/weatherApi';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../context/LocationContext';

// Тип для универсального входа
type CityOrCoords = string | { latitude: number; longitude: number };

export const useWeather = (cityOrCoords: CityOrCoords) => {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Используем контекст для получения текущих данных о местоположении
  const { latitude, longitude, city } = useContext(LocationContext);

  const loadData = async (override?: CityOrCoords) => {
    try {
      setLoading(true);
      let current;
      const target = override || cityOrCoords;

      if (typeof target === 'string') {
        current = await fetchCurrentWeather(target, lang);
      } else {
        current = await fetchCurrentWeatherByCoords(
          target.latitude,
          target.longitude,
          lang,
        );
      }
      setWeather(current);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при изменении cityOrCoords или при изменении данных о местоположении
  useEffect(() => {
    if (latitude && longitude) {
      loadData({
        latitude,
        longitude,
      });
    } else if (city) {
      loadData(city); // если локация по имени города
    }
  }, [JSON.stringify(cityOrCoords), latitude, longitude, city]);

  return {
    weather,
    loading,
    error,
    refresh: loadData, // теперь refresh может принять аргумент
  };
};
