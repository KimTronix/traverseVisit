import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Replace localhost with your machine's IP for mobile testing
// You can find your IP by running: ipconfig (Windows) or ifconfig (Mac/Linux)
const processedUrl = supabaseUrl.includes('localhost.sslip.io')
    ? supabaseUrl.replace('localhost.sslip.io', '10.0.2.2') // Android emulator
    : supabaseUrl;

export const supabase = createClient(processedUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
