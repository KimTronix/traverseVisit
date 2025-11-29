import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore, useUserProfileStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// AUTH HOOKS
// ============================================

// Sign up with email
export const useSignUp = () => {
    const { setUser, setSession } = useAuthStore();

    return useMutation({
        mutationFn: async ({ email, password, metadata }: {
            email: string;
            password: string;
            metadata?: any;
        }) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: metadata },
            });
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            setUser(data.user);
            setSession(data.session);
        },
    });
};

// Sign in with email
export const useSignIn = () => {
    const { setUser, setSession } = useAuthStore();

    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            setUser(data.user);
            setSession(data.session);
        },
    });
};

// Sign in with OAuth (Google, Facebook, Twitter)
export const useOAuthSignIn = () => {
    return useMutation({
        mutationFn: async (provider: 'google' | 'facebook' | 'twitter') => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: 'traverse://auth/callback',
                },
            });
            if (error) throw error;
            return data;
        },
    });
};

// Sign out
export const useSignOut = () => {
    const { logout } = useAuthStore();
    const { clearProfile } = useUserProfileStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
        onSuccess: () => {
            logout();
            clearProfile();
            queryClient.clear();
        },
    });
};

// Reset password
export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'traverse://auth/reset-password',
            });
            if (error) throw error;
        },
    });
};

// Update password
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: async (newPassword: string) => {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
        },
    });
};

// ============================================
// USER PROFILE HOOKS
// ============================================

// Get user profile
export const useUserProfile = (userId?: string) => {
    const { user } = useAuthStore();
    const targetUserId = userId || user?.id;

    return useQuery({
        queryKey: [QUERY_KEYS.USER_PROFILE, targetUserId],
        queryFn: async () => {
            if (!targetUserId) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', targetUserId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!targetUserId,
    });
};

// Update user profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { setProfile } = useUserProfileStore();

    return useMutation({
        mutationFn: async (updates: any) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            setProfile(data);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
        },
    });
};

// Get user's followers
export const useFollowers = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.FOLLOWERS, userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('follows')
                .select('follower_id, users!follows_follower_id_fkey(*)')
                .eq('following_id', userId);

            if (error) throw error;
            return data;
        },
    });
};

// Get user's following
export const useFollowing = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.FOLLOWING, userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('follows')
                .select('following_id, users!follows_following_id_fkey(*)')
                .eq('follower_id', userId);

            if (error) throw error;
            return data;
        },
    });
};

// Follow user
export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (followingId: string) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('follows')
                .insert({ follower_id: user.id, following_id: followingId });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
        },
    });
};

// Unfollow user
export const useUnfollowUser = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (followingId: string) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', user.id)
                .eq('following_id', followingId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
        },
    });
};

// Check if following user
export const useIsFollowing = (userId: string) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.FOLLOWING, user?.id, userId],
        queryFn: async () => {
            if (!user?.id) return false;

            const { data, error } = await supabase
                .from('follows')
                .select('id')
                .eq('follower_id', user.id)
                .eq('following_id', userId)
                .maybeSingle();

            if (error) throw error;
            return !!data;
        },
        enabled: !!user?.id && !!userId,
    });
};
