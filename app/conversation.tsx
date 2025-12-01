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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock messages data
const mockMessages = [
    {
        id: '1',
        text: 'Hey! I saw your post about Santorini. It looks amazing!',
        sender: 'other',
        timestamp: '10:30 AM',
    },
    {
        id: '2',
        text: 'Thanks! It was an incredible experience. Have you been there?',
        sender: 'me',
        timestamp: '10:32 AM',
    },
    {
        id: '3',
        text: 'Not yet, but it\'s on my bucket list! How long did you stay?',
        sender: 'other',
        timestamp: '10:33 AM',
    },
    {
        id: '4',
        text: 'We stayed for 5 days. Perfect amount of time to explore the island.',
        sender: 'me',
        timestamp: '10:35 AM',
    },
    {
        id: '5',
        text: 'That sounds perfect! Any recommendations for accommodations?',
        sender: 'other',
        timestamp: '10:36 AM',
    },
    {
        id: '6',
        text: 'Definitely! I can share some great options. What\'s your budget?',
        sender: 'me',
        timestamp: '10:38 AM',
    },
];

const otherUser = {
    name: 'Sarah Johnson',
    username: '@sarahj',
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
};

export default function ConversationScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState(mockMessages);
    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (messageText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: messageText,
                sender: 'me',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                }),
            };
            setMessages([...messages, newMessage]);
            setMessageText('');
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageContainer, isMe && styles.myMessageContainer]}>
                {!isMe && (
                    <Image source={{ uri: otherUser.avatar }} style={styles.messageAvatar} />
                )}
                <View style={[styles.messageBubble, isMe && styles.myMessageBubble]}>
                    <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
                        {item.timestamp}
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
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push('/user-profile' as any)}
                >
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
                        {otherUser.online && <View style={styles.onlineIndicator} />}
                    </View>
                    <View>
                        <Text style={styles.headerName}>{otherUser.name}</Text>
                        <Text style={styles.headerStatus}>
                            {otherUser.online ? 'Active now' : 'Offline'}
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
});
