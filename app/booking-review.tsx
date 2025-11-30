import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BookingReviewData {
    propertyId: string;
    propertyName: string;
    propertyImage: string;
    propertyLocation: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: {
        adults: number;
        children: number;
        infants: number;
    };
    pricePerNight: number;
    totalPrice: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
}

export default function BookingReviewScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Parse booking data from params or use defaults
    const bookingData: BookingReviewData = params.booking ? JSON.parse(params.booking as string) : {
        propertyId: '1',
        propertyName: 'Luxury Beachfront Villa',
        propertyImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
        propertyLocation: 'Malibu, California',
        checkIn: '2024-12-15',
        checkOut: '2024-12-20',
        nights: 5,
        guests: { adults: 2, children: 1, infants: 0 },
        pricePerNight: 350,
        totalPrice: 1925,
        cleaningFee: 75,
        serviceFee: 125,
        taxes: 100,
    };

    const [acceptedCancellation, setAcceptedCancellation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const calculateTotalGuests = (): number => {
        return bookingData.guests.adults + bookingData.guests.children + bookingData.guests.infants;
    };

    const handleContinue = () => {
        if (!acceptedCancellation) {
            Alert.alert('Cancellation Policy', 'Please review and accept the cancellation policy to continue.');
            return;
        }

        setIsLoading(true);
        
        // Navigate to payment method selection
        setTimeout(() => {
            setIsLoading(false);
            router.push({
                pathname: '/payment-method-selection',
                params: {
                    propertyId: bookingData.propertyId,
                    propertyName: bookingData.propertyName,
                    checkIn: bookingData.checkIn,
                    checkOut: bookingData.checkOut,
                    guests: `${calculateTotalGuests()} guests`,
                    totalPrice: bookingData.totalPrice.toString(),
                    nights: bookingData.nights.toString(),
                },
            });
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Review</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Property Card */}
                <View style={styles.propertyCard}>
                    <View style={styles.propertyImageContainer}>
                        <Image 
                            source={{ uri: bookingData.propertyImage }} 
                            style={styles.propertyImage} 
                        />
                    </View>
                    <View style={styles.propertyInfo}>
                        <Text style={styles.propertyName}>{bookingData.propertyName}</Text>
                        <View style={styles.propertyLocation}>
                            <Ionicons name="location-outline" size={16} color="#666" />
                            <Text style={styles.locationText}>{bookingData.propertyLocation}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.modifyButton}
                        onPress={() => router.push({
                            pathname: '/date-guests-selection',
                            params: {
                                booking: JSON.stringify(bookingData),
                                fromReview: 'true',
                            }
                        })}
                    >
                        <Ionicons name="create-outline" size={16} color="#4ECDC4" />
                        <Text style={styles.modifyButtonText}>Modify</Text>
                    </TouchableOpacity>
                </View>

                {/* Dates Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.sectionTitle}>Dates Summary</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <Text style={styles.dateValue}>{formatDate(bookingData.checkIn)}</Text>
                        </View>
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <Text style={styles.dateValue}>{formatDate(bookingData.checkOut)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.dateRow}>
                            <Text style={styles.dateLabel}>Duration</Text>
                            <Text style={styles.dateValue}>{bookingData.nights} nights</Text>
                        </View>
                    </View>
                </View>

                {/* Guests Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.sectionTitle}>Guests Summary</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={styles.guestRow}>
                            <Text style={styles.guestLabel}>Adults</Text>
                            <Text style={styles.guestValue}>{bookingData.guests.adults}</Text>
                        </View>
                        {bookingData.guests.children > 0 && (
                            <View style={styles.guestRow}>
                                <Text style={styles.guestLabel}>Children</Text>
                                <Text style={styles.guestValue}>{bookingData.guests.children}</Text>
                            </View>
                        )}
                        {bookingData.guests.infants > 0 && (
                            <View style={styles.guestRow}>
                                <Text style={styles.guestLabel}>Infants</Text>
                                <Text style={styles.guestValue}>{bookingData.guests.infants}</Text>
                            </View>
                        )}
                        <View style={styles.divider} />
                        <View style={styles.guestRow}>
                            <Text style={styles.guestLabelTotal}>Total Guests</Text>
                            <Text style={styles.guestValueTotal}>{calculateTotalGuests()}</Text>
                        </View>
                    </View>
                </View>

                {/* Price Breakdown */}
                <View style={styles.summarySection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="receipt-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.sectionTitle}>Price Breakdown</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>
                                ${bookingData.pricePerNight} x {bookingData.nights} nights
                            </Text>
                            <Text style={styles.priceValue}>
                                ${bookingData.pricePerNight * bookingData.nights}
                            </Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Cleaning fee</Text>
                            <Text style={styles.priceValue}>${bookingData.cleaningFee}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Service fee</Text>
                            <Text style={styles.priceValue}>${bookingData.serviceFee}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Taxes</Text>
                            <Text style={styles.priceValue}>${bookingData.taxes}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabelTotal}>Total Amount</Text>
                            <Text style={styles.priceValueTotal}>${bookingData.totalPrice}</Text>
                        </View>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <View style={styles.summarySection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    </View>
                    <View style={styles.cancellationCard}>
                        <View style={styles.policyItem}>
                            <View style={styles.policyHeader}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={styles.policyTitle}>Free Cancellation</Text>
                            </View>
                            <Text style={styles.policyText}>
                                Cancel up to 24 hours before check-in for a full refund
                            </Text>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyHeader}>
                                <Ionicons name="time" size={16} color="#FF9800" />
                                <Text style={styles.policyTitle}>50% Refund</Text>
                            </View>
                            <Text style={styles.policyText}>
                                Cancel between 24 hours and 72 hours before check-in
                            </Text>
                        </View>
                        <View style={styles.policyItem}>
                            <View style={styles.policyHeader}>
                                <Ionicons name="close-circle" size={16} color="#F44336" />
                                <Text style={styles.policyTitle}>No Refund</Text>
                            </View>
                            <Text style={styles.policyText}>
                                Cancel within 24 hours of check-in
                            </Text>
                        </View>
                        
                        {/* Acceptance Checkbox */}
                        <TouchableOpacity
                            style={styles.acceptanceRow}
                            onPress={() => setAcceptedCancellation(!acceptedCancellation)}
                        >
                            <View style={[styles.checkbox, acceptedCancellation && styles.checkboxChecked]}>
                                {acceptedCancellation && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                            <Text style={styles.acceptanceText}>
                                I have read and accept the cancellation policy
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        (!acceptedCancellation || isLoading) && styles.continueButtonDisabled
                    ]}
                    onPress={handleContinue}
                    disabled={!acceptedCancellation || isLoading}
                >
                    <Text style={styles.continueButtonText}>
                        {isLoading ? 'Processing...' : 'Continue to Payment'}
                    </Text>
                </TouchableOpacity>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    propertyCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    propertyImageContainer: {
        height: 180,
    },
    propertyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    propertyInfo: {
        padding: 16,
    },
    propertyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    propertyLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    modifyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F0F9FF',
        borderRadius: 8,
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    modifyButtonText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '500',
        marginLeft: 4,
    },
    summarySection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dateLabel: {
        fontSize: 14,
        color: '#666',
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    guestLabel: {
        fontSize: 14,
        color: '#666',
    },
    guestValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    guestLabelTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    guestValueTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    priceLabelTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    priceValueTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: 8,
    },
    cancellationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    policyItem: {
        marginBottom: 16,
    },
    policyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    policyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    policyText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 24,
        lineHeight: 18,
    },
    acceptanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    acceptanceText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    continueButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
