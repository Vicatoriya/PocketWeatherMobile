import { useState, useEffect, useContext } from 'react';
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  CurrentWeatherResponse,
} from '../services/weatherApi';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../context/LocationContext';

type CityOrCoords = string | { latitude: number; longitude: number };

export const useWeather = (cityOrCoords: CityOrCoords) => {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();
  const lang = i18n.language;

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

  useEffect(() => {
    if (latitude && longitude) {
      loadData({
        latitude,
        longitude,
      });
    } else if (city) {
      loadData(city);
    }
  }, [JSON.stringify(cityOrCoords), latitude, longitude, city]);

  return {
    weather,
    loading,
    error,
    refresh: loadData,
  };
};
