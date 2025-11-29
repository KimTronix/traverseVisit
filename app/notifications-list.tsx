import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StandardHeader from '../components/StandardHeader';
import {
    EmptyState,
    showSuccessToast
} from '../components/ui/FeedbackStates';
import { LoadingSpinner } from '../components/ui/LoadingStates';

interface Notification {
    id: string;
    type: 'booking' | 'social' | 'system' | 'promotion' | 'message';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionText?: string;
    imageUrl?: string;
    metadata?: {
        bookingId?: string;
        userId?: string;
        propertyId?: string;
        postId?: string;
    };
}

export default function NotificationsListScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'booking' | 'social' | 'system'>('all');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        
        // Mock notifications data - in a real app, this would fetch from an API
        const mockNotifications: Notification[] = [
            {
                id: '1',
                type: 'booking',
                title: 'Booking Confirmed!',
                message: 'Your trip to Malibu, California has been confirmed. Check-in is on Dec 15, 2025.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                read: false,
                actionUrl: '/my-bookings',
                actionText: 'View Booking',
                metadata: { bookingId: 'BK123456789' },
            },
            {
                id: '2',
                type: 'social',
                title: 'New follower',
                message: 'Emily Chen started following you. Check out her travel posts!',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                read: false,
                actionUrl: '/user-profile',
                actionText: 'View Profile',
                imageUrl: 'https://i.pravatar.cc/150?img=44',
                metadata: { userId: 'user123' },
            },
            {
                id: '3',
                type: 'social',
                title: 'Your post was liked',
                message: 'Michael Chen liked your post "Beautiful sunset at the beach"',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/post-details',
                actionText: 'View Post',
                imageUrl: 'https://i.pravatar.cc/150?img=32',
                metadata: { postId: 'post456' },
            },
            {
                id: '4',
                type: 'system',
                title: 'Price drop alert',
                message: 'Properties in Aspen, Colorado are now 20% cheaper. Book before prices go up!',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/explore',
                actionText: 'Explore Deals',
            },
            {
                id: '5',
                type: 'booking',
                title: 'Check-in reminder',
                message: 'Your check-in for "Luxury Beachfront Villa" is tomorrow at 3:00 PM.',
                timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/my-bookings',
                actionText: 'View Details',
                metadata: { bookingId: 'BK123456789' },
            },
            {
                id: '6',
                type: 'message',
                title: 'New message from host',
                message: 'Sarah Johnson: Welcome! Looking forward to hosting you next week.',
                timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/messages',
                actionText: 'Reply',
                imageUrl: 'https://i.pravatar.cc/150?img=28',
                metadata: { userId: 'host123' },
            },
            {
                id: '7',
                type: 'promotion',
                title: 'Special offer',
                message: 'Get 25% off on beach destinations this weekend. Limited time only!',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/explore',
                actionText: 'Browse Deals',
            },
            {
                id: '8',
                type: 'social',
                title: 'Comment on your post',
                message: 'David Martinez: "Looks amazing! Which beach is this?"',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                read: true,
                actionUrl: '/post-comments',
                actionText: 'Reply',
                imageUrl: 'https://i.pravatar.cc/150?img=68',
                metadata: { postId: 'post456' },
            },
        ];

        setNotifications(mockNotifications);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const formatTimestamp = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffMs = now.getTime() - notificationTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) {
            return 'Just now';
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return notificationTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'booking':
                return 'calendar-outline';
            case 'social':
                return 'people-outline';
            case 'system':
                return 'notifications-outline';
            case 'promotion':
                return 'pricetag-outline';
            case 'message':
                return 'chatbubble-outline';
            default:
                return 'notifications-outline';
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'booking':
                return '#007AFF';
            case 'social':
                return '#00C851';
            case 'system':
                return '#FF9500';
            case 'promotion':
                return '#FF3B30';
            case 'message':
                return '#5856D6';
            default:
                return '#666';
        }
    };

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read
        markAsRead(notification.id);

        // Navigate to action URL if available
        if (notification.actionUrl) {
            if (notification.actionUrl.startsWith('/')) {
                router.push(notification.actionUrl as any);
            } else {
                Alert.alert('Navigation', 'This notification type is not yet supported.');
            }
        }
    };

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead(notificationId);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
        showSuccessToast('All notifications marked as read');
    };

    const handleDeleteNotification = (notificationId: string) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setNotifications(prev =>
                            prev.filter(notification => notification.id !== notificationId)
                        );
                        showSuccessToast('Notification deleted');
                    }
                }
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to delete all notifications?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        setNotifications([]);
                        showSuccessToast('All notifications cleared');
                    }
                }
            ]
        );
    };

    const getFilteredNotifications = () => {
        switch (selectedFilter) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'booking':
                return notifications.filter(n => n.type === 'booking');
            case 'social':
                return notifications.filter(n => n.type === 'social');
            case 'system':
                return notifications.filter(n => n.type === 'system' || n.type === 'promotion');
            default:
                return notifications;
        }
    };

    const getUnreadCount = () => {
        return notifications.filter(n => !n.read).length;
    };

    const renderNotificationItem = (notification: Notification) => (
        <TouchableOpacity
            key={notification.id}
            style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
            ]}
            onPress={() => handleNotificationPress(notification)}
        >
            <View style={styles.notificationLeft}>
                <View style={[
                    styles.notificationIcon,
                    { backgroundColor: getNotificationColor(notification.type) }
                ]}>
                    <Ionicons
                        name={getNotificationIcon(notification.type) as any}
                        size={20}
                        color="#fff"
                    />
                </View>
                <View style={styles.notificationContent}>
                    <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.unreadTitle
                    ]}>
                        {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                        {notification.message}
                    </Text>
                    <View style={styles.notificationMeta}>
                        <Text style={styles.notificationTime}>
                            {formatTimestamp(notification.timestamp)}
                        </Text>
                        {notification.actionText && (
                            <Text style={styles.actionText}>
                                {notification.actionText}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
            
            <View style={styles.notificationRight}>
                {!notification.read && (
                    <TouchableOpacity
                        style={styles.markReadButton}
                        onPress={() => handleMarkAsRead(notification.id)}
                    >
                        <Ionicons name="checkmark" size={16} color="#007AFF" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteNotification(notification.id)}
                >
                    <Ionicons name="close" size={16} color="#999" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = getUnreadCount();

    return (
        <SafeAreaView style={styles.container}>
            <StandardHeader 
                title="Notifications"
                showNotifications={false}
                unreadMessages={5}
            />

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'unread', label: 'Unread' },
                        { key: 'booking', label: 'Bookings' },
                        { key: 'social', label: 'Social' },
                        { key: 'system', label: 'System' },
                    ].map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterTab,
                                selectedFilter === filter.key && styles.activeFilterTab
                            ]}
                            onPress={() => setSelectedFilter(filter.key as any)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                selectedFilter === filter.key && styles.activeFilterTabText
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Action Buttons */}
            {notifications.length > 0 && (
                <View style={styles.actionBar}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleMarkAllAsRead}
                    >
                        <Ionicons name="checkmark-done" size={20} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Mark All Read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleClearAll}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                        <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Content */}
            {loading ? (
                <LoadingSpinner text="Loading notifications..." fullScreen />
            ) : (
                <ScrollView
                    style={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {filteredNotifications.length === 0 ? (
                        <EmptyState
                            icon="notifications-off-outline"
                            title="No notifications"
                            description={
                                selectedFilter === 'unread'
                                    ? 'You have no unread notifications.'
                                    : `No ${selectedFilter} notifications found.`
                            }
                            fullScreen={false}
                        />
                    ) : (
                        <View style={styles.notificationsList}>
                            {filteredNotifications.map(renderNotificationItem)}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    filterContainer: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activeFilterTab: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filterTabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeFilterTabText: {
        color: '#fff',
    },
    actionBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionButtonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    notificationsList: {
        padding: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    unreadNotification: {
        backgroundColor: '#f0f8ff',
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    notificationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    actionText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    notificationRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    markReadButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
