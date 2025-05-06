import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';

type LocationContextType = {
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  locationLoaded: boolean;
  updateLocation: (
    newCity?: string,
    newLatitude?: number,
    newLongitude?: number,
  ) => void;
};

export const LocationContext = createContext<LocationContextType>({
  city: null,
  latitude: null,
  longitude: null,
  locationLoaded: false,
  updateLocation: () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  const { i18n } = useTranslation();

  // Универсальная функция определения текущей геолокации и названия города
  const determineCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Нет разрешения');
        setCity('Москва');
        setLatitude(55.7558);
        setLongitude(37.6173);
        return;
      }

      const loc = await Location.getLastKnownPositionAsync({});
      if (loc) {
        const { latitude: lat, longitude: lon } = loc.coords;
        setLatitude(lat);
        setLongitude(lon);

        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&language=${i18n.language}&key=8c19fc4500d448af89913363ee5699a2`,
        );
        const data = await response.json();

        if (data && data.results.length > 0) {
          const comp = data.results[0].components;
          const detectedCity =
            comp.city || comp.town || comp.village || 'Неизвестно';
          setCity(detectedCity);
        } else {
          setCity('Москва');
        }
      } else {
        setCity('Москва');
        setLatitude(55.7558);
        setLongitude(37.6173);
      }
    } catch (e) {
      console.error('Ошибка геолокации:', e);
      setCity('Москва');
      setLatitude(55.7558);
      setLongitude(37.6173);
    } finally {
      setLocationLoaded(true);
    }
  };

  // Обновление вручную или fallback к определению текущего местоположения
  const updateLocation = (newCity?: string) => {
    if (newCity) {
      setCity(newCity);
    } else {
      determineCurrentLocation();
    }
  };

  useEffect(() => {
    determineCurrentLocation();
  }, [i18n.language]);

  return (
    <LocationContext.Provider
      value={{ city, latitude, longitude, locationLoaded, updateLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};
