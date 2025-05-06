import { useState, useEffect } from 'react';
import { AirQualityData, fetchAirQualityByCoords } from '@/services/airApi';

export const useAir = (
  coords: { lat: number; lon: number },
  type?: 'current' | 'forecast' | 'history',
  start?: number,
  end?: number,
) => {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const result: AirQualityData = await fetchAirQualityByCoords(
        coords.lat,
        coords.lon,
      );
      setData(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords.lat && coords.lon) {
      loadData();
    }
  }, [coords.lat, coords.lon]);

  return { data, loading, error, refresh: loadData };
};

export { AirQualityData };

export type AQILevel = 1 | 2 | 3 | 4 | 5;

export interface AQILevelInfo {
  level: AQILevel;
  label: string;
  color: string;
}

export const aqiScale: Record<AQILevel, AQILevelInfo> = {
  1: { level: 1, label: 'Good', color: '#00e400' },
  2: { level: 2, label: 'Fair', color: '#ffff00' },
  3: { level: 3, label: 'Moderate', color: '#ff7e00' },
  4: { level: 4, label: 'Poor', color: '#ff0000' },
  5: { level: 5, label: 'Very Poor', color: '#8f3f97' },
};
