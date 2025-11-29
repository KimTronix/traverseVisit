import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addComment, CommentData, getPostComments } from '../utils/storage';

export default function CommentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.postId as string;

    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLikes, setCommentLikes] = useState<{ [key: string]: { count: number; liked: boolean } }>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        const postComments = await getPostComments(postId);
        setComments(postComments);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            return;
        }

        const comment: CommentData = {
            id: Date.now().toString(),
            postId: postId,
            userId: '1',
            username: 'AlexTravels',
            userImage: 'https://i.pravatar.cc/150?img=12',
            text: newComment.trim(),
            timestamp: Date.now(),
        };

        try {
            await addComment(comment);
            setComments(prev => [...prev, comment]);
            setCommentLikes(prev => ({
                ...prev,
                [comment.id]: { count: 0, liked: false }
            }));
            setNewComment('');
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
        }
    };

    const handleLikeComment = (commentId: string) => {
        setCommentLikes(prev => {
            const current = prev[commentId] || { count: 0, liked: false };
            const newLiked = !current.liked;
            const newCount = newLiked ? current.count + 1 : current.count - 1;
            
            return {
                ...prev,
                [commentId]: { count: newCount, liked: newLiked }
            };
        });
    };

    const handleReply = (commentId: string) => {
        setReplyingTo(commentId);
        setReplyText('');
    };

    const handleAddReply = async (commentId: string) => {
        if (!replyText.trim()) {
            return;
        }

        const reply: CommentData = {
            id: Date.now().toString(),
            postId: postId,
            userId: '1',
            username: 'AlexTravels',
            userImage: 'https://i.pravatar.cc/150?img=12',
            text: replyText.trim(),
            timestamp: Date.now(),
        };

        try {
            await addComment(reply);
            setComments(prev => [...prev, reply]);
            setCommentLikes(prev => ({
                ...prev,
                [reply.id]: { count: 0, liked: false }
            }));
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to add reply');
        }
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 28 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Comments List */}
                <ScrollView style={styles.commentsContainer} showsVerticalScrollIndicator={false}>
                    {comments.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                            <Text style={styles.emptyText}>No comments yet</Text>
                            <Text style={styles.emptySubtext}>Be the first to comment!</Text>
                        </View>
                    ) : (
                        comments.map((comment) => (
                            <View key={comment.id} style={styles.commentItem}>
                                <Image source={{ uri: comment.userImage }} style={styles.avatar} />
                                <View style={styles.commentContent}>
                                    <View style={styles.commentHeader}>
                                        <Text style={styles.username}>{comment.username}</Text>
                                        <Text style={styles.timeText}>{formatTime(comment.timestamp)}</Text>
                                    </View>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                    <View style={styles.commentActions}>
                                        <TouchableOpacity 
                                            style={styles.actionButton}
                                            onPress={() => handleLikeComment(comment.id)}
                                        >
                                            <Ionicons 
                                                name={commentLikes[comment.id]?.liked ? "heart" : "heart-outline"} 
                                                size={16} 
                                                color={commentLikes[comment.id]?.liked ? "#FF3B30" : "#666"} 
                                            />
                                            <Text style={styles.actionText}>
                                                {commentLikes[comment.id]?.count || 0}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.actionButton}
                                            onPress={() => handleReply(comment.id)}
                                        >
                                            <Ionicons name="arrow-undo" size={16} color="#666" />
                                            <Text style={styles.actionText}>Reply</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    {/* Reply Input */}
                                    {replyingTo === comment.id && (
                                        <View style={styles.replyContainer}>
                                            <TextInput
                                                style={styles.replyInput}
                                                value={replyText}
                                                onChangeText={setReplyText}
                                                placeholder="Write a reply..."
                                                placeholderTextColor="#999"
                                                multiline
                                                autoFocus
                                            />
                                            <TouchableOpacity
                                                onPress={() => handleAddReply(comment.id)}
                                                disabled={!replyText.trim()}
                                            >
                                                <Ionicons
                                                    name="send"
                                                    size={20}
                                                    color={replyText.trim() ? '#4ECDC4' : '#CCC'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                                <Ionicons name="close" size={20} color="#666" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Input Section */}
                <View style={styles.inputContainer}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.inputAvatar}
                    />
                    <TextInput
                        style={styles.input}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Add a comment..."
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={newComment.trim() ? '#4ECDC4' : '#CCC'}
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(239, 239, 239, 0.6)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    keyboardView: {
        flex: 1,
    },
    commentsContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#CCC',
        marginTop: 4,
    },
    commentItem: {
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 8,
        marginVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(239, 239, 239, 0.6)',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    // New styles for comment actions and replies
    commentActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(245, 245, 245, 0.6)',
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    replyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(78, 205, 196, 0.3)',
    },
    replyInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        maxHeight: 60,
    },
});
