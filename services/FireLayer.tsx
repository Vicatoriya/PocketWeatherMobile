import React, { useEffect, useState } from 'react';
import { Circle, Region } from 'react-native-maps';

type FireData = {
  latitude: number;
  longitude: number;
  frp: number;
  acq_date: string;
};

interface FireLayerProps {
  initialRegion: Region;
  isActive: boolean;
}

const NASA_API_KEY = '2249226dc882ca2ac2957ff508d2a250';

const FireLayer = ({ isActive }: { isActive: boolean }) => {
  const [fires, setFires] = useState<FireData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const fetchFires = async () => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `https://firms.modaps.eosdis.nasa.gov/api/area/csv/2249226dc882ca2ac2957ff508d2a250/VIIRS_SNPP_NRT/-180,-90,180,90/1/${date}`,
        );

        const text = await response.text();
        console.log(response.status);
        const data = text
          .split('\n')
          .slice(1)
          .filter((row) => row.trim())
          .map((row) => {
            const cols = row.split(',');
            return {
              latitude: parseFloat(cols[0]),
              longitude: parseFloat(cols[1]),
              frp: parseFloat(cols[12]),
              acq_date: cols[5],
            };
          });

        setFires(data.filter((item) => !isNaN(item.latitude)));
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

export default FireLayer;
