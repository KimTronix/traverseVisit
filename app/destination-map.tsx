import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Mock destinations data
const destinations = [
    {
        id: 1,
        name: 'Paris, France',
        rating: 4.8,
        reviews: '2.5k reviews',
        budget: '$1500',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
        latitude: 48.8566,
        longitude: 2.3522,
    },
    {
        id: 2,
        name: 'London, UK',
        rating: 4.7,
        reviews: '3.2k reviews',
        budget: '$1800',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
        latitude: 51.5074,
        longitude: -0.1278,
    },
    {
        id: 3,
        name: 'Barcelona, Spain',
        rating: 4.9,
        reviews: '1.8k reviews',
        budget: '$1200',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
        latitude: 41.3851,
        longitude: 2.1734,
    },
];

export default function DestinationMapScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
    const [searchQuery, setSearchQuery] = useState('');

    const handlePlanTrip = () => {
        // Navigate to accommodation booking
        router.push('/accommodation-booking');
    };

    const handleViewDetails = () => {
        // Navigate to destination details
        console.log('View details for:', selectedDestination.name);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="navigate-circle" size={28} color="#4ECDC4" />
                    <Text style={styles.logoText}>Traverse-Visit</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Map Container */}
            <View style={styles.mapContainer}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search destinations"
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <View style={styles.weatherBadge}>
                        <Ionicons name="sunny" size={16} color="#FFA500" />
                        <Text style={styles.weatherText}>22°C</Text>
                    </View>
                </View>

                {/* Map Placeholder with Markers */}
                <View style={styles.mapPlaceholder}>
                    <Image
                        source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/2.3522,48.8566,5,0/600x800@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' }}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />

                    {/* Map Markers */}
                    <View style={[styles.marker, { top: '30%', left: '45%' }]}>
                        <Ionicons name="location" size={32} color="#0A5F5A" />
                    </View>
                    <View style={[styles.marker, { top: '25%', left: '30%' }]}>
                        <Ionicons name="location" size={32} color="#0A5F5A" />
                    </View>
                    <View style={[styles.marker, { top: '45%', left: '35%' }]}>
                        <Ionicons name="location" size={32} color="#0A5F5A" />
                    </View>
                    <View style={[styles.marker, { top: '55%', left: '50%' }]}>
                        <Ionicons name="location" size={32} color="#0A5F5A" />
                    </View>
                    <View style={[styles.marker, { top: '65%', left: '60%' }]}>
                        <Ionicons name="location" size={32} color="#0A5F5A" />
                    </View>

                    {/* Current Location Button */}
                    <TouchableOpacity style={styles.locationButton}>
                        <Ionicons name="navigate" size={24} color="#0A5F5A" />
                    </TouchableOpacity>
                </View>

                {/* Destination Card */}
                <View style={styles.destinationCard}>
                    <Image
                        source={{ uri: selectedDestination.image }}
                        style={styles.destinationImage}
                    />
                    <View style={styles.destinationInfo}>
                        <Text style={styles.destinationName}>{selectedDestination.name}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFA500" />
                            <Text style={styles.ratingText}>
                                {selectedDestination.rating} ({selectedDestination.reviews})
                            </Text>
                        </View>
                        <Text style={styles.budgetText}>
                            Est. Budget: <Text style={styles.budgetAmount}>{selectedDestination.budget}</Text>
                        </Text>
                    </View>
                    <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
                            <Text style={styles.detailsButtonText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.planButton} onPress={handlePlanTrip}>
                            <Text style={styles.planButtonText}>Plan Trip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    searchContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        gap: 8,
        zIndex: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    weatherBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    weatherText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
    },
    locationButton: {
        position: 'absolute',
        bottom: 180,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    destinationCard: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    destinationImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginBottom: 12,
    },
    destinationInfo: {
        marginBottom: 12,
    },
    destinationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
    },
    budgetText: {
        fontSize: 13,
        color: '#666',
    },
    budgetAmount: {
        fontWeight: '600',
        color: '#333',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    planButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#0A5F5A',
        alignItems: 'center',
    },
    planButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
});
