import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DoubleTapLikeProps {
    onDoubleTap: () => void;
    children: React.ReactNode;
    style?: any;
}

export default function DoubleTapLike({ onDoubleTap, children, style }: DoubleTapLikeProps) {
    const lastTap = useRef<number>(0);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const handleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            onDoubleTap();

            // Trigger animation
            scaleAnim.setValue(0);
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 300,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        lastTap.current = now;
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
                        opacity: scaleAnim,
                        transform: [
                            {
                                scale: scaleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                        ],
                    },
                ]}
                pointerEvents="none"
            >
                <Ionicons name="heart" size={80} color="rgba(255, 255, 255, 0.9)" />
            </Animated.View>
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
});
