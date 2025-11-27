import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const serviceTypes = [
    'Accommodation',
    'Transport',
    'Tour Guide',
    'Restaurant',
    'Activity Provider',
];

export default function BusinessRegistrationScreen() {
    const router = useRouter();
    const [businessName, setBusinessName] = useState('');
    const [serviceType, setServiceType] = useState('Accommodation, Transport, Tour Guide');
    const [businessEmail, setBusinessEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [showServicePicker, setShowServicePicker] = useState(false);

    const handleUploadLicense = () => {
        console.log('Upload business license');
        // Open file picker or camera
    };

    const handleRegister = () => {
        console.log('Register business:', {
            businessName,
            serviceType,
            businessEmail,
            contactPhone,
        });
        // Navigate to business admin panel or success screen
    };

    const handleLoginToAdmin = () => {
        console.log('Login to admin panel');
        // Navigate to admin login
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Registration</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
                        <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Register as a Service Provider</Text>
                    <Text style={styles.citation}>[cite: 56]</Text>
                </View>

                {/* Form */}
                <View style={styles.formSection}>
                    {/* Business Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Business Name"
                                placeholderTextColor="#999"
                                value={businessName}
                                onChangeText={setBusinessName}
                            />
                        </View>
                    </View>

                    {/* Service Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Service Type</Text>
                        <Text style={styles.citation}>[cite: 29, 30, 31]</Text>
                        <TouchableOpacity
                            style={styles.pickerContainer}
                            onPress={() => setShowServicePicker(!showServicePicker)}
                        >
                            <Text style={styles.pickerText}>{serviceType}</Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Business Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Business Email"
                                placeholderTextColor="#999"
                                value={businessEmail}
                                onChangeText={setBusinessEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Contact Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contact Phone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Phone"
                                placeholderTextColor="#999"
                                value={contactPhone}
                                onChangeText={setContactPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <Text style={styles.citation}>[cite: 88]</Text>
                    </View>

                    {/* Upload License Button */}
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadLicense}>
                        <Ionicons name="document-attach-outline" size={20} color="#FFF" />
                        <Text style={styles.uploadButtonText}>Upload Business License</Text>
                    </TouchableOpacity>
                    <Text style={styles.citation}>[cite: 87]</Text>

                    {/* Register Button */}
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register as Business</Text>
                    </TouchableOpacity>
                    <Text style={styles.citation}>[cite: 57]</Text>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already registered? </Text>
                        <TouchableOpacity onPress={handleLoginToAdmin}>
                            <Text style={styles.loginLink}>Log In to Admin Panel</Text>
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
    titleSection: {
        backgroundColor: '#FFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    citation: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },
    formSection: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        height: 50,
    },
    pickerText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A5F5A',
        borderRadius: 8,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 4,
    },
    uploadButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    registerButton: {
        backgroundColor: '#0A5F5A',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 4,
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
    },
});
