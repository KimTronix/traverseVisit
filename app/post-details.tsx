import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock data - will be replaced with actual data from hooks
const mockPost = {
    id: 1,
    username: 'traveler_jane',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    location: 'Santorini, Greece',
    postImage: 'https://picsum.photos/800/1000?random=1',
    caption: 'Absolutely stunning sunset views from Oia! 🌅 This place is a dream come true. The white-washed buildings against the blue Aegean Sea create the most magical atmosphere. Highly recommend visiting during golden hour!',
    likes: 1234,
    comments: 89,
    shares: 45,
    budget: '$2,500',
    timestamp: '2 hours ago',
    isLiked: false,
};

const mockComments = [
    {
        id: 1,
        username: 'travel_lover',
        avatar: 'https://i.pravatar.cc/150?img=2',
        comment: 'This looks amazing! Adding to my bucket list 😍',
        likes: 23,
        timestamp: '1 hour ago',
    },
    {
        id: 2,
        username: 'wanderlust_mike',
        avatar: 'https://i.pravatar.cc/150?img=3',
        comment: 'I was there last summer! The sunset is even better in person',
        likes: 15,
        timestamp: '45 minutes ago',
    },
    {
        id: 3,
        username: 'adventure_sarah',
        avatar: 'https://i.pravatar.cc/150?img=4',
        comment: 'How many days would you recommend staying?',
        likes: 8,
        timestamp: '30 minutes ago',
    },
];

export default function PostDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.id;

    const [isLiked, setIsLiked] = useState(mockPost.isLiked);
    const [likesCount, setLikesCount] = useState(mockPost.likes);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
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
                    onPress={() => handleUserProfile(mockPost.username)}
                >
                    <Image source={{ uri: mockPost.userAvatar }} style={styles.userAvatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{mockPost.username}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={14} color="#666" />
                            <Text style={styles.location}>{mockPost.location}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Post Image */}
                <View style={styles.imageContainer}>
                    {!imageLoaded && (
                        <View style={styles.imageLoader}>
                            <ActivityIndicator size="large" color="#4ECDC4" />
                        </View>
                    )}
                    <Image
                        source={{ uri: mockPost.postImage }}
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
                    <Text style={styles.timestamp}>{mockPost.timestamp}</Text>
                </View>

                {/* Caption */}
                <View style={styles.captionSection}>
                    <Text style={styles.caption}>
                        <Text style={styles.captionUsername}>{mockPost.username}</Text>{' '}
                        {mockPost.caption}
                    </Text>
                </View>

                {/* Budget */}
                <View style={styles.budgetSection}>
                    <Ionicons name="wallet-outline" size={20} color="#4ECDC4" />
                    <Text style={styles.budgetLabel}>Estimated Budget: </Text>
                    <Text style={styles.budgetAmount}>{mockPost.budget}</Text>
                </View>

                {/* Comments Preview */}
                <View style={styles.commentsSection}>
                    <View style={styles.commentsSectionHeader}>
                        <Text style={styles.commentsTitle}>
                            Comments ({mockPost.comments})
                        </Text>
                        <TouchableOpacity onPress={handleViewAllComments}>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                    {mockComments.slice(0, 3).map((comment) => (
                        <TouchableOpacity
                            key={comment.id}
                            style={styles.commentItem}
                            onPress={handleViewAllComments}
                        >
                            <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                            <View style={styles.commentContent}>
                                <Text style={styles.commentText}>
                                    <Text style={styles.commentUsername}>{comment.username}</Text>{' '}
                                    {comment.comment}
                                </Text>
                                <View style={styles.commentMeta}>
                                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                                    <Text style={styles.commentLikes}>
                                        {comment.likes} likes
                                    </Text>
                                    <TouchableOpacity>
                                        <Text style={styles.replyButton}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.viewAllCommentsButton}
                        onPress={handleViewAllComments}
                    >
                        <Text style={styles.viewAllCommentsText}>
                            View all {mockPost.comments} comments
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#4ECDC4" />
                    </TouchableOpacity>
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
});
