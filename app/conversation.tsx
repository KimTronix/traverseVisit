import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';

export default function ConversationScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const [conversationId, setConversationId] = useState<string | null>(params.id as string || null);
    const otherUserId = params.otherUserId as string;
    const otherUserName = params.otherUserName as string;
    const otherUserAvatar = params.otherUserAvatar as string;

    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (user) {
            if (conversationId) {
                loadMessages(conversationId);
                subscribeToMessages(conversationId);
            } else if (otherUserId) {
                // Check if conversation already exists
                checkExistingConversation();
            }
        }
    }, [user, conversationId, otherUserId]);

    const checkExistingConversation = async () => {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant_1_id.eq.${user?.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user?.id})`)
                .single();

            if (data) {
                setConversationId(data.id);
            } else {
                setLoading(false); // No conversation yet, ready to create one
            }
        } catch (error) {
            console.error('Error checking conversation:', error);
            setLoading(false);
        }
    };

    const loadMessages = async (convId: string) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = (convId: string) => {
        const subscription = supabase
            .channel(`conversation:${convId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${convId}`,
                },
                (payload) => {
                    const newMessage = payload.new;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !user) return;

        const text = messageText.trim();
        setMessageText(''); // Optimistic clear

        try {
            let currentConvId = conversationId;

            // Create conversation if it doesn't exist
            if (!currentConvId && otherUserId) {
                const { data: newConv, error: convError } = await supabase
                    .from('conversations')
                    .insert({
                        participant_1_id: user.id,
                        participant_2_id: otherUserId,
                    })
                    .select()
                    .single();

                if (convError) throw convError;
                currentConvId = newConv.id;
                setConversationId(newConv.id);
            }

            if (currentConvId) {
                const { error } = await supabase
                    .from('messages')
                    .insert({
                        conversation_id: currentConvId,
                        sender_id: user.id,
                        recipient_id: otherUserId, // Assuming 1-on-1 for now
                        content: text,
                    });

                if (error) throw error;

                // Update conversation last message (can be done via trigger ideally, but manual for now)
                await supabase
                    .from('conversations')
                    .update({
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentConvId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Restore text if failed?
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender_id === user?.id;
        return (
            <View style={[styles.messageContainer, isMe && styles.myMessageContainer]}>
                {!isMe && (
                    <Image
                        source={{ uri: otherUserAvatar || 'https://i.pravatar.cc/150?img=1' }}
                        style={styles.messageAvatar}
                    />
                )}
                <View style={[styles.messageBubble, isMe && styles.myMessageBubble]}>
                    <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
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

                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push({
                        pathname: '/user-profile',
                        params: { userId: otherUserId }
                    })}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: otherUserAvatar || 'https://i.pravatar.cc/150?img=1' }}
                            style={styles.headerAvatar}
                        />
                        {/* Online status would require presence system */}
                    </View>
                    <View>
                        <Text style={styles.headerName}>{otherUserName || 'User'}</Text>
                        <Text style={styles.headerStatus}>
                            Active now
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Messages List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
                        </View>
                    }
                />

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickActionButton}>
                        <Ionicons name="location-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.quickActionText}>Share Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}>
                        <Ionicons name="home-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.quickActionText}>Recommend Place</Text>
                    </TouchableOpacity>
                </View>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#666" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={messageText.trim() ? '#4ECDC4' : '#CCC'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ECDC4',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    headerStatus: {
        fontSize: 12,
        color: '#4ECDC4',
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        backgroundColor: '#F5F5F5',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    myMessageBubble: {
        backgroundColor: '#4ECDC4',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFF',
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    myMessageTime: {
        color: 'rgba(255,255,255,0.8)',
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    quickActionText: {
        fontSize: 13,
        color: '#4ECDC4',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        backgroundColor: '#FFF',
    },
    attachButton: {
        marginRight: 8,
        marginBottom: 4,
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 8,
        marginBottom: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});
