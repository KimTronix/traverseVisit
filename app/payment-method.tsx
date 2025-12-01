import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PaymentMethodScreen() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    const handlePayment = () => {
        // Simulate payment processing
        Alert.alert(
            'Processing Payment',
            'Please wait while we secure your booking...',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate to success screen
                        router.push('/booking-success');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm and Pay</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Total Amount */}
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total to pay</Text>
                    <Text style={styles.totalAmount}>$2,530.00</Text>
                </View>

                {/* Payment Methods */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pay with</Text>

                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'card' && styles.selectedMethod]}
                        onPress={() => setSelectedMethod('card')}
                    >
                        <View style={styles.methodLeft}>
                            <Ionicons name="card-outline" size={24} color="#333" />
                            <Text style={styles.methodLabel}>Credit or Debit Card</Text>
                        </View>
                        {selectedMethod === 'card' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                        )}
                    </TouchableOpacity>

                    {selectedMethod === 'card' && (
                        <View style={styles.cardForm}>
                            <TextInput
                                style={styles.input}
                                placeholder="Card number"
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                                    placeholder="Expiration (MM/YY)"
                                    value={expiry}
                                    onChangeText={setExpiry}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="CVV"
                                    keyboardType="numeric"
                                    value={cvc}
                                    onChangeText={setCvc}
                                    maxLength={4}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Name on card"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'paypal' && styles.selectedMethod]}
                        onPress={() => setSelectedMethod('paypal')}
                    >
                        <View style={styles.methodLeft}>
                            <Ionicons name="logo-paypal" size={24} color="#003087" />
                            <Text style={styles.methodLabel}>PayPal</Text>
                        </View>
                        {selectedMethod === 'paypal' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'apple' && styles.selectedMethod]}
                        onPress={() => setSelectedMethod('apple')}
                    >
                        <View style={styles.methodLeft}>
                            <Ionicons name="logo-apple" size={24} color="#000" />
                            <Text style={styles.methodLabel}>Apple Pay</Text>
                        </View>
                        {selectedMethod === 'apple' && (
                            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Cancellation Policy Reminder */}
                <View style={styles.policyContainer}>
                    <Text style={styles.policyTitle}>Cancellation Policy</Text>
                    <Text style={styles.policyText}>
                        Free cancellation before Oct 10. Non-refundable after check-in.
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={handlePayment}
                >
                    <Text style={styles.payButtonText}>Pay $2,530.00</Text>
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
    totalSection: {
        marginBottom: 30,
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    methodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    selectedMethod: {
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.05)',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    methodLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    cardForm: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        marginTop: -4,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
    },
    policyContainer: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 16,
        borderRadius: 12,
    },
    policyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    policyText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
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
    payButton: {
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
    payButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
