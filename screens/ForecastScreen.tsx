import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ForecastChart from '../components/ForecastChart';
import WeatherHistoryCards from '../components/WeatherHistoryCards';
import { LinearGradient } from 'expo-linear-gradient';
import { useGradient } from '../context/GradientContext'; // путь подкорректируй при необходимости

const ForecastScreen = ({ weatherHistory, forecast }) => {
  const gradient = useGradient();

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Погода</Text>
          <WeatherHistoryCards weatherHistory={weatherHistory} />
          <ForecastChart forecast={forecast} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
  },
});

export default ForecastScreen;
