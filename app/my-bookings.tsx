import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock Bookings Data
const bookings = {
    upcoming: [
        {
            id: '1',
            property: 'Luxury Cliffside Villa',
            location: 'Santorini, Greece',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
            dates: 'Oct 15 - 20',
            status: 'Confirmed',
            price: '$2,530',
            reference: 'TRV-8X29B',
        },
        {
            id: '2',
            property: 'Modern Loft in Downtown',
            location: 'New York, USA',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            dates: 'Dec 24 - 28',
            status: 'Confirmed',
            price: '$1,200',
            reference: 'TRV-9Y30C',
        },
    ],
    past: [
        {
            id: '3',
            property: 'Cozy Mountain Cabin',
            location: 'Aspen, USA',
            image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
            dates: 'Jan 10 - 15, 2023',
            status: 'Completed',
            price: '$1,800',
            reference: 'TRV-7W18A',
        },
        {
            id: '4',
            property: 'Beachfront Bungalow',
            location: 'Bali, Indonesia',
            image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
            dates: 'Aug 5 - 12, 2022',
            status: 'Completed',
            price: '$950',
            reference: 'TRV-6V17Z',
        },
    ],
    cancelled: [],
};

export default function MyBookingsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

    const renderBookingItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>{item.property}</Text>
                    <View style={[styles.statusBadge, item.status === 'Confirmed' ? styles.statusConfirmed : styles.statusCompleted]}>
                        <Text style={[styles.statusText, item.status === 'Confirmed' ? styles.statusTextConfirmed : styles.statusTextCompleted]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <Text style={styles.location}>{item.location}</Text>
                <View style={styles.divider} />
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.dateLabel}>Dates</Text>
                        <Text style={styles.dateValue}>{item.dates}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.priceLabel}>Total</Text>
                        <Text style={styles.priceValue}>{item.price}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'past' && styles.activeTab]}
                    onPress={() => setActiveTab('past')}
                >
                    <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
                    onPress={() => setActiveTab('cancelled')}
                >
                    <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={bookings[activeTab]}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyTitle}>No bookings found</Text>
                        <Text style={styles.emptyText}>
                            You don't have any {activeTab} bookings yet.
                        </Text>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/(tabs)/explore')}
                        >
                            <Text style={styles.exploreButtonText}>Start Exploring</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    activeTab: {
        backgroundColor: '#333',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#FFF',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusConfirmed: {
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
    },
    statusCompleted: {
        backgroundColor: '#F5F5F5',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextConfirmed: {
        color: '#4ECDC4',
    },
    statusTextCompleted: {
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    priceLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
