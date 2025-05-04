import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

const WEATHER_API_KEY = 'df7b8d461e044e4da7f174958252204';
const BASE_URL = 'https://api.weatherapi.com/v1';
const url = 'https://archive-api.open-meteo.com/v1/archive';

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
  days: number = 7,
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
    return data.forecast.forecastday; // правильно возвращаем массив
  } catch (error) {
    throw new Error('Не удалось получить прогноз');
  }
};


// Тип для входных параметров
type ForecastParams = {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  daily: string[];
  timezone: string;
};

// Тип для возвращаемого результата
type WeatherDay = {
  date: string;
  maxTemp: string;
};

// Основная функция прогноза
export async function getForecast(params: ForecastParams): Promise<WeatherDay[]> {
  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const daily = response.daily();
    const start = BigInt(daily.time());       // Начальная дата (в секундах)
    const interval = BigInt(daily.interval()); // Интервал между днями (в секундах)

    const tempsMax = daily.variables(1).valuesArray() as number[];

    const result: WeatherDay[] = [];

    for (let i = 0; i < tempsMax.length; i++) {
      const timestamp = (start + BigInt(i) * interval) * 1000n; // в миллисекундах
      const date = new Date(Number(timestamp)).toISOString().split('T')[0];
      const maxTemp = tempsMax[i].toFixed(1);
      result.push({ date, maxTemp });
    }

    return result;
  } catch (e) {
    console.error('Ошибка при получении данных:', e);
    return [];
  }
}
