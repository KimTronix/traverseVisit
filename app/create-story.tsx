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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addStory, StoryData } from '../utils/storyStorage';

const BACKGROUND_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#6C5CE7', '#A29BFE', '#FD79A8'
];

export default function CreateStoryScreen() {
    const router = useRouter();
    const [storyType, setStoryType] = useState<'image' | 'text' | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [selectedColor, setSelectedColor] = useState(BACKGROUND_COLORS[0]);
    const [isPosting, setIsPosting] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant photo library access.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [9, 16],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            setStoryType('image');
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera access.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [9, 16],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            setStoryType('image');
        }
    };

    const handleShare = async () => {
        if (!storyType) {
            Alert.alert('Error', 'Please select a story type');
            return;
        }

        if (storyType === 'image' && !image) {
            Alert.alert('Error', 'Please select an image');
            return;
        }

        if (storyType === 'text' && !text.trim()) {
            Alert.alert('Error', 'Please enter some text');
            return;
        }

        setIsPosting(true);
        try {
            const now = Date.now();
            const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours from now

            const story: StoryData = {
                id: now.toString(),
                userId: '1',
                username: 'AlexTravels',
                userImage: 'https://i.pravatar.cc/150?img=12',
                type: storyType,
                imageUrl: storyType === 'image' ? image! : undefined,
                text: storyType === 'text' ? text.trim() : undefined,
                backgroundColor: storyType === 'text' ? selectedColor : undefined,
                timestamp: now,
                expiresAt: expiresAt,
                viewedBy: [],
            };

            await addStory(story);

            Alert.alert('Success', 'Story shared! It will be visible for 24 hours.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Error creating story:', error);
            Alert.alert('Error', 'Failed to share story. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Story</Text>
                <TouchableOpacity onPress={handleShare} disabled={isPosting}>
                    <Text style={[styles.shareButton, isPosting && styles.shareButtonDisabled]}>
                        Share
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {!storyType && (
                    <View style={styles.typeSelector}>
                        <Text style={styles.sectionTitle}>Choose Story Type</Text>

                        <TouchableOpacity
                            style={styles.typeCard}
                            onPress={() => setStoryType('image')}
                        >
                            <Ionicons name="image-outline" size={48} color="#4ECDC4" />
                            <Text style={styles.typeTitle}>Image Story</Text>
                            <Text style={styles.typeDescription}>Share a photo from camera or gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.typeCard}
                            onPress={() => setStoryType('text')}
                        >
                            <Ionicons name="text-outline" size={48} color="#4ECDC4" />
                            <Text style={styles.typeTitle}>Text Story</Text>
                            <Text style={styles.typeDescription}>Share a text update with color background</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {storyType === 'image' && !image && (
                    <View style={styles.imagePicker}>
                        <TouchableOpacity style={styles.imageOption} onPress={takePhoto}>
                            <Ionicons name="camera" size={48} color="#4ECDC4" />
                            <Text style={styles.imageOptionText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageOption} onPress={pickImage}>
                            <Ionicons name="images" size={48} color="#4ECDC4" />
                            <Text style={styles.imageOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {storyType === 'image' && image && (
                    <View style={styles.preview}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <TouchableOpacity style={styles.changeButton} onPress={() => setImage(null)}>
                            <Text style={styles.changeButtonText}>Change Image</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {storyType === 'text' && (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <Text style={styles.sectionTitle}>Background Color</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
                            {BACKGROUND_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.colorOptionSelected
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </ScrollView>

                        <View style={[styles.textPreview, { backgroundColor: selectedColor }]}>
                            <TextInput
                                style={styles.textInput}
                                value={text}
                                onChangeText={setText}
                                placeholder="What's on your mind?"
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                multiline
                                maxLength={200}
                                textAlign="center"
                            />
                            <Text style={styles.charCount}>{text.length}/200</Text>
                        </View>
                    </KeyboardAvoidingView>
                )}
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    shareButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    shareButtonDisabled: {
        color: '#CCC',
    },
    content: {
        flex: 1,
    },
    typeSelector: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        marginLeft: 16,
    },
    typeCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    typeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    typeDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    imagePicker: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    imageOption: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    preview: {
        padding: 16,
    },
    previewImage: {
        width: '100%',
        aspectRatio: 9 / 16,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    changeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4ECDC4',
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4ECDC4',
    },
    colorPicker: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    textPreview: {
        marginHorizontal: 16,
        aspectRatio: 9 / 16,
        borderRadius: 12,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        width: '100%',
        textAlignVertical: 'center',
    },
    charCount: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
    },
});
