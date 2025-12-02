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

const timeline = [
    {
        title: 'Application Submitted',
        description: 'We received your application',
        status: 'completed',
        time: 'Just now',
    },
    {
        title: 'Document Review',
        description: 'Verifying your business license and documents',
        status: 'in-progress',
        time: 'In progress',
    },
    {
        title: 'Background Check',
        description: 'Standard verification process',
        status: 'pending',
        time: 'Pending',
    },
    {
        title: 'Approval',
        description: 'Final review and account activation',
        status: 'pending',
        time: 'Pending',
    },
];

export default function VerificationPendingScreen() {
    const router = useRouter();

    const handleContinueBrowsing = () => {
        router.push('/(tabs)');
    };

    const handleContactSupport = () => {
        // Navigate to support/help screen
        console.log('Contact support');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification Status</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusIcon}>
                        <Ionicons name="time-outline" size={48} color="#FF9800" />
                    </View>
                    <Text style={styles.statusTitle}>Verification in Progress</Text>
                    <Text style={styles.statusDescription}>
                        We're reviewing your application. This usually takes 24-48 hours.
                    </Text>
                    <View style={styles.estimateTag}>
                        <Ionicons name="clock-outline" size={16} color="#FF9800" />
                        <Text style={styles.estimateText}>Estimated: 1-2 business days</Text>
                    </View>
                </View>

                {/* Timeline */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Verification Progress</Text>
                    <View style={styles.timelineContainer}>
                        {timeline.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View
                                        style={[
                                            styles.timelineDot,
                                            item.status === 'completed' && styles.timelineDotCompleted,
                                            item.status === 'in-progress' && styles.timelineDotInProgress,
                                        ]}
                                    >
                                        {item.status === 'completed' && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    {index < timeline.length - 1 && (
                                        <View
                                            style={[
                                                styles.timelineLine,
                                                item.status === 'completed' && styles.timelineLineCompleted,
                                            ]}
                                        />
                                    )}
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineTitle}>{item.title}</Text>
                                    <Text style={styles.timelineDescription}>{item.description}</Text>
                                    <Text style={styles.timelineTime}>{item.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* What's Next */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What Happens Next?</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={24} color="#4ECDC4" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Email Notification</Text>
                                <Text style={styles.infoDescription}>
                                    We'll send you an email once your account is verified
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="home-outline" size={24} color="#4ECDC4" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>List Your Property</Text>
                                <Text style={styles.infoDescription}>
                                    After approval, you can start adding your properties
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="cash-outline" size={24} color="#4ECDC4" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Start Earning</Text>
                                <Text style={styles.infoDescription}>
                                    Begin accepting bookings and earning income
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Help Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Need Help?</Text>
                    <TouchableOpacity style={styles.helpCard} onPress={handleContactSupport}>
                        <View style={styles.helpIcon}>
                            <Ionicons name="chatbubble-ellipses-outline" size={32} color="#4ECDC4" />
                        </View>
                        <View style={styles.helpContent}>
                            <Text style={styles.helpTitle}>Contact Support</Text>
                            <Text style={styles.helpDescription}>
                                Have questions? Our team is here to help
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinueBrowsing}
                >
                    <Text style={styles.continueButtonText}>Continue Browsing</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    statusCard: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statusIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF980020',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    statusDescription: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    estimateTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FF980020',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    estimateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF9800',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    timelineContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 16,
    },
    timelineLeft: {
        alignItems: 'center',
    },
    timelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineDotCompleted: {
        backgroundColor: '#4CAF50',
    },
    timelineDotInProgress: {
        backgroundColor: '#FF9800',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    timelineLineCompleted: {
        backgroundColor: '#4CAF50',
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 24,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    timelineDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    timelineTime: {
        fontSize: 12,
        color: '#999',
    },
    infoCard: {
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
    infoItem: {
        flexDirection: 'row',
        gap: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    helpIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4ECDC420',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpContent: {
        flex: 1,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    helpDescription: {
        fontSize: 14,
        color: '#666',
    },
    bottomPadding: {
        height: 100,
    },
    bottomBar: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
