import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useWeather } from '../../hooks/useWeather';
import { useContext } from 'react';
import ForecastScreen from '../../screens/ForecastScreen';
import LoadingIndicator from '../../components/LoadingIndicator';
import { LocationContext } from '../../context/LocationContext';
import { useHistory } from '../../hooks/useHistory';
import { fetchWeatherApi } from 'openmeteo';
import { useForecast } from '../../hooks/useForecast';

export default function TabTwoScreen() {
  const { city, latitude, longitude, locationLoaded } = useContext(LocationContext);
  const { history, loading} = useHistory(latitude, longitude);
  const { forecast, loadingForecast, hourlyForecast } = useForecast(city);

  if (loading || !locationLoaded || loadingForecast) return <LoadingIndicator />;
  return (
    <View style={styles.container}>
      <ForecastScreen weatherHistory={history} forecast={forecast} hourlyForecast={hourlyForecast}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
