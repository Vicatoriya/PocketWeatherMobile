import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

type LocationContextType = {
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  locationLoaded: boolean;
};

export const LocationContext = createContext<LocationContextType>({
  city: null,
  latitude: null,
  longitude: null,
  locationLoaded: false,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Нет разрешения');
          // По умолчанию — Москва
          setCity('Москва');
          setLatitude(55.7558);
          setLongitude(37.6173);
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          setLatitude(loc.coords.latitude);
          setLongitude(loc.coords.longitude);

          const geo = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });

          const detectedCity = geo[0]?.city || geo[0]?.region || 'Москва';
          setCity(detectedCity);
        }
      } catch (e) {
        console.error('Ошибка геолокации:', e);
        setCity('Москва');
        setLatitude(55.7558);
        setLongitude(37.6173);
      } finally {
        setLocationLoaded(true);
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ city, latitude, longitude, locationLoaded }}>
      {children}
    </LocationContext.Provider>
  );
};
