import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = [
    {
        label: 'Total Users',
        value: '12,450',
        change: '+12%',
        icon: 'people-outline',
        color: '#4ECDC4',
    },
    {
        label: 'Revenue',
        value: '$45.2k',
        change: '+8%',
        icon: 'cash-outline',
        color: '#4CAF50',
    },
    {
        label: 'Pending',
        value: '18',
        change: '-2',
        icon: 'time-outline',
        color: '#FF9800',
    },
    {
        label: 'Reports',
        value: '5',
        change: '+1',
        icon: 'flag-outline',
        color: '#FF5252',
    },
];

const menuItems = [
    {
        title: 'Provider Approvals',
        subtitle: 'Review pending applications',
        icon: 'checkmark-circle-outline',
        route: '/admin/approvals',
        color: '#FF9800',
        badge: 18,
    },
    {
        title: 'User Management',
        subtitle: 'Manage accounts and access',
        icon: 'people-circle-outline',
        route: '/admin/users',
        color: '#2196F3',
    },
    {
        title: 'Content Moderation',
        subtitle: 'Review reported content',
        icon: 'shield-outline',
        route: '/admin/moderation',
        color: '#FF5252',
        badge: 5,
    },
    {
        title: 'Analytics',
        subtitle: 'Platform performance stats',
        icon: 'bar-chart-outline',
        route: '/admin/analytics',
        color: '#9C27B0',
    },
];

const recentActivity = [
    {
        id: 1,
        type: 'signup',
        message: 'New provider registration: "Ocean View Villa"',
        time: '5 mins ago',
        icon: 'home-outline',
        color: '#4ECDC4',
    },
    {
        id: 2,
        type: 'report',
        message: 'Content reported by user @john_doe',
        time: '12 mins ago',
        icon: 'flag-outline',
        color: '#FF5252',
    },
    {
        id: 3,
        type: 'payment',
        message: 'Payout processed for Host #8821',
        time: '1 hour ago',
        icon: 'cash-outline',
        color: '#4CAF50',
    },
];

export default function AdminDashboardScreen() {
    const router = useRouter();

    const handleLogout = () => {
        router.replace('/admin/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF5252" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                            <Text style={[
                                styles.statChange,
                                { color: stat.change.startsWith('+') ? '#4CAF50' : '#FF5252' }
                            ]}>
                                {stat.change}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Main Menu */}
                <Text style={styles.sectionTitle}>Management Modules</Text>
                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuCard}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                                <Ionicons name={item.icon as any} size={28} color={item.color} />
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </View>
                            {item.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityList}>
                    {recentActivity.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                                <Ionicons name={activity.icon as any} size={18} color={activity.color} />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityMessage}>{activity.message}</Text>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: '#FF525210',
        borderRadius: 8,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    statChange: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    menuGrid: {
        gap: 12,
        marginBottom: 32,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    badge: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    activityList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityMessage: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 12,
        color: '#999',
    },
    bottomPadding: {
        height: 40,
    },
});
