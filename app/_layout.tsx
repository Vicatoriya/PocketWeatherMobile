import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { LocationProvider } from '../context/LocationContext';

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LocationProvider>
  );
}
