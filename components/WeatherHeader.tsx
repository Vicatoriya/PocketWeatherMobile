import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function WeatherHeader({ city, temp, icon, condition }) {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.time}>
          {new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.temperature}>{Math.round(temp)}°</Text>
        <Image source={{ uri: `https:${icon}` }} style={styles.weatherIcon} />
      </View>

      <Text style={styles.condition}>{condition}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  city: { fontSize: 32, color: 'white', fontWeight: '600' },
  time: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
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
  weatherIcon: { width: 120, height: 120 },
  condition: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
});

export default WeatherHeader;
