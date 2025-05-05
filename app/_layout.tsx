import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { LocationProvider } from '../context/LocationContext';
import { SettingsProvider } from '@/context/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </LocationProvider>
    </SettingsProvider>
  );
}
