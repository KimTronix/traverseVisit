import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// GROUPS HOOKS
// ============================================

// Get my groups
export const useGroups = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.GROUPS],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('groups')
                .select(`
          *,
          group_members!inner(user_id)
        `)
                .eq('group_members.user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Get single group details
export const useGroup = (groupId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GROUP, groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('groups')
                .select(`
          *,
          admin:users!groups_admin_id_fkey(username, avatar_url),
          destination:destinations(name, country, cover_image_url)
        `)
                .eq('id', groupId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!groupId,
    });
};

// Create group
export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (groupData: {
            name: string;
            description?: string;
            destination_id?: string;
            trip_start_date?: Date;
            trip_end_date?: Date;
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            // 1. Create group
            const { data: group, error: groupError } = await supabase
                .from('groups')
                .insert({
                    admin_id: user.id,
                    name: groupData.name,
                    description: groupData.description,
                    destination_id: groupData.destination_id,
                    trip_start_date: groupData.trip_start_date?.toISOString().split('T')[0],
                    trip_end_date: groupData.trip_end_date?.toISOString().split('T')[0],
                })
                .select()
                .single();

            if (groupError) throw groupError;

            // 2. Add admin as member
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.id,
                    role: 'admin',
                    status: 'active'
                });

            if (memberError) throw memberError;

            return group;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GROUPS] });
        },
    });
};

// Get group members
export const useGroupMembers = (groupId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GROUP_MEMBERS, groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('group_members')
                .select(`
          *,
          users(id, username, full_name, avatar_url)
        `)
                .eq('group_id', groupId);

            if (error) throw error;
            return data;
        },
        enabled: !!groupId,
    });
};

// Get group expenses
export const useGroupExpenses = (groupId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GROUP_EXPENSES, groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('group_expenses')
                .select(`
          *,
          proposed_by_user:users!group_expenses_proposed_by_fkey(username, avatar_url)
        `)
                .eq('group_id', groupId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!groupId,
    });
};

// Get itinerary
export const useItinerary = (groupId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ITINERARY, groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('itinerary_items')
                .select('*')
                .eq('group_id', groupId)
                .order('date', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!groupId,
    });
};
