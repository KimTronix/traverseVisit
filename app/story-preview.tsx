import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStory } from '../contexts/StoryContext';
import { useAuth } from './context/AuthContext';
import { supabase } from '../lib/supabase';

import { uploadImage } from '../utils/imageUpload';

export default function StoryPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { uri, type } = params as { uri: string; type: string };
  const { addUserStory } = useStory();
  const { user } = useAuth();

  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePostStory = async () => {
    if (!uri || !user) return;
    setIsPosting(true);

    try {
      // Upload image to Supabase Storage
      const uploadedUrl = await uploadImage(uri, 'posts', user.id);

      if (!uploadedUrl) {
        throw new Error('Failed to upload image');
      }

      // Insert story into posts table
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          media_urls: [uploadedUrl],
          caption: caption || '',
          is_story: true,
          location_name: null, // Optional
          story_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add story using context with the remote URL (for immediate UI update)
      addUserStory({
        uri: uploadedUrl,
        type: type as 'image' | 'video',
        caption: caption || undefined,
        isLive: false,
      });

      Alert.alert(
        'Story Posted!',
        'Your story will be visible for 24 hours.',
        [
          { text: 'OK', onPress: () => router.back() },
        ]
      );
    } catch (error) {
      console.error('Error posting story:', error);
      Alert.alert('Error', 'Failed to post story');
    } finally {
      setIsPosting(false);
    }
  };

  const getTimeUntilExpiration = () => {
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    const hours = Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60));
    const minutes = Math.floor(((expiresAt - Date.now()) % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Story Preview</Text>
        <TouchableOpacity
          style={[styles.postButton, isPosting && styles.postButtonDisabled]}
          onPress={handlePostStory}
          disabled={isPosting}
        >
          <Text style={styles.postButtonText}>
            {isPosting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Story Preview */}
      <View style={styles.previewContainer}>
        <Image source={{ uri }} style={styles.storyImage} />

        {/* Story Overlay */}
        <View style={styles.storyOverlay}>
          <View style={styles.captionContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={100}
            />
            <Text style={styles.characterCount}>{caption.length}/100</Text>
          </View>

          {/* Story Info */}
          <View style={styles.storyInfo}>
            <View style={styles.expirationBadge}>
              <Ionicons name="time" size={16} color="#fff" />
              <Text style={styles.expirationText}>Expires in {getTimeUntilExpiration()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Story Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Story Options</Text>

        <View style={styles.optionsList}>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="musical-notes" size={24} color="#4ECDC4" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Add Music</Text>
              <Text style={styles.optionDescription}>Add a song to your story</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="color-palette" size={24} color="#FF6B6B" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Add Filters</Text>
              <Text style={styles.optionDescription}>Enhance your story with filters</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="location" size={24} color="#FFD93D" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Add Location</Text>
              <Text style={styles.optionDescription}>Share where you are</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  postButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#666',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  captionContainer: {
    marginBottom: 16,
  },
  captionInput: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  storyInfo: {
    alignItems: 'flex-start',
  },
  expirationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  expirationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '40%',
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderRadius: 12,
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
