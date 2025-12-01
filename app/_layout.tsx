import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoryProvider } from '../contexts/StoryContext';
import { AuthProvider } from './context/AuthContext';
import { UserModeProvider } from './context/UserModeContext';

export const unstable_settings = {
  // Set welcome as the initial route
  initialRouteName: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserModeProvider>
          <StoryProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Auth Screens */}
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen name="forgot-password" options={{ headerShown: false }} />

                {/* Main App */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Booking Flow */}
                <Stack.Screen name="destination-details" options={{ headerShown: false }} />
                <Stack.Screen name="select-dates" options={{ headerShown: false }} />
                <Stack.Screen name="property-details" options={{ headerShown: false }} />
                <Stack.Screen name="booking-review" options={{ headerShown: false }} />
                <Stack.Screen name="payment-method" options={{ headerShown: false }} />
                <Stack.Screen name="booking-success" options={{ headerShown: false }} />
                <Stack.Screen name="my-bookings" options={{ headerShown: false }} />

                {/* Social Features */}
                <Stack.Screen name="post-comments" options={{ headerShown: false }} />
                <Stack.Screen name="user-profile" options={{ headerShown: false }} />
                <Stack.Screen name="messages-list" options={{ headerShown: false }} />
                <Stack.Screen name="conversation" options={{ headerShown: false }} />

                {/* Essential Screens */}
                <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                <Stack.Screen name="settings" options={{ headerShown: false }} />
                <Stack.Screen name="notifications-list" options={{ headerShown: false }} />
                <Stack.Screen name="search-results" options={{ headerShown: false }} />

                {/* Existing Screens */}
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
                <Stack.Screen name="direct-message" options={{ headerShown: false }} />
                <Stack.Screen name="host-onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="verification-pending" options={{ headerShown: false }} />
                <Stack.Screen name="manage-listings" options={{ headerShown: false }} />
                <Stack.Screen name="add-property/index" options={{ headerShown: false }} />
                <Stack.Screen name="property-published" options={{ headerShown: false }} />
                <Stack.Screen name="earnings" options={{ headerShown: false }} />

                {/* Admin Routes */}
                <Stack.Screen name="admin/login" options={{ headerShown: false }} />
                <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
                <Stack.Screen name="admin/approvals/index" options={{ headerShown: false }} />
                <Stack.Screen name="admin/approvals/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="admin/users" options={{ headerShown: false }} />
                <Stack.Screen name="admin/moderation" options={{ headerShown: false }} />
                <Stack.Screen name="admin/analytics" options={{ headerShown: false }} />

                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </StoryProvider>
        </UserModeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
