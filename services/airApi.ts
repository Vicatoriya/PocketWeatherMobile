
const AIR_API_KEY = '4bade26b47128d2971198bb41ee2e1fa011d868c';

interface WAQIResponse {
  status: string;
  data?: AirQualityData;
  message?: string;
}

export interface AirQualityData {
  aqi: number;
  idx: number;
  time: {
      s: string;
      tz: string;
      v: number;
  };
  city: {
      geo: number[];
      name: string;
      url: string;
  };
  dominentpol: string;
  iaqi: {
    co: { v: number };
    h: { v: number };
    no2: { v: number };
    o3: { v: number };
    p: { v: number };
    pm10: { v: number };
    pm25: { v: number };
    so2: { v: number };
    t: { v: number };
    w: { v: number };
  };
  forecast: {
      daily: {
          o3: [{ avg: number; day: string; max: number; min: number }];
          pm10: [{ avg: number; day: string; max: number; min: number }];
          pm25: [{ avg: number; day: string; max: number; min: number }];
      };
  };
}


export async function fetchAirQualityByCoords(
  lat: number,
  lng: number
): Promise<AirQualityData> {
  const url = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${AIR_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: WAQIResponse = await response.json();
    
    if (result.status !== 'ok') {
      throw new Error(result.message || 'Unknown API error');
    }

    return result.data!;
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
}