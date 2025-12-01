import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useStory } from '../../contexts/StoryContext';
import StoryViewer from '../story-viewer';

// Simple DoubleTapLike component for now
const DoubleTapLike = ({
  children,
  onDoubleTap,
  onSingleTap,
  initialLikes,
  isLiked
}: {
  children: React.ReactNode;
  onDoubleTap: () => void;
  onSingleTap?: () => void;
  initialLikes?: number;
  isLiked?: boolean;
}) => {
  const [lastTap, setLastTap] = useState(0);

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onDoubleTap();
      setLastTap(0); // Reset to prevent triple tap issues
    } else {
      // Single tap - wait to see if double tap follows
      setLastTap(now);
      if (onSingleTap) {
        setTimeout(() => {
          // If no second tap came within delay, trigger single tap
          if (Date.now() - now >= DOUBLE_TAP_DELAY) {
            onSingleTap();
          }
        }, DOUBLE_TAP_DELAY);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={1}>
      {children}
    </TouchableOpacity>
  );
};

const stories = [
  { id: 1, name: 'Your Story', image: 'https://i.pravatar.cc/150?img=1', isLive: false, hasStory: true },
  { id: 2, name: 'Maria', image: 'https://i.pravatar.cc/150?img=2', isLive: true, hasStory: false },
  { id: 3, name: 'John', image: 'https://i.pravatar.cc/150?img=3', isLive: false, hasStory: true },
  { id: 4, name: 'Sarah', image: 'https://i.pravatar.cc/150?img=4', isLive: false, hasStory: true },
  { id: 5, name: 'Mike', image: 'https://i.pravatar.cc/150?img=5', isLive: false, hasStory: true },
];

// Mock story data for viewing
const mockStories = [
  {
    id: 'story-1',
    uri: 'https://picsum.photos/400/800?random=1',
    type: 'image' as const,
    caption: 'Beautiful sunset today! ',
    timestamp: Date.now() - 3600000,
    views: 24,
  },
  {
    id: 'story-2',
    uri: 'https://picsum.photos/400/800?random=2',
    type: 'image' as const,
    caption: 'Coffee time ',
    timestamp: Date.now() - 7200000,
    views: 18,
  },
  {
    id: 'story-3',
    uri: 'https://picsum.photos/400/800?random=3',
    type: 'image' as const,
    caption: 'Working on something new...',
    timestamp: Date.now() - 10800000,
    views: 32,
  },
];

// Mock data for posts
const posts = [
  {
    id: 1,
    username: 'AlexTravels',
    location: 'Santorini, Greece',
    userImage: 'https://i.pravatar.cc/150?img=6',
    postImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    likes: 1234,
    caption: 'Sunset views in Santorini are unmatched! #travel #greece',
    budget: '$1200',
    isPinned: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { getUserStories, incrementStoryViews } = useStory();
  const userStories = getUserStories();

  const [postLikes, setPostLikes] = useState<{ [key: number]: { count: number; liked: boolean } }>(
    posts.reduce((acc, post) => ({
      ...acc,
      [post.id]: { count: post.likes, liked: false }
    }), {})
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [pressedStoryId, setPressedStoryId] = useState<number | null>(null);

  // Update stories array to reflect user's actual stories
  const updatedStories = stories.map(story => {
    if (story.id === 1) {
      return {
        ...story,
        hasStory: userStories.length > 0,
        image: userStories.length > 0 ? userStories[0].uri : story.image
      };
    }
    return story;
  });

  const handleStoryPress = (storyId: number) => {
    if (storyId === 1) {
      // "Your Story" - add story if no stories, view if has stories
      if (userStories.length === 0) {
        router.push('/add-story');
      } else {
        setCurrentStoryIndex(0);
        setShowStoryViewer(true);
      }
    } else if (updatedStories.find(s => s.id === storyId)?.hasStory) {
      // View story
      setCurrentStoryIndex(0);
      setShowStoryViewer(true);
    }
  };

  const handleStoryView = (storyId: string) => {
    incrementStoryViews(storyId);
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
  };

  const handleLikePost = (postId: number) => {
    setPostLikes(prev => {
      const current = prev[postId];
      const newLiked = !current.liked;
      const newCount = newLiked ? current.count + 1 : current.count - 1;

      return {
        ...prev,
        [postId]: { count: newCount, liked: newLiked }
      };
    });
  };

  const handleComment = (post: any) => {
    router.push('/comments' as any);
  };

  const handleShare = (post: any) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  const handleShareOption = async (option: string) => {
    setShowShareModal(false);

    switch (option) {
      case 'instagram':
        Alert.alert('Share to Instagram', 'Opening Instagram...');
        break;
      case 'facebook':
        Alert.alert('Share to Facebook', 'Opening Facebook...');
        break;
      case 'twitter':
        Alert.alert('Share to Twitter', 'Opening Twitter...');
        break;
      case 'youtube':
        Alert.alert('Share to YouTube', 'Opening YouTube...');
        break;
      case 'download':
        Alert.alert('Download', 'Downloading image...');
        break;
      case 'copy-link':
        try {
          await Share.share({
            message: `Check out this amazing post from ${selectedPost.username}: ${selectedPost.caption}`,
            url: selectedPost.postImage,
          });
        } catch (error) {
          Alert.alert('Error', 'Could not share link');
        }
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="navigate-circle" size={28} color="#4ECDC4" />
          <Text style={styles.logoText}>Traverse-Visit</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stories Section */}
        <TouchableOpacity
          style={styles.storiesSection}
          onPress={() => {
            // Check if user has stories to view
            if (userStories.length > 0) {
              setCurrentStoryIndex(0);
              setShowStoryViewer(true);
            }
          }}
        >
          <View style={styles.storiesHeader}>
            <Text style={styles.sectionTitle}>Stories & Live</Text>
            <TouchableOpacity
              style={styles.watchAllButton}
              onPress={() => {
                if (userStories.length > 0) {
                  setCurrentStoryIndex(0);
                  setShowStoryViewer(true);
                }
              }}
            >
              <Text style={styles.watchAllText}>Watch All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {updatedStories.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={[
                  styles.storyItem,
                  pressedStoryId === story.id && styles.storyItemPressed
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleStoryPress(story.id);
                }}
                onPressIn={() => setPressedStoryId(story.id)}
                onPressOut={() => setPressedStoryId(null)}
                activeOpacity={1}
              >
                <View style={[styles.storyImageContainer, story.hasStory && styles.storyBorder]}>
                  <Image source={{ uri: story.image }} style={styles.storyImage} />
                  {story.isLive && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                  {story.id === 1 && (
                    <TouchableOpacity
                      style={styles.addStoryButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/add-story');
                      }}
                    >
                      <Ionicons name="add" size={16} color="#FFF" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.storyName}>{story.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>

        {/* Posts Feed */}
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.postUserInfo}>
                <Image source={{ uri: post.userImage }} style={styles.postUserImage} />
                <View>
                  <Text style={styles.postUsername}>{post.username}</Text>
                  <Text style={styles.postLocation}>{post.location}</Text>
                </View>
              </View>
              {post.isPinned && (
                <View style={styles.pinBadge}>
                  <Ionicons name="location" size={16} color="#FF6B6B" />
                </View>
              )}
            </View>

            {/* Post Image */}
            <DoubleTapLike
              initialLikes={post.likes}
              isLiked={postLikes[post.id]?.liked || false}
              onDoubleTap={() => handleLikePost(post.id)}
              onSingleTap={() => router.push(`/post-details?id=${post.id}` as any)}
            >
              <Image source={{ uri: post.postImage }} style={styles.postImage} />
            </DoubleTapLike>

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLikePost(post.id)}
                >
                  <Ionicons
                    name={postLikes[post.id]?.liked ? "heart" : "heart-outline"}
                    size={26}
                    color={postLikes[post.id]?.liked ? "#FF3B30" : "#333"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleComment(post)}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(post)}
                >
                  <Ionicons name="paper-plane-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('/destination-details' as any)}
                >
                  <Ionicons name="airplane-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/destination-details' as any)}
              >
                <Ionicons name="bookmark-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Post Caption */}
            <View style={styles.postCaption}>
              <Text style={styles.captionText}>{post.caption}</Text>
              <View style={styles.budgetContainer}>
                <Text style={styles.budgetLabel}>Min. Budget: </Text>
                <Text style={styles.budgetAmount}>{post.budget}</Text>
              </View>
              <Text style={styles.likesText}>
                {postLikes[post.id]?.count || post.likes} likes
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>Share Post</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.shareOptions}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('instagram')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#E4405F' }]}>
                  <Ionicons name="logo-instagram" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('facebook')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#1877F2' }]}>
                  <Ionicons name="logo-facebook" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('twitter')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#1DA1F2' }]}>
                  <Ionicons name="logo-twitter" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('youtube')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#FF0000' }]}>
                  <Ionicons name="logo-youtube" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>YouTube</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('download')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#4ECDC4' }]}>
                  <Ionicons name="download" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareOption('copy-link')}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#666' }]}>
                  <Ionicons name="link" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >

      {/* Story Viewer */}
      < StoryViewer
        visible={showStoryViewer}
        stories={userStories}
        currentIndex={currentStoryIndex}
        onClose={handleCloseStoryViewer}
        onView={handleStoryView}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 239, 239, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  storiesSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 239, 239, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  watchAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  watchAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4ECDC4',
    letterSpacing: -0.2,
  },
  storiesScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  storyItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 70,
  },
  storyItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  storyImageContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  storyBorder: {
    padding: 2.5,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  storyImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  storyName: {
    fontSize: 13,
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    maxWidth: 70,
    lineHeight: 16,
  },
  liveBadge: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    transform: [{ translateX: -22 }],
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  liveText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4ECDC4',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    paddingBottom: 12,
    marginHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  pinBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#F0F0F0',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  postCaption: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  captionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  budgetContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  budgetLabel: {
    fontSize: 13,
    color: '#666',
  },
  budgetAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  likesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  shareModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  shareModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  shareOption: {
    alignItems: 'center',
    width: '30%',
  },
  shareIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  shareOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
