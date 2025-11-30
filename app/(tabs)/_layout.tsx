import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route, SceneMap, TabView } from 'react-native-tab-view';
import { UserModeProvider, useUserMode } from '../context/UserModeContext';

// Import screens
import CreateScreen from './create';
import ExploreScreen from './explore';
import HomeScreen from './index';
import MessagesScreen from './messages';
import ProfileScreen from './profile';

// Import Host Screens
import ProviderAdminDashboard from '../provider-admin';
import BookingRequestsScreen from '../booking-requests';
import ManageListingsScreen from '../manage-listings';
import EarningsScreen from '../earnings';

type TabRoute = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function TabContent() {
  const [index, setIndex] = useState(0);
  const { mode } = useUserMode();
  const insets = useSafeAreaInsets();

  // Reset index when mode changes to avoid out of bounds
  useEffect(() => {
    setIndex(0);
  }, [mode]);

  const travelerRoutes: TabRoute[] = [
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'explore', title: 'Explore', icon: 'compass' },
    { key: 'create', title: 'Create', icon: 'add-circle' },
    { key: 'messages', title: 'Messages', icon: 'chatbubble' },
    { key: 'profile', title: 'Profile', icon: 'person' },
  ];

  const hostRoutes: TabRoute[] = [
    { key: 'dashboard', title: 'Dashboard', icon: 'stats-chart' },
    { key: 'bookings', title: 'Bookings', icon: 'calendar' },
    { key: 'listings', title: 'Listings', icon: 'list' },
    { key: 'earnings', title: 'Earnings', icon: 'cash' },
    { key: 'profile', title: 'Profile', icon: 'person' },
  ];

  const routes = mode === 'traveler' ? travelerRoutes : hostRoutes;

  const renderScene = SceneMap({
    // Traveler Scenes
    home: () => <HomeScreen />,
    explore: () => <ExploreScreen />,
    create: () => <CreateScreen />,
    messages: () => <MessagesScreen />,

    // Host Scenes
    dashboard: () => <ProviderAdminDashboard />,
    bookings: () => <BookingRequestsScreen />,
    listings: () => <ManageListingsScreen />,
    earnings: () => <EarningsScreen />,

    // Shared
    profile: () => <ProfileScreen />,
  });

  const renderTabBar = (props: any) => {
    return (
      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        {props.navigationState.routes.map((route: Route, i: number) => {
          const focused = i === props.navigationState.index;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => {
                props.jumpTo(route.key);
                setIndex(i);
              }}
            >
              <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
                <Ionicons
                  name={focused ? (route.icon as any) : `${route.icon}-outline` as any}
                  size={24}
                  color={focused ? '#4ECDC4' : '#8E8E93'}
                />
                {route.key === 'messages' && mode === 'traveler' && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                )}
                {route.key === 'bookings' && mode === 'host' && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>5</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        swipeEnabled={false} // Disable swipe to prevent accidental mode confusion
        animationEnabled={true}
        tabBarPosition="bottom"
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <UserModeProvider>
      <TabContent />
    </UserModeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 239, 239, 0.8)',
    flexDirection: 'row',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainerFocused: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    borderRadius: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: '#4ECDC4',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
