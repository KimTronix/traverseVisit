import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileData, PostData, CommentData } from './storage';

// Story data interface
export interface StoryData {
    id: string;
    userId: string;
    username: string;
    userImage: string;
    type: 'image' | 'text';
    imageUrl?: string;
    text?: string;
    backgroundColor?: string;
    timestamp: number;
    expiresAt: number;
    viewedBy: string[];
}

const STORIES_KEY = '@traverse_stories';

// Story storage functions
export const saveStories = async (stories: StoryData[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORIES_KEY, JSON.stringify(stories));
    } catch (error) {
        console.error('Error saving stories:', error);
        throw error;
    }
};

export const loadStories = async (): Promise<StoryData[]> => {
    try {
        const data = await AsyncStorage.getItem(STORIES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading stories:', error);
        return [];
    }
};

export const addStory = async (story: StoryData): Promise<void> => {
    try {
        const stories = await loadStories();

        // Remove expired stories
        const now = Date.now();
        const activeStories = stories.filter(s => s.expiresAt > now);

        // Add new story
        activeStories.unshift(story);
        await saveStories(activeStories);
    } catch (error) {
        console.error('Error adding story:', error);
        throw error;
    }
};

export const getActiveStories = async (): Promise<StoryData[]> => {
    try {
        const stories = await loadStories();
        const now = Date.now();

        // Filter out expired stories
        const activeStories = stories.filter(s => s.expiresAt > now);

        // Save filtered list to remove expired ones
        if (activeStories.length !== stories.length) {
            await saveStories(activeStories);
        }

        return activeStories;
    } catch (error) {
        console.error('Error getting active stories:', error);
        return [];
    }
};

export const getUserStories = async (userId: string): Promise<StoryData[]> => {
    try {
        const stories = await getActiveStories();
        return stories.filter(s => s.userId === userId);
    } catch (error) {
        console.error('Error getting user stories:', error);
        return [];
    }
};

export const markStoryAsViewed = async (storyId: string, viewerId: string): Promise<void> => {
    try {
        const stories = await loadStories();
        const story = stories.find(s => s.id === storyId);

        if (story && !story.viewedBy.includes(viewerId)) {
            story.viewedBy.push(viewerId);
            await saveStories(stories);
        }
    } catch (error) {
        console.error('Error marking story as viewed:', error);
        throw error;
    }
};

export const deleteStory = async (storyId: string): Promise<void> => {
    try {
        const stories = await loadStories();
        const filteredStories = stories.filter(s => s.id !== storyId);
        await saveStories(filteredStories);
    } catch (error) {
        console.error('Error deleting story:', error);
        throw error;
    }
};

export const getStoryById = async (storyId: string): Promise<StoryData | null> => {
    try {
        const stories = await loadStories();
        const story = stories.find(s => s.id === storyId);
        return story || null;
    } catch (error) {
        console.error('Error getting story by ID:', error);
        return null;
    }
};

