import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Property {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    reviewCount: number;
    pricePerNight: number;
    images: string[];
    description: string;
    amenities: string[];
    houseRules: string[];
    host: {
        name: string;
        photo: string;
        joinedDate: string;
        isSuperhost: boolean;
        responseRate: number;
    };
    reviews: Review[];
    coordinates: {
        lat: number;
        lng: number;
    };
}

interface Review {
    id: string;
    user: string;
    userPhoto: string;
    rating: number;
    date: string;
    comment: string;
}

export default function PropertyDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Mock property data - in real app, this would be fetched based on params.id
    const property: Property = {
        id: params.id as string || '1',
        name: 'Luxury Beachfront Villa',
        type: 'Entire villa',
        location: 'Malibu, California',
        rating: 4.9,
        reviewCount: 128,
        pricePerNight: 450,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        description: 'Experience luxury living in this stunning beachfront villa with panoramic ocean views. This modern architectural masterpiece features floor-to-ceiling windows, private beach access, and a infinity pool overlooking the Pacific Ocean. Perfect for romantic getaways or family vacations.',
        amenities: [
            'WiFi',
            'Kitchen',
            'Free parking',
            'Pool',
            'Beach access',
            'Air conditioning',
            'TV',
            'Washer',
            'Dryer',
            'Essentials',
            'Hot water',
            'Beach towels',
            'Outdoor grill',
            'Fire pit',
            'Ocean view',
            'Sun deck',
        ],
        houseRules: [
            'Check-in: 3:00 PM - 8:00 PM',
            'Checkout: 11:00 AM',
            'No smoking',
            'No parties',
            'No pets',
            'Quiet hours: 10 PM - 8 AM',
        ],
        host: {
            name: 'Sarah Johnson',
            photo: 'https://i.pravatar.cc/150?img=28',
            joinedDate: 'January 2020',
            isSuperhost: true,
            responseRate: 98,
        },
        reviews: [
            {
                id: '1',
                user: 'Michael Chen',
                userPhoto: 'https://i.pravatar.cc/150?img=32',
                rating: 5,
                date: '2 weeks ago',
                comment: 'Absolutely stunning property! The views were breathtaking and the host was incredibly responsive. Would definitely stay here again.',
            },
            {
                id: '2',
                user: 'Emma Wilson',
                userPhoto: 'https://i.pravatar.cc/150?img=44',
                rating: 5,
                date: '1 month ago',
                comment: 'Perfect weekend getaway. The villa was immaculate and had everything we needed. Beach access was a huge plus!',
            },
            {
                id: '3',
                user: 'David Martinez',
                userPhoto: 'https://i.pravatar.cc/150?img=68',
                rating: 4,
                date: '2 months ago',
                comment: 'Beautiful property with amazing views. Only minor issue was the WiFi was a bit slow, but everything else was perfect.',
            },
        ],
        coordinates: {
            lat: 34.0259,
            lng: -118.7798,
        },
    };

    const handleImageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentImageIndex((prev) => prev === 0 ? property.images.length - 1 : prev - 1);
        } else {
            setCurrentImageIndex((prev) => prev === property.images.length - 1 ? 0 : prev + 1);
        }
    };

    const handleBookNow = () => {
        router.push({
            pathname: '/select-dates',
            params: {
                propertyId: property.id,
                destination: property.location,
            }
        });
    };

    const handleContactHost = () => {
        Alert.alert('Contact Host', 'This feature will open a chat with the host. Coming soon!');
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this amazing property: ${property.name} in ${property.location}`,
                url: `traverse://property/${property.id}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleViewMap = () => {
        Alert.alert('Map View', 'This will open the map view. Coming soon!');
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Ionicons key={i} name="star" size={16} color="#FFB800" />);
        }
        if (hasHalfStar) {
            stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFB800" />);
        }
        for (let i = stars.length; i < 5; i++) {
            stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFB800" />);
        }

        return stars;
    };

    const renderAmenities = () => {
        const amenitiesToShow = showAllAmenities ? property.amenities : property.amenities.slice(0, 8);
        
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesGrid}>
                    {amenitiesToShow.map((amenity, index) => (
                        <View key={index} style={styles.amenityItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#00C851" />
                            <Text style={styles.amenityText}>{amenity}</Text>
                        </View>
                    ))}
                </View>
                {property.amenities.length > 8 && (
                    <TouchableOpacity 
                        style={styles.showMoreButton}
                        onPress={() => setShowAllAmenities(!showAllAmenities)}
                    >
                        <Text style={styles.showMoreText}>
                            {showAllAmenities ? 'Show less' : `Show all ${property.amenities.length} amenities`}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderReviews = () => {
        const reviewsToShow = showAllReviews ? property.reviews : property.reviews.slice(0, 2);
        
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <View style={styles.ratingSummary}>
                        <Text style={styles.ratingValue}>{property.rating}</Text>
                        <View style={styles.ratingStars}>
                            {renderStars(property.rating)}
                        </View>
                        <Text style={styles.reviewCount}>({property.reviewCount} reviews)</Text>
                    </View>
                </View>
                
                {reviewsToShow.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image source={{ uri: review.userPhoto }} style={styles.reviewUserPhoto} />
                            <View style={styles.reviewUserInfo}>
                                <Text style={styles.reviewUserName}>{review.user}</Text>
                                <View style={styles.reviewRating}>
                                    {renderStars(review.rating)}
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                    </View>
                ))}
                
                {property.reviews.length > 2 && (
                    <TouchableOpacity 
                        style={styles.showMoreButton}
                        onPress={() => setShowAllReviews(!showAllReviews)}
                    >
                        <Text style={styles.showMoreText}>
                            {showAllReviews ? 'Show less' : `Show all ${property.reviews.length} reviews`}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                ref={scrollViewRef}
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Gallery */}
                <View style={styles.imageGallery}>
                    <TouchableOpacity 
                        style={styles.imageButton}
                        onPress={() => handleImageChange('prev')}
                    >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <Image 
                        source={{ uri: property.images[currentImageIndex] }} 
                        style={styles.mainImage}
                    />
                    
                    <TouchableOpacity 
                        style={styles.imageButton}
                        onPress={() => handleImageChange('next')}
                    >
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <View style={styles.imageIndicator}>
                        <Text style={styles.imageIndicatorText}>
                            {currentImageIndex + 1} / {property.images.length}
                        </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Ionicons name="share-outline" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Property Info */}
                <View style={styles.propertyInfo}>
                    <View style={styles.propertyHeader}>
                        <View style={styles.propertyTitleRow}>
                            <Text style={styles.propertyName}>{property.name}</Text>
                            <TouchableOpacity style={styles.heartButton}>
                                <Ionicons name="heart-outline" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.propertyMeta}>
                            <View style={styles.ratingContainer}>
                                <View style={styles.ratingStars}>
                                    {renderStars(property.rating)}
                                </View>
                                <Text style={styles.ratingText}>{property.rating}</Text>
                                <Text style={styles.reviewCountText}>({property.reviewCount})</Text>
                            </View>
                            <Text style={styles.propertyType}>{property.type}</Text>
                        </View>
                        
                        <View style={styles.locationContainer}>
                            <Ionicons name="location" size={16} color="#666" />
                            <Text style={styles.locationText}>{property.location}</Text>
                        </View>
                    </View>

                    {/* Host Info */}
                    <View style={styles.hostCard}>
                        <Image source={{ uri: property.host.photo }} style={styles.hostPhoto} />
                        <View style={styles.hostInfo}>
                            <Text style={styles.hostName}>Hosted by {property.host.name}</Text>
                            <Text style={styles.hostJoined}>Joined in {property.host.joinedDate}</Text>
                            <View style={styles.hostStats}>
                                {property.host.isSuperhost && (
                                    <View style={styles.superhostBadge}>
                                        <Ionicons name="star" size={12} color="#fff" />
                                        <Text style={styles.superhostText}>Superhost</Text>
                                    </View>
                                )}
                                <Text style={styles.responseRate}>
                                    {property.host.responseRate}% response rate
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.contactHostButton} onPress={handleContactHost}>
                            <Text style={styles.contactHostText}>Contact</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this place</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {/* Amenities */}
                    {renderAmenities()}

                    {/* House Rules */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>House rules</Text>
                        <View style={styles.rulesList}>
                            {property.houseRules.map((rule, index) => (
                                <View key={index} style={styles.ruleItem}>
                                    <Ionicons name="information-circle-outline" size={16} color="#666" />
                                    <Text style={styles.ruleText}>{rule}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <TouchableOpacity style={styles.mapPreview} onPress={handleViewMap}>
                            <View style={styles.mapPlaceholder}>
                                <Ionicons name="map" size={40} color="#ccc" />
                                <Text style={styles.mapPlaceholderText}>Show map</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.locationDescription}>
                            Located in the heart of Malibu, this villa offers easy access to beaches, restaurants, and shopping while maintaining privacy and stunning ocean views.
                        </Text>
                    </View>

                    {/* Reviews */}
                    {renderReviews()}
                </View>

                {/* Bottom padding for sticky button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Booking Bar */}
            <View style={styles.bookingBar}>
                <View style={styles.priceInfo}>
                    <Text style={styles.price}>${property.pricePerNight}</Text>
                    <Text style={styles.priceUnit}>/ night</Text>
                </View>
                <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
                    <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    imageGallery: {
        position: 'relative',
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButton: {
        left: 20,
    },
    imageButton: {
        right: 20,
    },
    imageIndicator: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    imageIndicatorText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    shareButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    propertyInfo: {
        padding: 20,
    },
    propertyHeader: {
        marginBottom: 24,
    },
    propertyTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    propertyName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 16,
    },
    heartButton: {
        padding: 8,
    },
    propertyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingStars: {
        flexDirection: 'row',
        marginRight: 4,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
    },
    reviewCountText: {
        fontSize: 14,
        color: '#666',
    },
    propertyType: {
        fontSize: 14,
        color: '#666',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    hostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    hostPhoto: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    hostInfo: {
        flex: 1,
    },
    hostName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    hostJoined: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    hostStats: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    superhostBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF385C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    superhostText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    responseRate: {
        fontSize: 12,
        color: '#666',
    },
    contactHostButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    contactHostText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginRight: 8,
    },
    ratingStars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    amenityText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    showMoreButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
    showMoreText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    rulesList: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 4,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
    },
    ruleText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
    mapPreview: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
    },
    locationDescription: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    reviewCard: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewUserPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewUserInfo: {
        flex: 1,
    },
    reviewUserName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    reviewRating: {
        flexDirection: 'row',
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    bookingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    priceInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    priceUnit: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    bookNowButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    bookNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
