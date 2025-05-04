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
          setCity('Москва');
          setLatitude(55.7558);
          setLongitude(37.6173);
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          setLatitude(loc.coords.latitude);
          setLongitude(loc.coords.longitude);
          const response = await fetch(
           `https://api.opencagedata.com/geocode/v1/json?q=${loc.coords.latitude}+${loc.coords.longitude}&language=ru&key=8c19fc4500d448af89913363ee5699a2`
          );
          const data = await response.json();
          const detectedCity = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
          setCity(detectedCity || 'Москва');
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
