/*4bade26b47128d2971198bb41ee2e1fa011d868c

"attributions": [
            {
                "url": "http://www.bjmemc.com.cn/",
                "name": "Beijing Environmental Protection Monitoring Center (北京市环境保护监测中心)"
            },
            {
                "url": "https://waqi.info/",
                "name": "World Air Quality Index Project"
            }
        ],

*/

const AIR_API_KEY = '4bade26b47128d2971198bb41ee2e1fa011d868c';

export interface AirQualityResponse {
    status: 'ok' | 'error';
    data?: AirQualityData;
    message?: string;
  }
  
  export interface AirQualityData {
    idx: number;
    aqi: number;
    time: TimeInfo;
    city: CityInfo;
    iaqi: IAQI;
    forecast?: Forecast;
  }
  
  interface TimeInfo {
    s: string;
    tz: string;
    v?: number;
  }
  
  interface CityInfo {
    name: string;
    geo: [number, number];
    url: string;
  }
  
  interface IAQI {
    [key: string]: { v: number };
  }
  
  interface ForecastData {
    avg: number;
    day: string;
    max: number;
    min: number;
  }
  
  interface Forecast {
    daily: {
      pm25?: ForecastData[];
      pm10?: ForecastData[];
      o3?: ForecastData[];
      uvi?: ForecastData[];
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
  
      const result: AirQualityResponse = await response.json();
      
      if (result.status !== 'ok') {
        throw new Error(result.message || 'Unknown API error');
      }
  
      return result.data!;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  }