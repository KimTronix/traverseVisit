import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for stories
const stories = [
  { id: 1, name: 'Your Story', image: 'https://i.pravatar.cc/150?img=1', isLive: false, hasStory: true },
  { id: 2, name: 'Maria', image: 'https://i.pravatar.cc/150?img=2', isLive: true, hasStory: false },
  { id: 3, name: 'John', image: 'https://i.pravatar.cc/150?img=3', isLive: false, hasStory: true },
  { id: 4, name: 'Sarah', image: 'https://i.pravatar.cc/150?img=4', isLive: false, hasStory: true },
  { id: 5, name: 'Mike', image: 'https://i.pravatar.cc/150?img=5', isLive: false, hasStory: true },
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Stories & Live</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {stories.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View style={[styles.storyImageContainer, story.hasStory && styles.storyBorder]}>
                  <Image source={{ uri: story.image }} style={styles.storyImage} />
                  {story.isLive && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                  {story.id === 1 && (
                    <View style={styles.addStoryButton}>
                      <Ionicons name="add" size={16} color="#FFF" />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

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
            <Image source={{ uri: post.postImage }} style={styles.postImage} />

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={26} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="paper-plane-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.planTripButton}>
                <Ionicons name="calendar-outline" size={18} color="#333" />
                <Text style={styles.planTripText}>Plan Trip</Text>
              </TouchableOpacity>
            </View>

            {/* Post Caption */}
            <View style={styles.postCaption}>
              <Text style={styles.captionText}>{post.caption}</Text>
              <View style={styles.budgetContainer}>
                <Text style={styles.budgetLabel}>Min. Budget: </Text>
                <Text style={styles.budgetAmount}>{post.budget}</Text>
              </View>
            </View>
          </View>
        ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  storiesScroll: {
    paddingLeft: 16,
  },
  storyItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  storyImageContainer: {
    position: 'relative',
  },
  storyBorder: {
    padding: 3,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  liveBadge: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transform: [{ translateX: -20 }],
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ECDC4',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  postCard: {
    backgroundColor: '#FFF',
    marginTop: 8,
    paddingBottom: 12,
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
    padding: 4,
  },
  planTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  planTripText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
});
