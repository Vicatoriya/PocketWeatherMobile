import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

const WEATHER_API_KEY = 'df7b8d461e044e4da7f174958252204';
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeatherResponse {
  temp_c: number;
  feelslike_c: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  pressure_mb: number;
  vis_km: number;
  uv: number;
  gust_kph: number;
  cloud: number;
  is_day: number;
  precip_mm: number;
  last_updated: string;
}

export interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: WeatherCondition;
  };
  hour: Array<{
    time: string;
    temp_c: number;
    condition: WeatherCondition;
  }>;
}

export const fetchCurrentWeather = async (
  city: string,
): Promise<CurrentWeatherResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        lang: 'ru',
      },
    });
    return data.current;
  } catch (error) {
    throw new Error('Не удалось получить данные о погоде');
  }
};

export const fetchForecast = async (
  city: string,
  days: number = 3,
): Promise<ForecastDay[]> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        days,
        lang: 'ru',
      },
    });
    return data.forecast.forecastday;
  } catch (error) {
    throw new Error('Не удалось получить прогноз');
  }
};



