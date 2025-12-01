import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock notifications data
const mockNotifications = [
    {
        id: '1',
        type: 'like',
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        message: 'liked your post',
        postImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=100&q=80',
        timestamp: '2m ago',
        read: false,
    },
    {
        id: '2',
        type: 'comment',
        user: {
            name: 'Mike Chen',
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
        message: 'commented on your post: "This looks amazing!"',
        postImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&q=80',
        timestamp: '1h ago',
        read: false,
    },
    {
        id: '3',
        type: 'follow',
        user: {
            name: 'Emma Wilson',
            avatar: 'https://i.pravatar.cc/150?img=4',
        },
        message: 'started following you',
        timestamp: '3h ago',
        read: true,
    },
    {
        id: '4',
        type: 'booking',
        message: 'Your booking for Santorini Villa has been confirmed',
        icon: 'checkmark-circle',
        iconColor: '#4ECDC4',
        timestamp: '5h ago',
        read: true,
    },
    {
        id: '5',
        type: 'message',
        user: {
            name: 'Alex Rivera',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        message: 'sent you a message',
        timestamp: '1d ago',
        read: true,
    },
    {
        id: '6',
        type: 'system',
        message: 'Your profile has been verified',
        icon: 'shield-checkmark',
        iconColor: '#4ECDC4',
        timestamp: '2d ago',
        read: true,
    },
];

export default function NotificationsListScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(mockNotifications);

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleNotificationPress = (notification: any) => {
        // Mark as read
        setNotifications(notifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
        ));

        // Navigate based on type
        if (notification.type === 'like' || notification.type === 'comment') {
            router.push('/post-comments' as any);
        } else if (notification.type === 'follow' || notification.type === 'message') {
            router.push('/user-profile' as any);
        } else if (notification.type === 'booking') {
            router.push('/my-bookings' as any);
        }
    };

    const renderNotification = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationItem, !item.read && styles.unreadNotification]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.notificationLeft}>
                {item.user ? (
                    <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}20` }]}>
                        <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                    </View>
                )}
            </View>

            <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>
                    {item.user && <Text style={styles.userName}>{item.user.name} </Text>}
                    {item.message}
                </Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>

            {item.postImage && (
                <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
            )}

            {!item.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
                {unreadCount === 0 && <View style={{ width: 80 }} />}
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyTitle}>No notifications</Text>
                        <Text style={styles.emptyText}>You're all caught up!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    markAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    listContent: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    unreadNotification: {
        backgroundColor: 'rgba(78, 205, 196, 0.05)',
    },
    notificationLeft: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    userName: {
        fontWeight: '600',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    postThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginLeft: 12,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ECDC4',
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});
