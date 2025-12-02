import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock properties data
const mockProperties = [
    {
        id: 1,
        name: 'Cozy Beach House',
        type: 'Villa',
        location: 'Malibu, CA',
        coverImage: 'https://picsum.photos/400/300?random=1',
        status: 'active',
        pricePerNight: 250,
        currency: 'USD',
        views: 1234,
        bookings: 45,
        rating: 4.8,
        reviewsCount: 32,
    },
    {
        id: 2,
        name: 'Modern Downtown Apartment',
        type: 'Apartment',
        location: 'New York, NY',
        coverImage: 'https://picsum.photos/400/300?random=2',
        status: 'active',
        pricePerNight: 180,
        currency: 'USD',
        views: 892,
        bookings: 28,
        rating: 4.6,
        reviewsCount: 21,
    },
    {
        id: 3,
        name: 'Mountain Cabin Retreat',
        type: 'Cabin',
        location: 'Aspen, CO',
        coverImage: 'https://picsum.photos/400/300?random=3',
        status: 'pending',
        pricePerNight: 320,
        currency: 'USD',
        views: 456,
        bookings: 0,
        rating: 0,
        reviewsCount: 0,
    },
];

export default function ManageListingsScreen() {
    const router = useRouter();
    const [properties, setProperties] = useState(mockProperties);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddProperty = () => {
        router.push('/add-property/index' as any);
    };

    const handleEditProperty = (propertyId: number) => {
        console.log('Edit property:', propertyId);
        // Navigate to edit screen
    };

    const handleToggleStatus = (propertyId: number) => {
        setProperties(
            properties.map((prop) =>
                prop.id === propertyId
                    ? {
                        ...prop,
                        status: prop.status === 'active' ? 'inactive' : 'active',
                    }
                    : prop
            )
        );
    };

    const handleDeleteProperty = (propertyId: number) => {
        Alert.alert(
            'Delete Property',
            'Are you sure you want to delete this property? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setProperties(properties.filter((prop) => prop.id !== propertyId));
                    },
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#4CAF50';
            case 'pending':
                return '#FF9800';
            case 'inactive':
                return '#999';
            default:
                return '#999';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'pending':
                return 'Pending Review';
            case 'inactive':
                return 'Inactive';
            default:
                return status;
        }
    };

    const renderProperty = ({ item }: { item: any }) => (
        <View style={styles.propertyCard}>
            <Image source={{ uri: item.coverImage }} style={styles.propertyImage} />

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>

            <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                    <View style={styles.propertyInfo}>
                        <Text style={styles.propertyName}>{item.name}</Text>
                        <View style={styles.propertyMeta}>
                            <Ionicons name="location-outline" size={14} color="#666" />
                            <Text style={styles.propertyLocation}>{item.location}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                            Alert.alert('Property Actions', 'Choose an action', [
                                {
                                    text: 'Edit',
                                    onPress: () => handleEditProperty(item.id),
                                },
                                {
                                    text: item.status === 'active' ? 'Deactivate' : 'Activate',
                                    onPress: () => handleToggleStatus(item.id),
                                },
                                {
                                    text: 'Delete',
                                    onPress: () => handleDeleteProperty(item.id),
                                    style: 'destructive',
                                },
                                { text: 'Cancel', style: 'cancel' },
                            ]);
                        }}
                    >
                        <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={18} color="#4ECDC4" />
                        <Text style={styles.statValue}>{item.views}</Text>
                        <Text style={styles.statLabel}>Views</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="calendar-outline" size={18} color="#4ECDC4" />
                        <Text style={styles.statValue}>{item.bookings}</Text>
                        <Text style={styles.statLabel}>Bookings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="star" size={18} color="#FFB800" />
                        <Text style={styles.statValue}>{item.rating || 'N/A'}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        ${item.pricePerNight}
                        <Text style={styles.priceUnit}> /night</Text>
                    </Text>
                    {item.status === 'active' && (
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => console.log('View property')}
                        >
                            <Text style={styles.viewButtonText}>View Listing</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Properties Yet</Text>
            <Text style={styles.emptyDescription}>
                Start earning by adding your first property
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddProperty}>
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.emptyButtonText}>Add Property</Text>
            </TouchableOpacity>
        </View>
    );

    const navigation = useNavigation();

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.replace('/provider-admin');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Listings</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Stats Summary */}
            {properties.length > 0 && (
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{properties.length}</Text>
                        <Text style={styles.summaryLabel}>Total Listings</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {properties.filter((p) => p.status === 'active').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Active</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {properties.reduce((sum, p) => sum + p.bookings, 0)}
                        </Text>
                        <Text style={styles.summaryLabel}>Total Bookings</Text>
                    </View>
                </View>
            )}

            {/* Properties List */}
            <FlatList
                data={properties}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#4ECDC4"
                    />
                }
                ListEmptyComponent={renderEmpty}
            />

            {/* FAB */}
            {properties.length > 0 && (
                <TouchableOpacity style={styles.fab} onPress={handleAddProperty}>
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            )}
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
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    filterButton: {
        padding: 4,
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4ECDC4',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#EFEFEF',
        marginHorizontal: 8,
    },
    listContent: {
        padding: 16,
    },
    propertyCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    propertyImage: {
        width: '100%',
        height: 200,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    propertyContent: {
        padding: 16,
    },
    propertyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    propertyInfo: {
        flex: 1,
    },
    propertyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    propertyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    propertyLocation: {
        fontSize: 14,
        color: '#666',
    },
    moreButton: {
        padding: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        marginBottom: 12,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#EFEFEF',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4ECDC4',
    },
    priceUnit: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
    viewButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
