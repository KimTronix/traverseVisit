import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Animated,
    Easing,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getStoryById, getUserStories, markStoryAsViewed, StoryData } from '../utils/storyStorage';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 10000; // 10 seconds per story

export default function ViewStoryScreen() {
    const router = useRouter();
    const { storyId } = useLocalSearchParams<{ storyId: string }>();
    const [stories, setStories] = useState<StoryData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Animation state
    const progress = useRef(new Animated.Value(0)).current;
    const [isPaused, setIsPaused] = useState(false);
    const startTimeRef = useRef<number>(0);
    const remainingTimeRef = useRef<number>(STORY_DURATION);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        loadStoriesData();
    }, [storyId]);

    useEffect(() => {
        if (stories.length > 0 && !loading) {
            const currentStory = stories[currentIndex];
            if (currentStory) {
                markStoryAsViewed(currentStory.id).catch(console.error);
            }
            resetAndStartAnimation();
        }
        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [currentIndex, stories, loading]);

    const loadStoriesData = async () => {
        if (!storyId) {
            router.back();
            return;
        }

        try {
            const initialStory = await getStoryById(storyId);
            if (initialStory) {
                // Get all stories for this user
                const userStories = await getUserStories(initialStory.userId);
                // Sort stories: Oldest to Newest for playback
                const sortedStories = [...userStories].reverse();

                setStories(sortedStories);

                // Find index of the requested story
                const index = sortedStories.findIndex(s => s.id === storyId);
                setCurrentIndex(index !== -1 ? index : 0);
            } else {
                router.back();
            }
        } catch (error) {
            console.error('Error loading stories:', error);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const resetAndStartAnimation = () => {
        progress.setValue(0);
        remainingTimeRef.current = STORY_DURATION;
        startAnimation();
    };

    const startAnimation = () => {
        if (remainingTimeRef.current <= 0) {
            nextStory();
            return;
        }

        startTimeRef.current = Date.now();

        animationRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: remainingTimeRef.current,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        animationRef.current.start(({ finished }) => {
            if (finished) {
                nextStory();
            }
        });
    };

    const pauseAnimation = () => {
        if (animationRef.current) {
            animationRef.current.stop();
            const elapsed = Date.now() - startTimeRef.current;
            remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
            setIsPaused(true);
        }
    };

    const resumeAnimation = () => {
        setIsPaused(false);
        startAnimation();
    };

    const nextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            router.back();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // Restart current story
            resetAndStartAnimation();
        }
    };

    const handlePress = (evt: any) => {
        const x = evt.nativeEvent.locationX;
        if (x < width / 3) {
            prevStory();
        } else {
            nextStory();
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        }
        return `${hours}h ago`;
    };

    const formatExpiryTime = (expiresAt: number) => {
        const now = Date.now();
        const diff = expiresAt - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m left`;
        }
        return `${minutes}m left`;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
            </SafeAreaView>
        );
    }

    if (stories.length === 0) {
        return null;
    }

    const currentStory = stories[currentIndex];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Pressable
                style={styles.storyContainer}
                onPressIn={pauseAnimation}
                onPressOut={resumeAnimation}
                onPress={handlePress}
            >
                {/* Story Content */}
                {currentStory.type === 'image' && currentStory.imageUrl ? (
                    <Image
                        source={{ uri: currentStory.imageUrl }}
                        style={styles.storyImage}
                        resizeMode="cover"
                    />
                ) : currentStory.type === 'text' ? (
                    <View style={[styles.textStoryContainer, { backgroundColor: currentStory.backgroundColor }]}>
                        <Text style={styles.storyText}>{currentStory.text}</Text>
                    </View>
                ) : null}

                {/* Progress Bars */}
                <View style={styles.progressContainer}>
                    {stories.map((_, index) => (
                        <View key={index} style={styles.progressBarBackground}>
                            <Animated.View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: index === currentIndex
                                            ? progress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%']
                                            })
                                            : index < currentIndex ? '100%' : '0%'
                                    }
                                ]}
                            />
                        </View>
                    ))}
                </View>

                {/* Header with User Info */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: currentStory.userImage }}
                            style={styles.userImage}
                        />
                        <View style={styles.userDetails}>
                            <Text style={styles.username}>{currentStory.username}</Text>
                            <Text style={styles.timestamp}>{formatTimestamp(currentStory.timestamp)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Story Stats Footer */}
                <View style={styles.footer}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={20} color="#FFF" />
                            <Text style={styles.statText}>
                                {currentStory.viewedBy.length} {currentStory.viewedBy.length === 1 ? 'view' : 'views'}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={20} color="#FFF" />
                            <Text style={styles.statText}>{formatExpiryTime(currentStory.expiresAt)}</Text>
                        </View>
                    </View>

                    {/* Viewer List */}
                    {currentStory.viewedBy.length > 0 && !isPaused && (
                        <ScrollView
                            style={styles.viewersList}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.viewersTitle}>Viewed by:</Text>
                            {currentStory.viewedBy.map((viewerId, index) => (
                                <View key={index} style={styles.viewerItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                                    <Text style={styles.viewerText}>User {viewerId.substring(0, 8)}...</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyContainer: {
        flex: 1,
        position: 'relative',
    },
    storyImage: {
        width: width,
        height: height,
        backgroundColor: '#000',
    },
    textStoryContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    storyText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 44,
    },
    progressContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        gap: 4,
        zIndex: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
    },
    header: {
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userDetails: {
        marginLeft: 10,
    },
    username: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    timestamp: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 16,
        zIndex: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
        padding: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    viewersList: {
        maxHeight: 150,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
        padding: 12,
    },
    viewersTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8,
        opacity: 0.8,
    },
    viewerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    viewerText: {
        fontSize: 13,
        color: '#FFF',
    },
});
