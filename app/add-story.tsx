import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AddStoryScreen() {
  const router = useRouter();
  const [showCameraModal, setShowCameraModal] = useState(false);

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

  const handleSelectType = (type: 'photo' | 'video' | 'text' | 'live') => {
    if (type === 'photo' || type === 'video') {
      setShowCameraModal(true);
    } else if (type === 'text') {
      // router.push('/create-text-story' as any);
      Alert.alert('Text Story', 'Text story feature coming soon!');
    } else if (type === 'live') {
      Alert.alert('Go Live', 'Starting live stream...', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Live', onPress: () => console.log('Go Live') }, // router.push('/live-stream' as any)
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
        // For now, we can just alert or use ImagePicker.launchCameraAsync if permissions allowed
        // But let's stick to the pattern:
        const result = await ImagePicker.launchCameraAsync({
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
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

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
