import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const benefits = [
    {
        icon: 'cash-outline',
        title: 'Earn Extra Income',
        description: 'Set your own prices and earn money by sharing your space with travelers',
        color: '#4CAF50',
    },
    {
        icon: 'people-outline',
        title: 'Meet Travelers',
        description: 'Connect with people from around the world and share local experiences',
        color: '#2196F3',
    },
    {
        icon: 'calendar-outline',
        title: 'Flexible Schedule',
        description: 'You control when your property is available and who can book it',
        color: '#FF9800',
    },
    {
        icon: 'shield-checkmark-outline',
        title: 'Host Protection',
        description: 'Comprehensive insurance coverage and 24/7 support for all hosts',
        color: '#9C27B0',
    },
];

const requirements = [
    'Property must meet safety standards',
    'Valid business license or registration',
    'Accurate property description and photos',
    'Responsive to guest inquiries',
    'Maintain cleanliness standards',
];

const testimonials = [
    {
        name: 'Sarah Johnson',
        location: 'New York, USA',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: "Hosting has been an amazing experience! I've met wonderful people and earned great income.",
        earnings: '$12,500/month',
    },
    {
        name: 'Michael Chen',
        location: 'Tokyo, Japan',
        avatar: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        text: 'The platform makes hosting so easy. Great support team and reliable bookings.',
        earnings: '$8,200/month',
    },
];

export default function HostOnboardingScreen() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/business-registration');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Become a Host</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={{ uri: 'https://picsum.photos/800/400?random=host' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Share Your Space,{'\n'}Earn Money</Text>
                        <Text style={styles.heroSubtitle}>
                            Join thousands of hosts earning extra income
                        </Text>
                    </View>
                </View>

                {/* Benefits Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Become a Host?</Text>
                    <View style={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitCard}>
                                <View
                                    style={[
                                        styles.benefitIcon,
                                        { backgroundColor: `${benefit.color}20` },
                                    ]}
                                >
                                    <Ionicons name={benefit.icon as any} size={32} color={benefit.color} />
                                </View>
                                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                <Text style={styles.benefitDescription}>{benefit.description}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Requirements Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    <View style={styles.requirementsCard}>
                        {requirements.map((requirement, index) => (
                            <View key={index} style={styles.requirementItem}>
                                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
                                <Text style={styles.requirementText}>{requirement}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Testimonials Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Success Stories</Text>
                    {testimonials.map((testimonial, index) => (
                        <View key={index} style={styles.testimonialCard}>
                            <View style={styles.testimonialHeader}>
                                <Image
                                    source={{ uri: testimonial.avatar }}
                                    style={styles.testimonialAvatar}
                                />
                                <View style={styles.testimonialInfo}>
                                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                                    <Text style={styles.testimonialLocation}>
                                        {testimonial.location}
                                    </Text>
                                    <View style={styles.ratingRow}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Ionicons key={i} name="star" size={14} color="#FFB800" />
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.earningsTag}>
                                    <Text style={styles.earningsText}>{testimonial.earnings}</Text>
                                </View>
                            </View>
                            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                        </View>
                    ))}
                </View>

                {/* How It Works Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How It Works</Text>
                    <View style={styles.stepsContainer}>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Register Your Business</Text>
                                <Text style={styles.stepDescription}>
                                    Provide your business details and upload required documents
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Get Verified</Text>
                                <Text style={styles.stepDescription}>
                                    Our team reviews your application (usually within 24-48 hours)
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>List Your Property</Text>
                                <Text style={styles.stepDescription}>
                                    Add photos, set prices, and publish your listing
                                </Text>
                            </View>
                        </View>

                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>4</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Start Hosting</Text>
                                <Text style={styles.stepDescription}>
                                    Accept bookings and welcome guests to your property
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    <TouchableOpacity style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>How much can I earn as a host?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>What fees does the platform charge?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>How do I handle guest issues?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Fixed Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
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
    heroSection: {
        position: 'relative',
        height: 250,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    benefitsGrid: {
        gap: 16,
    },
    benefitCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    benefitIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    benefitDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    requirementsCard: {
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
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    requirementText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    testimonialCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    testimonialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    testimonialAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    testimonialInfo: {
        flex: 1,
    },
    testimonialName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    testimonialLocation: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 4,
    },
    earningsTag: {
        backgroundColor: '#4ECDC420',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    earningsText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    testimonialText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    stepsContainer: {
        gap: 20,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 16,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
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
    faqItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    faqQuestion: {
        fontSize: 15,
        color: '#333',
        flex: 1,
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
    getStartedButton: {
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    getStartedButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
