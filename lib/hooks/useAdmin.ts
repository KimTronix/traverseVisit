import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// ADMIN HOOKS
// ============================================

// Get system stats
export const useAdminStats = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            // Check if admin
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (userData?.role !== 'admin') throw new Error('Unauthorized');

            // Fetch stats (parallel)
            const [
                { count: usersCount },
                { count: providersCount },
                { count: bookingsCount },
                { count: revenueCount } // This would be a sum query in reality
            ] = await Promise.all([
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'provider'),
                supabase.from('bookings').select('*', { count: 'exact', head: true }),
                supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('type', 'booking_payment')
            ]);

            return {
                usersCount: usersCount || 0,
                providersCount: providersCount || 0,
                bookingsCount: bookingsCount || 0,
                totalRevenue: 0 // Placeholder
            };
        },
        enabled: !!user?.id,
    });
};

// Get pending provider approvals
export const useProviderApprovals = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['providerApprovals'],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'provider')
                .eq('provider_verified', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Approve/Reject provider
export const useVerifyProvider = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ providerId, verified }: { providerId: string; verified: boolean }) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('users')
                .update({
                    provider_verified: verified,
                    account_status: verified ? 'active' : 'suspended'
                })
                .eq('id', providerId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerApprovals'] });
        },
    });
};

// Get content reports
export const useReports = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('reports')
                .select(`
          *,
          reporter:users!reports_reporter_id_fkey(username),
          post:posts!reports_reported_post_id_fkey(id, caption, media_urls)
        `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Resolve report
export const useResolveReport = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({
            reportId,
            action,
            resolution
        }: {
            reportId: string;
            action: 'dismiss' | 'remove_content' | 'ban_user';
            resolution?: string;
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            // 1. Update report status
            const { error: reportError } = await supabase
                .from('reports')
                .update({
                    status: 'resolved',
                    resolution,
                    reviewed_by: user.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', reportId);

            if (reportError) throw reportError;

            // 2. Perform action
            if (action === 'remove_content') {
                // Fetch report to get post ID
                const { data: report } = await supabase
                    .from('reports')
                    .select('reported_post_id')
                    .eq('id', reportId)
                    .single();

                if (report?.reported_post_id) {
                    await supabase
                        .from('posts')
                        .update({ is_removed: true, removed_reason: resolution || null })
                        .eq('id', report.reported_post_id);
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};
