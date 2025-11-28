import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { QUERY_KEYS } from '../config';

// ============================================
// DESTINATIONS HOOKS
// ============================================

// Search destinations
export const useDestinations = (searchQuery?: string, category?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DESTINATIONS, searchQuery, category],
        queryFn: async () => {
            let query = supabase
                .from('destinations')
                .select('*')
                .eq('is_active', true)
                .order('views_count', { ascending: false });

            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`);
            }

            if (category) {
                query = query.contains('categories', [category]);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });
};

// Get single destination
export const useDestination = (destinationId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DESTINATION, destinationId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('destinations')
                .select(`
          *,
          reviews!reviews_destination_id_fkey (
            id, rating, content, created_at,
            users!reviews_reviewer_id_fkey (username, avatar_url)
          )
        `)
                .eq('id', destinationId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!destinationId,
    });
};

// Get destination posts
export const useDestinationPosts = (destinationId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DESTINATION_POSTS, destinationId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          users!posts_user_id_fkey (username, avatar_url)
        `)
                .eq('destination_id', destinationId)
                .eq('is_removed', false)
                .order('likes_count', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data;
        },
        enabled: !!destinationId,
    });
};
