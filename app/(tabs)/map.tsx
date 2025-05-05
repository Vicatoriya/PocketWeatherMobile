import WeatherMap from '@/screens/WeatherMapScreen';
import { LocationContext } from '@/context/LocationContext';
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import LoadingIndicator from '@/components/LoadingIndicator';
import { View } from 'react-native';

export default function MapScreen() {
  const { locationLoaded } = useContext(LocationContext);

  if (!locationLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <WeatherMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
