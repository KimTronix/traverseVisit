import React from 'react';
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

// Mock provider data
const providerData = {
    businessName: 'Santorini Sunset Villa',
    newRequests: 5,
    monthlyEarnings: 4500,
    avgRating: 4.9,
    recentActivity: [
        {
            id: 1,
            type: 'booking',
            message: 'New booking from AlexTravels for Oct 10-15',
            hasAction: true,
        },
        {
            id: 2,
            type: 'confirmation',
            message: 'Booking #123 confirmed',
            hasAction: false,
        },
    ],
};

export default function ProviderAdminDashboard() {
    const router = useRouter();

    const handleViewRequest = () => {
        console.log('View booking request');
        // Navigate to booking requests screen
        router.push('/booking-requests');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Provider Admin Dashboard</Text>
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
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Hello, {providerData.businessName}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {/* New Requests */}
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Ionicons name="mail" size={28} color="#4ECDC4" />
                        </View>
                        <Text style={styles.statLabel}>New Requests:</Text>
                        <Text style={styles.statValue}>{providerData.newRequests}</Text>
                    </View>

                    {/* Monthly Earnings */}
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Ionicons name="cash" size={28} color="#4ECDC4" />
                        </View>
                        <Text style={styles.statLabel}>This Month's Earnings:</Text>
                        <Text style={styles.statValue}>
                            ${providerData.monthlyEarnings.toLocaleString()}
                        </Text>
                    </View>

                    {/* Average Rating */}
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Ionicons name="star" size={28} color="#4ECDC4" />
                        </View>
                        <Text style={styles.statLabel}>Avg. Rating:</Text>
                        <Text style={styles.statValue}>{providerData.avgRating}</Text>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>

                    {providerData.recentActivity.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <Text style={styles.activityMessage}>{activity.message}</Text>
                            {activity.hasAction && (
                                <TouchableOpacity style={styles.viewButton} onPress={handleViewRequest}>
                                    <Text style={styles.viewButtonText}>View</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Navigation for Provider */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#0A5F5A" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/booking-requests')}>
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                    <Text style={styles.navLabel}>Bookings</Text>
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
    welcomeSection: {
        backgroundColor: '#FFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F0F9F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 6,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    activitySection: {
        backgroundColor: '#FFF',
        marginTop: 8,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    activityMessage: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    viewButton: {
        backgroundColor: '#0A5F5A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    viewButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFF',
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
