import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock booking requests data
const bookingRequests = [
    {
        id: 1,
        guestName: 'AlexTravels',
        propertyName: 'Santorini Sunset Villa',
        checkIn: 'Oct 10',
        checkOut: 'Oct 15, 2024',
        guests: 2,
        totalPayout: 1200,
    },
    {
        id: 2,
        guestName: 'User456',
        propertyName: 'Santorini Sunset Villa',
        checkIn: 'Oct 10',
        checkOut: 'Oct 15, 2024',
        guests: 2,
        totalPayout: 1200,
    },
];

export default function BookingRequestsScreen() {
    const router = useRouter();
    const [requests, setRequests] = useState(bookingRequests);

    const handleAccept = (requestId: number) => {
        console.log('Accept booking request:', requestId);
        // Update request status and notify guest
        setRequests(requests.filter(r => r.id !== requestId));
    };

    const handleDecline = (requestId: number) => {
        console.log('Decline booking request:', requestId);
        // Update request status and notify guest
        setRequests(requests.filter(r => r.id !== requestId));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Requests</Text>
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
                {requests.map((request) => (
                    <View key={request.id} style={styles.requestCard}>
                        {/* Guest Info */}
                        <View style={styles.requestHeader}>
                            <Text style={styles.guestName}>{request.guestName}</Text>
                            <Text style={styles.propertyName}>{request.propertyName}</Text>
                        </View>

                        {/* Booking Details */}
                        <View style={styles.detailsSection}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Dates:</Text>
                                <Text style={styles.detailValue}>
                                    {request.checkIn} - {request.checkOut}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Guests:</Text>
                                <Text style={styles.detailValue}>{request.guests} Adults</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Payout:</Text>
                                <Text style={styles.detailValue}>
                                    ${request.totalPayout.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAccept(request.id)}
                            >
                                <Text style={styles.acceptButtonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.declineButton}
                                onPress={() => handleDecline(request.id)}
                            >
                                <Text style={styles.declineButtonText}>Decline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {requests.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color="#D0D0D0" />
                        <Text style={styles.emptyText}>No pending booking requests</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation for Provider */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/provider-admin')}>
                    <Ionicons name="home-outline" size={24} color="#666" />
                    <Text style={styles.navLabel}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="calendar" size={24} color="#0A5F5A" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="list-outline" size={24} color="#666" />
                    <Text style={styles.navLabel}>Listings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                    <Text style={styles.navLabel}>Profile</Text>
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
    requestCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    requestHeader: {
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    guestName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    propertyName: {
        fontSize: 14,
        color: '#666',
    },
    detailsSection: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#0A5F5A',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    declineButton: {
        flex: 1,
        backgroundColor: '#DC3545',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    declineButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingBottom: 8,
        paddingTop: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    navLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
    },
    navLabelActive: {
        color: '#0A5F5A',
        fontWeight: '600',
    },
});
