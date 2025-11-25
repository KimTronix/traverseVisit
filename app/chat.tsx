import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi Alex! To give you the best recommendations, what's your preferred travel scope? (Intercity, Provincial, National) [cite: 20, 21]",
            isUser: false,
            timestamp: '[cite: 21]',
        },
        {
            id: 2,
            text: "I'm thinking Intercity",
            isUser: true,
            timestamp: '[cite: 21]',
        },
        {
            id: 3,
            text: 'Great! How do you plan to travel? (Driving, Taxi, Public Transport) [cite: 21, 22]',
            isUser: false,
            timestamp: '[cite: 22]',
        },
        {
            id: 4,
            text: 'Public Transport',
            isUser: true,
            timestamp: '[cite: 22]',
        },
        {
            id: 5,
            text: 'Got it! For intercity public transport, I recommend checking the high-speed train options. Here are some popular routes... [cite: 22]',
            isUser: false,
            timestamp: '[cite: 22]',
        },
    ]);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                text: message,
                isUser: true,
                timestamp: `[cite: ${messages.length + 20}]`,
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    id: messages.length + 2,
                    text: "That's a great choice! Let me find the best options for you...",
                    isUser: false,
                    timestamp: `[cite: ${messages.length + 21}]`,
                };
                setMessages((prev) => [...prev, aiResponse]);
            }, 1000);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Ionicons name="navigate-circle" size={24} color="#4ECDC4" />
                    <Text style={styles.headerTitle}>Travel Assistant</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.chatContainer}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageWrapper,
                                msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                            ]}
                        >
                            {!msg.isUser && (
                                <View style={styles.aiAvatar}>
                                    <Ionicons name="navigate-circle" size={20} color="#4ECDC4" />
                                </View>
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg.isUser ? styles.userMessage : styles.aiMessage,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        msg.isUser ? styles.userMessageText : styles.aiMessageText,
                                    ]}
                                >
                                    {msg.text}
                                </Text>
                                <Text
                                    style={[
                                        styles.timestamp,
                                        msg.isUser ? styles.userTimestamp : styles.aiTimestamp,
                                    ]}
                                >
                                    {msg.timestamp}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            placeholderTextColor="#999"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                            onPress={handleSend}
                            disabled={!message.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={20}
                                color={message.trim() ? '#4ECDC4' : '#CCC'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        width: 32,
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    aiMessageWrapper: {
        justifyContent: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 12,
        paddingBottom: 8,
    },
    userMessage: {
        backgroundColor: '#0A5F5A',
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        backgroundColor: '#E8E8E8',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 4,
    },
    userMessageText: {
        color: '#FFF',
    },
    aiMessageText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 2,
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    aiTimestamp: {
        color: '#999',
    },
    inputContainer: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 44,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        maxHeight: 100,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
