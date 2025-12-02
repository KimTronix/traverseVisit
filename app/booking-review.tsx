import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingReviewScreen() {
    const router = useRouter();

    // Mock booking data
    const bookingDetails = {
        property: {
            title: 'Luxury Cliffside Villa with Infinity Pool',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
            rating: 4.9,
            reviews: 128,
            type: 'Entire villa',
        },
        dates: {
            checkIn: 'Oct 15',
            checkOut: 'Oct 20',
            nights: 5,
        },
        guests: {
            adults: 2,
            children: 0,
            infants: 0,
        },
        price: {
            perNight: 450,
            cleaningFee: 150,
            serviceFee: 85,
            taxes: 45,
        },
    };

    const total =
        (bookingDetails.price.perNight * bookingDetails.dates.nights) +
        bookingDetails.price.cleaningFee +
        bookingDetails.price.serviceFee +
        bookingDetails.price.taxes;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Booking</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Property Summary */}
                <View style={styles.card}>
                    <View style={styles.propertyRow}>
                        <Image source={{ uri: bookingDetails.property.image }} style={styles.propertyImage} />
                        <View style={styles.propertyInfo}>
                            <Text style={styles.propertyType}>{bookingDetails.property.type}</Text>
                            <Text style={styles.propertyTitle} numberOfLines={2}>{bookingDetails.property.title}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>{bookingDetails.property.rating}</Text>
                                <Text style={styles.reviewsText}>({bookingDetails.property.reviews})</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Trip Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Trip</Text>

                    <View style={styles.detailRow}>
                        <View>
                            <Text style={styles.detailLabel}>Dates</Text>
                            <Text style={styles.detailValue}>
                                {bookingDetails.dates.checkIn} - {bookingDetails.dates.checkOut}
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                        <View>
                            <Text style={styles.detailLabel}>Guests</Text>
                            <Text style={styles.detailValue}>
                                {bookingDetails.guests.adults} guests
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                            ${bookingDetails.price.perNight} x {bookingDetails.dates.nights} nights
                        </Text>
                        <Text style={styles.priceValue}>
                            ${bookingDetails.price.perNight * bookingDetails.dates.nights}
                        </Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Cleaning fee</Text>
                        <Text style={styles.priceValue}>${bookingDetails.price.cleaningFee}</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Service fee</Text>
                        <Text style={styles.priceValue}>${bookingDetails.price.serviceFee}</Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxes</Text>
                        <Text style={styles.priceValue}>${bookingDetails.price.taxes}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total (USD)</Text>
                        <Text style={styles.totalValue}>${total}</Text>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    <Text style={styles.policyText}>
                        Free cancellation before Oct 10. Cancel before check-in on Oct 15 for a partial refund.
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.readMoreText}>Read more</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.push('/payment-method')}
                >
                    <Text style={styles.continueButtonText}>Continue to Payment</Text>
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
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    propertyRow: {
        flexDirection: 'row',
        gap: 16,
    },
    propertyImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    propertyInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    propertyType: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        lineHeight: 22,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    reviewsText: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        color: '#666',
    },
    editText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textDecorationLine: 'underline',
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginBottom: 24,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 16,
        color: '#666',
    },
    priceValue: {
        fontSize: 16,
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    policyText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    readMoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textDecorationLine: 'underline',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    continueButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
