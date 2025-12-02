import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuthStore } from '../stores';
import { QUERY_KEYS } from '../config';

// ============================================
// WALLET HOOKS
// ============================================

// Get wallet balance and details
export const useWallet = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.WALLET],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('wallets')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Get transaction history
export const useTransactions = () => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.TRANSACTIONS],
        queryFn: async () => {
            if (!user?.id) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
};

// Add funds (Simulation)
export const useAddFunds = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ amount, currency = 'USD' }: { amount: number; currency?: string }) => {
            if (!user?.id) throw new Error('Not authenticated');

            // 1. Get wallet
            const { data: wallet } = await supabase
                .from('wallets')
                .select('id, balance')
                .eq('user_id', user.id)
                .single();

            if (!wallet) throw new Error('Wallet not found');

            // 2. Create transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    wallet_id: wallet.id,
                    user_id: user.id,
                    type: 'deposit',
                    amount: amount,
                    currency: currency,
                    balance_before: wallet.balance,
                    balance_after: wallet.balance + amount,
                    status: 'completed',
                    description: 'Deposit via App'
                });

            if (txError) throw txError;

            // 3. Update wallet balance
            const { error: walletError } = await supabase
                .from('wallets')
                .update({ balance: wallet.balance + amount })
                .eq('id', wallet.id);

            if (walletError) throw walletError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
        },
    });
};

// Withdraw funds
export const useWithdrawFunds = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ amount, method }: { amount: number; method: string }) => {
            if (!user?.id) throw new Error('Not authenticated');

            // 1. Get wallet
            const { data: wallet } = await supabase
                .from('wallets')
                .select('id, balance')
                .eq('user_id', user.id)
                .single();

            if (!wallet) throw new Error('Wallet not found');
            if (wallet.balance < amount) throw new Error('Insufficient funds');

            // 2. Create transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    wallet_id: wallet.id,
                    user_id: user.id,
                    type: 'withdrawal',
                    amount: -amount,
                    currency: 'USD',
                    balance_before: wallet.balance,
                    balance_after: wallet.balance - amount,
                    status: 'pending', // Pending approval
                    payment_method: method,
                    description: `Withdrawal to ${method}`
                });

            if (txError) throw txError;

            // 3. Update wallet balance
            const { error: walletError } = await supabase
                .from('wallets')
                .update({ balance: wallet.balance - amount })
                .eq('id', wallet.id);

            if (walletError) throw walletError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
        },
    });
};
