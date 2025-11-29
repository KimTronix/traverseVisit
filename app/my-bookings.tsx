import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import StandardHeader from '../components/StandardHeader';

interface Booking {
    id: string;
    propertyId: string;
    propertyName: string;
    propertyImage: string;
    location: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
    totalAmount: number;
    currency: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    bookingDate: string;
    hostName: string;
    canCancel: boolean;
    canModify: boolean;
    reviewSubmitted: boolean;
}

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function MyBookingsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        loadBookings();
        
        // If a specific booking ID is passed, highlight it
        if (params.bookingId) {
            // In a real app, you'd scroll to and highlight this booking
            console.log('Highlight booking:', params.bookingId);
        }
    }, [params.bookingId]);

    const loadBookings = async () => {
        setLoading(true);
        
        // Mock data - in a real app, this would fetch from an API
        const mockBookings: Booking[] = [
            {
                id: 'BK123456789',
                propertyId: '1',
                propertyName: 'Luxury Beachfront Villa',
                propertyImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
                location: 'Malibu, California',
                checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                guests: { adults: 2, children: 0, infants: 0 },
                totalAmount: 1350.00,
                currency: 'USD',
                status: 'upcoming',
                bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                hostName: 'Sarah Johnson',
                canCancel: true,
                canModify: true,
                reviewSubmitted: false,
            },
            {
                id: 'BK987654321',
                propertyId: '2',
                propertyName: 'Mountain View Cabin',
                propertyImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
                location: 'Aspen, Colorado',
                checkIn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
                checkOut: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
                guests: { adults: 4, children: 2, infants: 0 },
                totalAmount: 2100.00,
                currency: 'USD',
                status: 'upcoming',
                bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                hostName: 'Mike Wilson',
                canCancel: true,
                canModify: true,
                reviewSubmitted: false,
            },
            {
                id: 'BK456789123',
                propertyId: '3',
                propertyName: 'Downtown Loft',
                propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
                location: 'New York City',
                checkIn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                checkOut: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
                guests: { adults: 2, children: 0, infants: 0 },
                totalAmount: 890.00,
                currency: 'USD',
                status: 'completed',
                bookingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                hostName: 'Emily Chen',
                canCancel: false,
                canModify: false,
                reviewSubmitted: false,
            },
            {
                id: 'BK789123456',
                propertyId: '4',
                propertyName: 'Beach House',
                propertyImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
                location: 'Miami Beach',
                checkIn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                checkOut: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
                guests: { adults: 3, children: 1, infants: 0 },
                totalAmount: 1650.00,
                currency: 'USD',
                status: 'completed',
                bookingDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
                hostName: 'Carlos Rodriguez',
                canCancel: false,
                canModify: false,
                reviewSubmitted: true,
            },
            {
                id: 'BK321654987',
                propertyId: '5',
                propertyName: 'City Apartment',
                propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
                location: 'San Francisco',
                checkIn: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                checkOut: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
                guests: { adults: 2, children: 0, infants: 0 },
                totalAmount: 750.00,
                currency: 'USD',
                status: 'cancelled',
                bookingDate: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
                hostName: 'David Kim',
                canCancel: false,
                canModify: false,
                reviewSubmitted: false,
            },
        ];

        setBookings(mockBookings);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatDateRange = (checkIn: string, checkOut: string) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        const checkInFormatted = checkInDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        
        const checkOutFormatted = checkOutDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        
        return `${checkInFormatted} - ${checkOutFormatted}`;
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getTotalGuests = (guests: Booking['guests']) => {
        return guests.adults + guests.children + guests.infants;
    };

    const getDaysUntil = (checkIn: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(checkIn);
        checkInDate.setHours(0, 0, 0, 0);
        const diffTime = checkInDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return '';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `in ${diffDays} days`;
    };

    const getBookingStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'upcoming': return '#007AFF';
            case 'ongoing': return '#00C851';
            case 'completed': return '#666';
            case 'cancelled': return '#FF3B30';
            default: return '#666';
        }
    };

    const getBookingStatusText = (status: Booking['status']) => {
        switch (status) {
            case 'upcoming': return 'Upcoming';
            case 'ongoing': return 'Ongoing';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const handleViewDetails = (booking: Booking) => {
        // Navigate to property details since booking-details doesn't exist
        router.push({
            pathname: '/property-details',
            params: { id: booking.propertyId }
        } as any);
    };

    const handleCancelBooking = (booking: Booking) => {
        Alert.alert(
            'Cancel Booking',
            `Are you sure you want to cancel your booking at ${booking.propertyName}? Cancellation policies may apply.`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                        // In a real app, this would call an API to cancel
                        Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
                        loadBookings();
                    }
                }
            ]
        );
    };

    const handleModifyBooking = (booking: Booking) => {
        Alert.alert(
            'Modify Booking',
            'This feature will allow you to change dates or guest count. Coming soon!',
            [{ text: 'OK' }]
        );
    };

    const handleContactHost = (booking: Booking) => {
        Alert.alert(
            'Contact Host',
            `This will open a chat with ${booking.hostName}. Coming soon!`,
            [{ text: 'OK' }]
        );
    };

    const handleLeaveReview = (booking: Booking) => {
        // Navigate to property details since leave-review doesn't exist
        Alert.alert('Review', 'Review functionality will be available soon. For now, you can view the property details.');
        router.push({
            pathname: '/property-details',
            params: { id: booking.propertyId }
        } as any);
    };

    const handleBookAgain = (booking: Booking) => {
        router.push({
            pathname: '/property-details',
            params: { id: booking.propertyId }
        } as any);
    };

    const getFilteredBookings = () => {
        const now = new Date();
        
        return bookings.filter(booking => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            
            switch (activeTab) {
                case 'upcoming':
                    return booking.status === 'upcoming' || booking.status === 'ongoing';
                case 'past':
                    return booking.status === 'completed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                default:
                    return true;
            }
        });
    };

    const renderBookingCard = (booking: Booking) => (
        <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <Image source={{ uri: booking.propertyImage }} style={styles.propertyImage} />
                <View style={styles.bookingInfo}>
                    <Text style={styles.propertyName}>{booking.propertyName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color="#666" />
                        <Text style={styles.locationText}>{booking.location}</Text>
                    </View>
                    <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={[styles.statusText, { color: getBookingStatusColor(booking.status) }]}>
                        {getBookingStatusText(booking.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {formatDateRange(booking.checkIn, booking.checkOut)}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>
                            {getTotalGuests(booking.guests)} guests
                        </Text>
                    </View>
                </View>
                
                <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                        {formatCurrency(booking.totalAmount, booking.currency)}
                    </Text>
                    {booking.status === 'upcoming' && (
                        <Text style={styles.daysUntil}>
                            {getDaysUntil(booking.checkIn)}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.primaryActionButton}
                    onPress={() => handleViewDetails(booking)}
                >
                    <Text style={styles.primaryActionText}>View Details</Text>
                </TouchableOpacity>

                {booking.status === 'upcoming' && (
                    <>
                        {booking.canCancel && (
                            <TouchableOpacity 
                                style={styles.secondaryActionButton}
                                onPress={() => handleCancelBooking(booking)}
                            >
                                <Text style={styles.secondaryActionText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        {booking.canModify && (
                            <TouchableOpacity 
                                style={styles.secondaryActionButton}
                                onPress={() => handleModifyBooking(booking)}
                            >
                                <Text style={styles.secondaryActionText}>Modify</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                {booking.status === 'completed' && !booking.reviewSubmitted && (
                    <TouchableOpacity 
                        style={styles.reviewActionButton}
                        onPress={() => handleLeaveReview(booking)}
                    >
                        <Ionicons name="star" size={16} color="#FFB800" />
                        <Text style={styles.reviewActionText}>Leave Review</Text>
                    </TouchableOpacity>
                )}

                {booking.status === 'completed' && (
                    <TouchableOpacity 
                        style={styles.secondaryActionButton}
                        onPress={() => handleBookAgain(booking)}
                    >
                        <Text style={styles.secondaryActionText}>Book Again</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactHost(booking)}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#007AFF" />
                    <Text style={styles.contactButtonText}>Contact Host</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredBookings = getFilteredBookings();

    return (
        <SafeAreaView style={styles.container}>
            <StandardHeader 
                title="My Bookings" 
                onNotificationsPress={() => router.push('/notifications-list' as any)}
                onMessagesPress={() => router.push('/(tabs)/messages' as any)}
            />

            {/* Tabs */}
            <View style={styles.tabs}>
                {(['upcoming', 'past', 'cancelled'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading bookings...</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {filteredBookings.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyStateTitle}>No {activeTab} bookings</Text>
                            <Text style={styles.emptyStateDescription}>
                                {activeTab === 'upcoming' 
                                    ? 'You don\'t have any upcoming bookings. Start exploring destinations!'
                                    : activeTab === 'past'
                                    ? 'You don\'t have any past bookings yet.'
                                    : 'You don\'t have any cancelled bookings.'
                                }
                            </Text>
                            {activeTab === 'upcoming' && (
                                <TouchableOpacity 
                                    style={styles.exploreButton}
                                    onPress={() => router.push('/(tabs)/explore')}
                                >
                                    <Text style={styles.exploreButtonText}>Explore Destinations</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.bookingsList}>
                            {filteredBookings.map(renderBookingCard)}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        paddingVertical: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
        lineHeight: 24,
    },
    exploreButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bookingsList: {
        gap: 16,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    bookingHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    propertyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    bookingInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    propertyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    bookingId: {
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bookingDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    daysUntil: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    primaryActionButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    secondaryActionButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    secondaryActionText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    reviewActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFB800',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 4,
    },
    reviewActionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 4,
    },
    contactButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
});
