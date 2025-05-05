import React from 'react';
import { View, StyleSheet } from 'react-native';
import WeatherDetailCard from './WeatherDetailCard';

function WeatherDetails({ cards }) {
  return (
    <View style={styles.container}>
      {cards.map((card, idx) => (
        <WeatherDetailCard key={idx} {...card} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
});

export default WeatherDetails;
