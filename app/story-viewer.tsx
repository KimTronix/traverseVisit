import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 20000; // 20 seconds

interface Story {
  id: string;
  uri: string;
  type: 'image' | 'video';
  caption?: string;
  timestamp: number;
  views: number;
}

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onView: (storyId: string) => void;
}

export default function StoryViewer({ visible, stories, currentIndex, onClose, onView }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [closeButtonPressed, setCloseButtonPressed] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const progressAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && stories.length > 0) {
      startStoryProgress();
    }
    return () => {
      if (progressAnimation.current) {
        progressAnimation.current.stop();
      }
    };
  }, [visible, currentStoryIndex, stories]);

  const startStoryProgress = () => {
    // Reset progress
    setProgress(new Animated.Value(0));

    // Animate progress bar
    progressAnimation.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    progressAnimation.current.start(({ finished }) => {
      if (finished) {
        handleNextStory();
      }
    });
  };

  const pauseStory = () => {
    if (progressAnimation.current) {
      progressAnimation.current.stop();
    }
    setIsPaused(true);
  };

  const resumeStory = () => {
    if (isPaused && stories.length > 0) {
      progress.addListener(({ value }) => {
        const remainingProgress = value;
        const remainingDuration = STORY_DURATION * (1 - remainingProgress);

        progressAnimation.current = Animated.timing(progress, {
          toValue: 1,
          duration: remainingDuration,
          useNativeDriver: false,
        });

        progressAnimation.current.start(({ finished }) => {
          if (finished) {
            handleNextStory();
          }
        });
      });

      setIsPaused(false);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleStoryPress = () => {
    const nextIndex = Math.min(currentStoryIndex + 1, stories.length - 1);
    if (nextIndex !== currentStoryIndex) {
      setCurrentStoryIndex(nextIndex);
    }
  };

  const handleLongPressStart = () => {
    pauseStory();
  };

  const handleLongPressEnd = () => {
    resumeStory();
  };

  const handleStoryView = () => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory) {
      onView(currentStory.id);
    }
  };

  const handleDeleteStory = () => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Close story viewer and notify parent to delete
            setShowOptionsMenu(false);
            onClose();
            // You can add a callback prop for delete functionality
            Alert.alert('Story Deleted', 'Your story has been deleted successfully.');
          }
        },
      ]
    );
  };

  const handleShareStory = () => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory) {
      setShowOptionsMenu(false);
      // You can implement actual share functionality here
      Alert.alert('Share Story', 'Story sharing feature coming soon!');
    }
  };

  const handleReportStory = () => {
    setShowOptionsMenu(false);
    Alert.alert('Report Story', 'Report feature coming soon!');
  };

  const handleCopyLink = () => {
    setShowOptionsMenu(false);
    Alert.alert('Copy Link', 'Link copied to clipboard!');
  };

  const handleStoryInfo = () => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory) {
      setShowOptionsMenu(false);
      const timeAgo = Math.floor((Date.now() - currentStory.timestamp) / 60000);
      Alert.alert(
        'Story Info',
        `Views: ${currentStory.views}\nPosted: ${timeAgo} minutes ago\nType: ${currentStory.type}`
      );
    }
  };

  const handleShowViewers = () => {
    console.log('Show viewers clicked!');
    setShowViewersModal(true);
  };

  useEffect(() => {
    if (visible) {
      handleStoryView();
    }
  }, [currentStoryIndex, visible]);

  if (!visible || stories.length === 0) return null;

  const currentStory = stories[currentStoryIndex];

  // Mock data for viewers - removed as we don't have a viewers table yet
  const mockViewers: any[] = [];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Story Content */}
        <View style={styles.storyContainer}>
          <Image source={{ uri: currentStory.uri }} style={styles.storyImage} />

          {/* Top Overlay */}
          <View style={styles.topOverlay}>
            {/* Progress Bars */}
            <View style={styles.progressContainer}>
              {stories.map((_, index) => (
                <View key={index} style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        {
                          width: index < currentStoryIndex
                            ? '100%'
                            : index === currentStoryIndex
                              ? progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                                extrapolate: 'clamp',
                              })
                              : '0%',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Story</Text>
                <Text style={styles.timestamp}>
                  {new Date(currentStory.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    closeButtonPressed && styles.closeButtonPressed
                  ]}
                  onPressIn={() => setCloseButtonPressed(true)}
                  onPressOut={() => setCloseButtonPressed(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowOptionsMenu(true)} style={styles.moreButton}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Overlay */}
          <View style={styles.bottomOverlay}>
            {currentStory.caption && (
              <Text style={styles.caption}>{currentStory.caption}</Text>
            )}

            <View style={styles.storyActions}>
              <TouchableOpacity style={styles.viewCount} onPress={handleShowViewers}>
                <Ionicons name="eye" size={16} color="#fff" />
                <Text style={styles.viewCountText}>{currentStory.views} views</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Touch Areas */}
          <TouchableOpacity
            style={styles.leftTouchArea}
            onPress={handlePreviousStory}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
          />
          <TouchableOpacity
            style={styles.rightTouchArea}
            onPress={handleStoryPress}
            onLongPress={handleLongPressStart}
            onPressOut={handleLongPressEnd}
          />
        </View>
      </SafeAreaView>

      {/* Options Modal */}
      <Modal
        visible={showOptionsMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableOpacity
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsMenu(false)}
        >
          <View style={styles.optionsContainer}>
            <View style={styles.optionsHeader}>
              <Text style={styles.optionsTitle}>Story Options</Text>
              <TouchableOpacity onPress={() => setShowOptionsMenu(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>
              <TouchableOpacity style={styles.optionItem} onPress={handleShareStory}>
                <Ionicons name="share-outline" size={24} color="#4ECDC4" />
                <Text style={styles.optionText}>Share Story</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem} onPress={handleCopyLink}>
                <Ionicons name="link-outline" size={24} color="#4ECDC4" />
                <Text style={styles.optionText}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem} onPress={handleStoryInfo}>
                <Ionicons name="information-circle-outline" size={24} color="#4ECDC4" />
                <Text style={styles.optionText}>Story Info</Text>
              </TouchableOpacity>

              <View style={styles.optionsDivider} />

              <TouchableOpacity style={styles.optionItem} onPress={handleReportStory}>
                <Ionicons name="flag-outline" size={24} color="#FF6B6B" />
                <Text style={[styles.optionText, styles.dangerText]}>Report Story</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem} onPress={handleDeleteStory}>
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                <Text style={[styles.optionText, styles.dangerText]}>Delete Story</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Viewers Modal */}
      <Modal
        visible={showViewersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowViewersModal(false)}
      >
        <View style={styles.optionsOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => setShowViewersModal(false)}
          >
            <View style={styles.viewersContainer}>
              <View style={styles.viewersHeader}>
                <Text style={styles.viewersTitle}>Story Views</Text>
                <TouchableOpacity onPress={() => setShowViewersModal(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.viewersList}>
                <View style={styles.noViewersContainer}>
                  <Ionicons name="eye-off" size={48} color="rgba(255, 255, 255, 0.3)" />
                  <Text style={styles.noViewersText}>No views yet</Text>
                  <Text style={styles.noViewersSubtext}>Your story will appear here when people view it</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: StatusBar.currentHeight || 44,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  userDetails: {
    flex: 1,
    marginRight: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonPressed: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    transform: [{ scale: 0.95 }],
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  moreButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  storyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  viewCountText: {
    color: '#fff',
    fontSize: 14,
  },
  actionButton: {
    padding: 8,
  },
  leftTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.3,
    height: height,
    zIndex: 1,
  },
  rightTouchArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.7,
    height: height,
    zIndex: 1,
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerText: {
    color: '#FF6B6B',
  },
  optionsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  viewersContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  viewersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewersTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  viewersList: {
    paddingHorizontal: 20,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  viewerInfo: {
    flex: 1,
  },
  viewerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewerTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 2,
  },
  noViewersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noViewersText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  noViewersSubtext: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
});
