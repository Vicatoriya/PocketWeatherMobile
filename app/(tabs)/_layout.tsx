import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) =>
          (
            <MaterialCommunityIcons name="weather-sunny" color={color} size={size} />
          ),
          title: 'Текущая погода',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ color, size }) =>
          (
              <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
          ),
          title: 'Прогноз погоды',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
