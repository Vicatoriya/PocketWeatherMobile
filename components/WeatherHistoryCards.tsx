import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const WeatherHistoryCards = ({ weatherHistory }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={styles.sectionTitle}>{t('interface.historyForecast')}</Text>
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
    color: '#fff',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: width * 0.28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
