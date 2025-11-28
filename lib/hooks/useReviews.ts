import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// REVIEWS HOOKS
// ============================================

// Get reviews for a property
export const usePropertyReviews = (propertyId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PROPERTY_REVIEWS, propertyId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(username, avatar_url, location)
        `)
                .eq('property_id', propertyId)
                .eq('is_removed', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!propertyId,
    });
};

// Create review
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (reviewData: {
            booking_id: string;
            reviewee_id: string;
            property_id?: string;
            destination_id?: string;
            rating: number;
            title?: string;
            content: string;
            cleanliness_rating?: number;
            communication_rating?: number;
            location_rating?: number;
            value_rating?: number;
            images_urls?: string[];
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('reviews')
                .insert({
                    reviewer_id: user.id,
                    ...reviewData
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data, variables) => {
            if (variables.property_id) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTY_REVIEWS, variables.property_id] });
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTY, variables.property_id] }); // Update rating
            }
        },
    });
};
