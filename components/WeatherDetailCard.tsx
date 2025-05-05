import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function WeatherDetailCard({ icon, title, value, description }) {
    return(
  <View style={styles.card}>
    <MaterialCommunityIcons
      name={icon}
      size={28}
      color="rgba(255,255,255,0.9)"
    />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
  </View>);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 10,
    width: width * 0.28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 120,
  },
  title: {
    color: 'white',
    fontSize: 14,
    marginVertical: 5,
    fontWeight: '500',
    textAlign: 'center',
  },
  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
});

export default WeatherDetailCard;
