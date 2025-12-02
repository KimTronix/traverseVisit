import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';

export default function NotificationsListScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    *,
                    related_user:related_user_id (
                        id,
                        full_name,
                        avatar_url
                    ),
                    related_post:related_post_id (
                        id,
                        media_urls
                    )
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadNotifications();
    };

    const handleMarkAllRead = async () => {
        // Optimistic update
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user?.id)
                .eq('is_read', false);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking all read:', error);
            // Revert on error if needed, but for read status it's usually fine
        }
    };

    const handleNotificationPress = async (notification: any) => {
        // Mark as read if not already
        if (!notification.is_read) {
            setNotifications(notifications.map(n =>
                n.id === notification.id ? { ...n, is_read: true } : n
            ));

            try {
                await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .eq('id', notification.id);
            } catch (error) {
                console.error('Error marking read:', error);
            }
        }

        // Navigate based on type
        if (notification.type === 'like' || notification.type === 'comment') {
            router.push({
                pathname: '/post-comments',
                params: { postId: notification.related_post_id }
            });
        } else if (notification.type === 'follow' || notification.type === 'message') {
            router.push({
                pathname: '/user-profile',
                params: { userId: notification.related_user_id }
            });
        } else if (notification.type === 'booking') {
            router.push('/my-bookings' as any);
        }
    };

    const renderNotification = ({ item }: { item: any }) => {
        // Determine icon based on type
        let iconName = 'notifications';
        let iconColor = '#4ECDC4';

        switch (item.type) {
            case 'like': iconName = 'heart'; iconColor = '#FF3B30'; break;
            case 'comment': iconName = 'chatbubble'; iconColor = '#4ECDC4'; break;
            case 'follow': iconName = 'person-add'; iconColor = '#5856D6'; break;
            case 'booking': iconName = 'calendar'; iconColor = '#FF9500'; break;
            case 'system': iconName = 'information-circle'; iconColor = '#8E8E93'; break;
        }

        return (
            <TouchableOpacity
                style={[styles.notificationItem, !item.is_read && styles.unreadNotification]}
                onPress={() => handleNotificationPress(item)}
            >
                <View style={styles.notificationLeft}>
                    {item.related_user ? (
                        <Image
                            source={{ uri: item.related_user.avatar_url || 'https://i.pravatar.cc/150?img=1' }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                            <Ionicons name={iconName as any} size={24} color={iconColor} />
                        </View>
                    )}
                </View>

                <View style={styles.notificationContent}>
                    <Text style={styles.notificationText}>
                        {item.related_user && <Text style={styles.userName}>{item.related_user.full_name || 'User'} </Text>}
                        {item.message}
                    </Text>
                    <Text style={styles.timestamp}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>

                {item.related_post?.media_urls?.[0] && (
                    <Image source={{ uri: item.related_post.media_urls[0] }} style={styles.postThumbnail} />
                )}

                {!item.is_read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
            </SafeAreaView>
        );
    }

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
