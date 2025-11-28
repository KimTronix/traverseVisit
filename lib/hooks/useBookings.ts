import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// BOOKINGS HOOKS
// ============================================

// Create booking request
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (bookingData: {
            property_id: string;
            provider_id: string;
            check_in_date: Date;
            check_out_date: Date;
            nights: number;
            guests: {
                adults: number;
                children: number;
                infants: number;
                total: number;
            };
            pricing: {
                price_per_night: number;
                total_nights_cost: number;
                cleaning_fee: number;
                service_fee: number;
                total_amount: number;
                currency: string;
            };
            message?: string;
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    booking_reference: `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    guest_id: user.id,
                    property_id: bookingData.property_id,
                    provider_id: bookingData.provider_id,
                    check_in_date: bookingData.check_in_date.toISOString().split('T')[0],
                    check_out_date: bookingData.check_out_date.toISOString().split('T')[0],
                    nights: bookingData.nights,
                    adults: bookingData.guests.adults,
                    children: bookingData.guests.children,
                    infants: bookingData.guests.infants,
                    total_guests: bookingData.guests.total,
                    price_per_night: bookingData.pricing.price_per_night,
                    total_nights_cost: bookingData.pricing.total_nights_cost,
                    cleaning_fee: bookingData.pricing.cleaning_fee,
                    service_fee: bookingData.pricing.service_fee,
                    total_amount: bookingData.pricing.total_amount,
                    currency: bookingData.pricing.currency,
                    guest_message: bookingData.message,
                    status: 'pending',
                    payment_status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_BOOKINGS] });
        },
    });
};

// Get my bookings (as guest)
export const useMyBookings = (status?: string) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.MY_BOOKINGS, status],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            let query = supabase
                .from('bookings')
                .select(`
          *,
          properties!bookings_property_id_fkey (
            name, cover_image_url, address, city, country
          ),
          users!bookings_provider_id_fkey (
            username, full_name, avatar_url
          )
        `)
                .eq('guest_id', user.id)
                .order('check_in_date', { ascending: true });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Get provider bookings (incoming requests)
export const useProviderBookings = (status?: string) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.PROVIDER_BOOKINGS, status],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            let query = supabase
                .from('bookings')
                .select(`
          *,
          properties!bookings_property_id_fkey (
            name
          ),
          users!bookings_guest_id_fkey (
            username, full_name, avatar_url, location
          )
        `)
                .eq('provider_id', user.id)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Update booking status (Accept/Reject/Cancel)
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({
            bookingId,
            status,
            reason
        }: {
            bookingId: string;
            status: 'confirmed' | 'rejected' | 'cancelled';
            reason?: string;
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            const updates: any = { status };

            if (status === 'confirmed') {
                updates.confirmed_at = new Date().toISOString();
            } else if (status === 'cancelled') {
                updates.cancelled_at = new Date().toISOString();
                updates.cancelled_by = user.id;
                updates.cancellation_reason = reason;
            } else if (status === 'rejected') {
                // Rejection is similar to cancellation but by provider before confirmation
                updates.cancelled_at = new Date().toISOString();
                updates.cancelled_by = user.id;
                updates.cancellation_reason = reason;
            }

            const { data, error } = await supabase
                .from('bookings')
                .update(updates)
                .eq('id', bookingId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_BOOKINGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROVIDER_BOOKINGS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKING] });
        },
    });
};

// Get single booking details
export const useBooking = (bookingId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.BOOKING, bookingId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          properties!bookings_property_id_fkey (
            *,
            destinations!properties_destination_id_fkey (name, country)
          ),
          users!bookings_provider_id_fkey (
            username, full_name, avatar_url, phone, business_email
          ),
          users!bookings_guest_id_fkey (
            username, full_name, avatar_url, phone, email
          )
        `)
                .eq('id', bookingId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!bookingId,
    });
};
