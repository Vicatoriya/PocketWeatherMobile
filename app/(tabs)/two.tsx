import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useWeather } from '../../hooks/useWeather';
import { useContext } from 'react';
import ForecastScreen from '../../screens/ForecastScreen';
import LoadingIndicator from '../../components/LoadingIndicator';
import { LocationContext } from '../../context/LocationContext';
import { fetchWeatherApi } from 'openmeteo';

export default function TabTwoScreen() {
//   const { city, locationLoaded } = useContext(LocationContext);
//   const { weather, forecast, loading, error, refresh } = useWeather(
//     city || 'Москва',
//   );

  useEffect( () => {
//     if (city) refresh();
const params = {
  latitude: 53.9,
  longitude: 27.5667,
  start_date: '2025-04-17',
  end_date: '2025-05-01',
  daily: ['temperature_2m_min', 'temperature_2m_max'],
  timezone: 'auto',
};

const url = 'https://archive-api.open-meteo.com/v1/archive';

(async () => {
  try {
      const responses = await fetchWeatherApi(url, params);
            const response = responses[0];

            const daily = response.daily();
            const start = BigInt(daily.time());
            const interval = BigInt(daily.interval());

            const tempsMin = daily.variables(0).valuesArray();
            const tempsMax = daily.variables(1).valuesArray();

            const result: WeatherDay[] = [];

            for (let i = 0; i < tempsMin.length; i++) {
              const timestamp = (start + BigInt(i) * interval) * 1000n;
              const date = new Date(Number(timestamp)).toISOString().split('T')[0];
              const avgTemp = ((tempsMin[i] + tempsMax[i]) / 2).toFixed(1);
              result.push({ date, avgTemp });
            }
        console.log(result);
  } catch (e) {
    console.error('Ошибка при получении данных:', e);
  }
})();

  }, []);
//
//   if (loading || !locationLoaded) return <LoadingIndicator />;

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
