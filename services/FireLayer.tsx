import React, { useEffect, useState } from 'react';
import { Circle, Region} from 'react-native-maps';

type FireData = {
  latitude: number;
  longitude: number;
  frp: number;
  acq_date: string;
};

interface FireLayerProps {
  isActive: boolean;
  region: Region; 
}

const NASA_API_KEY = '2249226dc882ca2ac2957ff508d2a250';

const FireLayer = ({ isActive, region }: FireLayerProps) => {
  const [fires, setFires] = useState<FireData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    if (!isActive) return;

    const fetchFires = async () => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const [west, south, east, north] = getBoundingBox(region);
        const bbox = [west, south, east, north].join(',');
        const response = await fetch(
          `https://firms.modaps.eosdis.nasa.gov/api/area/csv/2249226dc882ca2ac2957ff508d2a250/VIIRS_SNPP_NRT/23.1783,51.2623,32.7708,56.1721/3/${date}`
        );
        
        const text = await response.text();
        console.log(response.status)
        console.log(bbox)
        console.log(text)
        const data = text.split('\n')
          .slice(1)
          .filter(row => row.trim())
          .map(row => {
            const cols = row.split(',');
            return {
              latitude: parseFloat(cols[0]),
              longitude: parseFloat(cols[1]),
              frp: parseFloat(cols[12]),
              acq_date: cols[5]
            };
          });
          
        setFires(data.filter(item => !isNaN(item.latitude)));
      } catch (error) {
        console.error('Fire data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFires();
  }, [isActive]);

  if (!isActive || isLoading) return null;

  return (
    <>
      {fires.map((fire, index) => (
        <Circle
          key={`fire-${index}`}
          center={{
            latitude: fire.latitude,
            longitude: fire.longitude,
          }}
          radius={5000}
          strokeWidth={1}
          strokeColor="rgba(255,69,0,0.8)"
          fillColor="rgba(255,69,0,0.5)"
        />
      ))}
    </>
  );
};

const getBoundingBox = (region: Region) => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  
  const west = longitude - longitudeDelta / 2;
  const east = longitude + longitudeDelta / 2;
  const south = latitude - latitudeDelta / 2;
  const north = latitude + latitudeDelta / 2;

  const normalizedWest = west < -180 ? west + 360 : west;
  const normalizedEast = east > 180 ? east - 360 : east;

  const clampedSouth = Math.max(-90, south);
  const clampedNorth = Math.min(90, north);

  return [
    normalizedWest,
    clampedSouth,
    normalizedEast,
    clampedNorth
  ];
};

export default FireLayer;