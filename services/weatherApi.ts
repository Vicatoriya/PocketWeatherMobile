import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

const WEATHER_API_KEY = 'c36208302694488a82f110406250605';
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
  lang: string = 'ru',
): Promise<CurrentWeatherResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        lang,
      },
    });
    return data.current;
  } catch (error) {
    throw new Error('Не удалось получить данные о погоде');
  }
};
export const fetchCurrentWeatherByCoords = async (
  latitude: number,
  longitude: number,
  lang: string = 'ru',
): Promise<CurrentWeatherResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: `${latitude},${longitude}`,
        lang,
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
    return data.forecast.forecastday;
  } catch (error) {
    throw new Error('Не удалось получить прогноз');
  }
};

export const fetchHourlyForecast = async (
  city: string,
): Promise<HourlyForecastItem[]> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        lang: 'ru',
        days: 2,
        aqi: 'no',
        alerts: 'no',
      },
    });

    const allHours: HourlyForecastItem[] = [
      ...data.forecast.forecastday[0].hour,
      ...data.forecast.forecastday[1].hour,
    ];

    const currentHour = new Date().getHours();

    const nowDate = new Date().toISOString().split('T')[0];

    const now = new Date();
    const nowISO = now.toISOString().slice(0, 13);

    const result = allHours
      .filter((hour) => {
        const hourISO = new Date(hour.time).toISOString().slice(0, 13);
        return hourISO >= nowISO;
      })
      .slice(0, 24);

    return result;
  } catch (error) {
    throw new Error('Не удалось получить почасовой прогноз погоды');
  }
};

type ForecastParams = {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  daily: string[];
  timezone: string;
};

type WeatherDay = {
  date: string;
  maxTemp: string;
};

export async function getRecentWeather(lat: number, lon: number) {
  const url = 'https://api.open-meteo.com/v1/forecast';

  const { data } = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: ['temperature_2m_max'],
      past_days: 1,
      timezone: 'auto',
    },
  });

  return data.daily.time.map((date: string, i: number) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[i].toFixed(1),
  }));
}

export async function getArchivedWeather(
  lat: number,
  lon: number,
): Promise<WeatherDay[]> {
  const url = 'https://archive-api.open-meteo.com/v1/archive';

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 3);
  const end = new Date(today);
  end.setDate(today.getDate() - 2);
  const format = (d: Date) => d.toISOString().split('T')[0];

  const { data } = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: format(start),
      end_date: format(end),
      daily: ['temperature_2m_max'],
      timezone: 'auto',
    },
  });

  return data.daily.time.map((date: string, i: number) => ({
    date,
    maxTemp: data.daily.temperature_2m_max[i].toFixed(1),
  }));
}
