import { useState, useEffect } from 'react';
import { AirQualityData, fetchAirQualityByCoords } from '@/services/airApi';

export const useAir = (coords: string) => {
    const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [latitude, longitude] = coords.split(',').map(Number);

    const loadData = async () => {
        try {
          setLoading(true);
          const data = await fetchAirQualityByCoords(latitude,longitude);
          setAirQuality(data);
          setError('');
        } catch (err) {
          setError(err.message);
          setAirQuality(null);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        loadData();
      }, [airQuality?.city]);
    
      return { airQuality, loading, error, refresh: loadData };
    };