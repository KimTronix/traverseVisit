import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockApprovals = [
    {
        id: '1',
        businessName: 'Ocean View Villa',
        ownerName: 'Sarah Johnson',
        type: 'Individual Host',
        date: '2 hours ago',
        status: 'pending',
    },
    {
        id: '2',
        businessName: 'City Center Apartments',
        ownerName: 'Michael Chen',
        type: 'Property Management Co.',
        date: '5 hours ago',
        status: 'pending',
    },
    {
        id: '3',
        businessName: 'Mountain Retreats',
        ownerName: 'David Smith',
        type: 'Individual Host',
        date: '1 day ago',
        status: 'reviewing',
    },
    {
        id: '4',
        businessName: 'Seaside Cottages',
        ownerName: 'Emma Wilson',
        type: 'Individual Host',
        date: '2 days ago',
        status: 'pending',
    },
];

export default function ApprovalsListScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, reviewing

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/admin/approvals/${item.id}` as any)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item.businessName[0]}</Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.businessName}>{item.businessName}</Text>
                    <Text style={styles.ownerName}>{item.ownerName}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.status === 'reviewing' ? styles.statusReviewing : styles.statusPending
                ]}>
                    <Text style={[
                        styles.statusText,
                        item.status === 'reviewing' ? styles.textReviewing : styles.textPending
                    ]}>
                        {item.status === 'reviewing' ? 'In Review' : 'Pending'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.metaItem}>
                    <Ionicons name="business-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.type}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Provider Approvals</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Search & Filter */}
            <View style={styles.filterSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search providers..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'all' && styles.activeTab]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'pending' && styles.activeTab]}
                        onPress={() => setFilter('pending')}
                    >
                        <Text style={[styles.tabText, filter === 'pending' && styles.activeTabText]}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, filter === 'reviewing' && styles.activeTab]}
                        onPress={() => setFilter('reviewing')}
                    >
                        <Text style={[styles.tabText, filter === 'reviewing' && styles.activeTabText]}>In Review</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* List */}
            <FlatList
                data={mockApprovals}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
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
    },
    placeholder: {
        width: 32,
    },
    filterSection: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    tabs: {
        flexDirection: 'row',
        gap: 12,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
    },
    activeTab: {
        backgroundColor: '#333',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4ECDC420',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    cardInfo: {
        flex: 1,
    },
    businessName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    ownerName: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusPending: {
        backgroundColor: '#FFF3E0',
    },
    statusReviewing: {
        backgroundColor: '#E3F2FD',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    textPending: {
        color: '#FF9800',
    },
    textReviewing: {
        color: '#2196F3',
    },
    cardFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F5F7FA',
        paddingTop: 12,
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
});
