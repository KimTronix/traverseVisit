import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuth } from './context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function PostDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.id;
    const { user } = useAuth();

    // State
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (postId) {
            loadPostData();
        }
    }, [postId]);

    const loadPostData = async () => {
        try {
            console.log('📝 Loading post:', postId);
            setLoading(true);

            // Fetch post with user data
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select(`
                    *,
                    users:user_id (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('id', postId)
                .single();

            if (postError) throw postError;

            setPost(postData);
            setLikesCount(postData.likes_count || 0);

            // Check if current user liked this post
            if (user) {
                const { data: likeData } = await supabase
                    .from('likes')
                    .select('id')
                    .eq('post_id', postId)
                    .eq('user_id', user.id)
                    .single();

                setIsLiked(!!likeData);
            }

            // Fetch comments
            const { data: commentsData, error: commentsError } = await supabase
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
                .order('created_at', { ascending: false })
                .limit(3);

            if (commentsError) throw commentsError;

            setComments(commentsData || []);

            console.log('✅ Post loaded successfully');
        } catch (error: any) {
            console.error('❌ Error loading post:', error);
            Alert.alert('Error', 'Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to like posts');
            return;
        }

        try {
            if (isLiked) {
                // Unlike
                await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);

                setIsLiked(false);
                setLikesCount(prev => prev - 1);
            } else {
                // Like
                await supabase
                    .from('likes')
                    .insert({
                        post_id: postId,
                        user_id: user.id,
                    });

                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }

            // Update post likes count
            await supabase
                .from('posts')
                .update({ likes_count: isLiked ? likesCount - 1 : likesCount + 1 })
                .eq('id', postId);

        } catch (error: any) {
            console.error('Error liking post:', error);
            Alert.alert('Error', 'Failed to update like');
        }
    };

    const handleShare = () => {
        // Share functionality
        console.log('Share post');
    };

    const handleViewAllComments = () => {
        router.push(`/comments?postId=${postId}`);
    };

    const handleUserProfile = (username: string) => {
        router.push(`/user-profile?username=${username}`);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post</Text>
                    <View style={styles.moreButton} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                    <Text style={styles.loadingText}>Loading post...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!post) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post</Text>
                    <View style={styles.moreButton} />
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Post not found</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadPostData}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const author = post.users;
    const formattedBudget = post.min_budget ? `$${post.min_budget}` : null;
    const timeAgo = new Date(post.created_at).toLocaleDateString();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* User Info */}
                <TouchableOpacity
                    style={styles.userSection}
                    onPress={() => handleUserProfile(author?.username || '')}
                >
                    <Image
                        source={{ uri: author?.avatar_url || 'https://i.pravatar.cc/150?img=1' }}
                        style={styles.userAvatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{author?.full_name || 'User'}</Text>
                        {post.location_name && (
                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={14} color="#666" />
                                <Text style={styles.location}>{post.location_name}</Text>
                            </View>
                        )}
                    </View>
                    {user?.id !== author?.id && (
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* Post Image */}
                <View style={styles.imageContainer}>
                    {!imageLoaded && (
                        <View style={styles.imageLoader}>
                            <ActivityIndicator size="large" color="#4ECDC4" />
                        </View>
                    )}
                    <Image
                        source={{ uri: post.media_urls?.[0] || 'https://via.placeholder.com/800x1000' }}
                        style={styles.postImage}
                        onLoad={() => setImageLoaded(true)}
                        resizeMode="cover"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                            <Ionicons
                                name={isLiked ? 'heart' : 'heart-outline'}
                                size={28}
                                color={isLiked ? '#FF3B30' : '#333'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewAllComments}
                        >
                            <Ionicons name="chatbubble-outline" size={26} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <Ionicons name="paper-plane-outline" size={26} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="bookmark-outline" size={26} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Engagement Stats */}
                <View style={styles.statsSection}>
                    <Text style={styles.likesText}>{likesCount.toLocaleString()} likes</Text>
                    <Text style={styles.timestamp}>{timeAgo}</Text>
                </View>

                {/* Caption */}
                {post.caption && (
                    <View style={styles.captionSection}>
                        <Text style={styles.caption}>
                            <Text style={styles.captionUsername}>{author?.full_name || 'User'}</Text>{' '}
                            {post.caption}
                        </Text>
                    </View>
                )}

                {/* Budget */}
                {formattedBudget && (
                    <View style={styles.budgetSection}>
                        <Ionicons name="wallet-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.budgetLabel}>Estimated Budget: </Text>
                        <Text style={styles.budgetAmount}>{formattedBudget}</Text>
                    </View>
                )}

                {/* Comments Preview */}
                <View style={styles.commentsSection}>
                    <View style={styles.commentsSectionHeader}>
                        <Text style={styles.commentsTitle}>
                            Comments ({post.comments_count || 0})
                        </Text>
                        {comments.length > 0 && (
                            <TouchableOpacity onPress={handleViewAllComments}>
                                <Text style={styles.viewAllText}>View all</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {comments.length === 0 ? (
                        <View style={styles.emptyComments}>
                            <Text style={styles.emptyCommentsText}>No comments yet</Text>
                            <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
                        </View>
                    ) : (
                        comments.map((comment) => (
                            <TouchableOpacity
                                key={comment.id}
                                style={styles.commentItem}
                                onPress={handleViewAllComments}
                            >
                                <Image
                                    source={{ uri: comment.users?.avatar_url || 'https://i.pravatar.cc/150?img=2' }}
                                    style={styles.commentAvatar}
                                />
                                <View style={styles.commentContent}>
                                    <Text style={styles.commentText}>
                                        <Text style={styles.commentUsername}>
                                            {comment.users?.full_name || 'User'}
                                        </Text>{' '}
                                        {comment.content}
                                    </Text>
                                    <View style={styles.commentMeta}>
                                        <Text style={styles.commentTimestamp}>
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </Text>
                                        <Text style={styles.commentLikes}>
                                            {comment.likes_count || 0} likes
                                        </Text>
                                        <TouchableOpacity>
                                            <Text style={styles.replyButton}>Reply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}

                    {comments.length > 0 && (
                        <TouchableOpacity
                            style={styles.viewAllCommentsButton}
                            onPress={handleViewAllComments}
                        >
                            <Text style={styles.viewAllCommentsText}>
                                View all {post.comments_count || 0} comments
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#4ECDC4" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Plan Trip Section */}
                <View style={styles.planTripSection}>
                    <Text style={styles.planTripTitle}>Inspired by this destination?</Text>
                    <TouchableOpacity
                        style={styles.planTripButton}
                        onPress={() => router.push('/destination-map')}
                    >
                        <Ionicons name="map-outline" size={20} color="#fff" />
                        <Text style={styles.planTripButtonText}>Plan Your Trip</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        backgroundColor: '#fff',
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
    moreButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 13,
        color: '#666',
    },
    followButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    imageContainer: {
        width: width,
        height: width * 1.25,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    imageLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    leftActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        padding: 4,
    },
    statsSection: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    likesText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    timestamp: {
        fontSize: 13,
        color: '#999',
    },
    captionSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    caption: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    captionUsername: {
        fontWeight: '600',
    },
    budgetSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        gap: 6,
    },
    budgetLabel: {
        fontSize: 14,
        color: '#666',
    },
    budgetAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    commentsSection: {
        backgroundColor: '#fff',
        paddingTop: 16,
        marginTop: 8,
    },
    commentsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    commentsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4ECDC4',
    },
    commentItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    commentUsername: {
        fontWeight: '600',
    },
    commentMeta: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 6,
    },
    commentTimestamp: {
        fontSize: 12,
        color: '#999',
    },
    commentLikes: {
        fontSize: 12,
        color: '#666',
    },
    replyButton: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    viewAllCommentsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 6,
    },
    viewAllCommentsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    planTripSection: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    planTripTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    planTripButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    planTripButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
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
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyComments: {
        padding: 32,
        alignItems: 'center',
    },
    emptyCommentsText: {
        fontSize: 15,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    emptyCommentsSubtext: {
        fontSize: 13,
        color: '#999',
    },
});
