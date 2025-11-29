import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS, PAGINATION } from '../config';

// ============================================
// NOTIFICATIONS HOOKS
// ============================================

// Get notifications
export const useNotifications = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(PAGINATION.NOTIFICATIONS_PAGE_SIZE);

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
        refetchInterval: 30000, // Poll every 30s
    });
};

// Get unread count
export const useUnreadCount = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.UNREAD_NOTIFICATIONS],
        queryFn: async () => {
            if (!user?.id) return 0;

            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;
        },
        enabled: !!user?.id,
        refetchInterval: 30000,
    });
};

// Mark as read
export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (notificationId: string) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', notificationId)
                .eq('user_id', user.id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_NOTIFICATIONS] });
        },
    });
};

// Mark all as read
export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_NOTIFICATIONS] });
        },
    });
};
