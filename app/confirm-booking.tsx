import React, { useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ConfirmBookingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedPayment, setSelectedPayment] = useState('wallet');

    // Mock booking data
    const bookingData = {
        propertyName: 'Santorini Sunset Villa',
        checkIn: 'Oct 10',
        checkOut: 'Oct 15',
        nights: 5,
        totalPrice: 1200.00,
        propertyImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
    };

    const walletBalance = 2150.00;

    const handleAuthorizePayment = () => {
        console.log('Authorize payment:', bookingData.totalPrice);
        // Process payment and navigate to confirmation
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm Booking</Text>
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
                {/* Booking Summary Card */}
                <View style={styles.summaryCard}>
                    <Image
                        source={{ uri: bookingData.propertyImage }}
                        style={styles.propertyImage}
                    />
                    <View style={styles.summaryInfo}>
                        <Text style={styles.propertyName}>{bookingData.propertyName}</Text>
                        <Text style={styles.dates}>
                            {bookingData.checkIn} - {bookingData.checkOut}
                        </Text>
                    </View>
                </View>

                {/* Total Price */}
                <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Total price</Text>
                    <Text style={styles.priceAmount}>
                        ${bookingData.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
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
                        <View style={[
                            styles.radioButton,
                            selectedPayment === 'wallet' && styles.radioButtonSelected,
                        ]}>
                            {selectedPayment === 'wallet' && <View style={styles.radioButtonInner} />}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.citation}>[cite: 36, 84]</Text>
                </View>

                {/* Secure Transaction Info */}
                <View style={styles.securityCard}>
                    <Ionicons name="lock-closed" size={24} color="#4ECDC4" />
                    <View style={styles.securityInfo}>
                        <Text style={styles.securityTitle}>Secure Transaction:</Text>
                        <Text style={styles.securityText}>
                            Your funds will be held securely in escrow until 24 hours after check-in.
                        </Text>
                    </View>
                </View>

                {/* Authorize Payment Button */}
                <TouchableOpacity
                    style={styles.authorizeButton}
                    onPress={handleAuthorizePayment}
                >
                    <Text style={styles.authorizeButtonText}>
                        Authorize Payment (${bookingData.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D0D0D0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#C0C0C0',
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
    scrollView: {
        flex: 1,
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: '#C0C0C0',
        margin: 16,
        marginBottom: 8,
        borderRadius: 12,
        padding: 12,
        gap: 12,
    },
    propertyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    summaryInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    propertyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    dates: {
        fontSize: 14,
        color: '#666',
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#C0C0C0',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#C0C0C0',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#B0B0B0',
        marginBottom: 4,
    },
    paymentOptionSelected: {
        backgroundColor: '#A0A0A0',
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
        fontSize: 14,
        color: '#333',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#666',
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
    citation: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    securityCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    securityInfo: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    securityText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    authorizeButton: {
        backgroundColor: '#0A5F5A',
        marginHorizontal: 16,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    authorizeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
