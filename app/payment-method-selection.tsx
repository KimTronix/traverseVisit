import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PaymentMethod {
    id: string;
    type: 'wallet' | 'card' | 'paypal' | 'other';
    name: string;
    description: string;
    icon: string;
    isAvailable: boolean;
}

export default function PaymentMethodSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Extract booking details from params
    const bookingData = {
        propertyId: params.propertyId as string,
        propertyName: params.propertyName as string,
        checkIn: params.checkIn as string,
        checkOut: params.checkOut as string,
        guests: params.guests as string,
        totalPrice: params.totalPrice as string,
        nights: params.nights as string,
    };

    const [selectedMethod, setSelectedMethod] = useState<string>('wallet');
    const [isLoading, setIsLoading] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'wallet',
            type: 'wallet',
            name: 'Traverse Wallet',
            description: 'Use your wallet balance for instant payment',
            icon: 'wallet-outline',
            isAvailable: true,
        },
        {
            id: 'card',
            type: 'card',
            name: 'Credit/Debit Card',
            description: 'Visa, Mastercard, American Express accepted',
            icon: 'card-outline',
            isAvailable: true,
        },
        {
            id: 'paypal',
            type: 'paypal',
            name: 'PayPal',
            description: 'Fast, secure payment with your PayPal account',
            icon: 'logo-paypal',
            isAvailable: true,
        },
        {
            id: 'apple-pay',
            type: 'other',
            name: 'Apple Pay',
            description: 'Pay with Touch ID or Face ID',
            icon: 'logo-apple',
            isAvailable: true,
        },
        {
            id: 'google-pay',
            type: 'other',
            name: 'Google Pay',
            description: 'Quick and secure payment with Google Pay',
            icon: 'logo-google',
            isAvailable: true,
        },
    ];

    const handleContinue = () => {
        if (!selectedMethod) {
            Alert.alert('Select Payment Method', 'Please select a payment method to continue');
            return;
        }

        setIsLoading(true);
        
        // Simulate payment method validation
        setTimeout(() => {
            setIsLoading(false);
            
            // Navigate to confirm booking with selected payment method
            router.push({
                pathname: '/confirm-booking',
                params: {
                    ...bookingData,
                    paymentMethod: selectedMethod,
                },
            });
        }, 1000);
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
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
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Booking Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Booking Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Property:</Text>
                        <Text style={styles.summaryValue}>{bookingData.propertyName}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Dates:</Text>
                        <Text style={styles.summaryValue}>
                            {formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Duration:</Text>
                        <Text style={styles.summaryValue}>{bookingData.nights} nights</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Guests:</Text>
                        <Text style={styles.summaryValue}>{bookingData.guests}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabelTotal}>Total Amount:</Text>
                        <Text style={styles.summaryValueTotal}>${bookingData.totalPrice}</Text>
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>
                    
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentMethodCard,
                                selectedMethod === method.id && styles.paymentMethodCardSelected,
                                !method.isAvailable && styles.paymentMethodCardDisabled,
                            ]}
                            onPress={() => method.isAvailable && setSelectedMethod(method.id)}
                            disabled={!method.isAvailable}
                        >
                            <View style={styles.paymentMethodInfo}>
                                <View style={styles.paymentMethodIcon}>
                                    <Ionicons 
                                        name={method.icon as any} 
                                        size={24} 
                                        color={selectedMethod === method.id ? '#4ECDC4' : '#666'} 
                                    />
                                </View>
                                <View style={styles.paymentMethodDetails}>
                                    <Text style={[
                                        styles.paymentMethodName,
                                        selectedMethod === method.id && styles.paymentMethodNameSelected,
                                        !method.isAvailable && styles.paymentMethodNameDisabled,
                                    ]}>
                                        {method.name}
                                    </Text>
                                    <Text style={[
                                        styles.paymentMethodDescription,
                                        !method.isAvailable && styles.paymentMethodDescriptionDisabled,
                                    ]}>
                                        {method.description}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.paymentMethodSelector}>
                                <View style={[
                                    styles.radioButton,
                                    selectedMethod === method.id && styles.radioButtonSelected,
                                ]}>
                                    {selectedMethod === method.id && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Security Note */}
                <View style={styles.securityNote}>
                    <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
                    <Text style={styles.securityText}>
                        Your payment information is encrypted and secure. We never store your payment details.
                    </Text>
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !selectedMethod && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedMethod || isLoading}
                >
                    <Text style={styles.continueButtonText}>
                        {isLoading ? 'Processing...' : 'Continue'}
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
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: 12,
    },
    summaryLabelTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    summaryValueTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    paymentSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    paymentMethodCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#EFEFEF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentMethodCardSelected: {
        borderColor: '#4ECDC4',
        backgroundColor: '#F0F9FF',
    },
    paymentMethodCardDisabled: {
        opacity: 0.5,
        backgroundColor: '#F8F8F8',
    },
    paymentMethodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentMethodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    paymentMethodDetails: {
        flex: 1,
    },
    paymentMethodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    paymentMethodNameSelected: {
        color: '#4ECDC4',
    },
    paymentMethodNameDisabled: {
        color: '#999',
    },
    paymentMethodDescription: {
        fontSize: 14,
        color: '#666',
    },
    paymentMethodDescriptionDisabled: {
        color: '#999',
    },
    paymentMethodSelector: {
        marginLeft: 16,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#4ECDC4',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ECDC4',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    securityText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
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
