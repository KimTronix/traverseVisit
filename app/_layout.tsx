import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoryProvider } from '../contexts/StoryContext';

export const unstable_settings = {
  // Set login as the initial route
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StoryProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="destination-map" options={{ headerShown: false }} />
            <Stack.Screen name="accommodation-booking" options={{ headerShown: false }} />
            <Stack.Screen name="group-planning" options={{ headerShown: false }} />
            <Stack.Screen name="wallet" options={{ headerShown: false }} />
            <Stack.Screen name="business-registration" options={{ headerShown: false }} />
            <Stack.Screen name="confirm-booking" options={{ headerShown: false }} />
            <Stack.Screen name="provider-admin" options={{ headerShown: false }} />
            <Stack.Screen name="booking-requests" options={{ headerShown: false }} />
            <Stack.Screen name="post-details" options={{ headerShown: false }} />
            <Stack.Screen name="user-profile" options={{ headerShown: false }} />
            <Stack.Screen name="direct-message" options={{ headerShown: false }} />
            <Stack.Screen name="host-onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="verification-pending" options={{ headerShown: false }} />
            <Stack.Screen name="manage-listings" options={{ headerShown: false }} />
            <Stack.Screen name="add-property/index" options={{ headerShown: false }} />
            <Stack.Screen name="property-published" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </StoryProvider>
    </SafeAreaProvider>
  );
}
