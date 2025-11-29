export interface StoryData {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  type: 'photo' | 'video' | 'text' | 'live';
  uri?: string;
  text?: string;
  caption?: string;
  backgroundColor?: string;
  fontSize?: number;
  timestamp: number;
  expiresAt: number;
  isLive: boolean;
  viewers?: string[];
}

class StoryManager {
  private stories: StoryData[] = [];
  private listeners: ((stories: StoryData[]) => void)[] = [];

  constructor() {
    // Load stories from storage on initialization
    this.loadStories();
    // Set up expiration check interval
    setInterval(() => this.checkExpiredStories(), 60000); // Check every minute
  }

  // Add a new story
  addStory(story: Omit<StoryData, 'id' | 'timestamp' | 'expiresAt'>): StoryData {
    const newStory: StoryData = {
      ...story,
      id: Date.now().toString(),
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      viewers: [],
    };

    this.stories.push(newStory);
    this.saveStories();
    this.notifyListeners();
    return newStory;
  }

  // Get all active (non-expired) stories
  getActiveStories(): StoryData[] {
    const now = Date.now();
    return this.stories.filter(story => story.expiresAt > now);
  }

  // Get stories by user
  getUserStories(userId: string): StoryData[] {
    return this.getActiveStories().filter(story => story.userId === userId);
  }

  // View a story (add to viewers)
  viewStory(storyId: string, viewerId: string): void {
    const story = this.stories.find(s => s.id === storyId);
    if (story && story.viewers) {
      if (!story.viewers.includes(viewerId)) {
        story.viewers.push(viewerId);
        this.saveStories();
      }
    }
  }

  // Check and remove expired stories
  private checkExpiredStories(): void {
    const now = Date.now();
    const expiredCount = this.stories.filter(story => story.expiresAt <= now).length;
    
    if (expiredCount > 0) {
      this.stories = this.stories.filter(story => story.expiresAt > now);
      this.saveStories();
      this.notifyListeners();
      console.log(`Removed ${expiredCount} expired stories`);
    }
  }

  // Get time until expiration
  getTimeUntilExpiration(storyId: string): string {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return 'Expired';

    const now = Date.now();
    const timeLeft = story.expiresAt - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Check if story is expired
  isStoryExpired(storyId: string): boolean {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return true;
    return story.expiresAt <= Date.now();
  }

  // Delete a story manually
  deleteStory(storyId: string): boolean {
    const index = this.stories.findIndex(s => s.id === storyId);
    if (index !== -1) {
      this.stories.splice(index, 1);
      this.saveStories();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Subscribe to story updates
  subscribe(listener: (stories: StoryData[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    const activeStories = this.getActiveStories();
    this.listeners.forEach(listener => listener(activeStories));
  }

  // Save stories to storage (mock implementation)
  private async saveStories(): Promise<void> {
    try {
      // In a real app, this would save to AsyncStorage or a database
      console.log('Saving stories:', this.stories.length);
    } catch (error) {
      console.error('Failed to save stories:', error);
    }
  }

  // Load stories from storage (mock implementation)
  private async loadStories(): Promise<void> {
    try {
      // In a real app, this would load from AsyncStorage or a database
      // For now, we'll start with empty stories
      console.log('Loading stories...');
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  }

  // Get story statistics
  getStoryStats(userId: string): {
    totalViews: number;
    activeStories: number;
    totalStories: number;
  } {
    const userStories = this.stories.filter(story => story.userId === userId);
    const activeUserStories = userStories.filter(story => story.expiresAt > Date.now());
    
    const totalViews = userStories.reduce((acc, story) => acc + (story.viewers?.length || 0), 0);
    
    return {
      totalViews,
      activeStories: activeUserStories.length,
      totalStories: userStories.length,
    };
  }
}

// Export singleton instance
export const storyManager = new StoryManager();

// Export utility functions
export const formatStoryTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const isStoryViewed = (story: StoryData, userId: string): boolean => {
  return story.viewers?.includes(userId) || false;
};
