import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DoubleTapLikeProps {
    onDoubleTap: () => void;
    children: React.ReactNode;
    style?: any;
    initialLikes?: number;
    isLiked?: boolean;
}

export default function DoubleTapLike({ 
    onDoubleTap, 
    children, 
    style, 
    initialLikes = 0,
    isLiked = false 
}: DoubleTapLikeProps) {
    const lastTap = useRef<number>(0);
    const heartScaleAnim = useRef(new Animated.Value(0)).current;
    const popupOpacityAnim = useRef(new Animated.Value(0)).current;
    const popupScaleAnim = useRef(new Animated.Value(0)).current;
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const [showPopup, setShowPopup] = useState(false);

    const handleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            const wasLiked = liked;
            
            // Trigger haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // Update like state
            setLiked(!wasLiked);
            setLikes(prev => wasLiked ? prev - 1 : prev + 1);
            
            // Trigger animations
            triggerAnimations();
            
            // Show popup for both like and unlike
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            
            // Call callback
            onDoubleTap();
        }

        lastTap.current = now;
    };

    const triggerAnimations = () => {
        // Heart animation
        heartScaleAnim.setValue(0);
        Animated.sequence([
            Animated.spring(heartScaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(heartScaleAnim, {
                toValue: 0,
                duration: 300,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Popup animation
        popupOpacityAnim.setValue(0);
        popupScaleAnim.setValue(0);
        Animated.parallel([
            Animated.timing(popupOpacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(popupScaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Fade out popup after delay
        setTimeout(() => {
            Animated.timing(popupOpacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, 1500);
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={handleTap}
            style={style}
        >
            {children}

            {/* Heart animation overlay */}
            <Animated.View
                style={[
                    styles.heartOverlay,
                    {
                        opacity: heartScaleAnim,
                        transform: [
                            {
                                scale: heartScaleAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0, 1.2, 1],
                                }),
                            },
                        ],
                    },
                ]}
                pointerEvents="none"
            >
                <Ionicons 
                    name="heart" 
                    size={120} 
                    color={liked ? "#FF3B30" : "#fff"} 
                />
            </Animated.View>

            {/* Like popup */}
            {showPopup && (
                <Animated.View
                    style={[
                        styles.likePopup,
                        {
                            opacity: popupOpacityAnim,
                            transform: [
                                {
                                    scale: popupScaleAnim,
                                },
                            ],
                        },
                    ]}
                    pointerEvents="none"
                >
                    {/* Gradient background layers */}
                    <View style={styles.popupBackground}>
                        <View style={styles.gradientLayer1} />
                        <View style={styles.gradientLayer2} />
                        <View style={styles.gradientLayer3} />
                        <View style={styles.popupContent}>
                            <Ionicons 
                                name={liked ? "heart" : "heart-outline"} 
                                size={24} 
                                color={liked ? "#FF3B30" : "#fff"} 
                            />
                            <Text style={styles.likeText}>
                                {liked ? "Liked!" : "Unliked!"}
                            </Text>
                            <View style={styles.likesCount}>
                            <View style={styles.likesCountGradient} />
                            <Text style={styles.likesNumber}>{likes}</Text>
                            <Ionicons 
                                name="heart" 
                                size={12} 
                                color={liked ? "#FF3B30" : "#fff"} 
                            />
                        </View>
                        </View>
                    </View>
                </Animated.View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    heartOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    likePopup: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -30,
        marginLeft: -60,
        borderRadius: 20,
        overflow: 'hidden',
    },
    popupBackground: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    gradientLayer1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 59, 48, 0.3)',
        borderRadius: 20,
    },
    gradientLayer2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(255, 149, 0, 0.2)',
        borderRadius: 20,
    },
    gradientLayer3: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(88, 86, 214, 0.2)',
        borderRadius: 20,
    },
    popupContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    likeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    likesCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    likesCountGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        borderRadius: 10,
    },
    likesNumber: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
