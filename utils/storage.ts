import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
    PROFILE: '@traverse_profile',
    POSTS: '@traverse_posts',
    LIKES: '@traverse_likes',
    COMMENTS: '@traverse_comments',
};

// Profile data interface
export interface ProfileData {
    name: string;
    username: string;
    bio: string;
    location: string;
    profileImage?: string;
    followers: string;
    following: number;
    posts: number;
}

// Post data interface
export interface PostData {
    id: string;
    username: string;
    location: string;
    userImage: string;
    postImage: string;
    likes: number;
    caption: string;
    budget?: string;
    isPinned: boolean;
    timestamp: number;
}

// Comment data interface
export interface CommentData {
    id: string;
    postId: string;
    userId: string;
    username: string;
    userImage: string;
    text: string;
    timestamp: number;
}

// Profile storage functions
export const saveProfile = async (profile: ProfileData): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
};

export const loadProfile = async (): Promise<ProfileData | null> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.PROFILE);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading profile:', error);
        return null;
    }
};

// Posts storage functions
export const savePosts = async (posts: PostData[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    } catch (error) {
        console.error('Error saving posts:', error);
        throw error;
    }
};

export const loadPosts = async (): Promise<PostData[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.POSTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
};

export const addPost = async (post: PostData): Promise<void> => {
    try {
        const posts = await loadPosts();
        posts.unshift(post); // Add to beginning of array
        await savePosts(posts);
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
};

// Likes storage functions
export const saveLikes = async (likes: Record<string, boolean>): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.LIKES, JSON.stringify(likes));
    } catch (error) {
        console.error('Error saving likes:', error);
        throw error;
    }
};

export const loadLikes = async (): Promise<Record<string, boolean>> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.LIKES);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error loading likes:', error);
        return {};
    }
};

export const toggleLike = async (postId: string): Promise<boolean> => {
    try {
        const likes = await loadLikes();
        const newState = !likes[postId];
        likes[postId] = newState;
        await saveLikes(likes);
        return newState;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

// Comments storage functions
export const saveComments = async (comments: CommentData[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
    } catch (error) {
        console.error('Error saving comments:', error);
        throw error;
    }
};

export const loadComments = async (): Promise<CommentData[]> => {
    try {
        const data = await AsyncStorage.getItem(KEYS.COMMENTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
};

export const addComment = async (comment: CommentData): Promise<void> => {
    try {
        const comments = await loadComments();
        comments.push(comment);
        await saveComments(comments);
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getPostComments = async (postId: string): Promise<CommentData[]> => {
    try {
        const comments = await loadComments();
        return comments.filter(c => c.postId === postId);
    } catch (error) {
        console.error('Error getting post comments:', error);
        return [];
    }
};

// Clear all data (for debugging/logout)
export const clearAllData = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([
            KEYS.PROFILE,
            KEYS.POSTS,
            KEYS.LIKES,
            KEYS.COMMENTS,
        ]);
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
};
