import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import ForecastChart from '../components/ForecastChart';

const ForecastScreen = ({ weatherHistory, forecast }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Погода</Text>

        <Text style={styles.sectionTitle}>Прошедшие 3 дня</Text>
        <View style={styles.cardRow}>
          {weatherHistory.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardTemp}>{Math.round(item.maxTemp)}°C</Text>
            </View>
          ))}
        </View>
        <ForecastChart forecast={forecast} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_GAP * 4) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#334155',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
 card: {
   backgroundColor: 'rgba(0, 0, 0, 0.05)',
   borderRadius: 16,
   paddingVertical: 20,
   paddingHorizontal: 10,
   width: CARD_WIDTH,
   alignItems: 'center',
   borderWidth: 1,
   borderColor: 'rgba(255,255,255,0.15)',
 },

  cardDate: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  cardTemp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default ForecastScreen;
