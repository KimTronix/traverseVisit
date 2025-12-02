import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUserMode } from '../context/UserModeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3; // 3 columns with padding



export default function ProfileScreen() {
    const router = useRouter();
    const { mode, toggleMode } = useUserMode();
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'posts' | 'bucket' | 'tours'>('posts');
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);

    // Profile state
    const [userData, setUserData] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<any[]>([]);

    // Load profile data on focus
    useFocusEffect(
        React.useCallback(() => {
            loadProfileData();
            loadUserPosts();
        }, [user])
    );

    const loadProfileData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error loading profile:', error);
                Alert.alert('Error', 'Failed to load profile data');
            } else {
                setUserData(data);
            }
        } catch (error) {
            console.error('Exception loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserPosts = async () => {
        if (!user) return;

        setPostsLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading posts:', error);
            } else {
                setUserPosts(data || []);
            }
        } catch (error) {
            console.error('Exception loading posts:', error);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/welcome');
                    },
                },
            ]
        );
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0]) {
            // TODO: Upload to Supabase Storage and update profile
            Alert.alert('Coming Soon', 'Profile photo upload will be implemented soon!');
        }
    };

    const getTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return userPosts;
            case 'bucket':
                return []; // TODO: Implement bucket list from database
            case 'tours':
                return []; // TODO: Implement virtual tours from database
            default:
                return userPosts;
        }
    };

    const navigation = useNavigation();

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // If in host mode, go to dashboard. If in traveler mode, go to home.
            if (mode === 'host') {
                router.replace('/provider-admin');
            } else {
                router.replace('/(tabs)');
            }
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!userData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Failed to load profile</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wallet')}>
                        <Ionicons name="wallet-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
                        <Ionicons name="settings-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Info Section */}
                <View style={styles.profileSection}>
                    {/* Profile Image and Stats */}
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: userData.avatar_url }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity
                                style={styles.addStoryButton}
                                onPress={pickImage}
                            >
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.followers_count || 0}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.following_count || 0}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{userData.posts_count || 0}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                        </View>
                    </View>

                    {/* Name and Bio */}
                    <View style={styles.bioSection}>
                        <Text style={styles.name}>{userData.full_name || 'User'}</Text>
                        {userData.username && (
                            <Text style={styles.username}>@{userData.username}</Text>
                        )}
                        {userData.bio && (
                            <Text style={styles.bio}>{userData.bio}</Text>
                        )}
                        {userData.location && (
                            <Text style={styles.location}>📍 {userData.location}</Text>
                        )}
                    </View>

                    {/* Edit Profile Button */}
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* Mode Switch Button */}
                    <TouchableOpacity
                        style={[styles.modeButton, mode === 'host' ? styles.modeButtonHost : styles.modeButtonTraveler]}
                        onPress={toggleMode}
                    >
                        <Ionicons
                            name={mode === 'host' ? 'airplane-outline' : 'business-outline'}
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.modeButtonText}>
                            {mode === 'host' ? 'Switch to Traveler Mode' : 'Switch to Host Mode'}
                        </Text>
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
                    {postsLoading ? (
                        <View style={styles.emptyContainer}>
                            <ActivityIndicator size="large" color="#4ECDC4" />
                            <Text style={styles.emptyText}>Loading posts...</Text>
                        </View>
                    ) : getTabContent().length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="images-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>
                                {activeTab === 'posts' ? 'No posts yet' :
                                    activeTab === 'bucket' ? 'No bucket list items' :
                                        'No virtual tours'}
                            </Text>
                            <Text style={styles.emptySubtext}>
                                {activeTab === 'posts' ? 'Share your travel experiences!' :
                                    activeTab === 'bucket' ? 'Add places you want to visit' :
                                        'Create virtual tours'}
                            </Text>
                        </View>
                    ) : (
                        getTabContent().map((item) => (
                            <TouchableOpacity key={item.id} style={styles.gridItem}>
                                <Image
                                    source={{ uri: item.media_urls?.[0] || item.image || 'https://via.placeholder.com/150' }}
                                    style={styles.gridImage}
                                />
                            </TouchableOpacity>
                        ))
                    )}
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
    profileImageContainer: {
        position: 'relative',
        marginRight: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    addStoryButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4ECDC4',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
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
    modeButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        gap: 8,
    },
    modeButtonHost: {
        backgroundColor: '#FF9800',
    },
    modeButtonTraveler: {
        backgroundColor: '#0A5F5A',
    },
    modeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    username: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
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
        minHeight: 200,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        minHeight: 300,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
});

