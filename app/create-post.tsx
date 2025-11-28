import React, { useState } from 'react';
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
import { addPost, PostData } from '../utils/storage';

export default function CreatePostScreen() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [isPosting, setIsPosting] = useState(false);

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
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    // Take photo with camera
    const takePhoto = async () => {
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    // Show image picker options
    const showImagePickerOptions = () => {
        Alert.alert(
            'Select Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: pickImageFromGallery },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    // Remove selected image
    const removeImage = () => {
        setImage(null);
    };

    // Share post
    const handleSharePost = async () => {
        if (!image) {
            Alert.alert('Error', 'Please select an image for your post');
            return;
        }

        if (!caption.trim()) {
            Alert.alert('Error', 'Please add a caption to your post');
            return;
        }

        setIsPosting(true);
        try {
            const newPost: PostData = {
                id: Date.now().toString(),
                username: 'AlexTravels',
                location: location.trim() || 'Unknown Location',
                userImage: 'https://i.pravatar.cc/150?img=12',
                postImage: image,
                likes: 0,
                caption: caption.trim(),
                budget: budget.trim(),
                isPinned: false,
                timestamp: Date.now(),
            };

            await addPost(newPost);

            Alert.alert('Success', 'Your post has been shared!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate to home feed
                        router.push('/(tabs)');
                    },
                },
            ]);
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'Failed to share post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Post</Text>
                <TouchableOpacity onPress={handleSharePost} disabled={isPosting}>
                    {isPosting ? (
                        <ActivityIndicator size="small" color="#4ECDC4" />
                    ) : (
                        <Text style={styles.shareButton}>Share</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Image Section */}
                    {image ? (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: image }} style={styles.postImage} />
                            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                                <Ionicons name="close-circle" size={32} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <TouchableOpacity style={styles.addPhotoButton} onPress={showImagePickerOptions}>
                                <Ionicons name="camera" size={48} color="#4ECDC4" />
                                <Text style={styles.addPhotoText}>Add Photo</Text>
                                <Text style={styles.addPhotoSubtext}>Take a photo or choose from gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        {/* Caption Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={[styles.input, styles.captionInput]}
                                value={caption}
                                onChangeText={setCaption}
                                placeholder="Share your travel story..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Location Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="location-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.inputText}
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="Where is this?"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        {/* Budget Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Estimated Budget (Optional)</Text>
                            <View style={styles.inputWithIcon}>
                                <Ionicons name="wallet-outline" size={20} color="#666" />
                                <TextInput
                                    style={styles.inputText}
                                    value={budget}
                                    onChangeText={setBudget}
                                    placeholder="e.g., $1200"
                                    placeholderTextColor="#999"
                                />
                            </View>
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
    shareButton: {
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
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 4 / 3,
        backgroundColor: '#000',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
    },
    placeholderContainer: {
        width: '100%',
        aspectRatio: 4 / 3,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    addPhotoButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    addPhotoText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addPhotoSubtext: {
        fontSize: 14,
        color: '#666',
    },
    formSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
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
    captionInput: {
        height: 100,
        paddingTop: 12,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
