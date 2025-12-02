import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface SkeletonLoaderProps {
    type: 'post' | 'destination-grid' | 'profile' | 'booking' | 'property';
    count?: number;
}

export function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (type) {
            case 'post':
                return (
                    <View style={styles.postSkeleton}>
                        <View style={styles.postHeader}>
                            <View style={[styles.avatar, styles.skeleton]} />
                            <View style={styles.postHeaderInfo}>
                                <View style={[styles.username, styles.skeleton]} />
                                <View style={[styles.timestamp, styles.skeleton]} />
                            </View>
                        </View>
                        <View style={[styles.postImage, styles.skeleton]} />
                        <View style={styles.postActions}>
                            <View style={[styles.actionButton, styles.skeleton]} />
                            <View style={[styles.actionButton, styles.skeleton]} />
                            <View style={[styles.actionButton, styles.skeleton]} />
                        </View>
                        <View style={[styles.caption, styles.skeleton]} />
                    </View>
                );

            case 'destination-grid':
                return (
                    <View style={styles.destinationSkeleton}>
                        <View style={[styles.destinationImage, styles.skeleton]} />
                        <View style={[styles.destinationName, styles.skeleton]} />
                    </View>
                );

            case 'profile':
                return (
                    <View style={styles.profileSkeleton}>
                        <View style={[styles.profileAvatar, styles.skeleton]} />
                        <View style={[styles.profileName, styles.skeleton]} />
                        <View style={[styles.profileBio, styles.skeleton]} />
                        <View style={styles.profileStats}>
                            <View style={[styles.statItem, styles.skeleton]} />
                            <View style={[styles.statItem, styles.skeleton]} />
                            <View style={[styles.statItem, styles.skeleton]} />
                        </View>
                    </View>
                );

            case 'booking':
                return (
                    <View style={styles.bookingSkeleton}>
                        <View style={styles.bookingHeader}>
                            <View style={[styles.bookingImage, styles.skeleton]} />
                            <View style={styles.bookingInfo}>
                                <View style={[styles.bookingTitle, styles.skeleton]} />
                                <View style={[styles.bookingLocation, styles.skeleton]} />
                                <View style={[styles.bookingDate, styles.skeleton]} />
                            </View>
                        </View>
                        <View style={styles.bookingDetails}>
                            <View style={[styles.bookingDetail, styles.skeleton]} />
                            <View style={[styles.bookingDetail, styles.skeleton]} />
                        </View>
                    </View>
                );

            case 'property':
                return (
                    <View style={styles.propertySkeleton}>
                        <View style={[styles.propertyImage, styles.skeleton]} />
                        <View style={styles.propertyInfo}>
                            <View style={[styles.propertyName, styles.skeleton]} />
                            <View style={[styles.propertyLocation, styles.skeleton]} />
                            <View style={[styles.propertyRating, styles.skeleton]} />
                            <View style={[styles.propertyPrice, styles.skeleton]} />
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: count }, (_, index) => (
                <View key={index} style={styles.skeletonItem}>
                    {renderSkeleton()}
                </View>
            ))}
        </View>
    );
}

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    text?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', text, fullScreen = false }: LoadingSpinnerProps) {
    const content = (
        <View style={[styles.loadingContainer, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color="#007AFF" />
            {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
    );

    return fullScreen ? content : content;
}

interface FullPageLoaderProps {
    text?: string;
}

export function FullPageLoader({ text = 'Loading...' }: FullPageLoaderProps) {
    return (
        <View style={styles.fullPageContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.fullPageText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skeletonItem: {
        marginBottom: 16,
    },
    skeleton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    
    // Post skeleton
    postSkeleton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    postHeaderInfo: {
        flex: 1,
    },
    username: {
        height: 16,
        width: 120,
        marginBottom: 4,
    },
    timestamp: {
        height: 12,
        width: 80,
    },
    postImage: {
        height: 300,
        width: '100%',
        marginBottom: 12,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    actionButton: {
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    caption: {
        height: 14,
        width: '80%',
    },

    // Destination skeleton
    destinationSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    destinationImage: {
        height: 150,
        width: '100%',
    },
    destinationName: {
        height: 16,
        width: 100,
        margin: 12,
    },

    // Profile skeleton
    profileSkeleton: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    profileName: {
        height: 20,
        width: 150,
        marginBottom: 8,
    },
    profileBio: {
        height: 14,
        width: 200,
        marginBottom: 16,
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statItem: {
        height: 16,
        width: 60,
    },

    // Booking skeleton
    bookingSkeleton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    bookingHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    bookingImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    bookingInfo: {
        flex: 1,
    },
    bookingTitle: {
        height: 16,
        width: 150,
        marginBottom: 4,
    },
    bookingLocation: {
        height: 12,
        width: 120,
        marginBottom: 4,
    },
    bookingDate: {
        height: 12,
        width: 100,
    },
    bookingDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    bookingDetail: {
        height: 12,
        width: '80%',
        marginBottom: 4,
    },

    // Property skeleton
    propertySkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    propertyImage: {
        height: 200,
        width: '100%',
    },
    propertyInfo: {
        padding: 16,
    },
    propertyName: {
        height: 18,
        width: 180,
        marginBottom: 8,
    },
    propertyLocation: {
        height: 14,
        width: 140,
        marginBottom: 8,
    },
    propertyRating: {
        height: 14,
        width: 80,
        marginBottom: 8,
    },
    propertyPrice: {
        height: 20,
        width: 100,
    },

    // Loading states
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    fullScreen: {
        flex: 1,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
    },
    fullPageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    fullPageText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
});
