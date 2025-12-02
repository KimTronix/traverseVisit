import React, { useState, useEffect } from 'react';
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
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';

export default function PostCommentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.postId;
    const { user } = useAuth();

    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [posting, setPosting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    useEffect(() => {
        if (postId) {
            loadComments();
        }
    }, [postId]);

    const loadComments = async () => {
        try {
            console.log('💬 Loading comments for post:', postId);
            setLoading(true);

            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    users:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('post_id', postId)
                .is('parent_comment_id', null) // Only top-level comments
                .order('created_at', { ascending: false });

            if (error) throw error;

            setComments(data || []);
            console.log('✅ Loaded', data?.length || 0, 'comments');
        } catch (error: any) {
            console.error('❌ Error loading comments:', error);
            Alert.alert('Error', 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handleLikeComment = async (commentId: string, currentlyLiked: boolean) => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to like comments');
            return;
        }

        try {
            // Optimistically update UI
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            likes_count: currentlyLiked
                                ? (comment.likes_count || 0) - 1
                                : (comment.likes_count || 0) + 1,
                        }
                        : comment
                )
            );

            if (currentlyLiked) {
                // Unlike
                await supabase
                    .from('likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user.id);
            } else {
                // Like
                await supabase
                    .from('likes')
                    .insert({
                        comment_id: commentId,
                        user_id: user.id,
                    });
            }

            // Update comment likes count
            const newCount = currentlyLiked
                ? (comments.find(c => c.id === commentId)?.likes_count || 1) - 1
                : (comments.find(c => c.id === commentId)?.likes_count || 0) + 1;

            await supabase
                .from('comments')
                .update({ likes_count: newCount })
                .eq('id', commentId);

        } catch (error: any) {
            console.error('Error liking comment:', error);
            // Revert optimistic update
            loadComments();
        }
    };

    const handlePostComment = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to comment');
            return;
        }

        if (!commentText.trim()) return;

        try {
            setPosting(true);
            console.log('💬 Posting comment...');

            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    content: commentText.trim(),
                    parent_comment_id: replyingTo,
                })
                .select(`
                    *,
                    users:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;

            // Add new comment to the list
            setComments([data, ...comments]);
            setCommentText('');
            setReplyingTo(null);

            // Update post comments count
            await supabase.rpc('increment_comments_count', { post_id: postId });

            console.log('✅ Comment posted successfully');
        } catch (error: any) {
            console.error('❌ Error posting comment:', error);
            Alert.alert('Error', 'Failed to post comment');
        } finally {
            setPosting(false);
        }
    };

    const renderComment = ({ item }: { item: any }) => {
        const author = item.users;
        const timeAgo = new Date(item.created_at).toLocaleDateString();

        return (
            <View style={styles.commentContainer}>
                <TouchableOpacity onPress={() => router.push('/user-profile' as any)}>
                    <Image
                        source={{ uri: author?.avatar_url || 'https://i.pravatar.cc/150?img=1' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <TouchableOpacity onPress={() => router.push('/user-profile' as any)}>
                            <Text style={styles.userName}>{author?.full_name || 'User'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.timestamp}>{timeAgo}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <View style={styles.commentActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleLikeComment(item.id, false)}
                        >
                            <Ionicons
                                name="heart-outline"
                                size={16}
                                color="#666"
                            />
                            <Text style={styles.actionText}>
                                {item.likes_count || 0}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setReplyingTo(item.id)}
                        >
                            <Text style={styles.actionText}>Reply</Text>
                        </TouchableOpacity>
                    </View>
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
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4ECDC4" />
                        <Text style={styles.loadingText}>Loading comments...</Text>
                    </View>
                ) : comments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubble-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No comments yet</Text>
                        <Text style={styles.emptySubtext}>Be the first to comment!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

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
                            source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=10' }}
                            style={styles.inputAvatar}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            placeholderTextColor="#999"
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                            editable={!posting}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, (!commentText.trim() || posting) && styles.sendButtonDisabled]}
                            onPress={handlePostComment}
                            disabled={!commentText.trim() || posting}
                        >
                            {posting ? (
                                <ActivityIndicator size="small" color="#4ECDC4" />
                            ) : (
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={commentText.trim() ? '#4ECDC4' : '#CCC'}
                                />
                            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});
