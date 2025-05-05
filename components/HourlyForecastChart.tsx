import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { HourlyForecastItem } from '../services/weatherApi';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface HourlyForecastChartProps {
  hourlyForecast: HourlyForecastItem[];
}

const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourlyForecast,
}) => {
  if (!Array.isArray(hourlyForecast)) {
    return (
      <Text style={styles.error}>Нет данных для отображения прогноза</Text>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Прогноз на 24 часа</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.cardRow}>
          {hourlyForecast.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTime}>{item.time.slice(11, 16)}</Text>
              <Image
                source={{ uri: `https:${item.condition.icon}` }}
                style={styles.weatherIcon}
              />
              <Text style={styles.cardTemp}>{Math.round(item.temp_c)}°C</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: 'white',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH / 5.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTime: {
    fontSize: 15,
    color: 'white',
    marginBottom: 6,
    fontWeight: '500',
  },
  weatherIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  cardTemp: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HourlyForecastChart;
