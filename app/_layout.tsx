import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { LocationProvider } from '../context/LocationContext';
import { GradientProvider } from '../context/GradientContext';

export default function RootLayout() {
  return (
    <LocationProvider>
      <GradientProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GradientProvider>
    </LocationProvider>
  );
}
