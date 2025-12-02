import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// PROPERTIES HOOKS
// ============================================

// Search properties
export const useProperties = (filters?: {
    destination_id?: string;
    min_price?: number;
    max_price?: number;
    guests?: number;
    start_date?: Date;
    end_date?: Date;
    amenities?: string[];
    property_type?: string;
}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PROPERTIES, filters],
        queryFn: async () => {
            let query = supabase
                .from('properties')
                .select(`
          *,
          destinations!properties_destination_id_fkey (name, country),
          users!properties_provider_id_fkey (username, avatar_url, provider_rating)
        `)
                .eq('status', 'active')
                .eq('is_active', true);

            // Apply filters
            if (filters?.destination_id) {
                query = query.eq('destination_id', filters.destination_id);
            }

            if (filters?.min_price) {
                query = query.gte('price_per_night', filters.min_price);
            }

            if (filters?.max_price) {
                query = query.lte('price_per_night', filters.max_price);
            }

            if (filters?.guests) {
                query = query.gte('max_guests', filters.guests);
            }

            if (filters?.property_type) {
                query = query.eq('property_type', filters.property_type);
            }

            if (filters?.amenities && filters.amenities.length > 0) {
                query = query.contains('amenities', filters.amenities);
            }

            // Date availability filtering would typically be done via a stored procedure or complex join
            // For MVP, we might fetch and filter in memory or rely on basic availability checks later

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });
};

// Get single property details
export const useProperty = (propertyId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PROPERTY, propertyId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('properties')
                .select(`
          *,
          destinations!properties_destination_id_fkey (name, country, location_coordinates),
          users!properties_provider_id_fkey (
            id, username, full_name, avatar_url, 
            provider_rating, provider_reviews_count, created_at
          ),
          reviews!reviews_property_id_fkey (
            id, rating, content, created_at,
            users!reviews_reviewer_id_fkey (username, avatar_url)
          )
        `)
                .eq('id', propertyId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!propertyId,
    });
};

// Create property (Provider only)
export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (propertyData: any) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('properties')
                .insert({
                    provider_id: user.id,
                    ...propertyData,
                    status: 'draft' // Default to draft
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_PROPERTIES] });
        },
    });
};

// Update property
export const useUpdateProperty = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('properties')
                .update(updates)
                .eq('id', id)
                .eq('provider_id', user.id) // Ensure ownership
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTY, data.id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_PROPERTIES] });
        },
    });
};

// Get my properties (Provider)
export const useMyProperties = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.MY_PROPERTIES],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('provider_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Check availability
export const useCheckAvailability = (propertyId: string, startDate: Date, endDate: Date) => {
    return useQuery({
        queryKey: [QUERY_KEYS.PROPERTY_AVAILABILITY, propertyId, startDate, endDate],
        queryFn: async () => {
            // This logic assumes we have a way to check availability
            // For now, we'll check if there are any overlapping bookings
            const { data, error } = await supabase
                .from('bookings')
                .select('id')
                .eq('property_id', propertyId)
                .in('status', ['confirmed', 'pending'])
                .or(`check_in_date.lte.${endDate.toISOString()},check_out_date.gte.${startDate.toISOString()}`);

            if (error) throw error;

            // Also check property_availability table for manual blocks
            const { data: blocks, error: blockError } = await supabase
                .from('property_availability')
                .select('id')
                .eq('property_id', propertyId)
                .eq('is_available', false)
                .gte('date', startDate.toISOString())
                .lte('date', endDate.toISOString());

            if (blockError) throw blockError;

            const isBooked = data && data.length > 0;
            const isBlocked = blocks && blocks.length > 0;

            return {
                available: !isBooked && !isBlocked,
                conflicts: { bookings: data, blocks }
            };
        },
        enabled: !!propertyId && !!startDate && !!endDate,
    });
};
