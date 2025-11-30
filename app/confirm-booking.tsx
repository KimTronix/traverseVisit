import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmBookingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedPayment, setSelectedPayment] = useState(params.paymentMethod as string || 'wallet');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Parse booking data from params or use defaults
    const bookingData = params.booking ? JSON.parse(params.booking as string) : {
        propertyName: 'Santorini Sunset Villa',
        checkIn: 'Oct 10',
        checkOut: 'Oct 15',
        nights: 5,
        totalPrice: 1200.00,
        propertyImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
        guests: { adults: 2, children: 0, infants: 0 },
        pricePerNight: 240.00,
        cleaningFee: 50.00,
        serviceFee: 75.00,
        taxes: 35.00,
    };

    const walletBalance = 2150.00;

    const handleAuthorizePayment = () => {
        if (!acceptedTerms) {
            Alert.alert('Terms Required', 'Please accept the terms and conditions to proceed with booking.');
            return;
        }

        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            
            // Generate booking reference
            const bookingReference = 'TV' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            // Navigate to booking success
            router.push({
                pathname: '/booking-success',
                params: {
                    bookingReference: bookingReference,
                    propertyName: bookingData.propertyName,
                    totalPrice: bookingData.totalPrice.toString(),
                    checkIn: bookingData.checkIn,
                    checkOut: bookingData.checkOut,
                    nights: bookingData.nights.toString(),
                },
            });
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Review</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Property Card */}
                <View style={styles.propertyCard}>
                    <Image
                        source={{ uri: bookingData.propertyImage }}
                        style={styles.propertyImage}
                    />
                    <View style={styles.propertyInfo}>
                        <Text style={styles.propertyName}>{bookingData.propertyName}</Text>
                        <View style={styles.propertyMeta}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.rating}>4.9</Text>
                            <Text style={styles.reviewCount}>(234 reviews)</Text>
                        </View>
                    </View>
                </View>

                {/* Booking Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>

                    {/* Dates Summary */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailLeft}>
                            <Ionicons name="calendar" size={20} color="#4ECDC4" />
                            <Text style={styles.detailLabel}>Dates</Text>
                        </View>
                        <Text style={styles.detailValue}>
                            {bookingData.checkIn} - {bookingData.checkOut}
                        </Text>
                    </View>

                    {/* Nights */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailLeft}>
                            <Ionicons name="moon" size={20} color="#4ECDC4" />
                            <Text style={styles.detailLabel}>Nights</Text>
                        </View>
                        <Text style={styles.detailValue}>{bookingData.nights} nights</Text>
                    </View>

                    {/* Guests Summary */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailLeft}>
                            <Ionicons name="people" size={20} color="#4ECDC4" />
                            <Text style={styles.detailLabel}>Guests</Text>
                        </View>
                        <Text style={styles.detailValue}>
                            {bookingData.guests ?
                                `${bookingData.guests.adults + bookingData.guests.children} guests` +
                                (bookingData.guests.infants > 0 ? `, ${bookingData.guests.infants} infants` : '') :
                                '2 guests'
                            }
                        </Text>
                    </View>
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Breakdown</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                            ${bookingData.pricePerNight} x {bookingData.nights} nights
                        </Text>
                        <Text style={styles.priceValue}>
                            ${(bookingData.pricePerNight * bookingData.nights).toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Cleaning fee</Text>
                        <Text style={styles.priceValue}>
                            ${bookingData.cleaningFee?.toFixed(2) || '50.00'}
                        </Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Service fee</Text>
                        <Text style={styles.priceValue}>
                            ${bookingData.serviceFee?.toFixed(2) || '75.00'}
                        </Text>
                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxes</Text>
                        <Text style={styles.priceValue}>
                            ${bookingData.taxes?.toFixed(2) || '35.00'}
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            ${bookingData.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    <View style={styles.policyCard}>
                        <View style={styles.policyHeader}>
                            <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
                            <Text style={styles.policyTitle}>Flexible</Text>
                        </View>
                        <Text style={styles.policyDescription}>
                            Free cancellation up to 24 hours before check-in. After that, the first night is non-refundable.
                        </Text>
                        <TouchableOpacity style={styles.policyLink}>
                            <Text style={styles.policyLinkText}>Learn more about cancellation</Text>
                            <Ionicons name="chevron-forward" size={16} color="#4ECDC4" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'wallet' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPayment('wallet')}
                    >
                        <View style={styles.paymentOptionLeft}>
                            <Ionicons name="wallet" size={24} color="#4ECDC4" />
                            <View style={styles.paymentOptionInfo}>
                                <Text style={styles.paymentOptionText}>
                                    My Wallet (${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} available)
                                </Text>
                            </View>
                        </View>
                        <View style={styles.radioButton}>
                            <View style={[styles.radioButtonInner, selectedPayment === 'wallet' && styles.radioButtonSelected]} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'card' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPayment('card')}
                    >
                        <View style={styles.paymentOptionLeft}>
                            <Ionicons name="card" size={24} color="#6366F1" />
                            <View style={styles.paymentOptionInfo}>
                                <Text style={styles.paymentOptionText}>
                                    Credit/Debit Card
                                </Text>
                            </View>
                        </View>
                        <View style={styles.radioButton}>
                            <View style={[styles.radioButtonInner, selectedPayment === 'card' && styles.radioButtonSelected]} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Terms and Conditions */}
                <View style={styles.termsSection}>
                    <TouchableOpacity
                        style={styles.termsCheckbox}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                            {acceptedTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the {' '}
                            <Text style={styles.termsLink}>Terms and Conditions</Text>
                            {' '}and {' '}
                            <Text style={styles.termsLink}>Cancellation Policy</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Authorize Payment Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            (!acceptedTerms || isProcessing) && styles.continueButtonDisabled
                        ]}
                        onPress={handleAuthorizePayment}
                        disabled={!acceptedTerms || isProcessing}
                    >
                        <Text style={styles.continueButtonText}>
                            {isProcessing ? 'Processing...' : 'Authorize Payment'}
                        </Text>
                    </TouchableOpacity>
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
        fontSize: 18,
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
    scrollView: {
        flex: 1,
    },
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        margin: 16,
        marginBottom: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    propertyImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    propertyInfo: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 12,
    },
    propertyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    propertyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    section: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    detailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
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
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    policyCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 16,
    },
    policyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    policyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    policyDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    policyLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    policyLinkText: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '500',
        marginRight: 4,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4ECDC4',
    },
    paymentOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    paymentOptionInfo: {
        flex: 1,
    },
    paymentOptionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#4ECDC4',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ECDC4',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    continueButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    continueButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    termsSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8F4F8',
    },
    termsCheckbox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#4ECDC4',
        borderColor: '#4ECDC4',
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    termsLink: {
        color: '#4ECDC4',
        textDecorationLine: 'underline',
    },
});
