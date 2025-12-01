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

// Mock Data
const destination = {
    id: 1,
    name: 'Santorini, Greece',
    description:
        'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater).',
    rating: 4.8,
    reviews: 3240,
    weather: '24°C',
    images: [
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    ],
    thingsToDo: [
        { id: 1, title: 'Oia Sunset', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80' },
        { id: 2, title: 'Red Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
        { id: 3, title: 'Wine Tasting', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
    ],
};

export default function DestinationDetailsScreen() {
    const router = useRouter();

    const renderImageItem = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.galleryImage} />
    );

    const renderThingToDo = ({ item }: { item: { id: number; title: string; image: string } }) => (
        <View style={styles.thingCard}>
            <Image source={{ uri: item.image }} style={styles.thingImage} />
            <Text style={styles.thingTitle}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: destination.images[0] }} style={styles.heroImage} />
                    <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="share-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="heart-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <View style={styles.heroContent}>
                        <Text style={styles.destinationName}>{destination.name}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{destination.rating}</Text>
                            <Text style={styles.reviewsText}>({destination.reviews} reviews)</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Weather & Info */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="sunny-outline" size={24} color="#4ECDC4" />
                            <Text style={styles.infoLabel}>Weather</Text>
                            <Text style={styles.infoValue}>{destination.weather}</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                            <Ionicons name="airplane-outline" size={24} color="#4ECDC4" />
                            <Text style={styles.infoLabel}>Flights</Text>
                            <Text style={styles.infoValue}>From $450</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={24} color="#4ECDC4" />
                            <Text style={styles.infoLabel}>Duration</Text>
                            <Text style={styles.infoValue}>5-7 Days</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.descriptionText}>{destination.description}</Text>
                    </View>

                    {/* Gallery */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Gallery</Text>
                        <FlatList
                            data={destination.images}
                            renderItem={renderImageItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.galleryList}
                        />
                    </View>

                    {/* Things to Do */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Things to Do</Text>
                        <FlatList
                            data={destination.thingsToDo}
                            renderItem={renderThingToDo}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.thingsList}
                        />
                    </View>
                </View>

                {/* Bottom Padding for Button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Avg. Price</Text>
                    <Text style={styles.priceValue}>$250<Text style={styles.priceUnit}>/night</Text></Text>
                </View>
                <TouchableOpacity
                    style={styles.findButton}
                    onPress={() => router.push('/select-dates')}
                >
                    <Text style={styles.findButtonText}>Find Accommodation</Text>
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
    heroContainer: {
        height: 400,
        position: 'relative',
    },
    heroImage: {
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', // Note: React Native doesn't support linear-gradient like this natively without a library, but for simplicity in this file we'll just use a background color with opacity or rely on the image. For better UI, we'd use expo-linear-gradient.
        backgroundColor: 'rgba(0,0,0,0.4)', // Fallback
    },
    destinationName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    reviewsText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 16,
    },
    infoItem: {
        alignItems: 'center',
        flex: 1,
    },
    infoDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E0E0E0',
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
    },
    galleryList: {
        paddingRight: 20,
    },
    galleryImage: {
        width: 150,
        height: 100,
        borderRadius: 12,
        marginRight: 12,
    },
    thingsList: {
        paddingRight: 20,
    },
    thingCard: {
        marginRight: 16,
        width: 140,
    },
    thingImage: {
        width: 140,
        height: 140,
        borderRadius: 16,
        marginBottom: 8,
    },
    thingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
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
    priceLabel: {
        fontSize: 12,
        color: '#666',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    priceUnit: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
    findButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    findButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
