import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock user data
const userData = {
    id: '123',
    name: 'Sarah Johnson',
    username: '@sarahj',
    avatar: 'https://i.pravatar.cc/150?img=1',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    bio: '✈️ Travel enthusiast | 📸 Photography lover | 🌍 Exploring the world one destination at a time',
    location: 'San Francisco, CA',
    website: 'sarahjohnson.com',
    joinedDate: 'Joined March 2022',
    stats: {
        posts: 248,
        followers: 1542,
        following: 892,
    },
    isFollowing: false,
    posts: [
        {
            id: '1',
            image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
            likes: 324,
        },
        {
            id: '2',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
            likes: 256,
        },
        {
            id: '3',
            image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80',
            likes: 189,
        },
        {
            id: '4',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
            likes: 412,
        },
        {
            id: '5',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
            likes: 298,
        },
        {
            id: '6',
            image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
            likes: 367,
        },
    ],
};

export default function UserProfileScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'posts' | 'reviews' | 'about'>('posts');
    const [isFollowing, setIsFollowing] = useState(userData.isFollowing);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const renderPost = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.postItem}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postOverlay}>
                <Ionicons name="heart" size={16} color="#FFF" />
                <Text style={styles.postLikes}>{item.likes}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{userData.username}</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Cover Image */}
                <Image source={{ uri: userData.coverImage }} style={styles.coverImage} />

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <Image source={{ uri: userData.avatar }} style={styles.avatar} />

                    <Text style={styles.name}>{userData.name}</Text>
                    <Text style={styles.username}>{userData.username}</Text>

                    {userData.bio && <Text style={styles.bio}>{userData.bio}</Text>}

                    <View style={styles.metaInfo}>
                        {userData.location && (
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={16} color="#666" />
                                <Text style={styles.metaText}>{userData.location}</Text>
                            </View>
                        )}
                        {userData.website && (
                            <View style={styles.metaItem}>
                                <Ionicons name="link-outline" size={16} color="#666" />
                                <Text style={styles.metaText}>{userData.website}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={16} color="#666" />
                            <Text style={styles.metaText}>{userData.joinedDate}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.posts}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.followers}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                        <View style={styles.statDivider} />
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.statValue}>{userData.stats.following}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.followButton, isFollowing && styles.followingButton]}
                            onPress={handleFollow}
                        >
                            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.messageButton}
                            onPress={() => router.push('/conversation' as any)}
                        >
                            <Ionicons name="chatbubble-outline" size={20} color="#333" />
                            <Text style={styles.messageButtonText}>Message</Text>
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
                            size={20}
                            color={activeTab === 'posts' ? '#333' : '#999'}
                        />
                        <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                            Posts
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                        onPress={() => setActiveTab('reviews')}
                    >
                        <Ionicons
                            name="star-outline"
                            size={20}
                            color={activeTab === 'reviews' ? '#333' : '#999'}
                        />
                        <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                            Reviews
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'about' && styles.activeTab]}
                        onPress={() => setActiveTab('about')}
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={activeTab === 'about' ? '#333' : '#999'}
                        />
                        <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
                            About
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'posts' && (
                    <FlatList
                        data={userData.posts}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        scrollEnabled={false}
                        contentContainerStyle={styles.postsGrid}
                    />
                )}

                {activeTab === 'reviews' && (
                    <View style={styles.emptyState}>
                        <Ionicons name="star-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>No reviews yet</Text>
                    </View>
                )}

                {activeTab === 'about' && (
                    <View style={styles.aboutSection}>
                        <Text style={styles.aboutText}>
                            Passionate traveler exploring the world and sharing experiences. Love discovering
                            hidden gems and connecting with fellow adventurers.
                        </Text>
                    </View>
                )}
            </ScrollView>
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
    moreButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    coverImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#F0F0F0',
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginTop: 12,
    },
    username: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
    },
    metaInfo: {
        marginTop: 12,
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F0F0F0',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        width: '100%',
    },
    followButton: {
        flex: 1,
        backgroundColor: '#4ECDC4',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    followingButton: {
        backgroundColor: '#F0F0F0',
    },
    followButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    followingButtonText: {
        color: '#333',
    },
    messageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F0F0F0',
        paddingVertical: 12,
        borderRadius: 8,
    },
    messageButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginTop: 8,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#333',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#999',
    },
    activeTabText: {
        color: '#333',
        fontWeight: '600',
    },
    postsGrid: {
        padding: 2,
    },
    postItem: {
        width: '33.33%',
        aspectRatio: 1,
        padding: 2,
    },
    postImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0',
    },
    postOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    postLikes: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    aboutSection: {
        padding: 20,
    },
    aboutText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
});
