import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

// Mock gallery data for initial display
const MOCK_GALLERY = Array.from({ length: 24 }).map((_, i) => ({
    id: String(i),
    uri: `https://picsum.photos/400/400?random=${i}`,
}));

const OPTIONS = [
    { id: 'post', label: 'Post', icon: 'grid-outline', route: '/create-post' },
    { id: 'story', label: 'Story', icon: 'add-circle-outline', route: '/create-story' },
    { id: 'live', label: 'Live', icon: 'radio-outline', route: '/go-live' },
    { id: 'reel', label: 'Reel', icon: 'videocam-outline', route: '/create-reel' },
    { id: 'place', label: 'Place', icon: 'map-outline', route: '/find-place' },
];

export default function CreationHub({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const [galleryImages, setGalleryImages] = useState(MOCK_GALLERY);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === 'granted');
            if (status === 'granted') {
                // In a real app, we would use expo-media-library to fetch actual photos here
                // For now, we'll stick to the mock gallery for visual demonstration
                // or we could use ImagePicker.launchImageLibraryAsync but that opens a modal
            }
        })();
    }, []);

    const renderGalleryItem = ({ item }: { item: { id: string; uri: string } }) => (
        <TouchableOpacity style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.galleryImage} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Create</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Creation Options */}
            <View style={styles.optionsContainer}>
                <FlatList
                    data={OPTIONS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.optionsList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                if (item.route) {
                                    // For demo purposes, some routes might not exist yet
                                    if (item.id === 'story') {
                                        router.push('/create-story');
                                    } else {
                                        console.log(`Navigating to ${item.route}`);
                                        // router.push(item.route); 
                                    }
                                }
                            }}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name={item.icon as any} size={24} color="#FFF" />
                            </View>
                            <Text style={styles.optionLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Gallery Grid */}
            <View style={styles.galleryContainer}>
                <View style={styles.galleryHeader}>
                    <Text style={styles.galleryTitle}>Recent</Text>
                    <TouchableOpacity>
                        <Text style={styles.gallerySelect}>Select Multiple</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={galleryImages}
                    renderItem={renderGalleryItem}
                    keyExtractor={(item) => item.id}
                    numColumns={COLUMN_COUNT}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.galleryGrid}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: width,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    optionsContainer: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionsList: {
        paddingHorizontal: 16,
        gap: 20,
    },
    optionItem: {
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4ECDC4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    optionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    galleryContainer: {
        flex: 1,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    galleryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    gallerySelect: {
        fontSize: 14,
        color: '#4ECDC4',
        fontWeight: '600',
    },
    galleryGrid: {
        paddingBottom: 20,
    },
    imageContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        padding: 1,
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0',
    },
});
