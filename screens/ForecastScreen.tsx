import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {useForecast} from '../hooks/useForecast'; // Импортируем хук

type WeatherData = {
  date: string;
  temperature: number;
  description: string;
};

const ForecastScreen = () => {
  // Получаем текущую дату для вычисления начала и конца периода
  const today = new Date().toISOString().split('T')[0];
  const threeDaysBefore = new Date();
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
  const threeDaysAfter = new Date();
  threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

  const startDate = threeDaysBefore.toISOString().split('T')[0];
  const endDate = threeDaysAfter.toISOString().split('T')[0];

  // Используем хук для получения данных
  const { forecast, loading, error } = useForecast(52.52, 13.405, startDate, endDate); // Берем координаты для Берлина

  if (loading) return <Text>Загрузка...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Прогноз погоды</Text>
      <FlatList
        data={forecast}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.date}</Text>
            <Text>{item.temperature}°C</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default ForecastScreen;

