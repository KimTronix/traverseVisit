import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Conversation {
    id: string;
    userName: string;
    userPhoto: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    isTyping: boolean;
    bookingId?: string;
    propertyId?: string;
}

export default function MessagesScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        setLoading(true);

        // Mock conversations data - in a real app, this would fetch from an API
        const mockConversations: Conversation[] = [
            {
                id: '1',
                userName: 'Sarah Johnson',
                userPhoto: 'https://i.pravatar.cc/150?img=28',
                lastMessage: 'Welcome! Looking forward to hosting you next week. Let me know if you have any questions.',
                lastMessageTime: '2h ago',
                unreadCount: 2,
                isOnline: true,
                isTyping: false,
                bookingId: 'BK123456789',
                propertyId: '1',
            },
            {
                id: '2',
                userName: 'Michael Chen',
                userPhoto: 'https://i.pravatar.cc/150?img=32',
                lastMessage: 'Thanks for the recommendation! I\'ll definitely check out that restaurant.',
                lastMessageTime: '1d ago',
                unreadCount: 0,
                isOnline: false,
                isTyping: false,
            },
            {
                id: '3',
                userName: 'Emily Wilson',
                userPhoto: 'https://i.pravatar.cc/150?img=44',
                lastMessage: 'The sunset looks amazing! Which beach is this?',
                lastMessageTime: '2d ago',
                unreadCount: 1,
                isOnline: true,
                isTyping: true,
                postId: 'post456',
            },
            {
                id: '4',
                userName: 'David Martinez',
                userPhoto: 'https://i.pravatar.cc/150?img=68',
                lastMessage: 'Perfect! See you tomorrow at 3 PM for the check-in.',
                lastMessageTime: '3d ago',
                unreadCount: 0,
                isOnline: false,
                isTyping: false,
                bookingId: 'BK987654321',
                propertyId: '2',
            },
            {
                id: '5',
                userName: 'Carlos Rodriguez',
                userPhoto: 'https://i.pravatar.cc/150?img=12',
                lastMessage: 'Thanks for your review! It was a pleasure hosting you.',
                lastMessageTime: '1w ago',
                unreadCount: 0,
                isOnline: false,
                isTyping: false,
            },
        ];

        setConversations(mockConversations);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadConversations();
        setRefreshing(false);
    };

    const handleConversationPress = (conversation: Conversation) => {
        // Mark as read
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversation.id
                    ? { ...conv, unreadCount: 0 }
                    : conv
            )
        );

        // Navigate to conversation
        router.push({
            pathname: '/conversation',
            params: {
                conversationId: conversation.id,
                userName: conversation.userName,
                userPhoto: conversation.userPhoto,
            }
        });
    };

    const handleNewMessage = () => {
        Alert.alert('New Message', 'This feature will allow you to start a new conversation. Coming soon!');
    };

    const getTotalUnreadCount = () => {
        return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    };

    const renderConversationItem = (conversation: Conversation) => (
        <TouchableOpacity
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => handleConversationPress(conversation)}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.userPhoto }} style={styles.avatar} />
                {conversation.isOnline && (
                    <View style={styles.onlineIndicator} />
                )}
            </View>

            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.userName}>{conversation.userName}</Text>
                    <Text style={styles.messageTime}>{conversation.lastMessageTime}</Text>
                </View>

                <View style={styles.messageContainer}>
                    <Text
                        style={[
                            styles.lastMessage,
                            conversation.unreadCount > 0 && styles.unreadMessage
                        ]}
                        numberOfLines={1}
                    >
                        {conversation.isTyping ? 'typing...' : conversation.lastMessage}
                    </Text>

                    {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const totalUnreadCount = getTotalUnreadCount();

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading messages...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity onPress={handleNewMessage}>
                    <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {conversations.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateTitle}>No messages yet</Text>
                        <Text style={styles.emptyStateDescription}>
                            Start a conversation with hosts or other travelers
                        </Text>
                        <TouchableOpacity
                            style={styles.startConversationButton}
                            onPress={handleNewMessage}
                        >
                            <Text style={styles.startConversationText}>Start a Conversation</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.conversationsList}>
                        {conversations.map(renderConversationItem)}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    startConversationButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    startConversationText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    conversationsList: {
        padding: 20,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginRight: 12,
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#00C851',
        borderWidth: 2,
        borderColor: '#fff',
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    messageTime: {
        fontSize: 12,
        color: '#999',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    unreadMessage: {
        color: '#333',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
