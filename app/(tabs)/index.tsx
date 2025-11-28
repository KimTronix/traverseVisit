import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import Feed from '../../components/Feed';
import CreationHub from '../../components/CreationHub';
import Explore from '../../components/Explore';
import Create from '../../components/Create';
import Notifications from '../../components/Notifications';
import Profile from '../../components/Profile';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to the Feed (index 1) initially
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width, animated: false });
    }
  }, []);

  const scrollToFeed = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: width, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentOffset={{ x: width, y: 0 }}
      >
        {/* Index 0: Creation Hub (Left of Home) */}
        <CreationHub onClose={scrollToFeed} />

        {/* Index 1: Feed (Home) */}
        <Feed />

        {/* Index 2: Explore */}
        <Explore />

        {/* Index 3: Create */}
        <Create />

        {/* Index 4: Notifications */}
        <Notifications />

        {/* Index 5: Profile */}
        <Profile />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
