import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="create" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
