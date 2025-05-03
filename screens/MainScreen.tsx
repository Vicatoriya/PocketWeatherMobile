import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CurrentWeatherResponse, ForecastDay } from '../services/weatherApi';

const { width } = Dimensions.get('window');

interface WeatherMainScreenProps {
  weather: CurrentWeatherResponse | null;
  forecast: ForecastDay[];
  city: string;
  onRefresh: () => Promise<void>;
}

const WeatherMainScreen: React.FC<WeatherMainScreenProps> = ({
  weather,
  forecast,
  city,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const gradients = useMemo(
    () => ({
      clear: ['#47b2ff', '#6c8ef5'],
      cloudy: ['#5d6d7e', '#839192'],
      rain: ['#2c3e50', '#3498db'],
      snow: ['#a8c0ff', '#3f2b96'],
      default: ['#1e3799', '#4a69bd'],
    }),
    [],
  );

  const getGradient = () => {
    const condition = weather?.condition?.text?.toLowerCase() || '';
    if (condition.includes('ясно')) return gradients.clear;
    if (condition.includes('дождь')) return gradients.rain;
    if (condition.includes('снег')) return gradients.snow;
    if (condition.includes('облач')) return gradients.cloudy;
    return gradients.default;
  };

  if (!weather) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={getGradient()}
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
        {/* Шапка с городом и временем */}
        <View style={styles.header}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.time}>
            {new Date().toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Основная информация о погоде */}
        <View style={styles.mainInfo}>
          <Text style={styles.temperature}>{Math.round(weather.temp_c)}°</Text>
          <Image
            source={{ uri: `https:${weather.condition.icon}` }}
            style={styles.weatherIcon}
          />
        </View>

        {/* Состояние погоды */}
        <Text style={styles.condition}>{weather.condition.text}</Text>

        {/* Детализированная информация */}
        <View style={styles.detailsContainer}>
          <WeatherDetail
            icon="weather-windy"
            title="Ветер"
            value={`${weather.wind_kph} км/ч`}
            description={weather.wind_dir}
          />
          <WeatherDetail
            icon="water-percent"
            title="Влажность"
            value={`${weather.humidity}%`}
            description={getHumidityStatus(weather.humidity)}
          />
          <WeatherDetail
            icon="gauge"
            title="Давление"
            value={`${weather.pressure_mb} гПа`}
            description={getPressureStatus(weather.pressure_mb)}
          />
        </View>

        <View style={styles.detailsContainer}>
          <WeatherDetail
            icon="weather-sunny-alert"
            title="УФ-индекс"
            value={String(weather.uv)}
            description={getUVStatus(weather.uv)}
          />
          <WeatherDetail
            icon="weather-cloudy"
            title="Облачность"
            value={`${weather.cloud}%`}
          />
          <WeatherDetail
            icon="weather-pouring"
            title="Осадки"
            value={`${weather.precip_mm} мм`}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Компонент деталей погоды
const WeatherDetail: React.FC<{
  icon: string;
  title: string;
  value: string;
  description?: string;
}> = ({ icon, title, value, description }) => (
  <View style={styles.detailCard}>
    <MaterialCommunityIcons
      name={icon}
      size={28}
      color="rgba(255,255,255,0.9)"
    />
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailValue}>{value}</Text>
    {description && <Text style={styles.detailDescription}>{description}</Text>}
  </View>
);

// Компонент прогноза на день
const ForecastItem: React.FC<{
  date: string;
  icon: string;
  temp: number;
  condition: string;
}> = ({ date, icon, temp, condition }) => (
  <View style={styles.forecastItem}>
    <Text style={styles.forecastDate}>
      {new Date(date)
        .toLocaleDateString('ru-RU', {
          weekday: 'short',
        })
        .replace('.', '')}
    </Text>
    <Image source={{ uri: `https:${icon}` }} style={styles.forecastIcon} />
    <Text style={styles.forecastTemp}>{Math.round(temp)}°</Text>
    <Text style={styles.forecastCondition}>{condition.split(' ')[0]}</Text>
  </View>
);

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3799',
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  city: {
    fontSize: 32,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  time: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  temperature: {
    fontSize: 80,
    color: 'white',
    fontWeight: '300',
    marginRight: 20,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  condition: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    width: width * 0.28,
    alignItems: 'center',
  },
  detailTitle: {
    color: 'white',
    fontSize: 14,
    marginVertical: 5,
    fontWeight: '500',
  },
  detailValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  detailDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 3,
  },
  forecastTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    width: width * 0.28,
  },
  forecastDate: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginVertical: 8,
  },
  forecastTemp: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  forecastCondition: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

// Вспомогательные функции
const getHumidityStatus = (humidity: number) => {
  if (humidity < 40) return 'Сухо';
  if (humidity < 70) return 'Комфортно';
  return 'Высокая влажность';
};

const getPressureStatus = (pressure: number) => {
  const normalPressure = 1013;
  const diff = pressure - normalPressure;
  if (diff < -15) return 'Низкое';
  if (diff > 15) return 'Высокое';
  return 'Нормальное';
};

const getUVStatus = (uv: number) => {
  if (uv < 3) return 'Низкий';
  if (uv < 6) return 'Умеренный';
  if (uv < 8) return 'Высокий';
  return 'Очень высокий';
};

export default WeatherMainScreen;
