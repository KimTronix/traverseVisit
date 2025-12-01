import React, { useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock comments data
const mockComments = [
    {
        id: '1',
        user: {
            name: 'Sarah Johnson',
            username: '@sarahj',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        text: 'This looks absolutely stunning! How long did you stay there?',
        likes: 24,
        liked: false,
        timestamp: '2h ago',
        replies: [
            {
                id: '1-1',
                user: {
                    name: 'Alex Rivera',
                    username: '@alexr',
                    avatar: 'https://i.pravatar.cc/150?img=2',
                },
                text: 'We stayed for 5 days! Highly recommend.',
                likes: 8,
                liked: false,
                timestamp: '1h ago',
            },
        ],
    },
    {
        id: '2',
        user: {
            name: 'Mike Chen',
            username: '@mikec',
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
        text: 'Added to my bucket list! 🌟',
        likes: 15,
        liked: true,
        timestamp: '3h ago',
        replies: [],
    },
    {
        id: '3',
        user: {
            name: 'Emma Wilson',
            username: '@emmaw',
            avatar: 'https://i.pravatar.cc/150?img=4',
        },
        text: 'What was the weather like when you visited?',
        likes: 7,
        liked: false,
        timestamp: '5h ago',
        replies: [],
    },
];

export default function PostCommentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [comments, setComments] = useState(mockComments);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const handleLikeComment = (commentId: string) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? {
                        ...comment,
                        liked: !comment.liked,
                        likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                    }
                    : comment
            )
        );
    };

    const handlePostComment = () => {
        if (commentText.trim()) {
            const newComment = {
                id: Date.now().toString(),
                user: {
                    name: 'You',
                    username: '@you',
                    avatar: 'https://i.pravatar.cc/150?img=10',
                },
                text: commentText,
                likes: 0,
                liked: false,
                timestamp: 'Just now',
                replies: [],
            };
            setComments([newComment, ...comments]);
            setCommentText('');
            setReplyingTo(null);
        }
    };

    const renderComment = ({ item }: { item: any }) => (
        <View style={styles.commentContainer}>
            <TouchableOpacity onPress={() => router.push('/user-profile' as any)}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <TouchableOpacity onPress={() => router.push('/user-profile' as any)}>
                        <Text style={styles.userName}>{item.user.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
                <View style={styles.commentActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLikeComment(item.id)}
                    >
                        <Ionicons
                            name={item.liked ? 'heart' : 'heart-outline'}
                            size={16}
                            color={item.liked ? '#FF3B30' : '#666'}
                        />
                        <Text style={[styles.actionText, item.liked && styles.likedText]}>
                            {item.likes}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setReplyingTo(item.id)}
                    >
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>
                </View>

                {/* Replies */}
                {item.replies && item.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        {item.replies.map((reply: any) => (
                            <View key={reply.id} style={styles.replyItem}>
                                <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
                                <View style={styles.replyContent}>
                                    <Text style={styles.userName}>{reply.user.name}</Text>
                                    <Text style={styles.commentText}>{reply.text}</Text>
                                    <Text style={styles.timestamp}>{reply.timestamp}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Comments List */}
                <FlatList
                    data={comments}
                    renderItem={renderComment}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input */}
                <View style={styles.inputContainer}>
                    {replyingTo && (
                        <View style={styles.replyingBanner}>
                            <Text style={styles.replyingText}>Replying to comment...</Text>
                            <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                <Ionicons name="close" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputRow}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
                            style={styles.inputAvatar}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            placeholderTextColor="#999"
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
                            onPress={handlePostComment}
                            disabled={!commentText.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={20}
                                color={commentText.trim() ? '#4ECDC4' : '#CCC'}
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
    listContent: {
        paddingVertical: 8,
    },
    commentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    likedText: {
        color: '#FF3B30',
    },
    repliesContainer: {
        marginTop: 12,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#F0F0F0',
    },
    replyItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    replyAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    replyContent: {
        flex: 1,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        backgroundColor: '#FFF',
        paddingBottom: 20,
    },
    replyingBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
    },
    replyingText: {
        fontSize: 13,
        color: '#666',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: 8,
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        maxHeight: 100,
    },
    sendButton: {
        padding: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
