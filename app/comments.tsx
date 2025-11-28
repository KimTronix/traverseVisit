import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPostComments, addComment, CommentData } from '../utils/storage';

export default function CommentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.postId as string;

    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState('');

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
            setNewComment('');
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
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
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
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
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
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
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        gap: 12,
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
    },
});
