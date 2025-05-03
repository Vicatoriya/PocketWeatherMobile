import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingIndicator = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#1e3799" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default LoadingIndicator;
