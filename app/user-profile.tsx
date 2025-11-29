import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 6) / 3;

// Mock user data
const mockUser = {
    username: 'traveler_jane',
    fullName: 'Jane Anderson',
    avatar: 'https://i.pravatar.cc/300?img=1',
    bio: '✈️ Travel enthusiast | 📸 Photography lover | 🌍 Exploring the world one destination at a time',
    location: 'New York, USA',
    website: 'www.janestravel.com',
    postsCount: 127,
    followersCount: 12500,
    followingCount: 892,
    isFollowing: false,
    isVerified: true,
};

// Mock posts grid
const mockPosts = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/400/400?random=${i + 1}`,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
}));

export default function UserProfileScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const username = params.username;

    const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);
    const [followersCount, setFollowersCount] = useState(mockUser.followersCount);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    };

    const handleMessage = () => {
        router.push(`/direct-message?username=${username}`);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handlePostPress = (postId: number) => {
        router.push(`/post-details?id=${postId}`);
    };

    const renderHeader = () => (
        <View>
            {/* Profile Info */}
            <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{mockUser.postsCount}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {followersCount >= 1000
                                    ? `${(followersCount / 1000).toFixed(1)}K`
                                    : followersCount}
                            </Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.statNumber}>{mockUser.followingCount}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.profileInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.fullName}>{mockUser.fullName}</Text>
                        {mockUser.isVerified && (
                            <Ionicons name="checkmark-circle" size={18} color="#4ECDC4" />
                        )}
                    </View>
                    <Text style={styles.bio}>{mockUser.bio}</Text>
                    <View style={styles.detailsRow}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.detailText}>{mockUser.location}</Text>
                    </View>
                    {mockUser.website && (
                        <View style={styles.detailsRow}>
                            <Ionicons name="link-outline" size={16} color="#666" />
                            <Text style={[styles.detailText, styles.linkText]}>
                                {mockUser.website}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.primaryButton,
                            isFollowing && styles.followingButton,
                        ]}
                        onPress={handleFollow}
                    >
                        <Text
                            style={[
                                styles.actionButtonText,
                                isFollowing && styles.followingButtonText,
                            ]}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={handleMessage}
                    >
                        <Ionicons name="chatbubble-outline" size={18} color="#333" />
                        <Text style={styles.secondaryButtonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                    onPress={() => setActiveTab('posts')}
                >
                    <Ionicons
                        name="grid-outline"
                        size={24}
                        color={activeTab === 'posts' ? '#4ECDC4' : '#999'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
                    onPress={() => setActiveTab('saved')}
                >
                    <Ionicons
                        name="bookmark-outline"
                        size={24}
                        color={activeTab === 'saved' ? '#4ECDC4' : '#999'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPost = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handlePostPress(item.id)}
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.image }} style={styles.gridImage} />
            <View style={styles.gridOverlay}>
                <View style={styles.gridStat}>
                    <Ionicons name="heart" size={18} color="#fff" />
                    <Text style={styles.gridStatText}>{item.likes}</Text>
                </View>
                <View style={styles.gridStat}>
                    <Ionicons name="chatbubble" size={18} color="#fff" />
                    <Text style={styles.gridStatText}>{item.comments}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{mockUser.username}</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <FlatList
                data={mockPosts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                ListHeaderComponent={renderHeader}
                columnWrapperStyle={styles.gridRow}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#4ECDC4"
                    />
                }
            />
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
    shareButton: {
        padding: 4,
    },
    profileSection: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginRight: 20,
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    profileInfo: {
        marginBottom: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    fullName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    detailText: {
        fontSize: 13,
        color: '#666',
    },
    linkText: {
        color: '#4ECDC4',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#4ECDC4',
    },
    followingButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    followingButtonText: {
        color: '#333',
    },
    secondaryButton: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#f0f0f0',
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4ECDC4',
    },
    gridRow: {
        gap: 2,
    },
    gridItem: {
        width: GRID_ITEM_SIZE,
        height: GRID_ITEM_SIZE,
        position: 'relative',
        marginBottom: 2,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        opacity: 0,
    },
    gridStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gridStatText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
