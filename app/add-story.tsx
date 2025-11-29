import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AddStoryScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'text' | 'live' | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

  const storyOptions = [
    {
      id: 'photo',
      title: 'Photo',
      icon: 'camera',
      description: 'Share a photo',
    },
    {
      id: 'video',
      title: 'Video',
      icon: 'videocam',
      description: 'Record or share',
    },
    {
      id: 'text',
      title: 'Text',
      icon: 'text',
      description: 'Write something',
    },
    {
      id: 'live',
      title: 'Live',
      icon: 'radio',
      description: 'Go live',
    },
  ];

  useEffect(() => {
    loadGalleryPhotos();
  }, []);

  const loadGalleryPhotos = async () => {
    try {
      // Request media library permissions
      const permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionStatus.status === 'granted') {
        // Since expo-media-library is not available, use mock photos
        // In a real implementation, you would use expo-media-library or a native solution
        const mockPhotos = [
          { id: 'mock-1', uri: 'https://picsum.photos/200/300?random=1' },
          { id: 'mock-2', uri: 'https://picsum.photos/200/300?random=2' },
          { id: 'mock-3', uri: 'https://picsum.photos/200/300?random=3' },
          { id: 'mock-4', uri: 'https://picsum.photos/200/300?random=4' },
          { id: 'mock-5', uri: 'https://picsum.photos/200/300?random=5' },
          { id: 'mock-6', uri: 'https://picsum.photos/200/300?random=6' },
          { id: 'mock-7', uri: 'https://picsum.photos/200/300?random=7' },
          { id: 'mock-8', uri: 'https://picsum.photos/200/300?random=8' },
          { id: 'mock-9', uri: 'https://picsum.photos/200/300?random=9' },
          { id: 'mock-10', uri: 'https://picsum.photos/200/300?random=10' },
          { id: 'mock-11', uri: 'https://picsum.photos/200/300?random=11' },
          { id: 'mock-12', uri: 'https://picsum.photos/200/300?random=12' },
        ];
        
        setGalleryPhotos(mockPhotos);
        console.log('Gallery access granted, showing sample photos');
      } else {
        console.log('Gallery permission denied');
        Alert.alert(
          'Permission Required',
          'Please grant gallery access to view your photos',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Open settings') }
          ]
        );
        
        // Show fallback photos even without permission
        const fallbackPhotos = [
          { id: 'fallback-1', uri: 'https://picsum.photos/200/300?random=1' },
          { id: 'fallback-2', uri: 'https://picsum.photos/200/300?random=2' },
          { id: 'fallback-3', uri: 'https://picsum.photos/200/300?random=3' },
          { id: 'fallback-4', uri: 'https://picsum.photos/200/300?random=4' },
          { id: 'fallback-5', uri: 'https://picsum.photos/200/300?random=5' },
          { id: 'fallback-6', uri: 'https://picsum.photos/200/300?random=6' },
        ];
        setGalleryPhotos(fallbackPhotos);
      }
    } catch (error) {
      console.error('Error loading gallery photos:', error);
      Alert.alert('Error', 'Failed to load gallery photos');
      
      // Fallback to mock photos if real gallery fails
      const fallbackPhotos = [
        { id: 'fallback-1', uri: 'https://picsum.photos/200/300?random=1' },
        { id: 'fallback-2', uri: 'https://picsum.photos/200/300?random=2' },
        { id: 'fallback-3', uri: 'https://picsum.photos/200/300?random=3' },
        { id: 'fallback-4', uri: 'https://picsum.photos/200/300?random=4' },
        { id: 'fallback-5', uri: 'https://picsum.photos/200/300?random=5' },
        { id: 'fallback-6', uri: 'https://picsum.photos/200/300?random=6' },
      ];
      setGalleryPhotos(fallbackPhotos);
    }
  };

  const handleSelectType = (type: 'photo' | 'video' | 'text' | 'live') => {
    if (type === 'photo' || type === 'video') {
      setShowCameraModal(true);
    } else if (type === 'text') {
      router.push('/create-text-story' as any);
    } else if (type === 'live') {
      Alert.alert('Go Live', 'Starting live stream...', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Live', onPress: () => router.push('/live-stream' as any) },
      ]);
    }
  };

  const handleCameraOption = async (option: 'camera' | 'gallery') => {
    setShowCameraModal(false);
    
    try {
      if (option === 'gallery') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [9, 16],
          quality: 0.8,
        });

        if (!result.canceled) {
          router.push({
            pathname: '/story-preview' as any,
            params: {
              uri: result.assets[0].uri,
              type: result.assets[0].type,
            }
          });
        }
      } else {
        // Camera option would open camera
        Alert.alert('Camera', 'Camera feature coming soon!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media');
    }
  };

  const handleSeeAllPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Navigate to story preview with selected photo
        router.push({
          pathname: '/story-preview' as any,
          params: {
            uri: result.assets[0].uri,
            type: 'image',
          }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleGalleryPhotoSelect = (photo: any) => {
    router.push({
      pathname: '/story-preview' as any,
      params: {
        uri: photo.uri,
        type: 'image',
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Story</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Story Options - Horizontal */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Create Story</Text>
        <View style={styles.horizontalOptions}>
          {storyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSelectType(option.id as any)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gallery Photos */}
      <View style={styles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>Recent Photos</Text>
          <TouchableOpacity onPress={handleSeeAllPhotos}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={galleryPhotos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.photoItem}
              onPress={() => handleGalleryPhotoSelect(item)}
            >
              <Image source={{ uri: item.uri }} style={styles.photoImage} />
              <View style={styles.photoOverlay}>
                <Ionicons name="add" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.photoGrid}
        />
      </View>

      {/* Story Info */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#4ECDC4" />
        <Text style={styles.infoText}>
          Stories disappear after 24 hours. Your followers can see them for 1 day.
        </Text>
      </View>

      {/* Camera/Gallery Modal */}
      <Modal
        visible={showCameraModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Source</Text>
              <TouchableOpacity onPress={() => setShowCameraModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleCameraOption('camera')}
              >
                <View style={styles.modalIcon}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
                <Text style={styles.modalOptionText}>Take Photo/Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleCameraOption('gallery')}
              >
                <View style={styles.modalIcon}>
                  <Ionicons name="images" size={24} color="#fff" />
                </View>
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2D2D2D',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionsContainer: {
    backgroundColor: '#2D2D2D',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#404040',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555555',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  photoGrid: {
    gap: 2,
  },
  photoItem: {
    width: (width - 44) / 3,
    height: (width - 44) / 3,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 12,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2D2D2D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOptions: {
    gap: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 12,
    padding: 16,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
