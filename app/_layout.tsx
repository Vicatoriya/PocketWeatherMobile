import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { LocationProvider } from '../context/LocationContext';
import { GradientProvider } from '../context/GradientContext';
import { SettingsProvider } from '../context/SettingsContext';

export default function RootLayout() {
  return (
    <LocationProvider>
      <SettingsProvider>
        <GradientProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GradientProvider>
      </SettingsProvider>
    </LocationProvider>
  );
}
