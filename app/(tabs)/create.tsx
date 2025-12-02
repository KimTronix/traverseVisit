import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CreateScreen() {
    const router = useRouter();
    const [pressedCard, setPressedCard] = useState<string | null>(null);

    const createOptions = [
        {
            id: 'group-planning',
            icon: 'people-outline',
            title: 'Group Planning',
            description: 'Plan trips with friends and family',
            gradient: ['#667eea', '#764ba2'],
            route: '/group-planning',
        },
        {
            id: 'create-post',
            icon: 'camera-outline',
            title: 'Share Post',
            description: 'Share your travel experiences',
            gradient: ['#f093fb', '#f5576c'],
            route: '/create-post',
        },
        {
            id: 'plan-trip',
            icon: 'map-outline',
            title: 'Plan Trip',
            description: 'Explore amazing destinations',
            gradient: ['#4facfe', '#00f2fe'],
            route: '/destination-map',
        },
        {
            id: 'register-business',
            icon: 'briefcase-outline',
            title: 'Register Business',
            description: 'Become a service provider',
            gradient: ['#43e97b', '#38f9d7'],
            route: '/business-registration',
        },
        {
            id: 'create-event',
            icon: 'calendar-outline',
            title: 'Create Event',
            description: 'Organize meetups and activities',
            gradient: ['#fa709a', '#fee140'],
            route: '/create-event',
        },
        {
            id: 'write-review',
            icon: 'star-outline',
            title: 'Write Review',
            description: 'Share your experiences',
            gradient: ['#30cfd0', '#330867'],
            route: '/write-review',
        },
    ];

    const handleCardPress = (route: string, id: string) => {
        setPressedCard(id);
        setTimeout(() => {
            setPressedCard(null);
            // Use any to bypass strict route checking for demo purposes
            router.push(route as any);
        }, 150);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="add-circle" size={48} color="#4ECDC4" />
                    </View>
                    <Text style={styles.title}>Create</Text>
                    <Text style={styles.subtitle}>Start your next adventure</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => router.push('/create-post')}
                    >
                        <View style={styles.quickActionIcon}>
                            <Ionicons name="camera" size={24} color="#fff" />
                        </View>
                        <Text style={styles.quickActionText}>Quick Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => router.push('/destination-map')}
                    >
                        <View style={styles.quickActionIcon}>
                            <Ionicons name="map" size={24} color="#fff" />
                        </View>
                        <Text style={styles.quickActionText}>Quick Trip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickAction}
                        onPress={() => router.push('/create-event' as any)}
                    >
                        <View style={styles.quickActionIcon}>
                            <Ionicons name="calendar" size={24} color="#fff" />
                        </View>
                        <Text style={styles.quickActionText}>Quick Event</Text>
                    </TouchableOpacity>
                </View>

                {/* Create Options Grid */}
                <View style={styles.optionsGrid}>
                    {createOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                pressedCard === option.id && styles.optionCardPressed,
                                { backgroundColor: '#fff' }
                            ]}
                            onPress={() => handleCardPress(option.route, option.id)}
                            activeOpacity={0.9}
                        >
                            <View style={[styles.optionIcon, { backgroundColor: `${option.gradient[0]}20` }]}>
                                <Ionicons 
                                    name={option.icon as any} 
                                    size={28} 
                                    color={option.gradient[0]} 
                                />
                            </View>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionDescription}>{option.description}</Text>
                            <View style={styles.optionArrow}>
                                <Ionicons name="chevron-forward" size={20} color="#4ECDC4" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Inspiration Section */}
                <View style={styles.inspirationSection}>
                    <Text style={styles.sectionTitle}>Need Inspiration?</Text>
                    <View style={styles.inspirationCards}>
                        <TouchableOpacity style={styles.inspirationCard}>
                            <Ionicons name="trending-up" size={24} color="#4ECDC4" />
                            <Text style={styles.inspirationTitle}>Trending</Text>
                            <Text style={styles.inspirationCount}>245 places</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.inspirationCard}>
                            <Ionicons name="heart" size={24} color="#FF6B6B" />
                            <Text style={styles.inspirationTitle}>Popular</Text>
                            <Text style={styles.inspirationCount}>189 places</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.inspirationCard}>
                            <Ionicons name="location" size={24} color="#4ECDC4" />
                            <Text style={styles.inspirationTitle}>Nearby</Text>
                            <Text style={styles.inspirationCount}>42 places</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    quickAction: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    optionsGrid: {
        gap: 16,
        marginBottom: 32,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    optionCardPressed: {
        transform: [{ scale: 0.98 }],
        shadowOpacity: 0.15,
        elevation: 5,
    },
    optionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        flex: 1,
    },
    optionArrow: {
        marginLeft: 12,
    },
    inspirationSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    inspirationCards: {
        flexDirection: 'row',
        gap: 12,
    },
    inspirationCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inspirationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 8,
    },
    inspirationCount: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
