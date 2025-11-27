import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3; // 3 columns with padding

// Mock user data
const userData = {
    name: 'Alex Travels',
    username: '@alextravels',
    bio: 'Adventure seeker & travel photographer.\nSharing the world one photo at a time.',
    location: '📍 Based in London',
    followers: '1.5k',
    following: 800,
    posts: 250,
    profileImage: 'https://i.pravatar.cc/150?img=12',
    citation: '[cite: 92]',
};

// Mock posts data
const posts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
    { id: 3, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80' },
    { id: 5, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80' },
    { id: 6, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' },
];

// Mock bucket list
const bucketList = [
    { id: 1, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
];

// Mock virtual tours
const virtualTours = [
    { id: 1, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'posts' | 'bucket' | 'tours'>('posts');

    const getTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return posts;
            case 'bucket':
                return bucketList;
            case 'tours':
                return virtualTours;
            default:
                return posts;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Profile</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wallet')}>
                        <Ionicons name="wallet-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Info Section */}
                <View style={styles.profileSection}>
                    {/* Profile Image and Stats */}
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                                <Text style={styles.citation}>{userData.citation}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Name and Bio */}
                    <View style={styles.bioSection}>
                        <Text style={styles.name}>{userData.name}</Text>
                        <Text style={styles.bio}>{userData.bio}</Text>
                        <Text style={styles.location}>{userData.location}</Text>
                        <Text style={styles.citation}>{userData.citation}</Text>
                    </View>

                    {/* Edit Profile Button */}
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                        onPress={() => setActiveTab('posts')}
                    >
                        <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                            Posts
                        </Text>
                        {activeTab === 'posts' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'bucket' && styles.activeTab]}
                        onPress={() => setActiveTab('bucket')}
                    >
                        <Text style={[styles.tabText, activeTab === 'bucket' && styles.activeTabText]}>
                            Bucket List
                        </Text>
                        <Text style={styles.tabCitation}>[cite: 52]</Text>
                        {activeTab === 'bucket' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'tours' && styles.activeTab]}
                        onPress={() => setActiveTab('tours')}
                    >
                        <Text style={[styles.tabText, activeTab === 'tours' && styles.activeTabText]}>
                            Virtual Tours
                        </Text>
                        <Text style={styles.tabCitation}>[cite: 46]</Text>
                        {activeTab === 'tours' && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                </View>

                {/* Photo Grid */}
                <View style={styles.gridContainer}>
                    {getTabContent().map((item) => (
                        <TouchableOpacity key={item.id} style={styles.gridItem}>
                            <Image source={{ uri: item.image }} style={styles.gridImage} />
                        </TouchableOpacity>
                    ))}
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
        backgroundColor: '#FFF',
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
        flex: 1,
        marginLeft: 12,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        backgroundColor: '#FFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    bioSection: {
        marginBottom: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    location: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    citation: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    editButton: {
        backgroundColor: '#0A5F5A',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        position: 'relative',
    },
    activeTab: {
        // Active tab styling
    },
    tabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#333',
        fontWeight: '600',
    },
    tabCitation: {
        fontSize: 9,
        color: '#999',
        marginTop: 2,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#0A5F5A',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
    },
    gridItem: {
        width: imageSize,
        height: imageSize,
        padding: 2,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#F0F0F0',
    },
});
