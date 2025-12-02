import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS, PAGINATION } from '../config';

// ============================================
// POSTS HOOKS
// ============================================

// Get feed posts (infinite scroll)
export const useFeed = () => {
  const { user } = useAuthStore();

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.FEED],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
      // If user is logged in, prioritize posts from followed users
      // For now, we'll just fetch all posts ordered by creation date
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            username,
            avatar_url,
            location
          ),
          likes!likes_post_id_fkey (
            user_id
          )
        `)
        .eq('is_removed', false)
        .order('created_at', { ascending: false })
        .range(
          pageParam * PAGINATION.POSTS_PAGE_SIZE,
          (pageParam + 1) * PAGINATION.POSTS_PAGE_SIZE - 1
        );

      if (error) throw error;

      // Transform data to include isLiked by current user
      return data.map((post: any) => ({
        ...post,
        isLiked: user ? post.likes.some((like: any) => like.user_id === user.id) : false,
        likes: undefined // Remove the raw likes array
      }));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.length === PAGINATION.POSTS_PAGE_SIZE ? allPages.length : undefined;
    },
  });
};

// Get single post
export const usePost = (postId: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.POST, postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            id,
            username,
            avatar_url,
            location
          ),
          likes!likes_post_id_fkey (
            user_id
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      return {
        ...data,
        isLiked: user ? data.likes.some((like: any) => like.user_id === user.id) : false,
        likes: undefined
      };
    },
    enabled: !!postId,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (postData: {
      caption: string;
      media_urls: string[];
      media_type?: 'photo' | 'video' | 'story' | 'reel';
      location_name?: string;
      location_coordinates?: any;
      min_budget?: number;
      currency?: string;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          ...postData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEED] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_POSTS] });
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Ensure ownership

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEED] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_POSTS] });
    },
  });
};

// ============================================
// LIKES & COMMENTS HOOKS
// ============================================

// Toggle like
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.POST, postId] });

      const previousPost = queryClient.getQueryData([QUERY_KEYS.POST, postId]);

      queryClient.setQueryData([QUERY_KEYS.POST, postId], (old: any) => ({
        ...old,
        isLiked: !isLiked,
        likes_count: isLiked ? old.likes_count - 1 : old.likes_count + 1,
      }));

      return { previousPost };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData([QUERY_KEYS.POST, newTodo.postId], context?.previousPost);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEED] });
    },
  });
};

// Get comments
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST_COMMENTS, postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users!comments_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .eq('is_removed', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

// Add comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST_COMMENTS, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, variables.postId] }); // Update comment count
    },
  });
};
