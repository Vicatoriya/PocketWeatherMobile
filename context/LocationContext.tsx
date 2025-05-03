import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

type LocationContextType = {
  city: string | null;
  locationLoaded: boolean;
};

export const LocationContext = createContext<LocationContextType>({
  city: null,
  locationLoaded: false,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Нет разрешения');
          setCity('Москва');
        } else {
          const loc = await Location.getCurrentPositionAsync({});
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
      } finally {
        setLocationLoaded(true);
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ city, locationLoaded }}>
      {children}
    </LocationContext.Provider>
  );
};
