import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS, PAGINATION } from '../config';

// ============================================
// MESSAGING HOOKS
// ============================================

// Get conversations list
export const useConversations = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.CONVERSATIONS],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('conversations')
                .select(`
          *,
          participant_1:users!conversations_participant_1_id_fkey (
            id, username, full_name, avatar_url
          ),
          participant_2:users!conversations_participant_2_id_fkey (
            id, username, full_name, avatar_url
          ),
          last_message:messages!conversations_last_message_id_fkey (
            content, message_type, created_at, is_read, sender_id
          )
        `)
                .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            // Transform data to get "other user" details easily
            return data.map(conv => {
                const isP1 = conv.participant_1_id === user.id;
                const otherUser = isP1 ? conv.participant_2 : conv.participant_1;
                const unreadCount = isP1 ? conv.unread_count_p1 : conv.unread_count_p2;

                return {
                    ...conv,
                    otherUser,
                    unreadCount
                };
            });
        },
        enabled: !!user?.id,
        refetchInterval: 10000, // Poll every 10s for new messages
    });
};

// Get messages for a conversation
export const useMessages = (conversationId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.MESSAGES, conversationId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false }) // Newest first for chat UI
                .limit(PAGINATION.MESSAGES_PAGE_SIZE);

            if (error) throw error;
            return data;
        },
        enabled: !!conversationId,
        refetchInterval: 5000, // Poll every 5s for active chat
    });
};

// Send message
export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({
            conversationId,
            recipientId,
            content,
            mediaUrls = [],
            messageType = 'text',
            metadata
        }: {
            conversationId?: string;
            recipientId: string;
            content?: string;
            mediaUrls?: string[];
            messageType?: 'text' | 'image' | 'video' | 'booking_request';
            metadata?: any;
        }) => {
            if (!user?.id) throw new Error('Not authenticated');

            let finalConversationId = conversationId;

            // If no conversation ID, find or create one
            if (!finalConversationId) {
                // Check existing
                const { data: existing } = await supabase
                    .from('conversations')
                    .select('id')
                    .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${recipientId}),and(participant_1_id.eq.${recipientId},participant_2_id.eq.${user.id})`)
                    .maybeSingle();

                if (existing) {
                    finalConversationId = existing.id;
                } else {
                    // Create new
                    const { data: newConv, error: createError } = await supabase
                        .from('conversations')
                        .insert({
                            participant_1_id: user.id,
                            participant_2_id: recipientId,
                            last_message_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (createError) throw createError;
                    finalConversationId = newConv.id;
                }
            }

            // Send message
            const { data: message, error: msgError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: finalConversationId,
                    sender_id: user.id,
                    recipient_id: recipientId,
                    content,
                    media_urls: mediaUrls,
                    message_type: messageType,
                    metadata
                })
                .select()
                .single();

            if (msgError) throw msgError;

            // Update conversation last message
            await supabase
                .from('conversations')
                .update({
                    last_message_id: message.id,
                    last_message_at: message.created_at,
                    // Increment unread count for recipient (logic handled by trigger ideally, but manual here for now)
                })
                .eq('id', finalConversationId);

            return message;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
            if (variables.conversationId) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MESSAGES, variables.conversationId] });
            }
        },
    });
};

// Mark messages as read
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            if (!user?.id) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('conversation_id', conversationId)
                .eq('recipient_id', user.id)
                .eq('is_read', false);

            if (error) throw error;

            // Reset unread count on conversation
            // Note: This requires knowing which participant we are (p1 or p2)
            // For simplicity, we'll just invalidate queries
        },
        onSuccess: (data, conversationId) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });
        },
    });
};
