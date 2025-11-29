import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PropertyPublishedScreen() {
    const router = useRouter();

    const handleViewListing = () => {
        // Navigate to property details
        router.push('/manage-listings');
    };

    const handleAddAnother = () => {
        router.push('/add-property/index' as any);
    };

    const handleGoToDashboard = () => {
        router.push('/provider-admin');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Success Icon */}
                <View style={styles.successIcon}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={64} color="#fff" />
                    </View>
                </View>

                {/* Success Message */}
                <Text style={styles.title}>Property Published!</Text>
                <Text style={styles.subtitle}>
                    Your listing is now live and ready to receive bookings
                </Text>

                {/* Property Preview Card */}
                <View style={styles.previewCard}>
                    <Image
                        source={{ uri: 'https://picsum.photos/400/300?random=property' }}
                        style={styles.previewImage}
                    />
                    <View style={styles.previewContent}>
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.statusText}>Active</Text>
                        </View>
                        <Text style={styles.previewTitle}>Your Property is Live</Text>
                        <Text style={styles.previewDescription}>
                            Travelers can now discover and book your property
                        </Text>
                    </View>
                </View>

                {/* What's Next */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What's Next?</Text>
                    <View style={styles.nextStepsCard}>
                        <View style={styles.nextStep}>
                            <View style={styles.stepIcon}>
                                <Ionicons name="notifications-outline" size={24} color="#4ECDC4" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Get Notified</Text>
                                <Text style={styles.stepDescription}>
                                    We'll notify you when someone books your property
                                </Text>
                            </View>
                        </View>

                        <View style={styles.nextStep}>
                            <View style={styles.stepIcon}>
                                <Ionicons name="calendar-outline" size={24} color="#4ECDC4" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Manage Bookings</Text>
                                <Text style={styles.stepDescription}>
                                    Accept or decline booking requests from your dashboard
                                </Text>
                            </View>
                        </View>

                        <View style={styles.nextStep}>
                            <View style={styles.stepIcon}>
                                <Ionicons name="chatbubbles-outline" size={24} color="#4ECDC4" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Communicate</Text>
                                <Text style={styles.stepDescription}>
                                    Message guests directly through the app
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pro Tips</Text>
                    <View style={styles.tipsCard}>
                        <View style={styles.tip}>
                            <Ionicons name="bulb-outline" size={20} color="#FFB800" />
                            <Text style={styles.tipText}>
                                Respond to inquiries within 24 hours to boost your ranking
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="bulb-outline" size={20} color="#FFB800" />
                            <Text style={styles.tipText}>
                                Keep your calendar updated to avoid double bookings
                            </Text>
                        </View>
                        <View style={styles.tip}>
                            <Ionicons name="bulb-outline" size={20} color="#FFB800" />
                            <Text style={styles.tipText}>
                                High-quality photos get 3x more bookings
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleViewListing}>
                        <Ionicons name="eye-outline" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>View Listing</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleAddAnother}>
                        <Ionicons name="add-circle-outline" size={20} color="#4ECDC4" />
                        <Text style={styles.secondaryButtonText}>Add Another Property</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tertiaryButton} onPress={handleGoToDashboard}>
                        <Text style={styles.tertiaryButtonText}>Go to Dashboard</Text>
                    </TouchableOpacity>
                </View>

                {/* Share */}
                <View style={styles.shareSection}>
                    <Text style={styles.shareTitle}>Share Your Listing</Text>
                    <View style={styles.shareButtons}>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="link-outline" size={24} color="#666" />
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
    content: {
        padding: 24,
        alignItems: 'center',
    },
    successIcon: {
        marginTop: 40,
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    previewCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    previewImage: {
        width: '100%',
        height: 200,
    },
    previewContent: {
        padding: 20,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#4CAF5020',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4CAF50',
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    previewDescription: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        width: '100%',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    nextStepsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        gap: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    nextStep: {
        flexDirection: 'row',
        gap: 16,
    },
    stepIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4ECDC420',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    tipsCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 16,
        padding: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    tip: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    actionsContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    tertiaryButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    shareSection: {
        width: '100%',
        alignItems: 'center',
    },
    shareTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    shareButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    shareButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
