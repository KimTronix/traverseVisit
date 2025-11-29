import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock messages data
const mockMessages = [
    {
        id: 1,
        senderId: '2',
        text: 'Hey! I saw your post about Santorini. It looks amazing!',
        timestamp: Date.now() - 3600000,
        isRead: true,
    },
    {
        id: 2,
        senderId: '1',
        text: 'Thank you! It was absolutely stunning. Have you been there?',
        timestamp: Date.now() - 3500000,
        isRead: true,
    },
    {
        id: 3,
        senderId: '2',
        text: "Not yet, but it's definitely on my bucket list! How many days did you stay?",
        timestamp: Date.now() - 3400000,
        isRead: true,
    },
    {
        id: 4,
        senderId: '1',
        text: 'I spent 4 days there. Perfect amount of time to explore Oia, Fira, and the beaches.',
        timestamp: Date.now() - 3300000,
        isRead: true,
    },
    {
        id: 5,
        senderId: '2',
        text: 'That sounds perfect! Any accommodation recommendations?',
        timestamp: Date.now() - 3200000,
        isRead: true,
    },
    {
        id: 6,
        senderId: '1',
        text: 'I stayed at a cave hotel in Oia. The sunset views were incredible!',
        timestamp: Date.now() - 3100000,
        isRead: true,
    },
];

const mockOtherUser = {
    id: '2',
    username: 'travel_lover',
    fullName: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: true,
};

const currentUserId = '1';

export default function DirectMessageScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = params.username;

    const [messages, setMessages] = useState(mockMessages);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Scroll to bottom on mount
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
    }, []);

    const handleSend = () => {
        if (messageText.trim()) {
            const newMessage = {
                id: Date.now(),
                senderId: currentUserId,
                text: messageText.trim(),
                timestamp: Date.now(),
                isRead: false,
            };

            setMessages([...messages, newMessage]);
            setMessageText('');

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);

            // Simulate typing indicator
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / 3600000);

        if (hours < 1) {
            const minutes = Math.floor(diff / 60000);
            return minutes < 1 ? 'Just now' : `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isSent = item.senderId === currentUserId;

        return (
            <View style={[styles.messageContainer, isSent && styles.sentMessageContainer]}>
                {!isSent && (
                    <Image source={{ uri: mockOtherUser.avatar }} style={styles.messageAvatar} />
                )}
                <View style={[styles.messageBubble, isSent && styles.sentBubble]}>
                    <Text style={[styles.messageText, isSent && styles.sentMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.messageTime, isSent && styles.sentMessageTime]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push(`/user-profile?username=${username}`)}
                >
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: mockOtherUser.avatar }} style={styles.headerAvatar} />
                        {mockOtherUser.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View>
                        <Text style={styles.headerName}>{mockOtherUser.fullName}</Text>
                        <Text style={styles.headerStatus}>
                            {mockOtherUser.isOnline ? 'Active now' : 'Offline'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Typing Indicator */}
            {isTyping && (
                <View style={styles.typingContainer}>
                    <Image source={{ uri: mockOtherUser.avatar }} style={styles.typingAvatar} />
                    <View style={styles.typingBubble}>
                        <View style={styles.typingDots}>
                            <View style={[styles.dot, styles.dot1]} />
                            <View style={[styles.dot, styles.dot2]} />
                            <View style={[styles.dot, styles.dot3]} />
                        </View>
                    </View>
                </View>
            )}

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#4ECDC4" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Message..."
                        placeholderTextColor="#999"
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!messageText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={22}
                            color={messageText.trim() ? '#fff' : '#ccc'}
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
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
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
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    sentMessageContainer: {
        flexDirection: 'row-reverse',
    },
    messageAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sentBubble: {
        backgroundColor: '#4ECDC4',
    },
    messageText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    sentMessageText: {
        color: '#fff',
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    sentMessageTime: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'right',
    },
    typingContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'flex-end',
    },
    typingAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    typingBubble: {
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    typingDots: {
        flexDirection: 'row',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#999',
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.6,
    },
    dot3: {
        opacity: 0.8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        gap: 8,
    },
    attachButton: {
        padding: 4,
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#f5f5f5',
    },
});
