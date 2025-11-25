import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock accommodation data
const accommodations = [
    {
        id: 1,
        name: 'Hôtel de la Gare',
        rating: 4.5,
        reviews: 500,
        pricePerNight: 120,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        citation: '[cite: 30, 76, 79]',
    },
    {
        id: 2,
        name: 'Cozy Apartment Near Eiffel Tower',
        rating: 4.8,
        reviews: 250,
        pricePerNight: 150,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
        citation: '[cite: 30, 79]',
    },
    {
        id: 3,
        name: 'Luxury Suite with City View',
        rating: 4.9,
        reviews: 380,
        pricePerNight: 220,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
        citation: '[cite: 31, 80]',
    },
];

export default function AccommodationBookingScreen() {
    const router = useRouter();
    const [showMap, setShowMap] = useState(false);

    const handleViewDetails = (accommodation: any) => {
        console.log('View details for:', accommodation.name);
        // Navigate to accommodation details page
    };

    const handleSendBookingRequest = (accommodation: any) => {
        console.log('Send booking request for:', accommodation.name);
        // Navigate to booking confirmation or chat
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Accommodation Booking</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={18} color="#333" />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
                <View style={styles.mapToggle}>
                    <Text style={styles.mapToggleText}>Map</Text>
                    <Switch
                        value={showMap}
                        onValueChange={setShowMap}
                        trackColor={{ false: '#D0D0D0', true: '#4ECDC4' }}
                        thumbColor="#FFF"
                    />
                </View>
            </View>

            {/* Accommodation List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {accommodations.map((accommodation) => (
                    <View key={accommodation.id} style={styles.accommodationCard}>
                        {/* Image */}
                        <Image
                            source={{ uri: accommodation.image }}
                            style={styles.accommodationImage}
                        />

                        {/* Info */}
                        <View style={styles.accommodationInfo}>
                            <Text style={styles.accommodationName}>{accommodation.name}</Text>

                            {/* Rating */}
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#FFA500" />
                                <Text style={styles.ratingText}>
                                    {accommodation.rating} ({accommodation.reviews} reviews)
                                </Text>
                            </View>

                            {/* Price */}
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceLabel}>from </Text>
                                <Text style={styles.priceAmount}>${accommodation.pricePerNight}</Text>
                                <Text style={styles.priceLabel}>/night</Text>
                            </View>

                            {/* Citation */}
                            <Text style={styles.citation}>{accommodation.citation}</Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => handleViewDetails(accommodation)}
                            >
                                <Text style={styles.detailsButtonText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bookingButton}
                                onPress={() => handleSendBookingRequest(accommodation)}
                            >
                                <Text style={styles.bookingButtonText}>Send Booking Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Load More */}
                <TouchableOpacity style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>Load More</Text>
                    <Ionicons name="chevron-down" size={20} color="#4ECDC4" />
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginLeft: 12,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: '#FFF',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    mapToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mapToggleText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    accommodationCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    accommodationImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#F0F0F0',
    },
    accommodationInfo: {
        padding: 12,
    },
    accommodationName: {
        fontSize: 16,
        fontWeight: '600',
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    priceLabel: {
        fontSize: 13,
        color: '#666',
    },
    priceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    citation: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        paddingTop: 0,
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
    bookingButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#0A5F5A',
        alignItems: 'center',
    },
    bookingButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        marginVertical: 16,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
});
