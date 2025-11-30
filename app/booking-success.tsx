import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface BookingDetails {
    bookingId: string;
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
    status: 'confirmed' | 'pending' | 'cancelled';
    bookingDate: string;
    hostName: string;
    hostContact: string;
}

export default function BookingSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [scaleValue] = useState(new Animated.Value(0));

    useEffect(() => {
        // Trigger haptic feedback on mount
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Animate success icon
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        // Load booking details from params or generate mock data
        loadBookingDetails();
    }, []);

    const loadBookingDetails = () => {
        // In a real app, this would fetch booking details from an API
        // For now, we'll use the passed params or generate mock data
        const mockBooking: BookingDetails = {
            bookingId: params.bookingId as string || generateBookingId(),
            propertyId: params.propertyId as string || '1',
            propertyName: params.propertyName as string || 'Luxury Beachfront Villa',
            propertyImage: params.propertyImage as string || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            location: params.location as string || 'Malibu, California',
            checkIn: params.checkIn as string || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            checkOut: params.checkOut as string || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            guests: {
                adults: parseInt(params.adults as string) || 2,
                children: parseInt(params.children as string) || 0,
                infants: parseInt(params.infants as string) || 0,
            },
            totalAmount: parseFloat(params.totalAmount as string) || 1350.00,
            currency: params.currency as string || 'USD',
            status: 'confirmed',
            bookingDate: new Date().toISOString(),
            hostName: params.hostName as string || 'Sarah Johnson',
            hostContact: params.hostContact as string || 'sarah.j@example.com',
        };

        setBookingDetails(mockBooking);
    };

    const generateBookingId = () => {
        return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const handleViewBooking = () => {
        if (bookingDetails) {
            router.push({
                pathname: '/my-bookings',
                params: {
                    bookingId: bookingDetails.bookingId,
                }
            });
        }
    };

    const handleViewAllBookings = () => {
        router.push('/my-bookings');
    };

    const handleDownloadConfirmation = () => {
        Alert.alert(
            'Download Confirmation',
            'This will download a PDF confirmation of your booking. This feature is coming soon!',
            [{ text: 'OK' }]
        );
    };

    const handleShareBooking = async () => {
        if (!bookingDetails) return;

        try {
            await Share.share({
                message: `I just booked a trip to ${bookingDetails.location}! 🎉\n\nProperty: ${bookingDetails.propertyName}\nDates: ${formatDate(bookingDetails.checkIn)} - ${formatDate(bookingDetails.checkOut)}\nBooking ID: ${bookingDetails.bookingId}`,
                title: 'My Traverse-Visit Booking',
            });
        } catch (error) {
            console.error('Error sharing booking:', error);
        }
    };

    const handleBackToHome = () => {
        // Navigate back to the main tabs
        router.back();
    };

    const handleContactHost = () => {
        if (bookingDetails) {
            Alert.alert(
                'Contact Host',
                `You can reach your host at ${bookingDetails.hostContact}. Chat feature coming soon!`,
                [{ text: 'OK' }]
            );
        }
    };

    const getTotalGuests = () => {
        if (!bookingDetails) return 0;
        return bookingDetails.guests.adults + bookingDetails.guests.children + bookingDetails.guests.infants;
    };

    const calculateNights = () => {
        if (!bookingDetails) return 0;
        const checkIn = new Date(bookingDetails.checkIn);
        const checkOut = new Date(bookingDetails.checkOut);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (!bookingDetails) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading booking details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Success Animation */}
                <View style={styles.successContainer}>
                    <Animated.View
                        style={[
                            styles.successCircle,
                            {
                                transform: [{ scale: scaleValue }]
                            }
                        ]}
                    >
                        <Ionicons name="checkmark" size={60} color="#fff" />
                    </Animated.View>
                    <Text style={styles.successTitle}>Booking Confirmed!</Text>
                    <Text style={styles.successSubtitle}>
                        Your trip to {bookingDetails.location} is all set
                    </Text>
                </View>

                {/* Booking Reference */}
                <View style={styles.referenceCard}>
                    <Text style={styles.referenceLabel}>Booking Reference</Text>
                    <Text style={styles.referenceNumber}>{bookingDetails.bookingId}</Text>
                    <TouchableOpacity style={styles.copyButton} onPress={() => {
                        // Copy to clipboard functionality would go here
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Alert.alert('Copied!', 'Booking reference copied to clipboard');
                    }}>
                        <Ionicons name="copy-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                {/* Booking Details Card */}
                <View style={styles.bookingCard}>
                    <View style={styles.propertyHeader}>
                        <Image source={{ uri: bookingDetails.propertyImage }} style={styles.propertyImage} />
                        <View style={styles.propertyInfo}>
                            <Text style={styles.propertyName}>{bookingDetails.propertyName}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={16} color="#666" />
                                <Text style={styles.locationText}>{bookingDetails.location}</Text>
                            </View>
                            <Text style={styles.hostName}>Hosted by {bookingDetails.hostName}</Text>
                        </View>
                    </View>

                    <View style={styles.bookingDetails}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Check-in</Text>
                                    <Text style={styles.detailValue}>{formatDate(bookingDetails.checkIn)}</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Check-out</Text>
                                    <Text style={styles.detailValue}>{formatDate(bookingDetails.checkOut)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Ionicons name="people-outline" size={20} color="#007AFF" />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Guests</Text>
                                    <Text style={styles.detailValue}>{getTotalGuests()} guests</Text>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="moon-outline" size={20} color="#007AFF" />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Duration</Text>
                                    <Text style={styles.detailValue}>{calculateNights()} nights</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Total Paid</Text>
                            <Text style={styles.priceValue}>
                                {formatCurrency(bookingDetails.totalAmount, bookingDetails.currency)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Important Information */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Important Information</Text>
                    <View style={styles.infoItem}>
                        <Ionicons name="information-circle-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            Check-in time is 3:00 PM, checkout is 11:00 AM
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            Confirmation email sent to your registered email
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            Your booking is protected by our booking guarantee
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleViewBooking}
                    >
                        <Ionicons name="list-outline" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>View Booking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.viewAllBookingsButton}
                        onPress={handleViewAllBookings}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>View All Bookings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={handleDownloadConfirmation}
                    >
                        <Ionicons name="download-outline" size={20} color="#007AFF" />
                        <Text style={styles.secondaryButtonText}>Download Confirmation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.shareButton}
                        onPress={handleShareBooking}
                    >
                        <Ionicons name="share-outline" size={20} color="#007AFF" />
                        <Text style={styles.shareButtonText}>Share Booking</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Host */}
                <TouchableOpacity style={styles.contactHostButton} onPress={handleContactHost}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#007AFF" />
                    <Text style={styles.contactHostText}>Contact Your Host</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.backToHomeButton}
                    onPress={handleBackToHome}
                >
                    <Ionicons name="home-outline" size={20} color="#007AFF" />
                    <Text style={styles.backToHomeText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    successContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#00C851',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    referenceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    referenceLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    referenceNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    copyButton: {
        padding: 8,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    propertyHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    propertyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    propertyInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    propertyName: {
        fontSize: 18,
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
    hostName: {
        fontSize: 14,
        color: '#666',
    },
    bookingDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailContent: {
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#007AFF',
    },
    infoCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
    actionButtons: {
        marginBottom: 24,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    viewAllBookingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
    contactHostButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    contactHostText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
    bottomBar: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    backToHomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    backToHomeText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
});
