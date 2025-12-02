import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';

export default function MessagesListScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    const loadConversations = async () => {
        try {
            // Fetch conversations where current user is a participant
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    last_message:last_message_id (
                        content,
                        created_at,
                        is_read,
                        sender_id
                    ),
                    participant_1:participant_1_id (
                        id,
                        username,
                        full_name,
                        avatar_url
                    ),
                    participant_2:participant_2_id (
                        id,
                        username,
                        full_name,
                        avatar_url
                    )
                `)
                .or(`participant_1_id.eq.${user?.id},participant_2_id.eq.${user?.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Process data to identify the "other" user
            const processedConversations = data?.map(conv => {
                const isParticipant1 = conv.participant_1_id === user?.id;
                const otherUser = isParticipant1 ? conv.participant_2 : conv.participant_1;
                const unreadCount = isParticipant1 ? conv.unread_count_p1 : conv.unread_count_p2;

                return {
                    id: conv.id,
                    otherUser,
                    lastMessage: conv.last_message?.content || 'Start a conversation',
                    timestamp: conv.last_message?.created_at,
                    unread: unreadCount,
                    online: false, // Need presence system for this
                };
            }) || [];

            setConversations(processedConversations);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadConversations();
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderConversation = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => router.push({
                pathname: '/conversation',
                params: {
                    id: item.id,
                    otherUserId: item.otherUser.id,
                    otherUserName: item.otherUser.full_name || item.otherUser.username,
                    otherUserAvatar: item.otherUser.avatar_url
                }
            })}
        >
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: item.otherUser?.avatar_url || 'https://i.pravatar.cc/150?img=1' }}
                    style={styles.avatar}
                />
                {item.online && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.userName}>{item.otherUser?.full_name || item.otherUser?.username || 'User'}</Text>
                    {item.timestamp && (
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleDateString()}
                        </Text>
                    )}
                </View>
                <View style={styles.messageRow}>
                    <Text
                        style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]}
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity style={styles.newMessageButton}>
                    <Ionicons name="create-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search conversations..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Conversations List */}
            <FlatList
                data={filteredConversations}
                renderItem={renderConversation}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyTitle}>No conversations found</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'Try a different search' : 'Start a conversation with someone'}
                        </Text>
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
    newMessageButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listContent: {
        flexGrow: 1,
    },
    conversationItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
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
        backgroundColor: '#4ECDC4',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    conversationContent: {
        flex: 1,
        justifyContent: 'center',
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
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    unreadMessage: {
        fontWeight: '600',
        color: '#333',
    },
    unreadBadge: {
        backgroundColor: '#4ECDC4',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
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
        textAlign: 'center',
    },
});
