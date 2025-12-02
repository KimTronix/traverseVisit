import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        try {
            console.log('🔵 Starting signup...');
            console.log('📧 Email:', email);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                console.error('❌ Signup error:', error);
                return {
                    error: {
                        message: error.message || 'Failed to create account. Please check your connection.',
                        details: error
                    }
                };
            }

            console.log('✅ Auth user created:', data.user?.id);
            console.log('✅ Profile will be created automatically by database trigger');

            return { error: null };
        } catch (error: any) {
            console.error('❌ Signup exception:', error);
            return {
                error: {
                    message: error.message || 'Network error. Please check:\n1. Your internet connection\n2. Supabase URL is correct\n3. Supabase is running',
                    details: error
                }
            };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            console.log('🔵 Starting login...');
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('❌ Login error:', error);
            } else {
                console.log('✅ Login successful');
            }

            return { error };
        } catch (error: any) {
            console.error('❌ Login exception:', error);
            return {
                error: {
                    message: error.message || 'Network error during login',
                    details: error
                }
            };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            return { error };
        } catch (error) {
            return { error };
        }
    };

    const updatePassword = async (newPassword: string) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            return { error };
        } catch (error) {
            return { error };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signUp,
                signIn,
                signOut,
                resetPassword,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
