import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useWeather } from '../../hooks/useWeather';
import { useContext } from 'react';
import MainScreen from '../../screens/MainScreen';
import LoadingIndicator from '../../components/LoadingIndicator';
import { LocationContext } from '../../context/LocationContext';

export default function TabOneScreen() {
  const { city, locationLoaded } = useContext(LocationContext);
  const { weather, forecast, loading, error, refresh } = useWeather(
    city || 'Москва',
  );

  useEffect(() => {
    if (city) refresh();
  }, [city]);

  if (loading || !locationLoaded) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      {city && (
        <MainScreen
          weather={weather}
          forecast={forecast}
          city={city}
          onRefresh={refresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
