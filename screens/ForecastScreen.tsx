import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ForecastChart from '../components/ForecastChart';
import WeatherHistoryCards from '../components/WeatherHistoryCards';
import { LinearGradient } from 'expo-linear-gradient';
import { useGradient } from '../context/GradientContext';
import { LocationContext } from '../context/LocationContext';
import HourlyForecastChart from '../components/HourlyForecastChart';
import { getGradient } from '../utils/weatherUtils';
import { useWeather } from '../hooks/useWeather';

const ForecastScreen = ({ weatherHistory, forecast, hourlyForecast }) => {
//   const { city, locationLoaded, updateLocation } = useContext(LocationContext);
//   const { weather, loading, refresh } = useWeather(city || 'Москва');
//
//   useEffect(() => {
//     if (city) {
//       refresh(); // Обновляем погоду при изменении города
//     }
//   }, [city]);
  const gradient = useGradient();
  return (
    <LinearGradient
      colors={gradient}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <HourlyForecastChart hourlyForecast={hourlyForecast} />
          <ForecastChart forecast={forecast} />
          <WeatherHistoryCards weatherHistory={weatherHistory} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
  },
});

export default ForecastScreen;
