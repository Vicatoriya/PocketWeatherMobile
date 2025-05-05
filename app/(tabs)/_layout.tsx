import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-sunny"
              color={color}
              size={size}
            />
          ),
          title: t('tabs.currentWeather'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={color}
              size={size}
            />
          ),
          title: t('tabs.forecast'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="google-maps"
              color={color}
              size={size}
            />
          ),
          title: t('tabs.map'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="align-vertical-distribute"
              color={color}
              size={size}
            />
          ),
          title: t('tabs.settings'),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
