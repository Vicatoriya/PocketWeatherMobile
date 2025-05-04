import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * 4) / 3;

const WeatherHistoryCards = ({ weatherHistory }) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Прошедшие 3 дня</Text>
      <View style={styles.cardRow}>
        {weatherHistory.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardTemp}>{Math.round(item.maxTemp)}°C</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff', // Цвет шрифта в соответствии с дизайном
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Полупрозрачный фон как на MainScreen
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: CARD_WIDTH,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Добавим стиль, как на MainScreen
    justifyContent: 'flex-start', // Контент внутри карточки выравнивается по верху
  },
  cardDate: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardTemp: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default WeatherHistoryCards;
