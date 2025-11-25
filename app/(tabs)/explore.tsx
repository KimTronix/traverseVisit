import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const destinations = [
  { id: 1, name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80' },
  { id: 2, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 3, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { id: 4, name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
];

export default function ExploreScreen() {
  const router = useRouter();

  const handleDestinationPress = (destination: any) => {
    router.push({
      pathname: '/destination-map',
      params: {
        destinationId: destination.id,
        destinationName: destination.name
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {['Beach', 'Mountain', 'City', 'Adventure', 'Culture'].map((category) => (
              <TouchableOpacity key={category} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Destinations Grid */}
        <View style={styles.destinationsSection}>
          <Text style={styles.sectionTitle}>Top Destinations</Text>
          <View style={styles.destinationsGrid}>
            {destinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => handleDestinationPress(destination)}
              >
                <Image source={{ uri: destination.image }} style={styles.destinationImage} />
                <View style={styles.destinationOverlay}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationCountry}>{destination.country}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4ECDC4',
  },
  destinationsSection: {
    paddingBottom: 24,
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  destinationCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  destinationCountry: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 2,
  },
});
