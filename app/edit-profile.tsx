import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { saveProfile, loadProfile, ProfileData } from '../utils/storage';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [profileImage, setProfileImage] = useState<string>('https://i.pravatar.cc/150?img=12');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');

    const MAX_BIO_LENGTH = 150;

    // Load existing profile on mount
    useEffect(() => {
        loadExistingProfile();
    }, []);

    const loadExistingProfile = async () => {
        setLoading(true);
        try {
            const profile = await loadProfile();
            if (profile) {
                setName(profile.name);
                setBio(profile.bio);
                setLocation(profile.location);
                if (profile.profileImage) {
                    setProfileImage(profile.profileImage);
                }
            } else {
                // Set defaults if no profile exists
                setName('Alex Travels');
                setBio('Adventure seeker & travel photographer.\\nSharing the world one photo at a time.');
                setLocation('📍 Based in London');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Request permissions
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant photo library access to select images.');
            return false;
        }
        return true;
    };

    const requestCameraPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera access to take photos.');
            return false;
        }
        return true;
    };

    // Pick image from gallery
    const pickImageFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Take photo with camera
    const takePhoto = async () => {
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Show image picker options
    const showImagePickerOptions = () => {
        Alert.alert(
            'Update Profile Picture',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: pickImageFromGallery },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    // Save profile
    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        setSaving(true);
        try {
            const existingProfile = await loadProfile();
            const profileData: ProfileData = {
                name: name.trim(),
                username: existingProfile?.username || '@alextravels',
                bio: bio.trim(),
                location: location.trim(),
                profileImage: profileImage,
                followers: existingProfile?.followers || '1.5k',
                following: existingProfile?.following || 800,
                posts: existingProfile?.posts || 250,
            };

            await saveProfile(profileData);
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
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

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#4ECDC4" />
                    ) : (
                        <Text style={styles.saveButton}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Profile Picture Section */}
                    <View style={styles.imageSection}>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        <TouchableOpacity style={styles.changePhotoButton} onPress={showImagePickerOptions}>
                            <Ionicons name="camera" size={24} color="#4ECDC4" />
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Bio Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Bio</Text>
                                <Text style={styles.charCount}>
                                    {bio.length}/{MAX_BIO_LENGTH}
                                </Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={bio}
                                onChangeText={(text) => {
                                    if (text.length <= MAX_BIO_LENGTH) {
                                        setBio(text);
                                    }
                                }}
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Location Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="📍 Your location"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
        paddingHorizontal: 8,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        backgroundColor: '#F0F0F0',
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    changePhotoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    formSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    charCount: {
        fontSize: 12,
        color: '#999',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    bioInput: {
        height: 100,
        paddingTop: 12,
    },
});
