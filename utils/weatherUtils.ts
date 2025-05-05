import { TFunction } from 'i18next';

export const getHumidityStatus = (humidity: number, t: TFunction): string => {
  if (humidity < 40) return t('weather.humidity.dry');
  if (humidity < 70) return t('weather.humidity.comfort');
  return t('weather.humidity.high');
};

export const getPressureStatus = (pressure: number, t: TFunction): string => {
  const normalPressure = 1013;
  const diff = pressure - normalPressure;
  if (diff < -15) return t('weather.pressure.low');
  if (diff > 15) return t('weather.pressure.high');
  return t('weather.pressure.normal');
};

export const getUVStatus = (uv: number, t: TFunction): string => {
  if (uv < 3) return t('weather.uv.low');
  if (uv < 6) return t('weather.uv.moderate');
  if (uv < 8) return t('weather.uv.high');
  return t('weather.uv.veryHigh');
};

export const getWindDirection = (dir: string, t: TFunction): string => {
  const directions: { [key: string]: string } = {
    N: 'north',
    NNE: 'north-northeast',
    NE: 'northeast',
    ENE: 'east-northeast',
    E: 'east',
    ESE: 'east-southeast',
    SE: 'southeast',
    SSE: 'south-southeast',
    S: 'south',
    SSW: 'south-southwest',
    SW: 'southwest',
    WSW: 'west-southwest',
    W: 'west',
    WNW: 'west-northwest',
    NW: 'northwest',
    NNW: 'north-northwest',
  };

  return t(`weather.wind.${directions[dir] || dir}`);
};
