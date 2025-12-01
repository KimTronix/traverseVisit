import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock Property Data
const property = {
    id: 1,
    title: 'Luxury Cliffside Villa with Infinity Pool',
    location: 'Oia, Santorini',
    rating: 4.9,
    reviews: 128,
    host: {
        name: 'Elena',
        image: 'https://i.pravatar.cc/150?img=5',
        joined: 'Joined 2019',
        superhost: true,
    },
    description:
        'Experience the magic of Santorini from this stunning cliffside villa. Featuring a private infinity pool with breathtaking caldera views, this traditional cave house has been luxuriously renovated with modern amenities while preserving its authentic charm.',
    price: 450,
    images: [
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        'https://images.unsplash.com/photo-1512918760513-95f1929c3d09?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-27b5c6b8e600?w=800&q=80',
    ],
    amenities: [
        { icon: 'wifi', name: 'Fast Wifi' },
        { icon: 'water', name: 'Pool' },
        { icon: 'snow', name: 'AC' },
        { icon: 'restaurant', name: 'Kitchen' },
        { icon: 'desktop', name: 'Workspace' },
        { icon: 'car', name: 'Parking' },
    ],
    rules: [
        'Check-in: 3:00 PM - 8:00 PM',
        'Checkout: 11:00 AM',
        'No smoking',
        'No parties or events',
    ],
};

export default function PropertyDetailsScreen() {
    const router = useRouter();

    const renderImageItem = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.galleryImage} />
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: property.images[0] }} style={styles.mainImage} />
                    <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="share-outline" size={24} color="#333" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="heart-outline" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <View style={styles.imageCounter}>
                        <Text style={styles.imageCounterText}>1 / {property.images.length}</Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Title & Location */}
                    <Text style={styles.title}>{property.title}</Text>
                    <Text style={styles.location}>{property.location}</Text>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{property.rating}</Text>
                        <Text style={styles.reviewsText}>({property.reviews} reviews)</Text>
                        {property.host.superhost && (
                            <>
                                <Text style={styles.dot}>•</Text>
                                <Ionicons name="medal-outline" size={16} color="#FF6B6B" />
                                <Text style={styles.superhostText}>Superhost</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Host Info */}
                    <View style={styles.hostRow}>
                        <Image source={{ uri: property.host.image }} style={styles.hostImage} />
                        <View style={styles.hostInfo}>
                            <Text style={styles.hostName}>Hosted by {property.host.name}</Text>
                            <Text style={styles.hostJoined}>{property.host.joined}</Text>
                        </View>
                        <TouchableOpacity style={styles.messageButton}>
                            <Ionicons name="chatbubble-outline" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this place</Text>
                        <Text style={styles.descriptionText}>{property.description}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Amenities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>What this place offers</Text>
                        <View style={styles.amenitiesGrid}>
                            {property.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Ionicons name={amenity.icon as any} size={24} color="#666" />
                                    <Text style={styles.amenityText}>{amenity.name}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.showAllButton}>
                            <Text style={styles.showAllText}>Show all amenities</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* House Rules */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>House Rules</Text>
                        {property.rules.map((rule, index) => (
                            <View key={index} style={styles.ruleItem}>
                                <Ionicons name="alert-circle-outline" size={20} color="#666" />
                                <Text style={styles.ruleText}>{rule}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Map Placeholder */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Where you'll be</Text>
                        <View style={styles.mapPlaceholder}>
                            <Ionicons name="map" size={48} color="#CCC" />
                            <Text style={styles.mapText}>Map View</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceValue}>${property.price}</Text>
                        <Text style={styles.priceUnit}> / night</Text>
                    </View>
                    <Text style={styles.dateRange}>Oct 15 - 20</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => router.push('/booking-review')}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    imageCounterText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        lineHeight: 32,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
        textDecorationLine: 'underline',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    reviewsText: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
    },
    dot: {
        fontSize: 14,
        color: '#666',
    },
    superhostText: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 24,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    hostImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    hostInfo: {
        flex: 1,
        marginLeft: 16,
    },
    hostName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    hostJoined: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    messageButton: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    amenityItem: {
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    amenityText: {
        fontSize: 16,
        color: '#333',
    },
    showAllButton: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    showAllText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    ruleText: {
        fontSize: 16,
        color: '#333',
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    mapText: {
        marginTop: 8,
        color: '#999',
        fontSize: 16,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    priceContainer: {
        flex: 1,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    priceUnit: {
        fontSize: 16,
        color: '#333',
    },
    dateRange: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
        marginTop: 2,
    },
    bookButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
