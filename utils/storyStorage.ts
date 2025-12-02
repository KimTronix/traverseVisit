import { supabase } from '../lib/supabase';

// Story data interface matching Supabase structure
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
    viewedBy: string[]; // This will be empty or mocked for now as we lack a views table
    caption?: string;
}

// Helper to map Supabase post to StoryData
const mapPostToStory = (post: any): StoryData => {
    return {
        id: post.id.toString(),
        userId: post.user_id,
        username: post.users?.username || 'User',
        userImage: post.users?.avatar_url || 'https://i.pravatar.cc/150?img=1',
        type: post.media_urls && post.media_urls.length > 0 ? 'image' : 'text',
        imageUrl: post.media_urls?.[0],
        text: post.caption, // Using caption as text for text stories
        backgroundColor: '#000', // Default background
        timestamp: new Date(post.created_at).getTime(),
        expiresAt: new Date(post.created_at).getTime() + 24 * 60 * 60 * 1000, // 24h expiry
        viewedBy: [], // Placeholder
        caption: post.caption
    };
};

export const addStory = async (story: Partial<StoryData> & { userId: string }): Promise<void> => {
    try {
        const { error } = await supabase
            .from('posts')
            .insert({
                user_id: story.userId,
                caption: story.text || story.caption,
                media_urls: story.imageUrl ? [story.imageUrl] : [],
                is_story: true,
                // created_at is auto-generated
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error adding story:', error);
        throw error;
    }
};

export const getActiveStories = async (): Promise<StoryData[]> => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                users:user_id (
                    id,
                    username,
                    avatar_url
                )
            `)
            .eq('is_story', true)
            .gt('created_at', yesterday)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data?.map(mapPostToStory) || [];
    } catch (error) {
        console.error('Error getting active stories:', error);
        return [];
    }
};

export const getUserStories = async (userId: string): Promise<StoryData[]> => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                users:user_id (
                    id,
                    username,
                    avatar_url
                )
            `)
            .eq('is_story', true)
            .eq('user_id', userId)
            .gt('created_at', yesterday)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data?.map(mapPostToStory) || [];
    } catch (error) {
        console.error('Error getting user stories:', error);
        return [];
    }
};

export const markStoryAsViewed = async (storyId: string, viewerId: string): Promise<void> => {
    try {
        // Since we don't have a views table, we'll just increment the view count
        // This is a simplified approach
        const { error } = await supabase.rpc('increment_post_views', { post_id: storyId });

        if (error) {
            // Fallback if RPC doesn't exist (it might not)
            // Just ignore for now or try to update manually if RLS allows
            console.log('Could not increment view count (RPC missing?)');
        }
    } catch (error) {
        console.error('Error marking story as viewed:', error);
        // Don't throw, just log
    }
};

export const deleteStory = async (storyId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', storyId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting story:', error);
        throw error;
    }
};

export const getStoryById = async (storyId: string): Promise<StoryData | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                users:user_id (
                    id,
                    username,
                    avatar_url
                )
            `)
            .eq('id', storyId)
            .single();

        if (error) throw error;

        return data ? mapPostToStory(data) : null;
    } catch (error) {
        console.error('Error getting story by ID:', error);
        return null;
    }
};

