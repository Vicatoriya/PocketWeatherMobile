import React, { useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGradient } from '../context/GradientContext';
import WeatherHeader from '../components/WeatherHeader';
import WeatherDetails from '../components/WeatherDetails';
import { CurrentWeatherResponse, ForecastDay } from '../services/weatherApi';
import {
  getHumidityStatus,
  getPressureStatus,
  getUVStatus,
  getWindDirection,
} from '../utils/weatherUtils';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

function MainScreen({ weather, city, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const gradient = useGradient();
  const { t } = useTranslation();

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <LinearGradient
      colors={gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
      >
        <WeatherHeader
          city={city}
          temp={weather.temp_c}
          icon={weather.condition.icon}
          condition={weather.condition.text}
        />

        <WeatherDetails
          cards={[
            {
              icon: 'weather-windy',
              title: t('interface.wind'),
              value: `${weather.wind_kph} км/ч`,
              description: getWindDirection(weather.wind_dir, t),
            },
            {
              icon: 'water-percent',
              title: t('interface.humidity'),
              value: `${weather.humidity}%`,
              description: getHumidityStatus(weather.humidity, t),
            },
            {
              icon: 'gauge',
              title: t('interface.pressure'),
              value: `${weather.pressure_mb} гПа`,
              description: getPressureStatus(weather.pressure_mb, t),
            },
          ]}
        />

        <WeatherDetails
          cards={[
            {
              icon: 'weather-sunny-alert',
              title: t('interface.uv'),
              value: String(weather.uv),
              description: getUVStatus(weather.uv, t),
            },
            {
              icon: 'weather-cloudy',
              title: t('interface.cloud'),
              value: `${weather.cloud}%`,
            },
            {
              icon: 'weather-pouring',
              title: t('interface.precip'),
              value: `${weather.precip_mm} мм`,
            },
          ]}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3799',
  },
});

export default MainScreen;
