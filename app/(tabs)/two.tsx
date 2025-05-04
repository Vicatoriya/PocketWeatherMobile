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


export default function TabTwoScreen() {
  const { city, latitude, longitude, locationLoaded } = useContext(LocationContext);
  const { history, loading} = useHistory(latitude, longitude);

   if (loading || !locationLoaded) return <LoadingIndicator />;
  return (
    <View style={styles.container}>
    <ForecastScreen weatherHistory={history}> </ForecastScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
