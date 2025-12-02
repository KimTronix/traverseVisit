import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendChatMessage, createSystemPrompt } from '../lib/openai';
import { useAuth } from './context/AuthContext';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIChatScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! I\'m your travel assistant. I can help you plan trips, find destinations, estimate budgets, and give you local tips. What would you like to know?',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNewChat = () => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: 'Hi! I\'m your travel assistant. I can help you plan trips, find destinations, estimate budgets, and give you local tips. What would you like to know?',
                timestamp: new Date(),
            },
        ]);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const text = inputText.trim();
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Prepare messages for OpenAI
            const systemPrompt = createSystemPrompt(
                user?.full_name,
                user?.location
            );

            const apiMessages = [
                { role: 'system' as const, content: systemPrompt },
                ...messages.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
                { role: 'user' as const, content: text },
            ];

            // Get AI response
            const aiResponse = await sendChatMessage(apiMessages);

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error: any) {
            console.error('Error getting AI response:', error);
            Alert.alert(
                'Error',
                'Failed to get response from AI assistant. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedPrompts = [
        '🏖️ Best beaches in Bali',
        '🗺️ 7-day Italy itinerary',
        '💰 Budget for Japan trip',
        '🍜 Must-try foods in Thailand',
    ];

    const handleSuggestedPrompt = (prompt: string) => {
        setInputText(prompt.substring(3)); // Remove emoji
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.role === 'user';

        return (
            <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    {!isUser && (
                        <View style={styles.aiIcon}>
                            <Ionicons name="sparkles" size={16} color="#4ECDC4" />
                        </View>
                    )}
                    <Text style={[styles.messageText, isUser && styles.userMessageText]}>
                        {item.content}
                    </Text>
                </View>
                <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
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
                <View style={styles.headerTitle}>
                    <Ionicons name="sparkles" size={20} color="#4ECDC4" />
                    <Text style={styles.headerText}>Travel Assistant</Text>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={handleNewChat}>
                    <Ionicons name="add-circle-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
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

                {/* Suggested Prompts */}
                {messages.length === 1 && (
                    <View style={styles.suggestedContainer}>
                        <Text style={styles.suggestedTitle}>Try asking about:</Text>
                        <View style={styles.suggestedPrompts}>
                            {suggestedPrompts.map((prompt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.promptChip}
                                    onPress={() => handleSuggestedPrompt(prompt)}
                                >
                                    <Text style={styles.promptText}>{prompt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#4ECDC4" />
                        <Text style={styles.loadingText}>Thinking...</Text>
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything about travel..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() && !isLoading ? '#FFF' : '#CCC'}
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
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    menuButton: {
        padding: 4,
    },
    keyboardView: {
        flex: 1,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 8,
    },
    messageContainer: {
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    userMessageContainer: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    aiBubble: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    userBubble: {
        backgroundColor: '#4ECDC4',
    },
    aiIcon: {
        marginBottom: 4,
    },
    messageText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFF',
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
        marginLeft: 8,
    },
    userTimestamp: {
        marginRight: 8,
        marginLeft: 0,
    },
    suggestedContainer: {
        padding: 16,
        paddingTop: 0,
    },
    suggestedTitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        fontWeight: '500',
    },
    suggestedPrompts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    promptChip: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    promptText: {
        fontSize: 13,
        color: '#333',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
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
        backgroundColor: '#E0E0E0',
    },
});
