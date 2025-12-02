import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock search results
const mockResults = {
    destinations: [
        {
            id: '1',
            type: 'destination',
            name: 'Santorini',
            country: 'Greece',
            image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
        },
        {
            id: '2',
            type: 'destination',
            name: 'Bali',
            country: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        },
    ],
    users: [
        {
            id: '3',
            type: 'user',
            name: 'Sarah Johnson',
            username: '@sarahj',
            avatar: 'https://i.pravatar.cc/150?img=1',
            followers: '1.5k',
        },
        {
            id: '4',
            type: 'user',
            name: 'Mike Chen',
            username: '@mikec',
            avatar: 'https://i.pravatar.cc/150?img=3',
            followers: '892',
        },
    ],
    posts: [
        {
            id: '5',
            type: 'post',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
            caption: 'Amazing sunset in Santorini',
            likes: 324,
        },
        {
            id: '6',
            type: 'post',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
            caption: 'Exploring Paris',
            likes: 256,
        },
    ],
};

export default function SearchResultsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'users' | 'posts'>('all');

    const allResults = [
        ...mockResults.destinations,
        ...mockResults.users,
        ...mockResults.posts,
    ];

    const getFilteredResults = () => {
        if (activeTab === 'all') return allResults;
        if (activeTab === 'destinations') return mockResults.destinations;
        if (activeTab === 'users') return mockResults.users;
        if (activeTab === 'posts') return mockResults.posts;
        return [];
    };

    const renderDestination = (item: any) => (
        <TouchableOpacity
            style={styles.destinationCard}
            onPress={() => router.push('/destination-details' as any)}
        >
            <Image source={{ uri: item.image }} style={styles.destinationImage} />
            <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{item.name}</Text>
                <Text style={styles.destinationCountry}>{item.country}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderUser = (item: any) => (
        <TouchableOpacity
            style={styles.userCard}
            onPress={() => router.push('/user-profile' as any)}
        >
            <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userUsername}>{item.username}</Text>
                <Text style={styles.userFollowers}>{item.followers} followers</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderPost = (item: any) => (
        <TouchableOpacity
            style={styles.postCard}
            onPress={() => router.push('/post-comments' as any)}
        >
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postOverlay}>
                <Ionicons name="heart" size={16} color="#FFF" />
                <Text style={styles.postLikes}>{item.likes}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: any }) => {
        if (item.type === 'destination') return renderDestination(item);
        if (item.type === 'user') return renderUser(item);
        if (item.type === 'post') return renderPost(item);
        return null;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search destinations, users, posts..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'destinations' && styles.activeTab]}
                    onPress={() => setActiveTab('destinations')}
                >
                    <Text style={[styles.tabText, activeTab === 'destinations' && styles.activeTabText]}>
                        Destinations
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => setActiveTab('users')}
                >
                    <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
                        Users
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                    onPress={() => setActiveTab('posts')}
                >
                    <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                        Posts
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Results */}
            <FlatList
                data={getFilteredResults()}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyTitle}>No results found</Text>
                        <Text style={styles.emptyText}>Try searching for something else</Text>
                    </View>
                }
            />
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 16,
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
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    destinationCard: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    destinationImage: {
        width: 100,
        height: 100,
    },
    destinationInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    destinationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    destinationCountry: {
        fontSize: 14,
        color: '#666',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    userAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userUsername: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    userFollowers: {
        fontSize: 13,
        color: '#999',
        marginTop: 4,
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
        color: '#FFF',
    },
    postCard: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: 16,
        marginRight: '2%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    postImage: {
        width: '100%',
        height: '100%',
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});
