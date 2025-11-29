import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const backgroundColors = [
  '#4ECDC4', '#FF6B6B', '#FFD93D', '#FF3B30', 
  '#5856D6', '#AF52DE', '#007AFF', '#34C759'
];

export default function CreateTextStoryScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [selectedBg, setSelectedBg] = useState(backgroundColors[0]);
  const [fontSize, setFontSize] = useState(24);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostStory = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text for your story');
      return;
    }

    setIsPosting(true);
    
    try {
      // Simulate posting text story with 24-hour expiration
      const storyData = {
        id: Date.now().toString(),
        type: 'text',
        text: text.trim(),
        backgroundColor: selectedBg,
        fontSize,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Story Posted!',
        'Your text story will be visible for 24 hours.',
        [
          { text: 'OK', onPress: () => router.back() },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post story');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text Story</Text>
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
      <View style={[styles.storyPreview, { backgroundColor: selectedBg }]}>
        <ScrollView contentContainerStyle={styles.textContainer}>
          <TextInput
            style={[styles.storyText, { fontSize }]}
            placeholder="Type your story..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={text}
            onChangeText={setText}
            multiline
            textAlign="center"
            autoFocus
          />
        </ScrollView>
        
        {/* Story Info */}
        <View style={styles.storyInfo}>
          <View style={styles.expirationBadge}>
            <Ionicons name="time" size={16} color="#fff" />
            <Text style={styles.expirationText}>Expires in 24h</Text>
          </View>
        </View>
      </View>

      {/* Text Options */}
      <View style={styles.optionsContainer}>
        {/* Font Size */}
        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>Font Size</Text>
          <View style={styles.fontSizeOptions}>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 20 && styles.fontSizeButtonActive]}
              onPress={() => setFontSize(20)}
            >
              <Text style={styles.fontSizeButtonText}>Small</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 24 && styles.fontSizeButtonActive]}
              onPress={() => setFontSize(24)}
            >
              <Text style={styles.fontSizeButtonText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeButton, fontSize === 32 && styles.fontSizeButtonActive]}
              onPress={() => setFontSize(32)}
            >
              <Text style={styles.fontSizeButtonText}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Background Color */}
        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>Background Color</Text>
          <View style={styles.colorGrid}>
            {backgroundColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedBg === color && styles.colorOptionActive
                ]}
                onPress={() => setSelectedBg(color)}
              >
                {selectedBg === color && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Character Count */}
        <View style={styles.characterCountContainer}>
          <Text style={styles.characterCount}>
            {text.length}/500 characters
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
  storyPreview: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  storyText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 36,
  },
  storyInfo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  expirationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  optionSection: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  fontSizeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  fontSizeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  characterCountContainer: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
  },
});
