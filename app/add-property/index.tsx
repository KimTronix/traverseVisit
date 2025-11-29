import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = ['Basic Info', 'Location & Pricing', 'Review'];

export default function AddPropertyScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    // Form state
    const [propertyData, setPropertyData] = useState({
        name: '',
        type: 'apartment',
        description: '',
        maxGuests: '',
        bedrooms: '',
        bathrooms: '',
        address: '',
        city: '',
        country: '',
        pricePerNight: '',
        currency: 'USD',
        cleaningFee: '',
        minNights: '1',
    });

    const propertyTypes = [
        { value: 'apartment', label: 'Apartment', icon: 'business-outline' },
        { value: 'house', label: 'House', icon: 'home-outline' },
        { value: 'villa', label: 'Villa', icon: 'home-outline' },
        { value: 'cabin', label: 'Cabin', icon: 'log-cabin-outline' },
        { value: 'hotel', label: 'Hotel Room', icon: 'bed-outline' },
    ];

    const handleNext = () => {
        // Validate current step
        if (currentStep === 0) {
            if (!propertyData.name || !propertyData.description) {
                Alert.alert('Required Fields', 'Please fill in all required fields');
                return;
            }
        } else if (currentStep === 1) {
            if (!propertyData.address || !propertyData.pricePerNight) {
                Alert.alert('Required Fields', 'Please fill in all required fields');
                return;
            }
        }

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handlePublish = () => {
        // Submit property
        Alert.alert(
            'Publish Listing',
            'Are you ready to publish your property?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Publish',
                    onPress: () => {
                        // Navigate to success screen
                        router.push('/property-published');
                    },
                },
            ]
        );
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tell us about your property</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Property Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Cozy Beach House"
                    value={propertyData.name}
                    onChangeText={(text) => setPropertyData({ ...propertyData, name: text })}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Property Type *</Text>
                <View style={styles.typeGrid}>
                    {propertyTypes.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            style={[
                                styles.typeCard,
                                propertyData.type === type.value && styles.typeCardSelected,
                            ]}
                            onPress={() => setPropertyData({ ...propertyData, type: type.value })}
                        >
                            <Ionicons
                                name={type.icon as any}
                                size={28}
                                color={propertyData.type === type.value ? '#4ECDC4' : '#666'}
                            />
                            <Text
                                style={[
                                    styles.typeLabel,
                                    propertyData.type === type.value && styles.typeLabelSelected,
                                ]}
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your property..."
                    value={propertyData.description}
                    onChangeText={(text) => setPropertyData({ ...propertyData, description: text })}
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                />
                <Text style={styles.charCount}>{propertyData.description.length}/500</Text>
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Max Guests</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="4"
                        value={propertyData.maxGuests}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, maxGuests: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Bedrooms</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2"
                        value={propertyData.bedrooms}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, bedrooms: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Bathrooms</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1"
                        value={propertyData.bathrooms}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, bathrooms: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location & Pricing</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="123 Main Street"
                    value={propertyData.address}
                    onChangeText={(text) => setPropertyData({ ...propertyData, address: text })}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New York"
                        value={propertyData.city}
                        onChangeText={(text) => setPropertyData({ ...propertyData, city: text })}
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="USA"
                        value={propertyData.country}
                        onChangeText={(text) => setPropertyData({ ...propertyData, country: text })}
                    />
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex2]}>
                    <Text style={styles.label}>Price per Night *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="150"
                        value={propertyData.pricePerNight}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, pricePerNight: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Currency</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="USD"
                        value={propertyData.currency}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, currency: text })
                        }
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Cleaning Fee</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="50"
                        value={propertyData.cleaningFee}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, cleaningFee: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Min Nights</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1"
                        value={propertyData.minNights}
                        onChangeText={(text) =>
                            setPropertyData({ ...propertyData, minNights: text })
                        }
                        keyboardType="number-pad"
                    />
                </View>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review Your Listing</Text>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Property Name</Text>
                <Text style={styles.reviewValue}>{propertyData.name}</Text>
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Type</Text>
                <Text style={styles.reviewValue}>
                    {propertyTypes.find((t) => t.value === propertyData.type)?.label}
                </Text>
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Description</Text>
                <Text style={styles.reviewValue}>{propertyData.description}</Text>
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Location</Text>
                <Text style={styles.reviewValue}>
                    {propertyData.address}
                    {propertyData.city && `, ${propertyData.city}`}
                    {propertyData.country && `, ${propertyData.country}`}
                </Text>
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Pricing</Text>
                <Text style={styles.reviewValue}>
                    ${propertyData.pricePerNight} {propertyData.currency} per night
                </Text>
                {propertyData.cleaningFee && (
                    <Text style={styles.reviewSubValue}>
                        Cleaning fee: ${propertyData.cleaningFee}
                    </Text>
                )}
            </View>

            <View style={styles.reviewCard}>
                <Text style={styles.reviewLabel}>Capacity</Text>
                <Text style={styles.reviewValue}>
                    {propertyData.maxGuests || 'N/A'} guests · {propertyData.bedrooms || 'N/A'}{' '}
                    bedrooms · {propertyData.bathrooms || 'N/A'} bathrooms
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Property</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                {STEPS.map((step, index) => (
                    <View key={index} style={styles.progressItem}>
                        <View
                            style={[
                                styles.progressDot,
                                index <= currentStep && styles.progressDotActive,
                            ]}
                        >
                            {index < currentStep ? (
                                <Ionicons name="checkmark" size={16} color="#fff" />
                            ) : (
                                <Text
                                    style={[
                                        styles.progressNumber,
                                        index <= currentStep && styles.progressNumberActive,
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            )}
                        </View>
                        <Text
                            style={[
                                styles.progressLabel,
                                index <= currentStep && styles.progressLabelActive,
                            ]}
                        >
                            {step}
                        </Text>
                        {index < STEPS.length - 1 && (
                            <View
                                style={[
                                    styles.progressLine,
                                    index < currentStep && styles.progressLineActive,
                                ]}
                            />
                        )}
                    </View>
                ))}
            </View>

            {/* Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {currentStep === 0 && renderStep1()}
                    {currentStep === 1 && renderStep2()}
                    {currentStep === 2 && renderStep3()}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                {currentStep < STEPS.length - 1 ? (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
                        <Text style={styles.publishButtonText}>Publish Listing</Text>
                    </TouchableOpacity>
                )}
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
    progressContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    progressItem: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    progressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressDotActive: {
        backgroundColor: '#4ECDC4',
    },
    progressNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    progressNumberActive: {
        color: '#fff',
    },
    progressLabel: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    progressLabelActive: {
        color: '#4ECDC4',
        fontWeight: '600',
    },
    progressLine: {
        position: 'absolute',
        top: 16,
        left: '50%',
        right: '-50%',
        height: 2,
        backgroundColor: '#E0E0E0',
    },
    progressLineActive: {
        backgroundColor: '#4ECDC4',
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    stepContent: {
        padding: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    typeCardSelected: {
        borderColor: '#4ECDC4',
        backgroundColor: '#4ECDC410',
    },
    typeLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    typeLabelSelected: {
        color: '#4ECDC4',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 20,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    reviewLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginBottom: 4,
    },
    reviewValue: {
        fontSize: 15,
        color: '#333',
    },
    reviewSubValue: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    bottomBar: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    nextButton: {
        flexDirection: 'row',
        backgroundColor: '#4ECDC4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    publishButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    publishButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
